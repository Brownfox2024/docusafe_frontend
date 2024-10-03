import React, {useEffect, useState, useRef} from "react";
import {getCountryList, removeUserImage, updateUserData, uploadUserFile} from "../../../../services/CommonService";
import {CLIENT_LOCAL_STORE, COUNTRY_CODE, COUNTRY_ID, SALT} from "../../../../configs/AppConfig";
import {toast} from "react-toastify";
import Utils from "../../../../utils";
import validator from "validator";
import {encryptData} from "../../../../utils/crypto";

const UserProfile = (props) => {
    const [firstName, setFirstName] = useState("");
    const [countryList, setCountryList] = useState([]);
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [countryId, setCountryId] = useState(COUNTRY_ID);
    const [countryCode, setCountryCode] = useState(COUNTRY_CODE);
    const [mobile, setMobile] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState(0);
    const [zip, setZip] = useState("");
    const [userImage, setUserImage] = useState("");
    const [sameProfile, setSameProfile] = useState(false);
    const [keyFile, setKeyFile] = useState(Date.now);
    const [isImage, setIsImage] = useState(false);

    const [isViewReadOnly, setIsViewReadOnly] = useState(false);
    const userProfileModalRef = useRef(null);

    useEffect(() => {
        getCountryList()
            .then((response) => {
                setCountryList(response.data.data);
            })
            .catch((_err) => {
            });
    }, []);

    useEffect(() => {
        const userData = Utils.loginUserData();
        if (Object.keys(userData).length > 0) {
            setFirstName(userData.first_name);
            setLastName(userData.last_name);
            setEmail(userData.email);
            setMobile(userData.mobile);
            setCountryId(userData.country_id);
            setAddress1(userData.address_1 ? userData.address_1 : '');
            setAddress2(userData.address_2 ? userData.address_2 : '');
            setCity(userData.city ? userData.city : '');
            setState(userData.state ? userData.state : '');
            setZip(userData.zip ? userData.zip : '');
            setCountry(userData.address_country_id ? userData.address_country_id : COUNTRY_ID);
            setUserImage(userData.profile ? userData.profile : '');
            let index = countryList.findIndex((x) => x.id === parseInt(userData.country_id));
            if (index > -1) {
                setCountryCode(countryList[index]["code"]);
            }
            if (userData.profile) {
                setIsImage(true);
            }

            if (userData.address_1) {
                checkSameAddress(props?.companyData, userData);
            } else {
                setAddress1(props?.companyData.address_1 ? props?.companyData.address_1 : "");
                setAddress2(props?.companyData.address_2 ? props?.companyData.address_2 : "");
                setCity(props?.companyData.city ? props?.companyData.city : "");
                setState(props?.companyData.state ? props?.companyData.state : "");
                setZip(props?.companyData.zip_code ? props?.companyData.zip_code : "");
                setCountry(props?.companyData.country_id ? props?.companyData.country_id : COUNTRY_ID);
                setSameProfile(true);
            }

            if (userData.role_id > 4) {
                setIsViewReadOnly(true);
            }
        }
    }, [props?.companyData, countryList]);

    let errorsObj = {
        first_name: "",
        last_name: "",
        email: "",
        country_id: "",
        mobile: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    };

    const [errors, setErrors] = useState(errorsObj);

    function handleCountry(e) {
        setCountryId(e.target.value);
        let index = countryList.findIndex((x) => x.id === parseInt(e.target.value));
        if (index > -1) {
            setCountryCode(countryList[index]["code"]);
        }
    }

    const handleFile = (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            props.setLoading(true);
            const formData = new FormData();
            formData.append("file", e.target.files[0]);
            uploadUserFile(formData)
                .then(response => {
                    setUserImage(response.data.data.profile);
                    let encryptedData = encryptData(response.data.data, SALT);
                    localStorage.setItem(CLIENT_LOCAL_STORE, encryptedData);
                    props.setLoading(false);
                    setKeyFile(Date.now);
                    setIsImage(true);
                    toast.success(response.data.message);
                })
                .catch(err => {
                    setKeyFile(Date.now);
                    props.setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        }
    };

    function onUpdateUser(e) {
        e.preventDefault();
        let error = false;
        const errorObj = {...errorsObj};
        if (!firstName) {
            errorObj.first_name = "First name must be required";
            error = true;
        }
        if (!lastName) {
            errorObj.last_name = "Last name must be required";
            error = true;
        }
        if (!email) {
            errorObj.email = "Email must be required";
            error = true;
        } else if (!validator.isEmail(email)) {
            errorObj.email = "Please enter valid email address";
            error = true;
        }
        if (!countryId) {
            errorObj.country_id = "Please select country.";
            error = true;
        }
        if (!mobile) {
            errorObj.mobile = "Mobile number must be required";
            error = true;
        }
        if (!city) {
            errorObj.city = "City name must be required";
            error = true;
        }
        if (!state) {
            errorObj.state = "State name must be required";
            error = true;
        }
        if (!zip) {
            errorObj.zip = "Zip must be required";
            error = true;
        }
        if (!address1) {
            errorObj.address1 = "Address must be required";
            error = true;
        }
        if (!country) {
            errorObj.country = "please select country";
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        props.setLoading(true);
        let obj = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            country: countryId,
            mobile: mobile,
            address_1: address1,
            address_2: address2,
            city: city,
            state: state,
            zip: zip,
            address_country: country,
        };

        updateUserData(obj)
            .then((response) => {
                checkSameAddress(props?.companyData, response.data.data);
                let encryptedData = encryptData(response.data.data, SALT);
                localStorage.setItem(CLIENT_LOCAL_STORE, encryptedData);
                props.setLoading(false);
                toast.success(response.data.message);
            })
            .catch((err) => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    }

    const handleSameAddress = (e) => {
        let isChecked = e.target.checked;
        setSameProfile(isChecked);
        if (isChecked === true) {
            setAddress1(props?.companyData.address_1 ? props?.companyData.address_1 : "");
            setAddress2(props?.companyData.address_2 ? props?.companyData.address_2 : "");
            setCity(props?.companyData.city ? props?.companyData.city : "");
            setState(props?.companyData.state ? props?.companyData.state : "");
            setZip(props?.companyData.zip_code ? props?.companyData.zip_code : "");
            setCountry(props?.companyData.country_id ? props?.companyData.country_id : COUNTRY_ID);
        }
    };

    const handleRemoveImage = (e) => {
        e.preventDefault();

        props.setLoading(true);
        removeUserImage({})
            .then(response => {
                setUserImage('');
                let encryptedData = encryptData(response.data.data, SALT);
                localStorage.setItem(CLIENT_LOCAL_STORE, encryptedData);
                props.setLoading(false);
                setIsImage(false);
                userProfileModalRef?.current.click();
                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const checkSameAddress = (companyData, userData) => {
        let isSameAddress = true;
        if (companyData.address_1 !== userData.address_1) {
            isSameAddress = false;
        }
        if (companyData.address_2 !== userData.address_2) {
            isSameAddress = false;
        }
        if (companyData.city !== userData.city) {
            isSameAddress = false;
        }
        if (companyData.state !== userData.state) {
            isSameAddress = false;
        }
        if (companyData.zip_code !== userData.zip) {
            isSameAddress = false;
        }
        if (companyData.country_id !== userData.address_country_id) {
            isSameAddress = false;
        }
        setSameProfile(isSameAddress);
    };

    const updateSameAddress = (e, type) => {
        const userData = Utils.loginUserData();
        if (type === 'address1') {
            userData.address_1 = e.target.value;
            userData.address_2 = address2;
            userData.city = city;
            userData.state = state;
            userData.zip = zip;
            userData.address_country_id = country;
            setAddress1(e.target.value);
        } else if (type === 'address2') {
            userData.address_1 = address1;
            userData.address_2 = e.target.value;
            userData.city = city;
            userData.state = state;
            userData.zip = zip;
            userData.address_country_id = country;
            setAddress2(e.target.value);
        } else if (type === 'city') {
            userData.address_1 = address1;
            userData.address_2 = address2;
            userData.city = e.target.value;
            userData.state = state;
            userData.zip = zip;
            userData.address_country_id = country;
            setCity(e.target.value);
        } else if (type === 'state') {
            userData.address_1 = address1;
            userData.address_2 = address2;
            userData.city = city;
            userData.state = e.target.value;
            userData.zip = zip;
            userData.address_country_id = country;
            setState(e.target.value);
        } else if (type === 'zip') {
            userData.address_1 = address1;
            userData.address_2 = address2;
            userData.city = city;
            userData.state = state;
            userData.zip = e.target.value;
            userData.address_country_id = country;
            setZip(e.target.value);
        } else if (type === 'country') {
            userData.address_1 = address1;
            userData.address_2 = address2;
            userData.city = city;
            userData.state = state;
            userData.zip = zip;
            userData.address_country_id = (e.target.value) ? parseInt(e.target.value) : 0;
            setCountry(e.target.value);
        }
        checkSameAddress(props?.companyData, userData);
    };

    return (
        <div className="tab-pane" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
            <div className="row bg_white border_radius mx-0">
                <div className="col-lg-9 border-end step_wizard_content py-4">
                    {isViewReadOnly === false && (
                        <>
                            <form onSubmit={onUpdateUser}>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="mb-4">
                                            <label className="form-label mb-2">First Name</label>
                                            <input type="text" className="form-control"
                                                   placeholder="Enter First Name" value={firstName}
                                                   onChange={(e) => setFirstName(e.target.value)}/>
                                            {errors.first_name && (
                                                <div className="text-danger form-text">{errors.first_name}</div>)}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="mb-4">
                                            <label className="form-label mb-2">Last Name</label>
                                            <input type="text" className="form-control" placeholder="Enter Last Name"
                                                   value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                                            {errors.last_name && (
                                                <div className="text-danger">{errors.last_name}</div>)}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="mb-4">
                                            <label className="form-label mb-2">Email</label>
                                            <input type="text" className="form-control" id="email"
                                                   placeholder="Enter Email Address" value={email}
                                                   onChange={(e) => setEmail(e.target.value.trim())}/>
                                            {errors.email && (
                                                <div className="text-danger">{errors.email}</div>)}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="mb-4">
                                            <label className="form-label mb-2">Country</label>
                                            <select className="form-select" value={countryId}
                                                    onChange={(e) => handleCountry(e)}>
                                                {countryList && countryList.map((item, i) => (
                                                    <option value={item.id} key={i}>{item.name}</option>
                                                ))}
                                            </select>
                                            {errors.country_id && (
                                                <div className="text-danger form-text">{errors.country_id}</div>)}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="mb-4">
                                            <label className="form-label mb-2 number">Mobile Number</label>
                                            <div className="country_code">
                                        <span className="d-flex align-items-center"
                                              style={{width: '76px'}}>+{countryCode}</span>
                                                <input type="number" className="form-control mobile-contact-input"
                                                       placeholder="Enter Mobile Number"
                                                       value={mobile} onChange={(e) => setMobile(e.target.value)}/>
                                                {errors.mobile && (
                                                    <div className="text-danger form-text">{errors.mobile}</div>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-4">
                                            <label className="form-label mb-3 number">Address</label>
                                            <div className="form-check mb-4">
                                                <input className="form-check-input" type="checkbox"
                                                       checked={sameProfile}
                                                       onChange={handleSameAddress} id="flexCheckDefault"/>
                                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                                    Choose Same as company address
                                                </label>
                                            </div>
                                            <input type="address" className="form-control"
                                                   placeholder="Enter Address Line 1"
                                                   value={address1} onChange={(e) => updateSameAddress(e, 'address1')}/>
                                            {errors.address1 && (
                                                <div className="text-danger form-text">{errors.address1}</div>)}
                                            <input type="address" className="form-control mb-4 mt-4"
                                                   placeholder="Enter Address Line 2 (optional)" value={address2}
                                                   onChange={(e) => updateSameAddress(e, 'address2')}/>
                                            <div className="row">
                                                <div className="col-lg-6 mb-4">
                                                    <input type="text" className="form-control" placeholder="Enter City"
                                                           value={city} onChange={(e) => updateSameAddress(e, 'city')}/>
                                                    {errors.city && (
                                                        <div className="text-danger text-danger">{errors.city}</div>)}
                                                </div>
                                                <div className="col-lg-6 mb-4">
                                                    <input type="text" className="form-control"
                                                           placeholder="Enter State" value={state}
                                                           onChange={(e) => updateSameAddress(e, 'state')}/>
                                                    {errors.state && (
                                                        <div className="text-danger text-danger">{errors.state}</div>)}
                                                </div>
                                                <div className="col-lg-6 mb-4">
                                                    <input type="text" className="form-control" placeholder="Enter Zip"
                                                           value={zip} onChange={(e) => updateSameAddress(e, 'zip')}/>
                                                    {errors.zip && (
                                                        <div className="text-danger form-text">{errors.zip}</div>)}
                                                </div>
                                                <div className="col-lg-6 mb-4">
                                                    <select className="form-select" value={country}
                                                            onChange={(e) => updateSameAddress(e, 'country')}>
                                                        {countryList && countryList.map((item, i) => (
                                                            <option value={item.id} key={i}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.country && (
                                                        <div
                                                            className="text-danger form-text">{errors.country}</div>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="tab_footer_button">
                                <button type="submit" className="btn btn-primary" onClick={onUpdateUser}>Save</button>
                            </div>
                        </>
                    )}

                    {isViewReadOnly === true && (
                        <div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="mb-4">
                                        <label className="form-label mb-2">First Name</label>
                                        <input type="text" className="form-control" readOnly={true}
                                               placeholder="Enter First Name" value={firstName}
                                               onChange={(e) => setFirstName(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-4">
                                        <label className="form-label mb-2">Last Name</label>
                                        <input type="text" className="form-control" placeholder="Enter Last Name"
                                               readOnly={true}
                                               value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-4">
                                        <label className="form-label mb-2">Email</label>
                                        <input type="text" className="form-control" id="email" readOnly={true}
                                               placeholder="Enter Email Address" value={email}
                                               onChange={(e) => setEmail(e.target.value.trim())}/>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-4">
                                        <label className="form-label mb-2">Country</label>
                                        <select style={{width: "100%", background: "#FFF"}}
                                                className="dropdown send_reminder" value={countryId}
                                                disabled={true} onChange={(e) => handleCountry(e)}>
                                            {countryList && countryList.map((item, i) => (
                                                <option value={item.id} key={i}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-4">
                                        <label className="form-label mb-2 number">Mobile Number</label>
                                        <div className="country_code">
                                        <span className="d-flex align-items-center"
                                              style={{width: '76px'}}>+{countryCode}</span>
                                            <input type="number" className="form-control"
                                                   placeholder="Enter Mobile Number" readOnly={true}
                                                   value={mobile} onChange={(e) => setMobile(e.target.value)}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="mb-4">
                                        <label className="form-label mb-3 number">Address</label>
                                        <div className="form-check mb-4">
                                            <input className="form-check-input" type="checkbox"
                                                   checked={sameProfile} disabled={true}
                                                   onChange={handleSameAddress} id="flexCheckDefault"/>
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Choose Same as company address
                                            </label>
                                        </div>
                                        <input type="address" className="form-control"
                                               placeholder="Enter Address Line 1" readOnly={true}
                                               value={address1} onChange={(e) => setAddress1(e.target.value)}/>
                                        <input type="address" className="form-control mb-4 mt-4" readOnly={true}
                                               placeholder="Enter Address Line 2 (optional)" value={address2}
                                               onChange={(e) => setAddress2(e.target.value)}/>
                                        <div className="row">
                                            <div className="col-lg-6 mb-4">
                                                <input type="text" className="form-control" placeholder="Enter City"
                                                       readOnly={true}
                                                       value={city} onChange={(e) => setCity(e.target.value)}/>
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <input type="text" className="form-control"
                                                       placeholder="Enter State" readOnly={true}
                                                       value={state} onChange={(e) => setState(e.target.value)}/>
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <input type="text" className="form-control" placeholder="Enter Zip"
                                                       readOnly={true}
                                                       value={zip} onChange={(e) => setZip(e.target.value)}/>
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <div className="dropdown send_reminder">
                                                    <select style={{width: "100%", background: "#FFF"}} disabled={true}
                                                            className="dropdown send_reminder" value={country}
                                                            onChange={(e) => setCountry(e.target.value)}>
                                                        {countryList && countryList.map((item, i) => (
                                                            <option value={item.id} key={i}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                <div className="col-lg-3 py-4">
                    <div className="company_logo w-75 mx-auto">
                        <img src={userImage ? userImage : `/images/user_bg.png`} alt="..."/>
                        {isViewReadOnly === false && (
                            <>
                                {isImage === false && (
                                    <div className="tab_logo_edit">
                                        <label htmlFor="profile_img">
                                            <i className="fa fa-pencil" aria-hidden="true"/>
                                        </label>
                                        <input type="file" key={keyFile} id="profile_img" onChange={handleFile}/>
                                    </div>
                                )}

                                {isImage === true && (
                                    <div className="tab_logo_edit" data-bs-toggle="modal"
                                         data-bs-target="#deleteUserProfileModal">
                                        <i className="fa fa-remove" aria-hidden="true"/>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="modal fade" id="deleteUserProfileModal" tabIndex="-1"
                 aria-labelledby="deleteUserProfileModalLabel" data-bs-backdrop="static" data-bs-keyboard="false"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteUserProfileModalLabel">Delete Image</h5>
                            <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                    ref={userProfileModalRef} data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa fa-times-circle" aria-hidden="true"/>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure want to delete user image?</p>
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" onClick={handleRemoveImage} className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default UserProfile;
