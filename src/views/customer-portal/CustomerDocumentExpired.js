import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {
    envelopeVerifyOtp,
    getCustomerDocumentExpired, sendCustomerEnvelope,
    uploadCustomerEnvelopeDocumentExpired
} from "../../services/CommonService";
import {Lang} from "../../lang";
import {CUSTOMER_PORTAL, DATE_FORMAT_LIST} from "../../configs/AppConfig";
import Header from "./Header";
import Utils from "../../utils";
import {toast} from "react-toastify";
import Footer from "./Footer";
import CustomerPortalTab from "./CustomerPortalTab";
import Messages from "./Messages";
import Contact from "./Contact";
import Help from "./Help";
import DatePicker from "react-datepicker";

function CustomerDocumentExpired() {
    let {uuid, id} = useParams();
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('');
    const [error, setError] = useState('');
    const [envelopeData, setEnvelopeData] = useState({});
    const [contactData, setContactData] = useState({});
    const [otp, setOtp] = useState(true);

    const [contactName, setContactName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [envelopeName, setEnvelopeName] = useState("");
    const [documentList, setDocumentList] = useState([]);
    const [fileKey, setFileKey] = useState(Date.now);
    const [isEnvelopeEdit, setIsEnvelopeEdit] = useState(false);

    const [firstLetter, setFirstLetter] = useState('');
    const [secondLetter, setSecondLetter] = useState('');
    const [thirdLetter, setThirdLetter] = useState('');
    const [fourthLetter, setFourthLetter] = useState('');
    const [fifthLetter, setFifthLetter] = useState('');
    const [sixthLetter, setSixthLetter] = useState('');

    const secondLetterRef = useRef(null);
    const thirdLetterRef = useRef(null);
    const fourthLetterRef = useRef(null);
    const fifthLetterRef = useRef(null);
    const sixthLetterRef = useRef(null);

    const warningModalRef = useRef(null);
    const warningModalCloseRef = useRef(null);
    const envDueDateRef = useRef([]);

    useEffect(function () {
        document.title = Lang.client_portal_title;
        getCustomerDocumentExpired({uuid: uuid, id: id})
            .then(response => {
                setEnvelopeData(response.data.data);
                setTheme(response.data.data.theme_color);
                setContactData(response.data.data.contact_detail);

                setContactName(response.data.data.contact_detail.first_name + " " + response.data.data.contact_detail.last_name);
                setCompanyName(response.data.data.contact_detail.company_name);
                setEnvelopeName(response.data.data.envelope_name);
                setDocumentList(response.data.data.document_list);
                setIsEnvelopeEdit(response.data.data.isEnvelopeEdit);

                let localStore = sessionStorage.getItem(CUSTOMER_PORTAL);
                if (localStore) {
                    if (localStore === id) {
                        setOtp(false);
                    }
                }

                setLoading(false);
            })
            .catch(err => {
                setError(Utils.getErrorMessage(err));
                setLoading(false);
            });
    }, [uuid, id]);

    const handlePasteValue = (e) => {
        let value = e.clipboardData.getData('text');
        let length = value.length;
        if (length === 6) {
            for (let i = 0; i < length; i++) {
                if (i === 0) {
                    setFirstLetter(value[i]);
                } else if (i === 1) {
                    setSecondLetter(value[i]);
                } else if (i === 2) {
                    setThirdLetter(value[i]);
                } else if (i === 3) {
                    setFourthLetter(value[i]);
                } else if (i === 4) {
                    setFifthLetter(value[i]);
                } else if (i === 5) {
                    setSixthLetter(value[i]);
                }
            }
        }
    };

    const handleOptClear = (e, type) => {
        if (e.key === 'Backspace') {
            if (type === 1) {
                setFirstLetter('');
            } else if (type === 2) {
                setSecondLetter('');
            } else if (type === 3) {
                setThirdLetter('');
            } else if (type === 4) {
                setFourthLetter('');
            } else if (type === 5) {
                setFifthLetter('');
            }
        }
    };

    const handleOtpInput = (e, type) => {
        let value = e.target.value;
        if (value.length > 1) return;
        if (type === 1) {
            setFirstLetter(value);
            secondLetterRef?.current.focus();
        } else if (type === 2) {
            setSecondLetter(value);
            thirdLetterRef?.current.focus();
        } else if (type === 3) {
            setThirdLetter(value);
            fourthLetterRef?.current.focus();
        } else if (type === 4) {
            setFourthLetter(value);
            fifthLetterRef?.current.focus();
        } else if (type === 5) {
            setFifthLetter(value);
            sixthLetterRef?.current.focus();
        } else if (type === 6) {
            setSixthLetter(value);
        }
    };

    const handleOtp = async (e) => {
        e.preventDefault();

        let otpValue = firstLetter + secondLetter + thirdLetter + fourthLetter + fifthLetter + sixthLetter;

        if (otpValue.length === 6) {
            setLoading(true);
            let ipAddress = '';
            await Utils.getIpAddress().then(response => {
                ipAddress = response;
            });

            let obj = {
                ip_address: ipAddress,
                otp: otpValue,
                id: envelopeData.id,
                recipient_id: envelopeData.recipient_detail.id,
                recipient_email: envelopeData.recipient_detail.email
            };

            envelopeVerifyOtp(obj)
                .then(response => {
                    setLoading(false);
                    setOtp(false);

                    sessionStorage.setItem(CUSTOMER_PORTAL, id);
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        } else {
            toast.error('Invalid OTP');
        }
    };

    const handleDocRemove = (e, idx, index) => {
        e.preventDefault();
        let docList = [...documentList];
        let uploadDocList = docList[index]['uploaded_documents'];
        let removeId = uploadDocList[idx]['id'];
        uploadDocList.splice(idx, 1);
        docList[index]['uploaded_documents'] = uploadDocList;
        if (removeId > 0) {
            let removeDocList = docList[index]['remove_doc'];
            removeDocList.push(removeId);
            docList[index]['remove_doc'] = removeDocList;
        }
        setDocumentList(docList);
    };

    const handleDocFile = (e, index) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            let docList = [...documentList];
            let uploadDocs = docList[index]['uploaded_documents'];
            for (let i = 0; i < e.target.files.length; i++) {
                let kb = e.target.files[i].size / 1000;
                uploadDocs.push({
                    id: 0,
                    name: e.target.files[i].name,
                    kb: parseFloat(kb).toFixed(2),
                    is_upload_client: 0,
                    file: e.target.files[i],
                });
            }
            docList[index]['uploaded_documents'] = uploadDocs;
            setDocumentList(docList);
            setFileKey(Date.now());
        }
    };

    const handleDownload = async (e, data) => {
        e.preventDefault();
        setLoading(true);
        await Utils.downloadAnyFile(data.file_path, data.file_name);
        setLoading(false);
    };

    const showDate = (date) => {
        let dateFormat = '';
        if (date) {
            dateFormat = new Date(date);
        }
        return dateFormat;
    };

    const showDateFormat = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['format'];
        }
        return value;
    };

    const showDatePlaceholder = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['text'];
        }
        return value;
    };

    const handleDateFormat = (date, index) => {
        let list = [...documentList];
        list[index]['date_format_text'] = date;
        list[index]['date_text'] = Utils.expiryDateFormatText(date);
        setDocumentList(list);
    };

    const handleEnvDate = (e, index) => {
        e.preventDefault();
        envDueDateRef?.current[index].setFocus(true);
    };

    const handleDocNote = (e, index) => {
        e.preventDefault();
        let docList = [...documentList];
        docList[index]['notes'] = e.target.value;
        setDocumentList(docList);
    };

    const handleCancelDoc = (e, index) => {
        e.preventDefault();
        let docList = [...documentList];
        docList[index]['uploaded_documents'] = [];
        docList[index]['notes'] = '';
        setDocumentList(docList);
    };

    const handleSubmitDoc = async (e, index) => {
        e.preventDefault();
        let error = false;
        let docList = [...documentList];

        if (docList[index]['uploaded_documents'].length === 0) {
            docList[index]['doc_err'] = 'Please upload document';
            error = true;
        } else {
            docList[index]['doc_err'] = '';
        }

        setDocumentList(docList);

        if (error) return;

        setLoading(true);

        let ipAddress = '';
        await Utils.getIpAddress().then(response => {
            ipAddress = response;
        });

        const formData = new FormData();
        formData.append('ip_address', ipAddress);
        formData.append('uuid', uuid);
        formData.append('envelope_id', envelopeData.id);
        formData.append('user_id', envelopeData.user_id);
        formData.append('envelope_name', envelopeData.envelope_name);
        formData.append('recipient_id', envelopeData.recipient_detail.id);
        formData.append('recipient_email', envelopeData.recipient_detail.email);
        formData.append('recipient_name', envelopeData.recipient_detail.first_name + ' ' + envelopeData.recipient_detail.last_name);
        formData.append('sender_name', envelopeData.contact_detail.first_name + ' ' + envelopeData.contact_detail.last_name);
        formData.append('sender_email', envelopeData.contact_detail.email);
        formData.append('company_name', envelopeData.contact_detail.company_name);
        formData.append('company_id', envelopeData.contact_detail.id);
        formData.append('document_id', docList[index]['id']);
        formData.append('notes', docList[index]['notes']);
        formData.append('date_text', docList[index]['date_text']);
        formData.append('remove_doc_id', JSON.stringify(docList[index]['remove_doc']));
        for (let i = 0; i < docList[index]['uploaded_documents'].length; i++) {
            if (docList[index]['uploaded_documents'][i]['id'] === 0) {
                formData.append('files', docList[index]['uploaded_documents'][i]['file']);
            }
        }

        uploadCustomerEnvelopeDocumentExpired(formData)
            .then(response => {
                let docsList = [...documentList];
                docsList[index]['status_id'] = response.data.status_id;
                docsList[index]['status_name'] = response.data.status_name;
                docsList[index]['is_edit'] = false;
                if (response.data.files.length > 0) {
                    for (let i = 0; i < docsList[index]['uploaded_documents'].length; i++) {
                        if (docsList[index]['uploaded_documents'][i]['id'] === 0) {
                            let idx = response.data.files.findIndex(x => x.originalname === docsList[index]['uploaded_documents'][i]['name']);
                            if (idx > -1) {
                                docsList[index]['uploaded_documents'][i]['id'] = parseInt(response.data.files[idx]['id']);
                            }
                        }
                    }
                }
                setDocumentList(docsList);
                toast.success(response.data.message);
                setIsEnvelopeEdit(true);
                setLoading(false);

                let element = document.getElementById("document_accordion_" + index);
                if (element) {
                    element.classList.remove("show");
                }
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const onFinishEnvelope = async (e, type) => {
        e.preventDefault();
        let error = false;
        let docList = [...documentList];
        for (let i = 0; i < docList.length; i++) {
            if (parseInt(docList[i]['status_id']) === 1 || parseInt(docList[i]['status_id']) === 4) {
                error = true;
            }
        }

        if (type === 1 && error === true) {
            warningModalRef?.current.click();
        } else {
            setLoading(true);

            let ipAddress = '';
            await Utils.getIpAddress().then(response => {
                ipAddress = response;
            });

            let obj = {
                envelope_id: envelopeData.id,
                user_id: envelopeData.user_id,
                sender_by: envelopeData.sender_by,
                sms_type: envelopeData.sms_type,
                recipient_id: envelopeData.recipient_detail.id,
                recipient_name: envelopeData.recipient_detail.first_name + " " + envelopeData.recipient_detail.last_name,
                client_name: envelopeData.contact_detail.first_name + " " + envelopeData.contact_detail.last_name,
                client_email: envelopeData.contact_detail.email,
                company_name: envelopeData.contact_detail.company_name,
                sender_id: envelopeData.contact_detail.id,
                envelope_name: envelopeData.envelope_name,
                uuid: envelopeData.uuid,
                recipient_email: envelopeData.recipient_detail.email,
                ip_address: ipAddress
            };
            sendCustomerEnvelope(obj)
                .then(response => {
                    let dList = [...documentList];
                    for (let i = 0; i < dList.length; i++) {
                        dList[i]['is_edit'] = false;
                        if (parseInt(dList[i]['status_id']) === 2) {
                            dList[i]['status_name'] = 'Sent';
                        }
                    }
                    setDocumentList(dList);


                    setIsEnvelopeEdit(false);
                    setLoading(false);

                    if (type === 2) {
                        warningModalCloseRef?.current.click();
                    }

                    toast.success(response.data.message);
                })
                .catch(err => {
                    toast.error(Utils.getErrorMessage(err));
                    setLoading(false);
                });
        }
    };

    return (
        <>
            {loading && (
                <div className="page-loading">
                    <img src="/images/loader.gif" alt="loader"/>
                </div>
            )}

            <div className={`wrapper clientPortal ${theme}`}>
                <Header envelopeData={envelopeData}/>

                {otp === true && (
                    <div className=" background_grey_400">
                        <section
                            className="setting_tab client_portal px-3 pb-2 d-flex align-items-center justify-content-center"
                            style={{minHeight: 'calc(100vh - 105px)'}}>
                            <div className=" otp-box h-100">
                                <p className="fz_25 mb-5">{contactName} {companyName && ` from ` + companyName} requested
                                    you to upload Documents.</p>
                                <div className="card shadow ">
                                    <div
                                        className="card-body d-flex align-items-center justify-content-center flex-column">
                                        <div className="mb-4">
                                            <img src="/images/logo.png" className="h-8" alt="..."/>
                                        </div>
                                        <p className="mb-4">Please enter 6 digit Access Code <br/> received in the email
                                        </p>
                                        <div className="verification-code--inputs mb-4">
                                            <input type="number" value={firstLetter} maxLength="1"
                                                   onPaste={handlePasteValue}
                                                   onKeyDown={(e) => handleOptClear(e, 1)}
                                                   onChange={(e) => handleOtpInput(e, 1)}/>
                                            <input type="number" value={secondLetter} maxLength="1"
                                                   onPaste={handlePasteValue}
                                                   ref={secondLetterRef} onKeyDown={(e) => handleOptClear(e, 2)}
                                                   onChange={(e) => handleOtpInput(e, 2)}/>
                                            <input type="number" value={thirdLetter} maxLength="1" ref={thirdLetterRef}
                                                   onPaste={handlePasteValue}
                                                   onKeyDown={(e) => handleOptClear(e, 3)}
                                                   onChange={(e) => handleOtpInput(e, 3)}/>
                                            <input type="number" value={fourthLetter} maxLength="1"
                                                   onPaste={handlePasteValue}
                                                   ref={fourthLetterRef} onKeyDown={(e) => handleOptClear(e, 4)}
                                                   onChange={(e) => handleOtpInput(e, 4)}/>
                                            <input type="number" value={fifthLetter} maxLength="1" ref={fifthLetterRef}
                                                   onPaste={handlePasteValue}
                                                   onKeyDown={(e) => handleOptClear(e, 5)}
                                                   onChange={(e) => handleOtpInput(e, 5)}/>
                                            <input type="number" value={sixthLetter} maxLength="1" ref={sixthLetterRef}
                                                   onPaste={handlePasteValue}
                                                   onChange={(e) => handleOtpInput(e, 6)}/>
                                        </div>
                                        <div className="accordion_primary_btn w-75">
                                            <button type="button" onClick={handleOtp}
                                                    className="btn btn-primary w-100">Verify
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {otp === false && (
                    <>
                        {!error && (
                            <>
                                {!envelopeData.is_finish && (
                                    <div className=" background_grey_400">
                                        <section className="setting_tab client_portal px-3 pb-2 custom_container_portal"
                                                 style={{minHeight: "calc(100vh - 104px)"}}>
                                            <CustomerPortalTab envelopeData={envelopeData}/>

                                            <div className="tab-content  px-5 py-4" id="nav-tabContent"
                                                 style={{minHeight: "calc(100vh - 219px)"}}>

                                                <div className="tab-pane fade active show" id="document-form-detail"
                                                     role="tabpanel"
                                                     aria-labelledby="document-form">
                                                    <label
                                                        className="tab_label mb-3">{contactName} {companyName && ` from ` + companyName} requested
                                                        you to upload Documents.</label>
                                                    <h6 className="tab_subtitle mb-2">{envelopeName}</h6>

                                                    {documentList.length > 0 &&
                                                    <h2 className="main_title text_blue mb-2">Documents to Upload</h2>}

                                                    <div className="form_card step_wizard_content">
                                                        <div className="accordion" id="accordionMedicare">
                                                            {documentList.map((item, index) =>
                                                                    <React.Fragment key={index}>
                                                                        <div className="accordion-item background_grey_400">
                                                                            <h2 className="accordion-header"
                                                                                id={`documentAccordion_${index}`}>
                                                                                <button
                                                                                    className="accordion-button background_grey_400"
                                                                                    type="button"
                                                                                    data-bs-toggle="collapse"
                                                                                    data-bs-target={`#document_accordion_${index}`}
                                                                                    aria-expanded="false"
                                                                                    aria-controls={`document_accordion_${index}`}>
                                                                                    {item.doc_name}
                                                                                </button>
                                                                                <span data-bs-toggle="collapse"
                                                                                      data-bs-target={`#document_accordion_${index}`}
                                                                                      className={item.status_id === 1 ? `bg_light_blue` : item.status_id === 2 ? `bg_light_yellow` : item.status_id === 3 ? `bg_light_green` : `bg_light_ping`}>{item.status_name}</span>
                                                                            </h2>
                                                                            <div id={`document_accordion_${index}`}
                                                                                 className="accordion-collapse collapse"
                                                                                 aria-labelledby={`document_accordion_${index}`}
                                                                                 data-bs-parent="#accordionMedicare">
                                                                                <div className="accordion-body  pt-0 px-0">
                                                                                    <label
                                                                                        className="tab_label mx-3 mb-4">{item.doc_detail}</label>
                                                                                    {item.status_id === 4 && item.reason_notes && (
                                                                                        <div
                                                                                            className="rejected_note mx-3 mb-3">
                                                                                            <p>{item.reason_notes}</p>
                                                                                            <span className="side_image">
                                                                                                <img
                                                                                                    src="/images/note.png"
                                                                                                    alt="..."/>
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                    <div
                                                                                        className="card mb-4 rounded add_document bg_blue mx-3">
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                className="form-label mb-0">Upload
                                                                                                Document
                                                                                                <i className="fa fa-question-circle ms-1"
                                                                                                   aria-hidden="true"
                                                                                                   data-toggle="tooltip"
                                                                                                   data-placement="right"
                                                                                                   title="Click to upload or Drag & Drop file in the Box."/>
                                                                                            </label>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <div className="col-lg-12">
                                                                                                {item.uploaded_documents.length > 0 &&
                                                                                                <div
                                                                                                    className="mb-3 download_document">
                                                                                                    {item.uploaded_documents.map((doc, d) => (
                                                                                                        <React.Fragment
                                                                                                            key={d}>
                                                                                                            {doc.is_upload_client === 0 && (
                                                                                                                <span
                                                                                                                    className="download_box text_blue me-2">{doc.name} ({doc.kb} KB)
                                                                                                                    {item.is_edit && (
                                                                                                                        <span
                                                                                                                            className="close_btn"
                                                                                                                            onClick={(e) => handleDocRemove(e, d, index)}>
                                                                                <i className="fa fa-times-circle"
                                                                                   aria-hidden="true"/>
                                                                            </span>
                                                                                                                    )}
                                                                        </span>
                                                                                                            )}
                                                                                                        </React.Fragment>
                                                                                                    ))}
                                                                                                </div>
                                                                                                }
                                                                                                <div
                                                                                                    className="download_wrapper">
                                                                                                    <div
                                                                                                        className="card p-2 w-100">
                                                                                                        <div
                                                                                                            className="drag-area">
                                                                                                            <div
                                                                                                                className="icon">
                                                                                                                <i className="fa fa-cloud-upload"
                                                                                                                   aria-hidden="true"/>
                                                                                                            </div>
                                                                                                            <h5>Drag & Drop
                                                                                                                to
                                                                                                                Upload File
                                                                                                                here
                                                                                                                or click to
                                                                                                                upload</h5>
                                                                                                            {item.is_edit &&
                                                                                                            <input
                                                                                                                type="file"
                                                                                                                id={`document_file_${index}`}
                                                                                                                key={fileKey}
                                                                                                                onChange={(e) => handleDocFile(e, index)}
                                                                                                                multiple
                                                                                                                className="cur-pointer"/>
                                                                                                            }
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="ms-3 capture_image">
                                                                                                        <label
                                                                                                            htmlFor={`document_file_${index}`}>
                                                                                                            <div
                                                                                                                className="icon_bg mx-1">
                                                                                                                <i className="fa fa-camera text-white"
                                                                                                                   aria-hidden="true"/>
                                                                                                            </div>
                                                                                                        </label>
                                                                                                        {/*<div className="icon_bg mx-1">
                                                                <i className="fa fa-cloud" aria-hidden="true"/>
                                                            </div>*/}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            {item.doc_err && <div
                                                                                                className="text-danger">{item.doc_err}</div>}
                                                                                        </div>
                                                                                    </div>

                                                                                    {item.documents.length > 0 &&
                                                                                    <div className="mx-3">
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                className="form-label mb-0 text_blue">Attachment
                                                                                                from Sender
                                                                                                <i className="fa fa-question-circle ms-1"
                                                                                                   aria-hidden="true"
                                                                                                   data-toggle="tooltip"
                                                                                                   data-placement="right"
                                                                                                   title="Sender sent you an Attachment file"/>
                                                                                            </label>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <div className="col-lg-12">
                                                                                                <div
                                                                                                    className="mb-3 download_document">
                                                                                                    {item.documents.map((doc, d) =>
                                                                                                            <span key={d}
                                                                                                                  className="download_box text_blue background_document me-2">
                                                            {doc.file_name} ({doc.file_size} KB)
                                                                                                                {doc.file_path &&
                                                                                                                <i className="fa fa-download ms-3 round_blue"
                                                                                                                   aria-hidden="true"
                                                                                                                   onClick={(e) => handleDownload(e, doc)}/>
                                                                                                                }
                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    }

                                                                                    <div className="modal-footer mt-3 p-0">
                                                                                        <div
                                                                                            className="accordion w-100 mx-3"
                                                                                            id={`AdditionalField_${index}`}>
                                                                                            {item.date_format > 0 && (
                                                                                                <div
                                                                                                    className="accordion-item">
                                                                                                    <h2 className="accordion-header"
                                                                                                        id="AddField">
                                                                                                        <button
                                                                                                            className="accordion-button"
                                                                                                            type="button"
                                                                                                            data-bs-toggle="collapse"
                                                                                                            data-bs-target={`#AddFieldMessage_${index}`}
                                                                                                            aria-expanded="true"
                                                                                                            aria-controls={`AddFieldMessage_${index}`}>
                                                                                                            Expiry Date
                                                                                                            <i className="fa fa-question-circle ms-2"
                                                                                                               aria-hidden="true"
                                                                                                               data-toggle="tooltip"
                                                                                                               data-placement="right"
                                                                                                               title="Enter details as requested"/>
                                                                                                        </button>
                                                                                                    </h2>
                                                                                                    <div
                                                                                                        id={`AddFieldMessage_${index}`}
                                                                                                        className="accordion-collapse collapse show"
                                                                                                        aria-labelledby={`AddFieldMessage_${index}`}
                                                                                                        data-bs-parent={`#AdditionalField_${index}`}>
                                                                                                        <div
                                                                                                            className="accordion-body pt-0">
                                                                                                            <div
                                                                                                                className="row">
                                                                                                                <div
                                                                                                                    className="col-md-3 position-relative">
                                                                                                                    <DatePicker
                                                                                                                        selected={showDate(item.date_format_text)}
                                                                                                                        dateFormat={showDateFormat(item.date_format)}
                                                                                                                        className="form-control"
                                                                                                                        disabled={!item.is_edit}
                                                                                                                        ref={(ref) => envDueDateRef.current[index] = ref}
                                                                                                                        placeholderText={showDatePlaceholder(item.date_format)}
                                                                                                                        onChange={(date) => handleDateFormat(date, index)}/>
                                                                                                                    <i className="fa fa-calendar calendar-new"
                                                                                                                       onClick={(e) => handleEnvDate(e, index)}/>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}

                                                                                            <div className="accordion-item">
                                                                                                <h2 className="accordion-header"
                                                                                                    id="typeNote">
                                                                                                    <button
                                                                                                        className="accordion-button"
                                                                                                        type="button"
                                                                                                        data-bs-toggle="collapse"
                                                                                                        data-bs-target={`#typeNoteMessage_${index}`}
                                                                                                        aria-expanded="true"
                                                                                                        aria-controls={`typeNoteMessage_${index}`}>
                                                                                                        Type a Note
                                                                                                        <i className="fa fa-question-circle ms-2"
                                                                                                           aria-hidden="true"
                                                                                                           data-toggle="tooltip"
                                                                                                           data-placement="right"
                                                                                                           title="Type a Note"/>
                                                                                                    </button>
                                                                                                </h2>
                                                                                                <div
                                                                                                    id={`typeNoteMessage_${index}`}
                                                                                                    className="accordion-collapse collapse show"
                                                                                                    aria-labelledby={`typeNoteMessage_${index}`}
                                                                                                    data-bs-parent={`#AdditionalField_${index}`}>
                                                                                                    <div
                                                                                                        className="accordion-body pt-0">
                                                                                                        <div
                                                                                                            className="row">
                                                                                                            <div
                                                                                                                className="col-lg-12">
                                                                                                                <div
                                                                                                                    className="mb-4">
                                                                <textarea className="form-control input_bg" rows="2"
                                                                          value={item.notes} disabled={!item.is_edit}
                                                                          onChange={(e) => handleDocNote(e, index)}
                                                                          placeholder="Write a Note"/>
                                                                                                                    {item.note_error &&
                                                                                                                    <div
                                                                                                                        className="text-danger">{item.note_error}</div>}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                        {item.is_edit &&
                                                                                        <>
                                                                                            <button type="button"
                                                                                                    onClick={(e) => handleCancelDoc(e, index)}
                                                                                                    className="btn modal_btn_outline mt-4">Cancel
                                                                                            </button>
                                                                                            <button type="button"
                                                                                                    onClick={(e) => handleSubmitDoc(e, index)}
                                                                                                    className="btn modal_btn mt-4">Save
                                                                                            </button>
                                                                                        </>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {item.error &&
                                                                        <div
                                                                            className="text-danger mb-2">{item.error}</div>}
                                                                    </React.Fragment>
                                                            )}

                                                            <div
                                                                className="d-flex align-items-center justify-content-center mt-4 accordion_primary_btn">
                                                                {isEnvelopeEdit &&
                                                                <button type="button"
                                                                        onClick={(e) => onFinishEnvelope(e, 1)}
                                                                        className="btn btn-primary">Finish
                                                                    & Send
                                                                </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button type="button" className="d-none" ref={warningModalRef}
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#warningModal"/>
                                                    <div className="modal fade" data-bs-keyboard="false"
                                                         data-bs-backdrop="static" id="warningModal"
                                                         tabIndex="-1" aria-labelledby="warningModalLabel"
                                                         aria-hidden="true">
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <div className="modal-header bg-theme py-2">
                                                                    <h5 className="modal-title text-white"
                                                                        style={{fontSize: '22px'}}
                                                                        id="warningModalLabel">Warning</h5>
                                                                    <button type="button" className="btn-close py-0"
                                                                            data-bs-dismiss="modal"
                                                                            ref={warningModalCloseRef}
                                                                            aria-label="Close">
                                                                        <i className="fa fa-times text-white"/>
                                                                    </button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    You have not uploaded all Documents or Data, Are you
                                                                    sure you want to Finish the Envelope?
                                                                </div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-secondary"
                                                                            data-bs-dismiss="modal">Cancel
                                                                    </button>
                                                                    <button type="button"
                                                                            onClick={(e) => onFinishEnvelope(e, 2)}
                                                                            className="btn btn-primary">Finish
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Messages envelopeData={envelopeData}/>
                                                <Contact contactData={contactData}/>
                                                <Help/>
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {envelopeData.is_finish && (
                                    <div className="error_Wrapper">
                                        <div className="card">
                                            <span className="text-success mb-3 error_icon">
                                                <i className="fa fa-check-circle-o" aria-hidden="true"/>
                                            </span>
                                            <h2 className=" mb-2"><b>Completed</b></h2>
                                            {envelopeData.finish_message}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {error && (
                            <div className="error_Wrapper">
                                <div className="card">
                                    <span className="text-danger mb-3 error_icon">
                                        <i className="fa fa-exclamation-triangle" aria-hidden="true"/>
                                    </span>
                                    <h2 className=" mb-2"><b>ERROR</b></h2>
                                    {error}
                                </div>
                            </div>
                        )}
                    </>
                )}

                <Footer/>
            </div>
        </>
    );
}

export default CustomerDocumentExpired;