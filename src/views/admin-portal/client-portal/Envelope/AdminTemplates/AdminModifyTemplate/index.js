import React, {useEffect, useState, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import AdminDocumentTemplate from "./AdminDocumentTemplate";
import AdminRequestFormTemplate from "./AdminRequestFormTemplate";
import {toast} from "react-toastify";
import Utils from "../../../../../../utils";
import {
    NAME_CONVENTION,
    OVERDUE_REMINDER,
    PASSWORD_LIST,
    SEND_REMINDER,
    SYNC_STATUS
} from "../../../../../../configs/AppConfig";
import {
    adminGetEnvelopeDocumentCheckStorage,
    adminGetPreferenceData,
    adminGetTemplateEnvelope, adminGetTemplateUser, adminPostCloudList, adminTemplateEnvelopeModify,
    adminTemplateFolderBreadcrumbs
} from "../../../../../../services/AdminService";
import {Lang} from "../../../../../../lang";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function AdminModifyTemplate(props) {
    const navigate = useNavigate();
    let {client, id} = useParams();
    const [templateId, setTemplateId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [folderId, setFolderId] = useState(0);
    const [allSenders, setAllSenders] = useState([]);
    const [selectedSenders, setSelectedSenders] = useState([]);
    const [envelopeName, setEnvelopeName] = useState('');
    const [clientMessage, setClientMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [emailText, setEmailText] = useState('');
    const [documentList, setDocumentList] = useState([]);
    const [requestFormList, setRequestFormList] = useState([]);
    const [removeDocumentsId, setRemoveDocumentsId] = useState([]);
    const [removeRequestFormId, setRemoveRequestFormId] = useState([]);
    const [templateData, setTemplateData] = useState({});

    const animatedComponents = makeAnimated();

    const [nameConvention, setNameConvention] = useState(1);
    const [syncStatusList, setSyncStatusList] = useState(SYNC_STATUS);
    const [cloudSync, setCloudSync] = useState(0);
    const [sendReminder, setSendReminder] = useState(0);
    const [overdueReminder, setOverdueReminder] = useState(0);
    const [isPassword, setIsPassword] = useState(0);
    const [password, setPassword] = useState('');
    const [referenceId, setReferenceId] = useState('');

    let docObj = {
        type: 'create',
        id: 0,
        name: '',
        detail: '',
        files: [],
        date_format: 0,
        remove_doc_id: []
    };
    const [docData, setDocData] = useState(docObj);

    let formObj = {
        type: 'create',
        id: 0,
        name: '',
        questions: [],
        remove_question_ids: [],
        remove_option_ids: []
    };
    const [formData, setFormData] = useState(formObj);

    let errorsObj = {
        sender_id: '',
        envelope_name: '',
        client_message: '',
        documents: '',
        request_form: '',
        subject: '',
        email_text: '',
        password: '',
    };
    const [errors, setErrors] = useState(errorsObj);

    const openDocumentRef = useRef(null);
    const docDragItem = useRef(null);
    const docDragOverItem = useRef(null);
    const openRequestFormRef = useRef(null);
    const formDragItem = useRef(null);
    const formDragOverItem = useRef(null);

    useEffect(function () {
        setLoading(true);
        adminGetTemplateUser({client_id: client})
            .then(responseData => {
                let sList = responseData.data.data;
                let selectedSenderList = [];
                for (let i = 0; i < sList.length; i++) {
                    selectedSenderList.push({
                        value: parseInt(sList[i]['id']),
                        label: sList[i]['first_name'] + ' ' + sList[i]['last_name']
                    });
                }
                setAllSenders(selectedSenderList);

                if (id) {
                    if (props.type === 1) {
                        adminPostCloudList({client_id: client})
                            .then(response => {
                                setSyncStatusList(response.data.data);

                                adminGetPreferenceData({client_id: client})
                                    .then(response => {
                                        let preferenceData = response.data.data;
                                        setClientMessage(preferenceData.client_portal_message);
                                        setSubject(preferenceData.email_subject);
                                        setEmailText(preferenceData.email_message);
                                        setSendReminder(parseInt(preferenceData.recipient_send_reminder_type));
                                        setOverdueReminder(parseInt(preferenceData.recipient_overdue_reminder_type));
                                        if (parseInt(preferenceData.default_cloud_storage) > 0) {
                                            setCloudSync(parseInt(preferenceData.default_cloud_storage));
                                        }
                                    })
                                    .catch(err => {

                                    });
                            })
                            .catch(err => {

                            });

                        adminTemplateFolderBreadcrumbs({client_id: client, uuid: id})
                            .then(response => {
                                setFolderId(response.data.data.id);
                                setBreadcrumbs(response.data.breadcrumbs);
                                setLoading(false);
                            })
                            .catch(err => {
                                navigate('/back-admin/client-portal/' + client + '/templates');
                                toast.error(Utils.getErrorMessage(err));
                                setLoading(false);
                            });
                    } else {
                        adminGetTemplateEnvelope({client_id: client, uuid: id})
                            .then(response => {
                                setTemplateId(parseInt(response.data.data.id));
                                setFolderId(parseInt(response.data.data.folder_id));
                                setBreadcrumbs(response.data.breadcrumbs);
                                setEnvelopeName(response.data.data.envelope_name);
                                setClientMessage(response.data.data.message);
                                setSubject(response.data.data.email_subject);
                                setEmailText(response.data.data.email_text);
                                setDocumentList(response.data.data.document_list);
                                setRequestFormList(response.data.data.request_form_list);
                                setNameConvention((response.data.data.name_convention) ? parseInt(response.data.data.name_convention) : 1);
                                setCloudSync((response.data.data.cloud_sync) ? parseInt(response.data.data.cloud_sync) : 0);
                                setSendReminder((response.data.data.send_reminder) ? parseInt(response.data.data.send_reminder) : 0);
                                setOverdueReminder((response.data.data.over_due_reminder) ? parseInt(response.data.data.over_due_reminder) : 0);
                                if (response.data.data.password) {
                                    setIsPassword(1);
                                    setPassword(response.data.data.password);
                                } else {
                                    setIsPassword(0);
                                }
                                setReferenceId((response.data.data.reference_id) ? response.data.data.reference_id : '');
                                setTemplateData(response.data.data);

                                let selectedSList = [];
                                if (response.data.data.share_user_ids) {
                                    for (let i = 0; i < sList.length; i++) {
                                        let index = response.data.data.share_user_ids.findIndex(x => parseInt(x) === parseInt(sList[i]['id']));
                                        if (index > -1) {
                                            selectedSList.push({
                                                value: parseInt(sList[i]['id']),
                                                label: sList[i]['first_name'] + ' ' + sList[i]['last_name']
                                            });
                                        }
                                    }
                                }
                                setSelectedSenders(selectedSList);
                                setLoading(false);
                            })
                            .catch(err => {
                                navigate('/back-admin/client-portal/' + client + '/templates');
                                toast.error(Utils.getErrorMessage(err));
                                setLoading(false);
                            });
                    }
                } else {
                    adminPostCloudList({client_id: client})
                        .then(response => {
                            setSyncStatusList(response.data.data);

                            adminGetPreferenceData({client_id: client})
                                .then(response => {
                                    let preferenceData = response.data.data;
                                    setClientMessage(preferenceData.client_portal_message);
                                    setSubject(preferenceData.email_subject);
                                    setEmailText(preferenceData.email_message);
                                    setSendReminder(parseInt(preferenceData.recipient_send_reminder_type));
                                    setOverdueReminder(parseInt(preferenceData.recipient_overdue_reminder_type));
                                    if (parseInt(preferenceData.default_cloud_storage) > 0) {
                                        setCloudSync(parseInt(preferenceData.default_cloud_storage));
                                    }
                                    setLoading(false);
                                })
                                .catch(err => {
                                    setLoading(false);
                                });
                        })
                        .catch(err => {
                            setLoading(false);
                        });
                }
            })
            .catch(err => {
                setLoading(false);
                navigate('/back-admin/client-portal/' + client + '/templates');
                toast.error(Utils.getErrorMessage(err));
            });
    }, [client, id, navigate, props]);

    const docDragStart = (e, position) => {
        docDragItem.current = position;
    };

    const docDragEnter = (e, position) => {
        docDragOverItem.current = position;
    };

    const docDrop = (e) => {
        const copyListItems = [...documentList];
        const dragItemContent = copyListItems[docDragItem.current];
        copyListItems.splice(docDragItem.current, 1);
        copyListItems.splice(docDragOverItem.current, 0, dragItemContent);
        docDragItem.current = null;
        docDragOverItem.current = null;
        setDocumentList(copyListItems);
    };

    const formDragStart = (e, position) => {
        formDragItem.current = position;
    };

    const formDragEnter = (e, position) => {
        formDragOverItem.current = position;
    };

    const formDrop = (e) => {
        const copyListItems = [...requestFormList];
        const dragItemContent = copyListItems[formDragItem.current];
        copyListItems.splice(formDragItem.current, 1);
        copyListItems.splice(formDragOverItem.current, 0, dragItemContent);
        formDragItem.current = null;
        formDragOverItem.current = null;
        setRequestFormList(copyListItems);
    };

    const onBackTemplate = (e) => {
        e.preventDefault();
        navigate('/back-admin/client-portal/' + client + '/templates');
    };

    const handleEditDoc = (e, data) => {
        e.preventDefault();
        let obj = {
            type: 'edit',
            id: data.id,
            name: data.name,
            detail: data.detail,
            files: data.files,
            date_format: data.date_format,
            remove_doc_id: data.remove_doc_id
        };
        setDocData(obj);
        openDocumentRef?.current.click();
    };

    const handleCopyDoc = (e, data) => {
        e.preventDefault();
        let obj = {
            type: 'create',
            id: 0,
            name: data.name,
            detail: data.detail,
            files: [],
            date_format: data.date_format,
            remove_doc_id: []
        };
        setDocData(obj);
        openDocumentRef?.current.click();
    };

    const handleDeleteDoc = (e, index) => {
        let docList = [...documentList];
        let docId = docList[index]['id'];
        if (docId > 0) {
            let removeIds = [...removeDocumentsId];
            removeIds.push(docId);
            setRemoveDocumentsId(removeIds);
        }

        docList.splice(index, 1);

        setDocumentList(docList);
    };

    const handleEditRequestForm = (e, data) => {
        e.preventDefault();
        let obj = {
            type: 'edit',
            id: data.id,
            name: data.name,
            questions: data.questions,
            remove_question_ids: data.remove_question_ids,
            remove_option_ids: data.remove_option_ids
        };
        setFormData(obj);
        openRequestFormRef?.current.click();
    };

    const handleCopyRequestForm = (e, data) => {
        e.preventDefault();

        let questions = data.questions;
        let list = [];
        for (let i = 0; i < questions.length; i++) {
            let options = [];
            for (let j = 0; j < questions[i]['options'].length; j++) {
                options.push({
                    id: 0,
                    name: questions[i]['options'][j]['name']
                });
            }
            list.push({
                id: 0,
                is_show: false,
                name: questions[i]['name'],
                options: options,
                select_options: questions[i]['select_options'],
                sub_label: questions[i]['sub_label'],
                type: questions[i]['type']
            });
        }

        let obj = {
            type: 'create',
            id: 0,
            name: data.name,
            questions: list,
            remove_question_ids: [],
            remove_option_ids: []
        };
        setFormData(obj);
        openRequestFormRef?.current.click();
    };

    const handleDeleteRequestForm = (e, index) => {
        let formList = [...requestFormList];

        let formId = formList[index]['id'];
        if (formId > 0) {
            let removeIds = [...removeRequestFormId];
            removeIds.push(formId);
            setRemoveRequestFormId(removeIds);
        }

        formList.splice(index, 1);
        setRequestFormList(formList);
    };

    const handleClearTemplate = (e) => {
        e.preventDefault();

        if (templateId > 0) {
            let data = {...templateData};

            let senderList = [];
            if (data.share_user_ids) {
                let sList = [...allSenders];
                for (let i = 0; i < sList.length; i++) {
                    let index = data.share_user_ids.findIndex(x => parseInt(x) === parseInt(sList[i]['value']));
                    if (index > -1) {
                        senderList.push(sList[i]);
                    }
                }
            }
            setSelectedSenders(senderList);

            setEnvelopeName(data.envelope_name);
            setClientMessage(data.message);
            setSubject(data.email_subject);
            setEmailText(data.email_text);
            setDocumentList(data.document_list);
            setRequestFormList(data.request_form_list);
            setRemoveDocumentsId([]);
            setRemoveRequestFormId([]);
        } else {
            setSelectedSenders([]);
            setEnvelopeName('');
            setClientMessage('');
            setSubject('');
            setEmailText('');
            setDocumentList([]);
            setRequestFormList([]);
        }
        setErrors(errorsObj);
    };

    const handleTemplate = async (e) => {
        e.preventDefault();
        let error = false;
        let totalKb = 0;
        let errorObj = {...errorsObj};

        if (selectedSenders.length === 0) {
            errorObj.sender_id = 'Please select one';
            error = true;
        }
        if (!envelopeName) {
            errorObj.envelope_name = 'Please enter name';
            error = true;
        }
        if (!clientMessage) {
            errorObj.client_message = 'Please enter message';
            error = true;
        }
        if (documentList.length === 0) {
            errorObj.documents = 'Please add at-least one document';
            error = true;
        }
        if (!subject) {
            errorObj.subject = 'Please enter subject';
            error = true;
        }
        if (!emailText) {
            errorObj.email_text = 'Please enter email text';
            error = true;
        }
        if (parseInt(isPassword) === 1 && !password) {
            errorObj.password = 'Please enter password';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        setLoading(true);

        let senderIds = selectedSenders.map(x => x.value);

        const formData = new FormData();
        formData.append('client_id', client);
        formData.append('id', templateId);
        formData.append('folder_id', folderId);
        formData.append('sender_id', JSON.stringify(senderIds));
        formData.append('envelope_name', envelopeName);
        formData.append('client_message', clientMessage);
        formData.append('subject', subject);
        formData.append('email_text', emailText);
        for (let i = 0; i < documentList.length; i++) {
            let docData = documentList[i];
            formData.append('doc_id[' + i + ']', docData.id);
            formData.append('doc_name[' + i + ']', docData.name);
            formData.append('doc_detail[' + i + ']', docData.detail);
            for (let j = 0; j < docData.files.length; j++) {
                formData.append('doc_files[' + i + ']', docData.files[j]['file']);
                totalKb += parseFloat(docData.files[j]["kb"]);
            }
            formData.append('date_format[' + i + ']', docData.date_format);
            formData.append('remove_doc_file_id[' + i + ']', JSON.stringify(docData.remove_doc_id));
        }
        formData.append('request_form', JSON.stringify(requestFormList));
        formData.append('remove_doc_id', JSON.stringify(removeDocumentsId));
        formData.append('remove_form_id', JSON.stringify(removeRequestFormId));
        formData.append('name_convention', nameConvention);
        formData.append('cloud_sync', cloudSync);
        formData.append('send_reminder', sendReminder);
        formData.append('overdue_reminder', overdueReminder);
        formData.append('reference_id', referenceId);
        if (parseInt(isPassword) === 1) {
            formData.append('password', password);
        } else {
            formData.append('password', '');
        }

        let isCall = true;
        if (totalKb > 0) {
            isCall = false;
            await adminGetEnvelopeDocumentCheckStorage({kb: totalKb, client_id: client})
                .then((res) => {
                    if (res.data.is_storage_full === false) {
                        isCall = true;
                    } else {
                        toast.error(res.data.message);
                        props.setLoading(false);
                    }
                }).catch(err => {
                    props.setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        }

        if (isCall === true) {
            adminTemplateEnvelopeModify(client, formData)
                .then(response => {
                    setLoading(false);
                    toast.success(response.data.message);
                    navigate('/back-admin/client-portal/' + client + '/templates');
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        }
    };

    const handlePassword = (e) => {
        setIsPassword(e.target.value);
        setPassword('');
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <div className="templates_page">
                <section className="main_wrapper background_grey_400" style={{minHeight: 'calc(100vh - 119px)'}}>
                    <div className="custom_container">
                        <h2 className="main_title template_main_title">{props.type === 1 ? `Create a Template` : `Edit Template`}</h2>
                        <div className=" row shadow-lg  mx-0">
                            <div className="col-lg-12 pt-3 px-0">
                                <h2 className="main_title mb-3 d-flex align-items-center justify-content-between bread_crumb flexWrap px-3">
                                    <span>
                                        {breadcrumbs.length === 0 ?
                                            <span>
                                            <i className="fa fa-folder" aria-hidden="true"/> My Templates
                                        </span>
                                            :
                                            <>
                                                <span className="text_blue">
                                                    <i className="fa fa-folder" aria-hidden="true"/> My Templates
                                                </span>
                                                {breadcrumbs.map((item, index) =>
                                                    <React.Fragment key={index}>
                                                        <i className="fa fa-angle-double-right mx-3"/>
                                                        <span className={`${item.is_last === true ? `` : `text_blue`}`}>
                                                            <i className="fa fa-folder"
                                                               aria-hidden="true"/> {item.folder_name}
                                                        </span>
                                                    </React.Fragment>
                                                )}
                                            </>
                                        }
                                    </span>
                                    <div className="d-flex">
                                        <button type="button" className="btn shadow load_template_btn me-3 back_btn"
                                                data-toggle="tooltip" data-placement="right" title=""
                                                onClick={onBackTemplate} data-bs-original-title="click Me">
                                            <i className="fa fa-arrow-left me-2" aria-hidden="true"/>Back
                                        </button>
                                    </div>
                                </h2>
                            </div>
                        </div>
                        <div className="bg_white py-4 step_wizard_content mb-3">
                            <div className="row">
                                <div className="col-lg-1"/>
                                <div className="col-lg-10">
                                    <h2 className="main_title ps-0 d-flex align-items-center">
                                        <span className="round_blue me-2">1</span>Template Directory
                                    </h2>
                                    <div className="card mb-5 shadow-sm">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-0">
                                                    <label className="form-label mb-2">Share with
                                                        <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                           data-toggle="tooltip" data-placement="right"
                                                           title="How Can i help you?"/>
                                                    </label>
                                                    <Select closeMenuOnSelect={true} value={selectedSenders}
                                                            components={animatedComponents} isMulti
                                                            onChange={(e) => setSelectedSenders(e)}
                                                            options={allSenders}/>
                                                    {errors.sender_id &&
                                                    <div className="text-danger mt-2">{errors.sender_id}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="main_title d-flex align-items-center ps-0">
                                        <span className="round_blue me-2">2</span>Envelope Details
                                    </h2>
                                    <div className="card mb-5 background_grey_400">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="mb-4">
                                                    <label className="form-label mb-2">Envelope Name
                                                        <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                           data-toggle="tooltip" data-placement="right"
                                                           title={Lang.env_envelope_name}/>
                                                    </label>
                                                    <input type="text" className="form-control" value={envelopeName}
                                                           onChange={(e) => setEnvelopeName(e.target.value)}
                                                           aria-describedby="emailHelp"
                                                           placeholder="Enter Envelope Name"/>
                                                    {errors.envelope_name &&
                                                    <div className="text-danger mt-2">{errors.envelope_name}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-0">
                                                    <label className="form-label mb-2">Client Portal Message
                                                        <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                           data-toggle="tooltip" data-placement="right"
                                                           title={Lang.env_client_message}/>
                                                    </label>
                                                    <textarea className="form-control" rows={9} value={clientMessage}
                                                              onChange={(e) => setClientMessage(e.target.value)}
                                                              placeholder="Enter Message to Client"/>
                                                    {errors.client_message &&
                                                    <div className="text-danger mt-2">{errors.client_message}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="main_title ps-0 d-flex align-items-center">
                                        <span className="round_blue me-2">3</span>Email Details
                                    </h2>
                                    <div className="card p-3 background_grey_400 mb-5">
                                        <div className="mb-4">
                                            <label htmlFor="email_subject" className="form-label mb-2">Subject
                                                <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                   data-toggle="tooltip" data-placement="right"
                                                   title={Lang.env_subject}/>
                                            </label>
                                            <input type="text" className="form-control" id="email_subject"
                                                   value={subject} onChange={(e) => setSubject(e.target.value)}
                                                   aria-describedby="emailHelp" placeholder="Enter Email Subject"/>
                                            {errors.subject && <div className="text-danger mt-2">{errors.subject}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="email_text" className="form-label mb-2">Email Text
                                                <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                   data-toggle="tooltip" data-placement="right"
                                                   title={Lang.env_email_text}/>
                                            </label>
                                            <textarea className="form-control" rows={12} value={emailText}
                                                      onChange={(e) => setEmailText(e.target.value)}
                                                      placeholder="Enter Email text box"/>
                                            {errors.email_text &&
                                            <div className="text-danger mt-2">{errors.email_text}</div>}
                                        </div>
                                    </div>

                                    <div className=" mb-4 d-flex justify-content-between flex_wrap">
                                        <h2 className="main_title ps-0 d-flex align-items-center">
                                            <span className="round_blue me-2">4</span>Document Request
                                        </h2>
                                        <div className="d-flex flex_wrap">
                                            <button type="button" className="btn shadow add_recipients_btn"
                                                    data-bs-toggle="offcanvas" data-bs-target="#Add-document"
                                                    aria-controls="Add-document" data-toggle="tooltip"
                                                    ref={openDocumentRef} data-placement="right" title=""
                                                    data-bs-original-title="click Me">
                                                <span className="me-3">+</span>Add Documents
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-4 mb-5 card p-3 background_grey_400">
                                        {documentList.map((item, index) =>
                                            <h2 key={index} className="request_document_tab  mb-2">
                                                <div className="d-flex justify-content-between">
                                                    <div className="accordion_text" style={{cursor: "grab"}}
                                                         onDragStart={(e) => docDragStart(e, index)}
                                                         onDragEnter={(e) => docDragEnter(e, index)}
                                                         onDragEnd={docDrop} draggable>
                                                        <img src="/images/dots_rectangle.png" alt="..."
                                                             className="me-3"/>
                                                        {item.name}
                                                    </div>
                                                    <div className="functional_icons d-flex align-items-center">
                                                    <span className="functional_icon_round"
                                                          data-toggle="tooltip" data-placement="right" title=""
                                                          data-bs-original-title="click Me">
                                                        <i className="fa fa-users" aria-hidden="true"/>
                                                    </span>
                                                        <div className="dropdown">
                                                        <span className="functional_icon_ellipsis"
                                                              id="dropdownMenuButton1" data-bs-toggle="dropdown"
                                                              aria-expanded="false">
                                                            <i className="fa fa-ellipsis-v"/>
                                                        </span>
                                                            <ul className="dropdown-menu"
                                                                aria-labelledby="dropdownMenuButton1">
                                                                <li onClick={(e) => handleEditDoc(e, item)}>
                                                                <span className="dropdown-item">
                                                                    <i className="fa fa-pencil me-2"
                                                                       aria-hidden="true"/> Edit
                                                                </span>
                                                                </li>
                                                                <li onClick={(e) => handleCopyDoc(e, item)}>
                                                                <span className="dropdown-item">
                                                                    <i className="fa fa-clone me-2"
                                                                       aria-hidden="true"/> Duplicate
                                                                </span>
                                                                </li>
                                                                <li onClick={(e) => handleDeleteDoc(e, index)}>
                                                                <span className="dropdown-item">
                                                                    <i className="fa fa-trash-o me-2"
                                                                       aria-hidden="true"/>Delete
                                                                </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </h2>
                                        )}
                                        {errors.documents && <div className="text-danger mt-2">{errors.documents}</div>}
                                    </div>

                                    <div className=" mb-4 d-flex justify-content-between flex_wrap">
                                        <h2 className="main_title ps-0 d-flex align-items-center">
                                            <span className="round_blue me-2">5</span>Information Request (Form Builder)
                                        </h2>
                                        <div className="d-flex flex_wrap">
                                            <button type="button" className="btn shadow add_recipients_btn "
                                                    data-bs-toggle="offcanvas" data-bs-target="#MakeForm"
                                                    aria-controls="MakeForm" data-toggle="tooltip"
                                                    ref={openRequestFormRef}
                                                    data-placement="right" title="" data-bs-original-title="click Me">
                                                <span className="me-3">+</span>Add Information
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-4 mb-5 card p-3 background_grey_400">
                                        {requestFormList.map((item, index) =>
                                            <h2 key={index} className="request_document_tab yellow mb-2">
                                                <div className="d-flex justify-content-between">
                                                    <div className="accordion_text" style={{cursor: "grab"}}
                                                         onDragStart={(e) => formDragStart(e, index)}
                                                         onDragEnter={(e) => formDragEnter(e, index)}
                                                         onDragEnd={formDrop} draggable>
                                                        <img src="/images/dots_rectangle.png" alt="..."
                                                             className="me-3"/>{item.name}
                                                    </div>
                                                    <div className="functional_icons d-flex align-items-center">
                                                    <span className="functional_icon_round"
                                                          data-toggle="tooltip" data-placement="right" title=""
                                                          data-bs-original-title="click Me">
                                                        <i className="fa fa-users" aria-hidden="true"/>
                                                    </span>
                                                        <div className="dropdown">
                                                        <span className="functional_icon_ellipsis"
                                                              id="dropdownMenuButton1" data-bs-toggle="dropdown"
                                                              aria-expanded="false">
                                                            <i className="fa fa-ellipsis-v"/>
                                                        </span>
                                                            <ul className="dropdown-menu"
                                                                aria-labelledby="dropdownMenuButton1">
                                                                <li onClick={(e) => handleEditRequestForm(e, item)}>
                                                                <span className="dropdown-item">
                                                                    <i className="fa fa-pencil me-2"
                                                                       aria-hidden="true"/> Edit
                                                                </span>
                                                                </li>
                                                                <li onClick={(e) => handleCopyRequestForm(e, item)}>
                                                                <span className="dropdown-item">
                                                                    <i className="fa fa-clone me-2"
                                                                       aria-hidden="true"/> Duplicate
                                                                </span>
                                                                </li>
                                                                <li onClick={(e) => handleDeleteRequestForm(e, index)}>
                                                                <span className="dropdown-item">
                                                                    <i className="fa fa-trash-o me-2"
                                                                       aria-hidden="true"/>Delete
                                                                </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </h2>
                                        )}
                                        {errors.request_form &&
                                        <div className="text-danger mt-2">{errors.request_form}</div>}
                                    </div>

                                    <div className="accordion tab-pane form_card accordion_style"
                                         id="accordionMedicare">
                                        <div className="accordion-item  border-0 ">
                                            <h2 className="accordion-header" id="MedicareRejected">
                                                <button className="accordion-button bg_blue py-2 " type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#Medicare-Rejected"
                                                        aria-expanded="true" aria-controls="Medicare-Rejected">
                                                    More Settings
                                                </button>
                                            </h2>
                                            <div id="Medicare-Rejected"
                                                 className="accordion-collapse collapse show bg_blue"
                                                 aria-labelledby="MedicareRejected" data-bs-parent="#accordionMedicare">
                                                <div className="accordion-body pt-0">
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="mb-0">
                                                                <label className="form-label mb-2">Naming
                                                                    Convention</label>
                                                                <div className="d-flex align-items-center">
                                                                    <select className="form-select"
                                                                            value={nameConvention}
                                                                            onChange={(e) => setNameConvention(e.target.value)}>
                                                                        {NAME_CONVENTION.map((item, index) =>
                                                                            <option key={index}
                                                                                    value={item.id}>{item.value}</option>
                                                                        )}
                                                                    </select>
                                                                    <i className="fa fa-question-circle ms-2"
                                                                       aria-hidden="true" data-toggle="tooltip"
                                                                       data-placement="right"
                                                                       title={Lang.env_naming_convention}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="mb-4 ">
                                                                <label className="form-label mb-2">Cloud Storage
                                                                    Sync</label>
                                                                <div className="d-flex align-items-center">
                                                                    <select className="form-select" value={cloudSync}
                                                                            onChange={(e) => setCloudSync(e.target.value)}
                                                                            aria-label="Default select example">
                                                                        {syncStatusList.map((item, index) =>
                                                                            <option key={index}
                                                                                    value={item.id}>{item.value}</option>
                                                                        )}
                                                                    </select>
                                                                    <i className="fa fa-question-circle ms-2"
                                                                       aria-hidden="true" data-toggle="tooltip"
                                                                       data-placement="right"
                                                                       title={Lang.env_cloud_sync}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="mb-4 ">
                                                                <label className="form-label mb-2">Send Reminder
                                                                    (Email)</label>
                                                                <div className="d-flex align-items-center">
                                                                    <select className="form-select" value={sendReminder}
                                                                            onChange={(e) => setSendReminder(e.target.value)}
                                                                            aria-label="Default select example">
                                                                        {SEND_REMINDER.map((item, index) =>
                                                                            <option key={index}
                                                                                    value={item.id}>{item.value}</option>
                                                                        )}
                                                                    </select>
                                                                    <i className="fa fa-question-circle ms-2"
                                                                       aria-hidden="true" data-toggle="tooltip"
                                                                       data-placement="right"
                                                                       title={Lang.env_send_reminder}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="mb-4 ">
                                                                <label className="form-label mb-2">Overdue
                                                                    Reminder (Email)</label>
                                                                <div className="d-flex align-items-center">
                                                                    <select className="form-select"
                                                                            value={overdueReminder}
                                                                            onChange={(e) => setOverdueReminder(e.target.value)}
                                                                            aria-label="Default select example">
                                                                        {OVERDUE_REMINDER.map((item, index) =>
                                                                            <option key={index}
                                                                                    value={item.id}>{item.value}</option>
                                                                        )}
                                                                    </select>
                                                                    <i className="fa fa-question-circle ms-2"
                                                                       aria-hidden="true" data-toggle="tooltip"
                                                                       data-placement="right"
                                                                       title={Lang.env_overdue_reminder}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 d-none">
                                                            <div className="mb-4 ">
                                                                <label className="form-label mb-2">Password
                                                                    Protected</label>
                                                                <div className="d-flex align-items-center">
                                                                    <select className="form-select" value={isPassword}
                                                                            onChange={handlePassword}
                                                                            aria-label="Default select example">
                                                                        {PASSWORD_LIST.map((item, index) =>
                                                                            <option key={index}
                                                                                    value={item.id}>{item.value}</option>
                                                                        )}
                                                                    </select>
                                                                    <i className="fa fa-question-circle ms-2"
                                                                       aria-hidden="true" data-toggle="tooltip"
                                                                       data-placement="right"
                                                                       title={Lang.env_password}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {isPassword > 0 && (
                                                            <div className="col-lg-6">
                                                                <div className="mb-0">
                                                                    <label className="form-label mb-2">Password</label>
                                                                    <div className="d-flex align-items-center">
                                                                        <input type="password" value={password}
                                                                               onChange={(e) => setPassword(e.target.value)}
                                                                               className="form-control"
                                                                               placeholder="Enter password"/>
                                                                        <i className="fa fa-question-circle ms-2"
                                                                           aria-hidden="true" data-toggle="tooltip"
                                                                           data-placement="right"
                                                                           title={Lang.env_password}/>
                                                                    </div>
                                                                </div>
                                                                {errors.password && (
                                                                    <div
                                                                        className="text-danger ms-2">{errors.password}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div className="col-lg-6">
                                                            <div className="mb-0 ">
                                                                <label className="form-label mb-2">Reference
                                                                    ID</label>
                                                                <div className="d-flex align-items-center">
                                                                    <input type="text" value={referenceId}
                                                                           onChange={(e) => setReferenceId(e.target.value)}
                                                                           className="form-control"
                                                                           placeholder="Enter Reference ID"/>
                                                                    <i className="fa fa-question-circle ms-2"
                                                                       aria-hidden="true" data-toggle="tooltip"
                                                                       data-placement="right"
                                                                       title={Lang.env_reference}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-1"/>
                            </div>
                        </div>
                        <div className="step_wizard_button shadow justify-content-center modal-footer">
                            <button type="button" onClick={handleClearTemplate} className="btn btn-secondary">Cancel
                            </button>
                            <button type="button" onClick={handleTemplate}
                                    className="btn btn-primary">{props.type === 1 ? `Create  Template` : `Save Template`}
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <AdminDocumentTemplate docData={docData} setDocData={setDocData} documentList={documentList}
                                   setDocumentList={setDocumentList} setLoading={setLoading}/>

            <AdminRequestFormTemplate formData={formData} setFormData={setFormData} requestFormList={requestFormList}
                                      setRequestFormList={setRequestFormList}/>
        </>
    );
}

export default AdminModifyTemplate;