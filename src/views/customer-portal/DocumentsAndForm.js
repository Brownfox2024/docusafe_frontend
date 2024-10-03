import React, {useEffect, useState, useRef} from "react";
import {toast} from "react-toastify";
import DatePicker from "react-datepicker";
import {
    sendCustomerEnvelope,
    uploadCustomerEnvelopeDocument,
    uploadCustomerEnvelopeForm
} from "../../services/CommonService";
import Utils from "../../utils";
import {DATE_FORMAT_LIST} from "../../configs/AppConfig";
import SignFillablePopup from "./SignFillablePopup";

function DocumentsAndForm(props) {
    const [contactName, setContactName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [envelopeName, setEnvelopeName] = useState("");
    const [documentList, setDocumentList] = useState([]);
    const [requestFormList, setRequestFormList] = useState([]);
    const [signDocumentList, setSignDocumentList] = useState([]);
    const [fileKey, setFileKey] = useState(Date.now);
    const [isEnvelopeEdit, setIsEnvelopeEdit] = useState(false);
    const [signFillRequest, setSignFillRequest] = useState(false);
    
    const [signatureDocumentData, setSignatureDocumentData] = useState(null);
    
    const warningModalRef = useRef(null);
    const warningModalCloseRef = useRef(null);
    const envDueDateRef = useRef([]);
    const dateRef = useRef(null);
    const btnSignDocumentPopup = useRef(null);


    useEffect(function () {
        if (props.envelopeData?.id > 0) {
            setContactName(props.envelopeData.contact_detail.first_name + " " + props.envelopeData.contact_detail.last_name);
            setCompanyName(props.envelopeData.contact_detail.company_name);
            setEnvelopeName(props.envelopeData.envelope_name);
            setDocumentList(props.envelopeData.document_list);
            setRequestFormList(props.envelopeData.request_form_list);
            setSignDocumentList(props.envelopeData.sign_documents);
            setIsEnvelopeEdit(props.envelopeData.isEnvelopeEdit);
        }
    }, [props.envelopeData]);

    const handleDownload = async (e, data) => {
        e.preventDefault();
        props.setLoading(true);
        await Utils.downloadAnyFile(data.file_path, data.file_name);
        props.setLoading(false);
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

        props.setLoading(true);

        let ipAddress = '';
        await Utils.getIpAddress().then(response => {
            ipAddress = response;
        });

        const formData = new FormData();
        formData.append('ip_address', ipAddress);
        formData.append('envelope_id', props.envelopeData.id);
        formData.append('user_id', props.envelopeData.user_id);
        formData.append('envelope_name', props.envelopeData.envelope_name);
        formData.append('recipient_id', props.envelopeData.recipient_detail.id);
        formData.append('recipient_email', props.envelopeData.recipient_detail.email);
        formData.append('recipient_name', props.envelopeData.recipient_detail.first_name + ' ' + props.envelopeData.recipient_detail.last_name);
        formData.append('sender_name', props.envelopeData.contact_detail.first_name + ' ' + props.envelopeData.contact_detail.last_name);
        formData.append('sender_email', props.envelopeData.contact_detail.email);
        formData.append('company_name', props.envelopeData.contact_detail.company_name);
        formData.append('company_id', props.envelopeData.contact_detail.id);
        formData.append('document_id', docList[index]['id']);
        formData.append('notes', docList[index]['notes']);
        formData.append('date_text', docList[index]['date_text']);
        formData.append('remove_doc_id', JSON.stringify(docList[index]['remove_doc']));
        for (let i = 0; i < docList[index]['uploaded_documents'].length; i++) {
            if (docList[index]['uploaded_documents'][i]['id'] === 0) {
                formData.append('files', docList[index]['uploaded_documents'][i]['file']);
            }
        }

        uploadCustomerEnvelopeDocument(formData)
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
                props.setLoading(false);

                let element = document.getElementById("document_accordion_" + index);
                if (element) {
                    element.classList.remove("show");
                }
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleQuestionAnswer = (e, idx, index) => {
        let formList = [...requestFormList];
        if (formList[index]['questions'][idx]['type'] === 5) {
            let selectedAnswer = formList[index]['questions'][idx]['selected_answer'].split(',');
            let i = selectedAnswer.findIndex(x => parseInt(x) === parseInt(e.target.value));
            if (i > -1) {
                selectedAnswer.splice(i, 1);
            } else {
                selectedAnswer.push(e.target.value);
            }
            for (let o = 0; o < formList[index]['questions'][idx]['answers'].length; o++) {
                let checked = false;
                let check = selectedAnswer.findIndex(x => parseInt(x) === parseInt(formList[index]['questions'][idx]['answers'][o]['id']));
                if (check > -1) {
                    checked = true;
                }
                formList[index]['questions'][idx]['answers'][o]['checked'] = checked;
            }
            let answer = '';
            if (selectedAnswer.length > 0) {
                for (let s = 0; s < selectedAnswer.length; s++) {
                    if (selectedAnswer[s]) {
                        answer += selectedAnswer[s];
                        if (selectedAnswer.length !== (s + 1)) {
                            answer += ',';
                        }
                    }
                }
            }
            formList[index]['questions'][idx]['selected_answer'] = answer;
        } else if (formList[index]['questions'][idx]['type'] === 6) {
            if (e.target.files.length > 0) {
                let kb = e.target.files[0].size / 1000;
                formList[index]['questions'][idx]['selected_answer'] = {
                    name: e.target.files[0].name,
                    kb: parseFloat(kb).toFixed(2),
                    file: e.target.files[0],
                };
                setFileKey(Date.now());
            }
        } else if (formList[index]['questions'][idx]['type'] === 8) {
            formList[index]['questions'][idx]['selected_answer'] = Utils.expiryDateFormatText(e);
        } else {
            formList[index]['questions'][idx]['selected_answer'] = e.target.value;
        }
        setRequestFormList(formList);
    };

    const handleQuestionAnswerText = (e, index) => {
        let formList = [...requestFormList];
        formList[index].selected_answer = e.target.value;
        setRequestFormList(formList);
    };

    const removeQuestionFile = (e, idx, index) => {
        e.preventDefault();
        let formList = [...requestFormList];
        formList[index]['questions'][idx]['selected_answer'] = '';
        setRequestFormList(formList);
    };

    const handleFormCancel = (e, index) => {
        e.preventDefault();
        let formList = [...requestFormList];
        if (formList[index]['questions']) {
            for (let i = 0; i < formList[index]['questions'].length; i++) {
                if (formList[index]['questions'][i]['type'] === 5) {
                    for (let o = 0; o < formList[index]['questions'][i]['answers'].length; o++) {
                        formList[index]['questions'][i]['answers'][o]['checked'] = false;
                    }
                }
                formList[index]['questions'][i]['selected_answer'] = '';
            }
        } else {
            formList[index].selected_answer = '';
        }
        setRequestFormList(formList);
    };

    const handleSubmitForm = async (e, index) => {
        let formList = [...requestFormList];
        let error = false;

        if (formList[index]['questions']) {
            for (let i = 0; i < formList[index]['questions'].length; i++) {
                if (formList[index]['questions'][i]['selected_answer'] || (formList[index]['questions'][i]['type'] === 7) ) {
                    formList[index]['questions'][i]['error'] = '';
                } else {
                    error = true;
                    formList[index]['questions'][i]['error'] = 'This question is required';
                }
            }
        } else {
            if (formList[index]['selected_answer']) {
                formList[index].answer_error = '';
            } else {
                error = true;
                formList[index].answer_error = 'This question is required';
            }
        }

        setRequestFormList(formList);

        if (error) return;

        props.setLoading(true);

        let ipAddress = '';
        await Utils.getIpAddress().then(response => {
            ipAddress = response;
        });

        const formData = new FormData();
        formData.append('ip_address', ipAddress);
        formData.append('envelope_id', props.envelopeData.id);
        formData.append('user_id', props.envelopeData.user_id);
        formData.append('envelope_name', props.envelopeData.envelope_name);
        formData.append('recipient_id', props.envelopeData.recipient_detail.id);
        formData.append('recipient_email', props.envelopeData.recipient_detail.email);
        formData.append('recipient_name', props.envelopeData.recipient_detail.first_name + ' ' + props.envelopeData.recipient_detail.last_name);
        formData.append('sender_name', props.envelopeData.contact_detail.first_name + ' ' + props.envelopeData.contact_detail.last_name);
        formData.append('sender_email', props.envelopeData.contact_detail.email);
        formData.append('company_name', props.envelopeData.contact_detail.company_name);
        formData.append('company_id', props.envelopeData.contact_detail.id);
        formData.append('form_id', formList[index]['id']);

        let isCall = true;
        if (formList[index]['questions'] && formList[index]['questions'].length > 0) {
            let data = [];
            for (let i = 0; i < formList[index]['questions'].length; i++) {
                let obj = {
                    question_id: formList[index]['questions'][i]['id'],
                    type: formList[index]['questions'][i]['type'],
                    answer: formList[index]['questions'][i]['selected_answer']
                };
                if (formList[index]['questions'][i]['type'] === 6) {
                    if (formList[index]['questions'][i]['selected_answer']) {
                        if (formList[index]['questions'][i]['selected_answer'].file) {
                            formData.append('file', formList[index]['questions'][i]['selected_answer'].file);
                            obj.answer = '';
                        }
                    }
                }
                data.push(obj);
            }

            if (data.length > 0) {
                formData.append('form_field', JSON.stringify(data));
            } else {
                isCall = false;
                toast.error('Please fill the form');
            }
        } else {
            formData.append('question_answer', formList[index]['selected_answer']);
        }

        if (isCall === true) {
            uploadCustomerEnvelopeForm(formData)
                .then(response => {
                    let formsList = [...requestFormList];
                    formsList[index]['status_id'] = response.data.status_id;
                    formsList[index]['status_name'] = response.data.status_name;

                    if (formsList[index]['questions']) {
                        for (let i = 0; i < formsList[index]['questions'].length; i++) {
                            if (formsList[index]['questions'][i]['type'] === 6) {
                                if (formsList[index]['questions'][i]['selected_answer']) {
                                    formsList[index]['questions'][i]['selected_answer'].file = '';
                                }
                            }
                        }
                    }

                    setRequestFormList(formsList);
                    toast.success(response.data.message);
                    setIsEnvelopeEdit(true);
                    props.setLoading(false);
                    let element = document.getElementById("form_accordion_" + index);
                    if (element) {
                        element.classList.remove("show");
                    }
                })
                .catch(err => {
                    props.setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        } else {
            props.setLoading(false);
        }
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

        let formList = [...requestFormList];
        for (let i = 0; i < formList.length; i++) {
            if (parseInt(formList[i]['status_id']) === 1 || parseInt(formList[i]['status_id']) === 4) {
                error = true;
            }
        }

        let signDocList = [...signDocumentList];
        for (let i = 0; i < signDocList.length; i++) {
            if (parseInt(signDocList[i]['status_id']) === 1 || parseInt(signDocList[i]['status_id']) === 4) {
                error = true;
            }
        }

        if (type === 1 && error === true) {
            warningModalRef?.current.click();
        } else {
            props.setLoading(true);

            let ipAddress = '';
            await Utils.getIpAddress().then(response => {
                ipAddress = response;
            });

            let obj = {
                envelope_id: props.envelopeData.id,
                user_id: props.envelopeData.user_id,
                sender_by: props.envelopeData.sender_by,
                sms_type: props.envelopeData.sms_type,
                recipient_id: props.envelopeData.recipient_detail.id,
                recipient_name: props.envelopeData.recipient_detail.first_name + " " + props.envelopeData.recipient_detail.last_name,
                client_name: props.envelopeData.contact_detail.first_name + " " + props.envelopeData.contact_detail.last_name,
                client_email: props.envelopeData.contact_detail.email,
                company_name: props.envelopeData.contact_detail.company_name,
                sender_id: props.envelopeData.contact_detail.id,
                envelope_name: props.envelopeData.envelope_name,
                uuid: props.envelopeData.uuid,
                recipient_email: props.envelopeData.recipient_detail.email,
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

                    let fList = [...requestFormList];
                    for (let i = 0; i < fList.length; i++) {
                        fList[i]['is_edit'] = false;
                        if (parseInt(fList[i]['status_id']) === 2) {
                            fList[i]['status_name'] = 'Sent';
                        }
                    }
                    setRequestFormList(fList);

                    let sdList = [...signDocumentList];
                    for (let i = 0; i < sdList.length; i++) {
                        sdList[i]['is_edit'] = false;
                        if (parseInt(sdList[i]['status_id']) === 2) {
                            sdList[i]['status_name'] = 'Sent';
                        }
                    }
                    setSignDocumentList(sdList);


                    setIsEnvelopeEdit(false);
                    props.setLoading(false);

                    if (type === 2) {
                        warningModalCloseRef?.current.click();
                    }

                    toast.success(response.data.message);
                })
                .catch(err => {
                    toast.error(Utils.getErrorMessage(err));
                    props.setLoading(false);
                });
        }
    };

    const showDatePlaceholder = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['text'];
        }
        return value;
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

    const onRequestSignDocumentRender = async (e, data) => {
        if(data.is_edit === true){
            console.log("Render sign fillable form");
            e.preventDefault();

            localStorage.removeItem("pagesPosition");
            localStorage.removeItem("placeholders");
            localStorage.removeItem("localSign");
            localStorage.removeItem("localInitial");
            
            props.setLoading(true);
           

            await setSignatureDocumentData(data);
            await setSignFillRequest(true);

            //console.log(signatureDocumentData)
            btnSignDocumentPopup.current?.click();
        }
    };


    const handleSignFillableRequest = () => {
        let current = (signFillRequest === false) ? true : false; 
        setSignFillRequest(current);
        setIsEnvelopeEdit(true);
        props.setLoading(false);
    }

    
    return (
        <div className="tab-pane fade active show" id="document-form-detail" role="tabpanel"
             aria-labelledby="document-form">
            <label className="tab_label mb-3">{contactName} {companyName && ` from ` + companyName} requested you to
                upload
                Documents{props.envelopeData?.request_form_list && props.envelopeData?.request_form_list.length > 0 ? ` & Information` : ``}.</label>

            <h6 className="tab_subtitle mb-2">{envelopeName}</h6>

            {documentList.length > 0 && <h2 className="main_title text_blue mb-2">Documents to Upload</h2>}

            <div className="form_card step_wizard_content">
                <div className="accordion" id="accordionMedicare">
                    {documentList.map((item, index) =>
                        <React.Fragment key={index}>
                            <div className="accordion-item background_grey_400">
                                <h2 className="accordion-header" id={`documentAccordion_${index}`}>
                                    <button className="accordion-button background_grey_400" type="button"
                                            data-bs-toggle="collapse" data-bs-target={`#document_accordion_${index}`}
                                            aria-expanded="false" aria-controls={`document_accordion_${index}`}>
                                        {item.doc_name}
                                    </button>
                                    <span data-bs-toggle="collapse" data-bs-target={`#document_accordion_${index}`}
                                          className={item.status_id === 1 ? `bg_light_blue` : item.status_id === 2 ? `bg_light_yellow` : item.status_id === 3 ? `bg_light_green` : `bg_light_ping`}>{item.status_name}</span>
                                </h2>
                                <div id={`document_accordion_${index}`}
                                     className="accordion-collapse collapse"
                                     aria-labelledby={`document_accordion_${index}`}
                                     data-bs-parent="#accordionMedicare">
                                    <div className="accordion-body  pt-0 px-0">
                                        <label className="tab_label mx-3 mb-4">{item.doc_detail}</label>
                                        {item.status_id === 4 && item.reason_notes &&
                                        <div className="rejected_note mx-3 mb-3">
                                            <p>{item.reason_notes}</p>
                                            <span className="side_image">
                                            <img src="/images/note.png" alt="..."/>
                                        </span>
                                        </div>
                                        }
                                        <div className="card mb-4 rounded add_document bg_blue mx-3">
                                            <div className="mb-3">
                                                <label className="form-label mb-0">Upload Document
                                                    <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                                       data-toggle="tooltip" data-placement="right"
                                                       title="Click to upload or Drag & Drop file in the Box."/>
                                                </label>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    {item.uploaded_documents.length > 0 &&
                                                    <div className="mb-3 download_document">
                                                        {item.uploaded_documents.map((doc, d) => (
                                                            <React.Fragment key={d}>
                                                                {doc.is_upload_client === 0 && (
                                                                    <span
                                                                        className="download_box text_blue me-2">{doc.name} ({doc.kb} KB)
                                                                        {item.is_edit && (
                                                                            <span className="close_btn"
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
                                                    <div className="download_wrapper">
                                                        <div className="card p-2 w-100">
                                                            <div className="drag-area">
                                                                <div className="icon">
                                                                    <i className="fa fa-cloud-upload"
                                                                       aria-hidden="true"/>
                                                                </div>
                                                                <h5>Drag & Drop to Upload File here or click to
                                                                    upload</h5>
                                                                {item.is_edit &&
                                                                <input type="file" id={`document_file_${index}`}
                                                                       key={fileKey}
                                                                       onChange={(e) => handleDocFile(e, index)}
                                                                       multiple className="cur-pointer"/>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="ms-3 capture_image">
                                                            <label htmlFor={`document_file_${index}`}>
                                                                <div className="icon_bg mx-1">
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
                                                {item.doc_err && <div className="text-danger">{item.doc_err}</div>}
                                            </div>
                                        </div>

                                        {item.documents.length > 0 &&
                                        <div className="mx-3">
                                            <div className="mb-3">
                                                <label className="form-label mb-0 text_blue">Attachment from Sender
                                                    <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                                       data-toggle="tooltip" data-placement="right"
                                                       title="Sender sent you an Attachment file"/>
                                                </label>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="mb-3 download_document">
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
                                            <div className="accordion w-100 mx-3" id={`AdditionalField_${index}`}>
                                                {item.date_format > 0 && (
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="AddField">
                                                            <button className="accordion-button" type="button"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target={`#AddFieldMessage_${index}`}
                                                                    aria-expanded="true"
                                                                    aria-controls={`AddFieldMessage_${index}`}>
                                                                Expiry Date
                                                                <i className="fa fa-question-circle ms-2"
                                                                   aria-hidden="true"
                                                                   data-toggle="tooltip" data-placement="right"
                                                                   title="Enter details as requested"/>
                                                            </button>
                                                        </h2>
                                                        <div id={`AddFieldMessage_${index}`}
                                                             className="accordion-collapse collapse show"
                                                             aria-labelledby={`AddFieldMessage_${index}`}
                                                             data-bs-parent={`#AdditionalField_${index}`}>
                                                            <div className="accordion-body pt-0">
                                                                <div className="row">
                                                                    <div className="col-md-3 position-relative">
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
                                                    <h2 className="accordion-header" id="typeNote">
                                                        <button className="accordion-button" type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target={`#typeNoteMessage_${index}`}
                                                                aria-expanded="true"
                                                                aria-controls={`typeNoteMessage_${index}`}>
                                                            Type a Note
                                                            <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                               data-toggle="tooltip" data-placement="right"
                                                               title="Type a Note"/>
                                                        </button>
                                                    </h2>
                                                    <div id={`typeNoteMessage_${index}`}
                                                         className="accordion-collapse collapse show"
                                                         aria-labelledby={`typeNoteMessage_${index}`}
                                                         data-bs-parent={`#AdditionalField_${index}`}>
                                                        <div className="accordion-body pt-0">
                                                            <div className="row">
                                                                <div className="col-lg-12">
                                                                    <div className="mb-4">
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
                                                <button type="button" onClick={(e) => handleCancelDoc(e, index)}
                                                        className="btn modal_btn_outline mt-4">Cancel
                                                </button>
                                                <button type="button" onClick={(e) => handleSubmitDoc(e, index)}
                                                        className="btn modal_btn mt-4">Save
                                                </button>
                                            </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {item.error && <div className="text-danger mb-2">{item.error}</div>}
                        </React.Fragment>
                    )}

                    {requestFormList.length > 0 &&
                    <>
                        <h2 className="main_title text_blue mb-2 mt-3 ps-0">Add Information</h2>
                        {requestFormList.map((item, index) =>
                            <React.Fragment key={index}>
                                <div className="accordion-item background_grey_400">
                                    <h2 className="accordion-header " id={`formAccordion_${index}`}>
                                        <button className="accordion-button background_grey_400" type="button"
                                                data-bs-toggle="collapse" data-bs-target={`#form_accordion_${index}`}
                                                aria-expanded="true" aria-controls={`form_accordion_${index}`}>
                                            {item.form_name}
                                        </button>
                                        <span data-bs-toggle="collapse" data-bs-target={`#form_accordion_${index}`}
                                              className={item.status_id === 1 ? `bg_light_blue` : item.status_id === 2 ? `bg_light_yellow` : item.status_id === 3 ? `bg_light_green` : `bg_light_ping`}>{item.status_name}</span>
                                    </h2>
                                    <div id={`form_accordion_${index}`} className="accordion-collapse collapse"
                                         aria-labelledby={`form_accordion_${index}`}>
                                        <div className="accordion-body pt-0 px-0">
                                            {item.status_id === 4 && item.reason_notes &&
                                            <div className="rejected_note mx-3 mb-3">
                                                <p>{item.reason_notes}</p>
                                                <span className="side_image">
                                                <img src="/images/note.png" alt="..."/>
                                            </span>
                                            </div>
                                            }

                                            <div className="mx-3">
                                                {item.questions && item.questions.length > 0 ?
                                                    <>
                                                        {item.questions.map((question, q) =>
                                                            <div key={q} className="mb-4">
                                                                <label
                                                                    className="form-label mb-2">{question.name}</label>
                                                                {question.type === 1 &&
                                                                <input type="text" value={question.selected_answer}
                                                                       onChange={(e) => handleQuestionAnswer(e, q, index)}
                                                                       disabled={!item.is_edit}
                                                                       className="form-control"/>
                                                                }
                                                                {question.type === 2 &&
                                                                <textarea className="form-control"
                                                                          value={question.selected_answer}
                                                                          onChange={(e) => handleQuestionAnswer(e, q, index)}
                                                                          disabled={!item.is_edit} rows="3"/>
                                                                }
                                                                {question.type === 3 &&
                                                                <select className="form-select"
                                                                        value={question.selected_answer}
                                                                        disabled={!item.is_edit}
                                                                        onChange={(e) => handleQuestionAnswer(e, q, index)}>
                                                                    <option value="">Please select</option>
                                                                    {question.answers.map((option, o) => (
                                                                        <option key={o} value={option.id}>
                                                                            {option.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                }
                                                                {question.type === 4 && (
                                                                    <>
                                                                        {question.answers.map((option, o) => (
                                                                            <div key={o} className="form-check">
                                                                                <input type="radio"
                                                                                       disabled={!item.is_edit}
                                                                                       name={`radio_option_${index}`}
                                                                                       checked={parseInt(question.selected_answer) === parseInt(option.id)}
                                                                                       value={option.id}
                                                                                       onChange={(e) => handleQuestionAnswer(e, q, index)}
                                                                                       id={`radio_option_${index}_${o}`}
                                                                                       className="form-check-input"/>
                                                                                <label
                                                                                    htmlFor={`radio_option_${index}_${o}`}
                                                                                    className="form-check-label">{option.name}</label>
                                                                            </div>
                                                                        ))}
                                                                    </>
                                                                )}
                                                                {question.type === 5 && (
                                                                    <>
                                                                        {question.answers.map((option, o) => (
                                                                            <div key={o} className="form-check">
                                                                                <input type="checkbox"
                                                                                       disabled={!item.is_edit}
                                                                                       value={option.id}
                                                                                       checked={option.checked}
                                                                                       onChange={(e) => handleQuestionAnswer(e, q, index)}
                                                                                       id={`checkbox_option_${index}_${o}`}
                                                                                       className="form-check-input"/>
                                                                                <label
                                                                                    htmlFor={`checkbox_option_${index}_${o}`}
                                                                                    className="form-check-label">{option.name}</label>
                                                                            </div>
                                                                        ))}
                                                                    </>
                                                                )}
                                                                {question.type === 6 && (
                                                                    <>
                                                                        {question.selected_answer &&
                                                                        <div className="mb-3 download_document">
                                                                <span
                                                                    className="download_box text_blue me-2">{question.selected_answer.name} ({question.selected_answer.kb} KB)
                                                                    {item.is_edit &&
                                                                    <span className="close_btn"
                                                                          onClick={(e) => removeQuestionFile(e, q, index)}>
                                                                        <i className="fa fa-times-circle"
                                                                           aria-hidden="true"/>
                                                                    </span>
                                                                    }
                                                                </span>
                                                                        </div>
                                                                        }
                                                                        <div className="card p-2 w-100">
                                                                            <div className="drag-area p-2">
                                                                                <div className="icon">
                                                                                    <i className="fa fa-cloud-upload"
                                                                                       aria-hidden="true"/>
                                                                                </div>
                                                                                <label htmlFor={'file-upload-'+q} style={{ cursor: 'pointer' }}>
                                                                                    <h5>Drag &amp; Drop to Upload File here or click to upload</h5>
                                                                                </label>
                                                                                {item.is_edit &&
                                                                                <input type="file" id={'file-upload-'+q} key={fileKey}
                                                                                       onChange={(e) => handleQuestionAnswer(e, q, index)}/>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {question.type === 7 && (
                                                                    <>
                                                                        <div className="mb-2"
                                                                             dangerouslySetInnerHTML={{__html: question.que_comment}}/>
                                                                        
                                                                        {/* <input type="text"
                                                                               value={question.selected_answer}
                                                                               onChange={(e) => handleQuestionAnswer(e, q, index)}
                                                                               disabled={!item.is_edit}
                                                                               className="form-control"/> */}
                                                                    </>
                                                                )}

                                                                {question.type === 8 &&
                                                                <div
                                                                    className="position-relative">
                                                                    <DatePicker
                                                                        className="form-control"
                                                                        selected={showDate(question.selected_answer)}
                                                                        dateFormat={showDateFormat(2)}
                                                                        placeholderText={showDatePlaceholder(2)}
                                                                        onChange={(e) => handleQuestionAnswer(e, q, index)}
                                                                        ref={dateRef}
                                                                    />
                                                                    <i className="fa fa-calendar" style={{top: "15px"}}
                                                                       onClick={(e) => dateRef?.current.setFocus(true)}/>
                                                                </div>
                                                                }

                                                                <div className="mt-1">{question.sub_label}</div>
                                                                {question.error &&
                                                                <div className="text-danger">{question.error}</div>}
                                                            </div>
                                                        )}
                                                    </>
                                                    :
                                                    <>
                                                        <textarea className="form-control"
                                                                  value={item.selected_answer}
                                                                  onChange={(e) => handleQuestionAnswerText(e, index)}
                                                                  disabled={!item.is_edit} rows="3"/>
                                                        {item.answer_error && (
                                                            <div
                                                                className="text-danger ms-2">{item.answer_error}</div>)}
                                                    </>
                                                }
                                            </div>

                                            {item.is_edit &&
                                            <div className="modal-footer mt-3 p-0 ">
                                                <button type="button" onClick={(e) => handleFormCancel(e, index)}
                                                        className="btn modal_btn_outline mt-4">Cancel
                                                </button>
                                                <button type="button" onClick={(e) => handleSubmitForm(e, index)}
                                                        className="btn modal_btn mt-4">Save
                                                </button>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {item.error && <div className="text-danger mb-2">{item.error}</div>}
                            </React.Fragment>
                        )}
                    </>
                    }

                    {signDocumentList.length > 0 &&
                    <>
                        <h2 className="main_title text_blue mb-2 mt-3 ps-0">Sign Documents</h2>
                        {signDocumentList.map((item, index) =>
                            <React.Fragment key={index}>
                                <div onClick={(e) => onRequestSignDocumentRender(e, item)} className={item.is_edit ? 'accordion-item sign-doc-item background_grey_400 c-sign-document-wrapper' : 'accordion-item sign-doc-item background_grey_400 c-cursor-default'}>
                                    <h2 className="accordion-header" id={`signAccordion_${index}`}>
                                        <button className={item.is_edit ? "accordion-button background_grey_400" : "accordion-button background_grey_400 c-cursor-default"} type="button"
                                                data-bs-toggle="collapse" data-bs-target={`#sign_accordion_${index}`}
                                                aria-expanded="true" aria-controls={`sign_accordion_${index}`}>
                                            {item.doc_name}
                                        </button>
                                        
                                       

                                        <span data-bs-toggle="collapse" data-bs-target={`#sign_accordion_${index}`}
                                              className={item.status_id === 1 ? `bg_light_blue cursor-pointer` : item.status_id === 2 ? `bg_light_yellow` : item.status_id === 5 ? `bg_light_auro` : item.status_id === 3 ? `bg_light_green` : `bg_light_ping`}>{item.status_name}</span>
                                    </h2>
                                </div>
                                {item.error && <div className="text-danger mb-2">{item.error}</div>}
                            </React.Fragment>
                        )}
                        <span className="d-none" ref={btnSignDocumentPopup} data-bs-toggle="offcanvas" data-bs-target="#signFillableForm" ></span>
                    </>
                    }

                    <div className="d-flex align-items-center justify-content-center mt-4 accordion_primary_btn">
                        {isEnvelopeEdit &&
                        <button type="button" onClick={(e) => onFinishEnvelope(e, 1)} className="btn btn-primary">Finish
                            & Send
                        </button>
                        }
                    </div>
                </div>
            </div>

            <button type="button" className="d-none" ref={warningModalRef} data-bs-toggle="modal"
                    data-bs-target="#warningModal"/>
            <div className="modal fade" data-bs-keyboard="false" data-bs-backdrop="static" id="warningModal"
                 tabIndex="-1" aria-labelledby="warningModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-theme py-2">
                            <h5 className="modal-title text-white" style={{fontSize: '22px'}}
                                id="warningModalLabel">Warning</h5>
                            <button type="button" className="btn-close py-0" data-bs-dismiss="modal"
                                    ref={warningModalCloseRef} aria-label="Close">
                                <i className="fa fa-times text-white"/>
                            </button>
                        </div>
                        <div className="modal-body">
                            You have not uploaded all Documents or Data, Are you sure you want to Finish the Envelope?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" onClick={(e) => onFinishEnvelope(e, 2)}
                                    className="btn btn-primary">Finish
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <SignFillablePopup formObj={props.envelopeData} setSignDocumentList={setSignDocumentList} signatureDocumentData={signatureDocumentData} setLoading={props.setLoading} signFillRequest={signFillRequest} handleSignFillableRequest={handleSignFillableRequest}></SignFillablePopup>
            
                
        </div>
        
    );
}

export default DocumentsAndForm;