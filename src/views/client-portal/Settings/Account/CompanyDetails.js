import React, {useEffect, useState, useRef} from "react";
import {
    getCountryList,
    removeCompanyImage,
    updateCompanyDetails,
    uploadCompanyFile
} from "../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../utils";
import {COUNTRY_ID, INDUSTRY_LIST} from "../../../../configs/AppConfig";

const CompanyDetails = (props) => {
    const [countryList, setCountryList] = useState([]);
    const [companyName, setCompanyName] = useState("");
    const [numberOfEmployee, setNumberOfEmployee] = useState("");
    const [website, setWebsite] = useState("");
    const [typeOfIndustry, setTypeOfIndustry] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [country, setCountry] = useState(0);
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [companyLogo, setCompanyLogo] = useState("");
    const [keyFile, setKeyFile] = useState(Date.now);
    const [isImage, setIsImage] = useState(false);

    const [isViewReadOnly, setIsViewReadOnly] = useState(false);
    const companyProfileModalRef = useRef(null);

    useEffect(() => {
        setCompanyName(props?.companyData.company_name ? props?.companyData.company_name : '');
        setNumberOfEmployee(props?.companyData.no_employee ? props?.companyData.no_employee : '');
        setTypeOfIndustry(props?.companyData.industry_type ? props?.companyData.industry_type : '');
        setWebsite(props?.companyData.website ? props?.companyData.website : '');
        setAddress1(props?.companyData.address_1 ? props?.companyData.address_1 : '');
        setAddress2(props?.companyData.address_2 ? props?.companyData.address_2 : '');
        setCity(props?.companyData.city ? props?.companyData.city : '');
        setState(props?.companyData.state ? props?.companyData.state : '');
        setZip(props?.companyData.zip_code ? props?.companyData.zip_code : '');
        setCountry(props?.companyData.country_id ? props?.companyData.country_id : COUNTRY_ID);
        setCompanyLogo(props.companyData.company_logo ? props.companyData.company_logo : '');
        if (props.companyData.company_logo) {
            setIsImage(true);
        }
    }, [props?.companyData]);

    useEffect(() => {
        getCountryList()
            .then((response) => {
                setCountryList(response.data.data);
            })
            .catch((err) => {
            });
    }, []);

    useEffect(function () {
        let loginData = Utils.loginUserData();
        if (Object.keys(loginData).length > 0) {
            if (loginData.role_id > 3) {
                setIsViewReadOnly(true);
            }
        }
    }, []);

    let errorsObj = {
        company_name: "",
        number_of_employee: "",
        website: "",
        type_of_industry: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    };

    const [errors, setErrors] = useState(errorsObj);

    const handleCompanyFile = (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            props.setLoading(true);
            const formData = new FormData();
            formData.append("file", e.target.files[0]);
            uploadCompanyFile(formData)
                .then(response => {
                    let cmpData = {...props.companyData};
                    if (response.data.logo) {
                        cmpData.company_logo = response.data.logo;
                    }
                    props.setCompanyData(cmpData);
                    props.setLoading(false);
                    setKeyFile(Date.now);
                    toast.success(response.data.message);
                })
                .catch(err => {
                    setKeyFile(Date.now);
                    props.setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        }
    };

    function onUpdateCompanyDetails(e) {
        e.preventDefault();
        let error = false;
        const errorObj = {...errorsObj};
        if (!companyName) {
            errorObj.company_name = "Company name must be required";
            error = true;
        }
        if (!website) {
            errorObj.website = "Website must be required";
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
            errorObj.address1 = "Address field must be required";
            error = true;
        }
        if (!country) {
            errorObj.country = "please select country";
            error = true;
        }
        setErrors(errorObj);
        if (error) return;

        let obj = {
            company_name: companyName,
            no_employee: numberOfEmployee,
            industry_type: typeOfIndustry,
            website: website,
            address_1: address1,
            address_2: address2,
            city: city,
            state: state,
            country_id: country,
            zip: zip
        };

        props.setLoading(true);
        updateCompanyDetails(obj)
            .then((response) => {
                let cmpData = {...props.companyData};
                cmpData.company_name = companyName;
                cmpData.no_employee = numberOfEmployee;
                cmpData.industry_type = typeOfIndustry;
                cmpData.website = website;
                cmpData.address_1 = address1;
                cmpData.address_2 = address2;
                cmpData.city = city;
                cmpData.state = state;
                cmpData.country_id = country;
                cmpData.zip_code = zip;
                props.setCompanyData(cmpData);
                props.setLoading(false);
                toast.success(response.data.message);
            })
            .catch((err) => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    }

    const handleRemoveImage = (e) => {
        e.preventDefault();

        props.setLoading(true);
        removeCompanyImage({})
            .then(response => {
                let cmpData = {...props.companyData};
                cmpData.company_logo = '';
                props.setCompanyData(cmpData);
                props.setLoading(false);
                setIsImage(false);
                companyProfileModalRef?.current.click();
                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <div className="tab-pane  active show" id="nav-company-detail" role="tabpanel"
             aria-labelledby="nav-companyDetails">
            <div className="row bg_white border_radius mx-0">
                <div className="col-lg-9 border-end step_wizard_content py-4">

                    {isViewReadOnly === false && (
                        <form onSubmit={onUpdateCompanyDetails}>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="mb-4">
                                        <label className="form-label mb-2">Company Name</label>
                                        <input type="text" className="form-control" placeholder="Enter Company Name"
                                               value={companyName} onChange={(e) => setCompanyName(e.target.value)}/>
                                        {errors.company_name && (
                                            <div className="text-danger form-text">{errors.company_name}</div>)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-4">
                                        <label className="form-label mb-2">Number of Employees</label>
                                        <input type="number" className="form-control"
                                               placeholder="Enter Number of Employees" value={numberOfEmployee}
                                               onChange={(e) => setNumberOfEmployee(e.target.value)}/>
                                        {errors.number_of_employee && (
                                            <div className="text-danger form-text">{errors.number_of_employee}</div>)}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-4">
                                        <label className="form-label mb-2">Type of Industry</label>
                                        <select className="form-select" value={typeOfIndustry}
                                                onChange={(e) => setTypeOfIndustry(e.target.value)}>
                                            <option value="">Select Industry</option>
                                            {INDUSTRY_LIST.map((item, index) => (
                                                <option key={index} value={item}>{item}</option>
                                            ))}
                                        </select>
                                        {errors.type_of_industry && (
                                            <div className="text-danger form-text">{errors.type_of_industry}</div>)}
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="mb-4">
                                        <label className="form-label mb-2">Website</label>
                                        <input type="text" className="form-control" placeholder="Enter Website Address"
                                               value={website} onChange={(e) => setWebsite(e.target.value)}/>
                                        {errors.website && (
                                            <div className="text-danger form-text">{errors.website}</div>)}
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="mb-5">
                                        <label className="form-label mb-2 number">Address</label>
                                        <input type="address" className="form-control"
                                               placeholder="Enter Address Line 1"
                                               value={address1} onChange={(e) => setAddress1(e.target.value)}/>
                                        {errors.address1 && (
                                            <div className="text-danger form-text">{errors.address1}</div>)}
                                        <input type="address" className="form-control mb-4 mt-4"
                                               placeholder="Enter Address Line 2 (Optional)" value={address2}
                                               onChange={(e) => setAddress2(e.target.value)}/>
                                        <div className="row">
                                            <div className="col-lg-6 mb-4">
                                                <input type="text" className="form-control" placeholder="Enter City"
                                                       value={city} onChange={(e) => setCity(e.target.value)}/>
                                                {errors.city && (
                                                    <div className="text-danger form-text">{errors.city}</div>)}
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <input type="text" className="form-control" placeholder="Enter State"
                                                       value={state} onChange={(e) => setState(e.target.value)}/>
                                                {errors.state && (
                                                    <div className="text-danger form-text">{errors.state}</div>)}
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <input type="text" className="form-control" placeholder="Enter Zip"
                                                       value={zip} onChange={(e) => setZip(e.target.value)}/>
                                                {errors.zip && (
                                                    <div className="text-danger form-text">{errors.zip}</div>)}
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <select className="form-select" value={country}
                                                        onChange={(e) => setCountry(e.target.value)}>
                                                    {countryList &&
                                                    countryList.map((item, i) => (
                                                        <option value={item.id} key={i}>{item.name}</option>
                                                    ))}
                                                </select>
                                                {errors.country && (
                                                    <div className="text-danger form-text">{errors.country}</div>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    {isViewReadOnly === true && (
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="mb-4">
                                    <label className="form-label mb-2">Company Name</label>
                                    <input type="text" className="form-control" placeholder="Enter Company Name"
                                           value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                                           readOnly={true}/>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="mb-4">
                                    <label className="form-label mb-2">Number of Employees</label>
                                    <input type="number" className="form-control"
                                           placeholder="Enter Number of Employees" value={numberOfEmployee}
                                           onChange={(e) => setNumberOfEmployee(e.target.value)} readOnly={true}/>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="mb-4">
                                    <label className="form-label mb-2">Type of Industry</label>
                                    <input type="text" className="form-control" placeholder="Enter type of Industry"
                                           value={typeOfIndustry}
                                           onChange={(e) => setTypeOfIndustry(e.target.value)} readOnly={true}/>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="mb-4">
                                    <label className="form-label mb-2">Website</label>
                                    <input type="text" className="form-control" placeholder="Enter Website Address"
                                           value={website} onChange={(e) => setWebsite(e.target.value)}
                                           readOnly={true}/>
                                </div>
                            </div>

                            <div className="col-lg-12">
                                <div className="mb-5">
                                    <label className="form-label mb-2 number">Address</label>
                                    <input type="address" className="form-control"
                                           placeholder="Enter Address Line 1" readOnly={true}
                                           value={address1} onChange={(e) => setAddress1(e.target.value)}/>
                                    <input type="address" className="form-control mb-4 mt-4" readOnly={true}
                                           placeholder="Enter Address Line 2 (Optional)" value={address2}
                                           onChange={(e) => setAddress2(e.target.value)}/>
                                    <div className="row">
                                        <div className="col-lg-6 mb-4">
                                            <input type="text" className="form-control" placeholder="Enter City"
                                                   value={city} onChange={(e) => setCity(e.target.value)}
                                                   readOnly={true}/>
                                        </div>
                                        <div className="col-lg-6 mb-4">
                                            <input type="text" className="form-control" placeholder="Enter State"
                                                   value={state} onChange={(e) => setState(e.target.value)}
                                                   readOnly={true}/>
                                        </div>
                                        <div className="col-lg-6 mb-4">
                                            <input type="text" className="form-control" placeholder="Enter Zip"
                                                   value={zip} onChange={(e) => setZip(e.target.value)}
                                                   readOnly={true}/>
                                        </div>
                                        <div className="col-lg-6 mb-4">
                                            <div className="dropdown send_reminder">
                                                <select style={{width: "100%", background: "#FFF"}}
                                                        className="dropdown send_reminder" value={country}
                                                        onChange={(e) => setCountry(e.target.value)}
                                                        aria-label="Select Country" disabled={true}>
                                                    {countryList &&
                                                    countryList.map((item, i) => (
                                                        <option value={item.id} key={i}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isViewReadOnly === false && (
                        <div className="tab_footer_button bg_white">
                            <button type="submit" className="btn btn-primary" onClick={onUpdateCompanyDetails}>Save
                            </button>
                        </div>
                    )}
                </div>
                <div className="col-lg-3 py-4">
                    <div className="company_logo">
                        <img src={companyLogo ? companyLogo : `/images/company-logo.png`} alt="..."/>

                        {isViewReadOnly === false && (
                            <>
                                {isImage === false && (
                                    <div className="tab_logo_edit">
                                        <label htmlFor="company_profile_img">
                                            <i className="fa fa-pencil" aria-hidden="true"/>
                                        </label>
                                        <input type="file" key={keyFile} id="company_profile_img"
                                               onChange={handleCompanyFile}/>
                                    </div>
                                )}
                                {isImage === true && (
                                    <div className="tab_logo_edit" data-bs-toggle="modal"
                                         data-bs-target="#deleteCompanyProfileModal">
                                        <i className="fa fa-remove" aria-hidden="true"/>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="modal fade" id="deleteCompanyProfileModal" tabIndex="-1"
                 aria-labelledby="deleteCompanyProfileModalLabel" data-bs-backdrop="static" data-bs-keyboard="false"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteCompanyProfileModalLabel">Delete Image</h5>
                            <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                    ref={companyProfileModalRef} data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa fa-times-circle" aria-hidden="true"/>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure want to delete company image?</p>
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
export default CompanyDetails;
