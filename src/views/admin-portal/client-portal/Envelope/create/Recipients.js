import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {getCountryByOrder, getCountryList} from "../../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import validator from "validator";
import {COUNTRY_CODE, COUNTRY_ICON, COUNTRY_ID} from "../../../../../configs/AppConfig";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {adminCreateEnvelopeRecipient, adminUpdateRecipient} from "../../../../../services/AdminService";

function AdminEnvelopeRecipients(props) {
    let {client} = useParams();

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

    const [documentIds, setDocumentIds] = useState([]);
    const [documentOptions, setDocumentOptions] = useState([]);
    const [formIds, setFormIds] = useState([]);
    const [formOptions, setFormOptions] = useState([]);

    const animatedComponents = makeAnimated();

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
        if (props?.formObj?.documents && props?.formObj?.documents.length > 0) {
            let options = [];
            for (let i = 0; i < props.formObj.documents.length; i++) {
                options.push({
                    value: props.formObj.documents[i]['id'],
                    label: props.formObj.documents[i]['name'],
                });
            }
            setDocumentOptions(options);
            setDocumentIds(options);
        }

        if (props?.formObj?.fill_forms && props?.formObj?.fill_forms.length > 0) {
            let options = [];
            for (let i = 0; i < props.formObj.fill_forms.length; i++) {
                options.push({
                    value: props.formObj.fill_forms[i]['id'],
                    label: props.formObj.fill_forms[i]['name'],
                });
            }
            setFormOptions(options);
            setFormIds(options);
        }
    }, [props?.formObj]);

    useEffect(() => {
        setId(props?.recipData?.id ? props?.recipData?.id : 0);
        setFirstName(props?.recipData?.first_name ? props?.recipData?.first_name : '');
        setLastName(props?.recipData?.last_name ? props?.recipData?.last_name : '');
        setEmail(props?.recipData?.email ? props?.recipData?.email : '');
        setMobile(props?.recipData?.mobile ? props?.recipData?.mobile : '');
        setCountryId(props?.recipData?.country_id ? props?.recipData?.country_id : COUNTRY_ID);

        if (props?.recipData?.country_id) {
            let index = countryList.findIndex(x => x.id === parseInt(props?.recipData?.country_id));
            if (index > -1) {
                setCountryIcon(countryList[index]['icon'].toLowerCase());
                setCountryCode(countryList[index]['code']);
            }
        }

        setCompanyName(props?.recipData?.company_name ? props?.recipData?.company_name : '');
        setAddress1(props?.recipData?.address_1 ? props?.recipData?.address_1 : '');
        setAddress2(props?.recipData?.address_2 ? props?.recipData?.address_2 : '');
        setCity(props?.recipData?.city ? props?.recipData?.city : '');
        setState(props?.recipData?.state ? props?.recipData?.state : '');
        setAddressCountryId(props?.recipData?.address_country_id ? props?.recipData?.address_country_id : '');
        setZipcode(props?.recipData?.zip_code ? props?.recipData?.zip_code : '');
    }, [props?.recipData, countryList]);

    let errorsObj = {
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        document: '',
        data_enter: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsButtonRef = useRef(null);

    function handleCountry(e, obj) {
        e.preventDefault();
        let id = obj.id;
        let index = countryCodeList.findIndex(x => x.id === parseInt(id));
        if (index > -1) {
            setCountryIcon(countryCodeList[index]['icon'].toLowerCase());
        }
        setCountryId(id);
        setCountryCode(obj.code);
    }

    function onStoreRecipient(e, type) {
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
        if (props?.formObj?.documents.length > 0 && documentIds.length === 0) {
            errorObj.document = 'Please select document';
            error = true;
        }
        if (props?.formObj?.fill_forms.length > 0 && formIds.length === 0) {
            errorObj.data_enter = 'Please select data';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        const formData = {...props.formObj};

        let obj = {
            client_id: client,
            envelope_id: formData.envelope_id,
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

        let index = formData.recipient_List.findIndex(x => x.email === obj.email);
        if (index === -1) {
            props.setLoading(true);
            adminCreateEnvelopeRecipient(obj)
                .then(response => {
                    let recipientData = response.data.data;
                    formData.recipient_List.push(recipientData);

                    let firstLetter = firstName.charAt(0);
                    let lastLetter = lastName.charAt(0);
                    let recipientDisplayName = [firstLetter + lastLetter];
                    if (documentIds.length > 0) {
                        for (let i = 0; i < formData.documents.length; i++) {
                            let index = documentIds.findIndex(x => parseInt(x.value) === parseInt(formData.documents[i]['id']));
                            if (index > -1) {
                                let requestIds = formData.documents[i]['request_id'].toString().split(',');
                                if ((requestIds.findIndex(x => parseInt(x) === 0) === -1)) {
                                    formData.documents[i]['request_id'] = formData.documents[i]['request_id'] + ',' + recipientData.id;
                                    let displayNameList = formData.documents[i]['request_display'];
                                    for (let j = 0; j < recipientDisplayName.length; j++) {
                                        displayNameList.push(recipientDisplayName[j]);
                                    }
                                    formData.documents[i]['request_display'] = displayNameList;
                                }
                            }
                        }
                    }

                    if (formIds.length > 0) {
                        for (let i = 0; i < formData.fill_forms.length; i++) {
                            let index = formIds.findIndex(x => parseInt(x.value) === parseInt(formData.fill_forms[i]['id']));
                            if (index > -1) {
                                let requestIds = formData.fill_forms[i]['request_id'].toString().split(',');
                                if ((requestIds.findIndex(x => parseInt(x) === 0) === -1)) {
                                    formData.fill_forms[i]['request_id'] = formData.fill_forms[i]['request_id'] + ',' + recipientData.id;
                                    let displayNameList = formData.fill_forms[i]['request_display'];
                                    for (let j = 0; j < recipientDisplayName.length; j++) {
                                        displayNameList.push(recipientDisplayName[j]);
                                    }
                                    formData.fill_forms[i]['request_display'] = displayNameList;
                                }
                            }
                        }
                    }

                    props.setFormObj(formData);
                    if (type === 1) {
                        clsButtonRef.current?.click();
                        clearRecipientForm();
                    } else {
                        clearRecipientForm();
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
    }

    function onSaveRecipient(e) {
        e.preventDefault();
        onStoreRecipient(e, 1);
    }

    function onSaveAddRecipient(e) {
        e.preventDefault();
        onStoreRecipient(e, 2);
    }

    function onUpdateRecipient(e) {
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
                const formData = {...props.formObj};
                let index = formData.recipient_List.findIndex(x => x.id === id);
                if (index > -1) {
                    formData.recipient_List[index]['first_name'] = firstName;
                    formData.recipient_List[index]['last_name'] = lastName;
                    formData.recipient_List[index]['email'] = email;
                    formData.recipient_List[index]['country_id'] = countryId;
                    formData.recipient_List[index]['country_code'] = countryCode;
                    formData.recipient_List[index]['mobile'] = mobile;
                    formData.recipient_List[index]['company_name'] = companyName;
                    formData.recipient_List[index]['address_1'] = address1;
                    formData.recipient_List[index]['address_2'] = address2;
                    formData.recipient_List[index]['city'] = city;
                    formData.recipient_List[index]['state'] = state;
                    formData.recipient_List[index]['zip_code'] = zipcode;
                    formData.recipient_List[index]['address_country_id'] = addressCountryId;
                    props.setFormObj(formData);
                }
                toast.success(response.data.message);
                clsButtonRef.current?.click();
                clearRecipientForm();
                props.setLoading(false);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));

            });
    }

    function onCloseRecipient(e) {
        e.preventDefault();
        clsButtonRef.current?.click();
        clearRecipientForm();
    }

    function clearRecipientForm() {
        setId(0);
        setFirstName('');
        setLastName('');
        setEmail('');
        setMobile('');
        setCountryId(COUNTRY_ID);
        setCountryCode(COUNTRY_CODE);
        setCountryIcon(COUNTRY_ICON);
        setCompanyName('');
        setAddress1('');
        setAddress2('');
        setCity('');
        setState('');
        setAddressCountryId('');
        setZipcode('');

        setDocumentIds([]);
        setFormIds([]);

        let errorObj = {
            first_name: '',
            last_name: '',
            email: '',
            mobile: ''
        };
        setErrors(errorObj);
    }

    return (
        <div className="offcanvas offcanvas-end Add-Recipients" data-bs-scroll="true" data-bs-backdrop="static"
             data-bs-keyboard="false" tabIndex="-1" id="addRecipients" aria-labelledby="addRecipientsLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title"
                    id="notification_boxLabel">{id > 0 ? 'Edit' : 'Add'} Recipients</h5>
                <button type="button" ref={clsButtonRef} className="btn close_btn text-reset"
                        data-bs-dismiss="offcanvas" aria-label="Close">
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
                                                    </li>)}
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

                {id === 0 && (
                    <div className="row mx-2">
                        {documentOptions.length > 0 && (
                            <div className="col-md-12">
                                <label className="form-label mb-2">Add Request Documents
                                    <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                                       data-placement="right" title="How Can i help you?"/>
                                </label>
                                <Select closeMenuOnSelect={true} value={documentIds} components={animatedComponents}
                                        isMulti onChange={(e) => setDocumentIds(e)} options={documentOptions}/>
                                {errors.document && <div className="text-danger">{errors.document}</div>}
                            </div>
                        )}

                        {formOptions.length > 0 && (
                            <div className="col-md-12 mt-4 mb-5">
                                <label className="form-label mb-2">Add Request Data
                                    <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                                       data-placement="right" title="How Can i help you?"/>
                                </label>
                                <Select closeMenuOnSelect={true} value={formIds} components={animatedComponents} isMulti
                                        onChange={(e) => setFormIds(e)} options={formOptions}/>
                                {errors.data_enter && <div className="text-danger">{errors.data_enter}</div>}
                            </div>
                        )}
                    </div>
                )}

                <div className="modal-footer mt-3">
                    <button type="button" onClick={onCloseRecipient} className="btn grey_btn_outline">Cancel
                    </button>
                    {id ? <button type="button" onClick={onUpdateRecipient}
                                  className="btn modal_btn">Update</button> :
                        <>
                            <button type="button" onClick={onSaveAddRecipient}
                                    className="btn modal_btn_outline">Save &
                                Add Another
                            </button>
                            <button type="button" onClick={onSaveRecipient} className="btn modal_btn">Save
                            </button>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default AdminEnvelopeRecipients;