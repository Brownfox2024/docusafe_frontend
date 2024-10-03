import React, {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import validator from "validator";
import {getCountryByOrder, getCountryList} from "../../../../services/CommonService";
import {
    COUNTRY_CODE,
    COUNTRY_ICON,
    COUNTRY_ID,
} from "../../../../configs/AppConfig";
import {toast} from "react-toastify";
import Utils from "../../../../utils";
import {adminRecipientCreate, adminUpdateRecipient} from "../../../../services/AdminService";

function AdminModifyRecipient(props) {
    let {client} = useParams();
    const clsButtonRef = useRef(null);

    const [id, setId] = useState(0);
    const [countryCodeList, setCountryCodeList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [countryIcon, setCountryIcon] = useState(COUNTRY_ICON);
    const [countryId, setCountryId] = useState(COUNTRY_ID);
    const [countryCode, setCountryCode] = useState(COUNTRY_CODE);
    const [mobile, setMobile] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [addressCountryId, setAddressCountryId] = useState("");
    const [zipcode, setZipcode] = useState("");

    let errorObj = {
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        company_name: "",
        address_1: "",
        address_2: "",
        city: "",
        state: "",
        address_country_id: "",
        zipcode: "",
    };
    const [errors, setErrors] = useState(errorObj);

    useEffect(() => {
        getCountryByOrder("code")
            .then((response) => {
                setCountryCodeList(response.data.data);
            })
            .catch((err) => {
            });

        getCountryList()
            .then((response) => {
                setCountryList(response.data.data);
            })
            .catch((err) => {
            });
    }, []);

    useEffect(() => {
        setId(props.data.id);
        setFirstName(props.data.first_name);
        setLastName(props.data.last_name);
        setEmail(props.data.email);
        setMobile(props.data.mobile);
        setCountryId(props.data.country_id);
        let index = countryList.findIndex(
            (x) => x.id === parseInt(props.data.country_id)
        );
        if (index > -1) {
            setCountryIcon(countryList[index]["icon"].toLowerCase());
            setCountryCode(countryList[index]["code"]);
        }
        setCompanyName(props.data.company_name);
        setAddress1(props.data.address_1);
        setAddress2(props.data.address_2);
        setCity(props.data.city);
        setState(props.data.state);
        setAddressCountryId(props.data.address_country_id);
        setZipcode(props.data.zipcode);
    }, [props?.data, countryList]);

    function handleCountry(e, obj) {
        e.preventDefault();
        let id = obj.id;
        let index = countryCodeList.findIndex((x) => x.id === parseInt(id));
        if (index > -1) {
            setCountryIcon(countryCodeList[index]["icon"].toLowerCase());
        }
        setCountryId(id);
        setCountryCode(obj.code);
    }

    function handleRecipientAdd(e) {
        e.preventDefault();
        onRecipientStore(e, 2);
    }

    function handleRecipientSave(e) {
        e.preventDefault();
        onRecipientStore(e, 1);
    }

    function onRecipientStore(e, type) {
        e.preventDefault();
        let error = false;
        const errorObj = {...errors};

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

        setErrors(errorObj);

        if (error) return;

        props.setLoading(true);
        let obj = {
            client_id: client,
            first_name: firstName,
            last_name: lastName,
            email: email,
            country_id: countryId,
            mobile: mobile,
            company_name: companyName,
            address_1: address1,
            address_2: address2,
            city: city,
            state: state,
            zip_code: zipcode,
            address_country_id: addressCountryId,
        };
        adminRecipientCreate(obj)
            .then((response) => {
                if (type === 1) {
                    clsButtonRef.current?.click();
                }
                clearRecipientData();
                props.setIsEffect(!props.isEffect);
                toast.success(response.data.message);
                props.setLoading(false);
            })
            .catch((err) => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    }

    function handleRecipientUpdate(e) {
        e.preventDefault();
        let error = false;
        const errorObj = {...errors};

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

        setErrors(errorObj);

        if (error) return;

        props.setLoading(true);
        let obj = {
            client_id: client,
            recipient_id: id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            country_id: countryId,
            mobile: mobile,
            company_name: companyName,
            address_1: address1,
            address_2: address2,
            city: city,
            state: state,
            zip_code: zipcode,
            address_country_id: addressCountryId,
        };
        adminUpdateRecipient(obj)
            .then((response) => {
                clsButtonRef.current?.click();
                clearRecipientData();
                toast.success(response.data.message);
                props.setIsEffect(!props.isEffect);
                props.setLoading(false);
            })
            .catch((err) => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    }

    function onCloseRecipientModel(e) {
        e.preventDefault();
        clsButtonRef.current?.click();
        clearRecipientData();
    }

    function clearRecipientData() {
        let error = {...errors};
        error.first_name = "";
        error.last_name = "";
        error.email = "";
        error.mobile = "";
        error.company_name = "";
        error.address_1 = "";
        error.address_2 = "";
        error.city = "";
        error.state = "";
        error.address_country_id = "";
        error.zipcode = "";
        setErrors(error);
        let obj = {
            id: 0,
            first_name: "",
            last_name: "",
            email: "",
            country_id: 13,
            mobile: "",
            company_name: "",
            address_1: "",
            address_2: "",
            city: "",
            state: "",
            address_country_id: "",
            zipcode: "",
            readonly: false,
        };
        props.setData(obj);
    }

    return (
        <div
            className="offcanvas offcanvas-end Add-Recipients "
            data-bs-scroll="true"
            tabIndex="-1"
            data-bs-keyboard="false"
            data-bs-backdrop="static"
            id="addRecipients"
            aria-labelledby="addRecipientsLabel"
        >
            <div className="offcanvas-header">
                <h5
                    className={
                        props.data.readonly === false ? `offcanvas-title` : `d-none`
                    }
                    id="notification_boxLabel"
                >
                    {id > 0 ? `Edit Recipient` : `Add Recipient`}
                </h5>
                <h5
                    className={
                        props.data.readonly === true ? `offcanvas-title` : `d-none`
                    }
                    id="notification_boxLabel"
                >
                    View Recipient
                </h5>
                <button
                    type="button"
                    ref={clsButtonRef}
                    onClick={clearRecipientData}
                    className="btn close_btn text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                >
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                <form className="mx-3 mb-4">
                    <div className="row mx-2 ">
                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="first_name" className="form-label mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="first_name"
                                    value={firstName}
                                    readOnly={props.data.readonly}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Enter First Name"
                                />
                                {errors.first_name && (
                                    <div className="text-danger">{errors.first_name}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label htmlFor="last_name" className="form-label mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="last_name"
                                    value={lastName}
                                    readOnly={props.data.readonly}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Enter Last Name"
                                />
                                {errors.last_name && (
                                    <div className="text-danger">{errors.last_name}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mb-0">
                                <label htmlFor="email" className="form-label mb-2">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    readOnly={props.data.readonly}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter Email Address"
                                />
                                {errors.email && (
                                    <div className="text-danger">{errors.email}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mb-0">
                                <label
                                    htmlFor="country_code"
                                    className="form-label mb-2 number"
                                >
                                    Mobile Number
                                </label>
                                <div className="country_code">
                  <span className="d-flex align-items-center">
                    <img
                        src={`/images/flags/${countryIcon}.png`}
                        className="me-2"
                        alt="country"
                    />
                    <button
                        className="btn btn-white dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                      +{countryCode}
                    </button>
                    <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton1"
                    >
                      {countryCodeList.map((item, index) => (
                          <li
                              key={index}
                              className="cur-pointer"
                              onClick={(e) => handleCountry(e, item)}
                          >
                              <div className="dropdown-item">
                                  <img
                                      src={`/images/flags/${item.icon}.png`}
                                      alt="..."
                                  />
                                  <div className="country-code">+{item.code}</div>
                              </div>
                          </li>
                      ))}
                    </ul>
                  </span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="country_code"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        readOnly={props.data.readonly}
                                        placeholder="Enter Mobile Number"
                                    />
                                </div>
                                {errors.mobile && (
                                    <div className="text-danger">{errors.mobile}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
                <div className="accordion mx-3 more--details" id="More_details">
                    <div className="accordion-item background_grey_400 border-0">
                        <h2 className="accordion-header " id="moreDetails">
                            <button
                                className="accordion-button background_grey_400 py-2 px-3"
                                style={{boxShadow: "none"}}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#More-details"
                                aria-expanded="true"
                                aria-controls="More-details"
                            >
                                More Details
                            </button>
                        </h2>
                        <div
                            id="More-details"
                            className="accordion-collapse collapse show"
                            aria-labelledby="moreDetails"
                        >
                            <div className="accordion-body px-0">
                                <form className="mx-3">
                                    <div className="mb-4">
                                        <label htmlFor="email_subject" className="form-label mb-3">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="company_name"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            readOnly={props.data.readonly}
                                            placeholder="Enter Company Name"
                                        />
                                        {errors.company_name && (
                                            <div className="text-danger">{errors.company_name}</div>
                                        )}
                                    </div>
                                    <div className="mb-0">
                                        <label htmlFor="email_subject" className="form-label mb-3">
                                            Address
                                        </label>
                                        <input
                                            type="address"
                                            className="form-control"
                                            id="address_1"
                                            value={address1}
                                            onChange={(e) => setAddress1(e.target.value)}
                                            readOnly={props.data.readonly}
                                            placeholder="Address line 1"
                                        />
                                        {errors.address_1 && (
                                            <div className="text-danger">{errors.address_1}</div>
                                        )}
                                        <input
                                            type="address"
                                            className="form-control mt-2"
                                            id="address_2"
                                            value={address2}
                                            onChange={(e) => setAddress2(e.target.value)}
                                            readOnly={props.data.readonly}
                                            placeholder="Address line 2"
                                        />
                                        {errors.address_2 && (
                                            <div className="text-danger">{errors.address_2}</div>
                                        )}
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <input
                                                    type="text"
                                                    className="form-control mt-2"
                                                    id="city"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    readOnly={props.data.readonly}
                                                    placeholder="City"
                                                />
                                                {errors.city && (
                                                    <div className="text-danger">{errors.city}</div>
                                                )}
                                            </div>
                                            <div className="col-lg-6">
                                                <input
                                                    type="text"
                                                    className="form-control mt-2"
                                                    id="state"
                                                    value={state}
                                                    onChange={(e) => setState(e.target.value)}
                                                    readOnly={props.data.readonly}
                                                    placeholder="State"
                                                />
                                                {errors.state && (
                                                    <div className="text-danger">{errors.state}</div>
                                                )}
                                            </div>
                                            <div className="col-lg-6">
                                                <select
                                                    className="form-select mt-2"
                                                    value={addressCountryId}
                                                    disabled={props.data.readonly}
                                                    onChange={(e) => setAddressCountryId(e.target.value)}
                                                >
                                                    <option value="">Country</option>
                                                    {countryList &&
                                                    countryList.map((country, index) => (
                                                        <option key={index} value={country.id}>
                                                            {country.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.address_country_id && (
                                                    <div className="text-danger">
                                                        {errors.address_country_id}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-lg-6">
                                                <input
                                                    type="number"
                                                    className="form-control mt-2"
                                                    id="zipcode"
                                                    value={zipcode}
                                                    onChange={(e) => setZipcode(e.target.value)}
                                                    readOnly={props.data.readonly}
                                                    placeholder="Zipcode"
                                                />
                                                {errors.zipcode && (
                                                    <div className="text-danger">{errors.zipcode}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer mt-3">
                    <button
                        type="button"
                        onClick={onCloseRecipientModel}
                        className="btn grey_btn_outline"
                    >
                        Cancel
                    </button>
                    {props.data.readonly === true ? (
                        ``
                    ) : (
                        <>
                            {id > 0 ? (
                                <button
                                    type="button"
                                    onClick={handleRecipientUpdate}
                                    className="btn modal_btn"
                                >
                                    Update
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleRecipientAdd}
                                        className="btn modal_btn_outline"
                                    >
                                        Save &amp; Add Another
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRecipientSave}
                                        className="btn modal_btn"
                                    >
                                        Save
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminModifyRecipient;