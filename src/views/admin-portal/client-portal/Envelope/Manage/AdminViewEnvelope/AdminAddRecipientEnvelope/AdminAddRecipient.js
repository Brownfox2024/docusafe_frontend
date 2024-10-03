import React, {useEffect, useState, useRef} from "react";
import {useParams} from "react-router-dom";
import {COUNTRY_CODE, COUNTRY_ICON, COUNTRY_ID} from "../../../../../../../configs/AppConfig";
import {getCountryByOrder, getCountryList} from "../../../../../../../services/CommonService";
import validator from "validator";
import {toast} from "react-toastify";
import Utils from "../../../../../../../utils";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {adminCreateEnvelopeRecipient, adminUpdateRecipient} from "../../../../../../../services/AdminService";

function AdminAddRecipient(props) {
    const {client} = useParams();
    const [countryList, setCountryList] = useState([]);
    const [countryCodeList, setCountryCodeList] = useState([]);
    const [id, setId] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [countryId, setCountryId] = useState(COUNTRY_ID);
    const [countryCode, setCountryCode] = useState(COUNTRY_CODE);
    const [mobile, setMobile] = useState('');
    const [countryIcon, setCountryIcon] = useState(COUNTRY_ICON);
    const [companyName, setCompanyName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [addressCountryId, setAddressCountryId] = useState('');
    const [zipcode, setZipcode] = useState('');

    const [docId, setDocId] = useState([]);
    const [documentOptions, setDocumentOptions] = useState([]);
    const [formId, setFormId] = useState([]);
    const [formOptions, setFormOptions] = useState([]);

    const animatedComponents = makeAnimated();

    let errorsObj = {
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        document: '',
        data_enter: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsAddRecipientModalRef = useRef(null);

    useEffect(() => {
        getCountryByOrder('code')
            .then(response => {
                setCountryCodeList(response.data.data);
            })
            .catch(err => {
            });

        getCountryList()
            .then(response => {
                setCountryList(response.data.data);
            })
            .catch(err => {
            });

    }, []);

    useEffect(function () {
        if (props?.docList && props?.docList.length > 0) {
            let options = [];
            for (let i = 0; i < props.docList.length; i++) {
                options.push({
                    value: props.docList[i]['id'],
                    label: props.docList[i]['doc_name'],
                });
            }
            setDocumentOptions(options);
            setDocId(options);
        }

        if (props?.formList && props?.formList.length > 0) {
            let options = [];
            for (let i = 0; i < props.formList.length; i++) {
                options.push({
                    value: props.formList[i]['id'],
                    label: props.formList[i]['form_name'],
                });
            }
            setFormOptions(options);
            setFormId(options);
        }
    }, [props?.docList, props?.formList]);

    useEffect(() => {
        setId(props?.recipientData?.id ? props?.recipientData?.id : 0);
        setFirstName(props?.recipientData?.first_name ? props?.recipientData?.first_name : '');
        setLastName(props?.recipientData?.last_name ? props?.recipientData?.last_name : '');
        setEmail(props?.recipientData?.email ? props?.recipientData?.email : '');
        setMobile(props?.recipientData?.mobile ? props?.recipientData?.mobile : '');
        setCountryId(props?.recipientData?.country_id ? props?.recipientData?.country_id : COUNTRY_ID);

        if (props?.recipientData?.country_id) {
            let index = countryList.findIndex(x => x.id === parseInt(props?.recipientData?.country_id));
            if (index > -1) {
                setCountryIcon(countryList[index]['icon'].toLowerCase());
                setCountryCode(countryList[index]['code']);
            }
        }

        setCompanyName(props?.recipientData?.company_name ? props?.recipientData?.company_name : '');
        setAddress1(props?.recipientData?.address_1 ? props?.recipientData?.address_1 : '');
        setAddress2(props?.recipientData?.address_2 ? props?.recipientData?.address_2 : '');
        setCity(props?.recipientData?.city ? props?.recipientData?.city : '');
        setState(props?.recipientData?.state ? props?.recipientData?.state : '');
        setAddressCountryId(props?.recipientData?.address_country_id ? props?.recipientData?.address_country_id : '');
        setZipcode(props?.recipientData?.zip_code ? props?.recipientData?.zip_code : '');
    }, [props?.recipientData, countryList]);

    const handleCountry = (e, obj) => {
        e.preventDefault();
        let id = obj.id;
        let index = countryCodeList.findIndex(x => x.id === parseInt(id));
        if (index > -1) {
            setCountryIcon(countryCodeList[index]['icon'].toLowerCase());
        }
        setCountryId(id);
        setCountryCode(obj.code);
    };

    const handleClearAddRecipientForm = (e) => {
        e.preventDefault();

        props.setRecipientData({
            id: 0,
            first_name: '',
            last_name: '',
            email: '',
            mobile: '',
            country_code: '',
            country_id: '',
            company_name: '',
            address_1: '',
            address_2: '',
            city: '',
            state: '',
            address_country_id: '',
            zip_code: ''
        });

        if (props?.docList && props?.docList.length > 0) {
            let options = [];
            for (let i = 0; i < props.docList.length; i++) {
                options.push({
                    value: props.docList[i]['id'],
                    label: props.docList[i]['doc_name'],
                });
            }
            setDocId(options);
        }

        if (props?.formList && props?.formList.length > 0) {
            let options = [];
            for (let i = 0; i < props.formList.length; i++) {
                options.push({
                    value: props.formList[i]['id'],
                    label: props.formList[i]['form_name'],
                });
            }
            setFormId(options);
        }

        setCountryIcon(COUNTRY_ICON);
        setCountryCode(COUNTRY_CODE);

        setErrors(errorsObj);
    };

    const handleAddRecipientSave = (e, type) => {
        e.preventDefault();

        let error = false;
        const errorObj = {...errorsObj};

        if (!firstName) {
            errorObj.first_name = 'First name must be required';
            error = true;
        }
        if (!lastName) {
            errorObj.last_name = 'Last name must be required';
            error = true;
        }
        if (!email) {
            errorObj.email = 'Email must be required';
            error = true;
        } else if (!validator.isEmail(email)) {
            errorObj.email = 'Please enter valid email address';
            error = true;
        }
        if (props?.docList.length > 0 && docId.length === 0) {
            errorObj.document = 'Please select document';
            error = true;
        }
        if (props?.formList.length > 0 && formId.length === 0) {
            errorObj.data_enter = 'Please select data';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        const reciptList = [...props.recipientList];

        let obj = {
            client_id: client,
            envelope_id: props.envelopeId,
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
            address_country_id: addressCountryId
        };

        let index = reciptList.findIndex(x => x.email === obj.email);
        if (index === -1) {
            props.setLoading(true);
            adminCreateEnvelopeRecipient(obj)
                .then(response => {
                    let reciptData = response.data.data;
                    reciptData.doc_id = docId;
                    reciptData.form_id = formId;
                    reciptList.push(reciptData);
                    props.setRecipientList(reciptList);
                    if (type === 2) {
                        clsAddRecipientModalRef.current?.click();
                    } else {
                        handleClearAddRecipientForm(e);
                    }
                    props.setLoading(false);
                })
                .catch(err => {
                    props.setLoading(false);
                    toast.error(Utils.getErrorMessage(err));

                });
        } else {
            toast.error('Recipient already exist.');
        }
    };

    const handleUpdateRecipient = (e) => {
        e.preventDefault();

        e.preventDefault();
        let error = false;
        const errorObj = {...errorsObj};

        if (!firstName) {
            errorObj.first_name = 'First name must be required';
            error = true;
        }
        if (!lastName) {
            errorObj.last_name = 'Last name must be required';
            error = true;
        }
        if (!email) {
            errorObj.email = 'Email must be required';
            error = true;
        } else if (!validator.isEmail(email)) {
            errorObj.email = 'Please enter valid email address';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

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
            address_country_id: addressCountryId
        };
        props.setLoading(true);
        adminUpdateRecipient(obj)
            .then(response => {
                let reciptList = [...props.recipientList];
                let index = reciptList.findIndex(x => parseInt(x.id) === parseInt(id));
                if (index > -1) {
                    reciptList[index]['first_name'] = firstName;
                    reciptList[index]['last_name'] = lastName;
                    reciptList[index]['email'] = email;
                    reciptList[index]['country_id'] = countryId;
                    reciptList[index]['country_code'] = countryCode;
                    reciptList[index]['mobile'] = mobile;
                    reciptList[index]['company_name'] = companyName;
                    reciptList[index]['address_1'] = address1;
                    reciptList[index]['address_2'] = address2;
                    reciptList[index]['city'] = city;
                    reciptList[index]['state'] = state;
                    reciptList[index]['zip_code'] = zipcode;
                    reciptList[index]['address_country_id'] = addressCountryId;
                    props.setRecipientList(reciptList);
                }

                toast.success(response.data.message);
                clsAddRecipientModalRef.current?.click();
                props.setLoading(false);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <div className="offcanvas offcanvas-end Add-Recipients " data-bs-scroll="true" tabIndex="-1" id="addRecipients"
             data-bs-keyboard="false" data-bs-backdrop="static" aria-labelledby="addRecipientsLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="notification_boxLabel">Add Recipients</h5>
                <button type="button" className="btn close_btn text-reset" onClick={handleClearAddRecipientForm}
                        ref={clsAddRecipientModalRef} data-bs-dismiss="offcanvas" aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                <div className="row mx-2 ">
                    <div className="col-lg-6">
                        <div className="mb-4">
                            <label htmlFor="first_name" className="form-label mb-2">First Name</label>
                            <input type="text" className="form-control" id="first_name"
                                   value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                   aria-describedby="emailHelp" placeholder="Enter First Name"/>
                            {errors.first_name && <div className="text-danger">{errors.first_name}</div>}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-4">
                            <label htmlFor="last_name" className="form-label mb-2">Last Name</label>
                            <input type="text" className="form-control" id="last_name"
                                   value={lastName} onChange={(e) => setLastName(e.target.value)}
                                   aria-describedby="emailHelp" placeholder="Enter Last Name"/>
                            {errors.last_name && <div className="text-danger">{errors.last_name}</div>}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-0">
                            <label htmlFor="email" className="form-label mb-2">Email</label>
                            <input type="text" className="form-control" id="email"
                                   value={email} onChange={(e) => setEmail(e.target.value)}
                                   aria-describedby="emailHelp" placeholder="Enter Email Address"/>
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-4">
                            <label htmlFor="country_code" className="form-label mb-2 number">Mobile
                                Number</label>
                            <div className="country_code">
                                <span className="d-flex align-items-center">
                                    <img src={`/images/flags/${countryIcon}.png`} className="me-2"
                                         alt="country"/>
                                    <button className="btn btn-white dropdown-toggle" type="button"
                                            id="dropdownMenuButton1" data-bs-toggle="dropdown"
                                            aria-expanded="false">+{countryCode}</button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        {countryCodeList.map((item, index) =>
                                            <li key={index} className="cur-pointer"
                                                onClick={(e) => handleCountry(e, item)}>
                                                <div className="dropdown-item">
                                                    <img src={`/images/flags/${item.icon}.png`} alt="..."/>
                                                    <div className="country-code">+{item.code}</div>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </span>
                                <input type="number" className="form-control" id="country_code"
                                       value={mobile} onChange={(e) => setMobile(e.target.value)}
                                       aria-describedby="emailHelp" placeholder="Enter Mobile Number"/>
                            </div>
                            {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
                        </div>
                    </div>
                </div>
                <div className="accordion mx-3 more--details" id="More_details">
                    <div className="accordion-item background_grey_400 border-0">
                        <h2 className="accordion-header " id="moreDetails">
                            <button className="accordion-button background_grey_400 py-2 px-3"
                                    style={{boxShadow: 'none'}} type="button" data-bs-toggle="collapse"
                                    data-bs-target="#More-details" aria-expanded="false"
                                    aria-controls="More-details">
                                More Details
                            </button>
                        </h2>
                        <div id="More-details" className="accordion-collapse collapse"
                             aria-labelledby="moreDetails">
                            <div className="accordion-body px-0">
                                <div className="mx-3">
                                    <div className="mb-4">
                                        <label htmlFor="email_subject" className="form-label mb-3">Company
                                            Name</label>
                                        <input type="text" className="form-control" id="company_name"
                                               value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                                               placeholder="Enter Company Name"/>
                                        {errors.company_name &&
                                        <div className="text-danger">{errors.company_name}</div>}
                                    </div>
                                    <div className="mb-0">
                                        <label htmlFor="email_subject"
                                               className="form-label mb-3">Address</label>
                                        <input type="address" className="form-control" id="address_1"
                                               value={address1} onChange={(e) => setAddress1(e.target.value)}
                                               placeholder="Address line 1"/>
                                        {errors.address_1 && <div className="text-danger">{errors.address_1}</div>}
                                        <input type="address" className="form-control mt-2" id="address_2"
                                               value={address2} onChange={(e) => setAddress2(e.target.value)}
                                               placeholder="Address line 2"/>
                                        {errors.address_2 && <div className="text-danger">{errors.address_2}</div>}
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <input type="text" className="form-control mt-2" id="city"
                                                       value={city} onChange={(e) => setCity(e.target.value)}
                                                       placeholder="City"/>
                                                {errors.city && <div className="text-danger">{errors.city}</div>}
                                            </div>
                                            <div className="col-lg-6">
                                                <input type="text" className="form-control mt-2" id="state"
                                                       value={state} onChange={(e) => setState(e.target.value)}
                                                       placeholder="State"/>
                                                {errors.state && <div className="text-danger">{errors.state}</div>}
                                            </div>
                                            <div className="col-lg-6">
                                                <select className="form-select mt-2" value={addressCountryId}
                                                        onChange={(e) => setAddressCountryId(e.target.value)}>
                                                    <option value="">Country</option>
                                                    {countryList && countryList.map((country, index) =>
                                                        <option key={index} value={country.id}>{country.name}</option>)}
                                                </select>
                                                {errors.address_country_id &&
                                                <div className="text-danger">{errors.address_country_id}</div>}
                                            </div>
                                            <div className="col-lg-6">
                                                <input type="number" className="form-control mt-2" id="zipcode"
                                                       value={zipcode} onChange={(e) => setZipcode(e.target.value)}
                                                       placeholder="Zipcode"/>
                                                {errors.zipcode && <div className="text-danger">{errors.zipcode}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {id === 0 &&
                <div className="row mx-2 ">
                    {props.docList && props.docList.length > 0 &&
                    <div className="col-lg-12">
                        <div className="mb-4">
                            <label className="form-label mb-2">Add Request Documents
                                <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                                   data-placement="right" title="How Can i help you?"/>
                            </label>
                            <Select closeMenuOnSelect={true} value={docId} components={animatedComponents} isMulti
                                    onChange={(e) => setDocId(e)} options={documentOptions}/>
                            {errors.document && <div className="text-danger">{errors.document}</div>}
                        </div>
                    </div>
                    }

                    {props.formList && props.formList.length > 0 &&
                    <div className="col-lg-12">
                        <div className="mb-4">
                            <label className="form-label mb-2">Add Request Data
                                <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                                   data-placement="right" title="How Can i help you?"/>
                            </label>
                            <Select closeMenuOnSelect={true} value={formId} components={animatedComponents} isMulti
                                    onChange={(e) => setFormId(e)} options={formOptions}/>
                            {errors.data_enter && <div className="text-danger">{errors.data_enter}</div>}
                        </div>
                    </div>
                    }
                </div>
                }

                <div className="modal-footer mt-3">
                    <button type="button" onClick={handleClearAddRecipientForm} className="btn grey_btn_outline"
                            data-bs-dismiss="offcanvas">Cancel
                    </button>
                    {id > 0
                        ?
                        <button type="button" onClick={handleUpdateRecipient} className="btn modal_btn">Update</button>
                        : <>
                            <button type="button" onClick={(e) => handleAddRecipientSave(e, 1)}
                                    className="btn modal_btn_outline">Save & Add Another
                            </button>
                            <button type="button" onClick={(e) => handleAddRecipientSave(e, 2)}
                                    className="btn modal_btn">Save
                            </button>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default AdminAddRecipient;