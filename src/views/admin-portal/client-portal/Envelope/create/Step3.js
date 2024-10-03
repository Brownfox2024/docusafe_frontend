import React, {useRef, useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Utils from "../../../../../utils";
import {toast} from "react-toastify";
import AdminEnvelopeDocument from "./Document";
import AdminEnvelopeRequestForm from "./RequestForm";
import AdminEnvelopePreview from "./Preview";
import AdminDocFormTemplate from "./DocFormTemplate";
import {Lang} from "../../../../../lang";
import {
    adminGetEnvelopeDocumentDetail,
    adminGetEnvelopeRequestInformationDetail,
    adminModifyDocumentRequestFormOrders,
    adminRemoveEnvelopeDocument,
    adminRemoveEnvelopeRequestForm,
    adminRemoveEnvelopeSignDocument
} from "../../../../../services/AdminService";

import AdminPdfUploadPopup from "./AdminPdfUploadPopup";
import AdminMakeFillablePopup from "./AdminMakeFillablePopup";

function AdminClientEnvelopeStep3(props) {
    let {client} = useParams();

    const navigate = useNavigate();
    const [fromTemplate, setFromTemplate] = useState(1);
    const [isUseFromTemplate, setIsUseFromTemplate] = useState(false);
    const [directMakeFillableOpen, setDirectMakeFillableOpen] = useState(false);

    const [docData, setDocData] = useState({
        id: 0,
        request_id: 0,
        doc_name: "",
        doc_detail: "",
        documents: [],
        date_format: 0,
        sign_documents: [],
    });

    const [requestFormData, setRequestFormData] = useState({
        id: 0,
        request_id: 0,
        form_name: "",
        form_questions: []
    });

    const [signatureDocumentData, setSignatureDocumentData] = useState(null);
    const btnSignDocumentPopup = useRef(null);


    const btnDocument = useRef(null);
    const btnRequestForm = useRef(null);
    const docDragItem = useRef();
    const docDragOverItem = useRef();
    const formDragItem = useRef();
    const formDragOverItem = useRef();

    const signDragItem = useRef();
    const signDragOverItem = useRef();

    const [makeFillable, setMakeFillable] = useState(false);

    const docDragStart = (e, position) => {
        docDragItem.current = position;
    };

    const docDragEnter = (e, position) => {
        docDragOverItem.current = position;
    };

    const formDragStart = (e, position) => {
        formDragItem.current = position;
    };

    const formDragEnter = (e, position) => {
        formDragOverItem.current = position;
    };

    const docDrop = (e) => {
        const formData = {...props.formObj};
        const copyListItems = [...formData.documents];
        const dragItemContent = copyListItems[docDragItem.current];
        copyListItems.splice(docDragItem.current, 1);
        copyListItems.splice(docDragOverItem.current, 0, dragItemContent);
        docDragItem.current = null;
        docDragOverItem.current = null;
        formData.documents = copyListItems;
        props.setFormObj(formData);
    };

    const formDrop = (e) => {
        const formData = {...props.formObj};
        const copyListItems = [...formData.fill_forms];
        const dragItemContent = copyListItems[formDragItem.current];
        copyListItems.splice(formDragItem.current, 1);
        copyListItems.splice(formDragOverItem.current, 0, dragItemContent);
        formDragItem.current = null;
        formDragOverItem.current = null;
        formData.fill_forms = copyListItems;
        props.setFormObj(formData);
    };



    const signDragStart = (e, position) => {
        signDragItem.current = position;
    };

    const signDragEnter = (e, position) => {
        signDragOverItem.current = position;
    };

    const signDrop = (e) => {
        const formData = {...props.formObj};
        const copyListItems = [...formData.sign_documents];
        const dragItemContent = copyListItems[signDragItem.current];
        copyListItems.splice(signDragItem.current, 1);
        copyListItems.splice(signDragOverItem.current, 0, dragItemContent);
        signDragItem.current = null;
        signDragOverItem.current = null;
        formData.sign_documents = copyListItems;
        props.setFormObj(formData);
    };

    function onBack(e) {
        e.preventDefault();
        const formData = {...props.formObj};
        formData.current_step = 2;
        props.setFormObj(formData);
        navigate('/back-admin/client-portal/' + client + '/envelope/edit/' + formData.envelope_uuid + '/2');
    }

    function onSaveExit(e) {
        e.preventDefault();
        onSubmitForm(1);
    }

    function onSave(e) {
        e.preventDefault();
        onSubmitForm(2);
    }

    function onSubmitForm(type) {
        const envelopeFormData = {...props.formObj};
        if (envelopeFormData.documents.length === 0 && envelopeFormData.fill_forms.length === 0 && envelopeFormData.sign_documents.length === 0) {
            toast.error("Please create Document");
        } else {

            if (envelopeFormData.sign_documents.length !== 0){
                let isAllFillable = true;
                for (let i = 0; i < envelopeFormData.sign_documents.length; i++) {
                    if(envelopeFormData.sign_documents[i].request_id === null){
                        isAllFillable = false;
                        break;
                    }
                }
                if(isAllFillable === false){
                    toast.error("Please make fillable sign request.");
                    return false;
                }
            }

            let obj = {
                client_id: client,
                id: envelopeFormData.envelope_id,
                document: envelopeFormData.documents,
                request_form: envelopeFormData.fill_forms,
                sign_document: envelopeFormData.sign_documents,
            };
            props.setLoading(true);
            adminModifyDocumentRequestFormOrders(obj)
                .then((response) => {
                    if (type === 1) {
                        navigate("/manage/draft");
                    } else {
                        envelopeFormData.current_step = 4;
                        props.setFormObj(envelopeFormData);
                        navigate('/back-admin/client-portal/' + client + '/envelope/edit/' + envelopeFormData.envelope_uuid + '/4');
                    }
                    toast.success(response.data.message);
                    props.setLoading(false);
                })
                .catch((err) => {
                    props.setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        }
    }

    const onRequestFormEdit = (e, data) => {
        e.preventDefault();
        props.setLoading(true);
        let obj = {
            client_id: client,
            id: data.id,
        };
        adminGetEnvelopeRequestInformationDetail(obj)
            .then((response) => {
                let formData = {...requestFormData};
                formData.id = response.data.data.id;
                formData.request_id = response.data.data.request_id;
                formData.form_name = response.data.data.form_name;
                formData.form_questions = response.data.data.questions;
                setRequestFormData(formData);
                btnRequestForm.current?.click();
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const onRequestClone = (e, data) => {
        e.preventDefault();
        props.setLoading(true);
        let obj = {
            client_id: client,
            id: data.id,
        };
        adminGetEnvelopeRequestInformationDetail(obj)
            .then((response) => {
                let formData = {...requestFormData};
                formData.id = 0;
                formData.request_id = response.data.data.request_id;
                formData.form_name = response.data.data.form_name;
                let questionList = response.data.data.questions;
                for (let i = 0; i < questionList.length; i++) {
                    questionList[i]['id'] = 0;
                    for (let j = 0; j < questionList[i]['options'].length; j++) {
                        questionList[i]['options'][j]['id'] = 0;
                    }
                }
                formData.form_questions = questionList;
                setRequestFormData(formData);
                btnRequestForm.current?.click();
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const onRequestFormDelete = (e, data) => {
        e.preventDefault();

        props.setLoading(true);
        let obj = {
            client_id: client,
            id: data.id,
        };
        adminRemoveEnvelopeRequestForm(obj)
            .then((response) => {
                let envelopeData = {...props.formObj};
                let index = envelopeData.fill_forms.findIndex((x) => x.id === obj.id);
                envelopeData.fill_forms.splice(index, 1);
                props.setFormObj(envelopeData);
                toast.success(response.data.message);
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const onDocumentEdit = (e, data) => {
        e.preventDefault();
        props.setLoading(true);
        let obj = {
            client_id: client,
            id: data.id,
        };
        adminGetEnvelopeDocumentDetail(obj)
            .then((response) => {
                let formData = {...docData};
                formData.id = response.data.data.id;
                formData.request_id = response.data.data.request_id;
                formData.doc_name = response.data.data.doc_name;
                formData.doc_detail = response.data.data.doc_detail;
                let files = [];
                for (let i = 0; i < response.data.data.files.length; i++) {
                    files.push({
                        id: response.data.data.files[i]["id"],
                        name: response.data.data.files[i]["file_name"],
                        kb: response.data.data.files[i]["file_size"],
                        path: response.data.data.files[i]["file_path"],
                        file: "",
                    });
                }
                formData.documents = files;
                formData.date_format = response.data.data.date_format;
                setDocData(formData);
                btnDocument.current?.click();
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const onDocumentClone = (e, data) => {
        e.preventDefault();
        props.setLoading(true);
        let obj = {
            client_id: client,
            id: data.id,
        };
        adminGetEnvelopeDocumentDetail(obj)
            .then((response) => {
                let formData = {...docData};
                formData.id = 0;
                formData.request_id = response.data.data.request_id;
                formData.doc_name = response.data.data.doc_name;
                formData.doc_detail = response.data.data.doc_detail;
                formData.documents = [];
                formData.date_format = response.data.data.date_format;
                setDocData(formData);
                btnDocument.current?.click();
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const onDocumentDelete = (e, data) => {
        e.preventDefault();

        props.setLoading(true);
        let obj = {
            client_id: client,
            id: data.id,
        };
        adminRemoveEnvelopeDocument(obj)
            .then((response) => {
                let envelopeData = {...props.formObj};
                let index = envelopeData.documents.findIndex((x) => x.id === obj.id);
                envelopeData.documents.splice(index, 1);
                props.setFormObj(envelopeData);
                toast.success(response.data.message);
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const handleUseDocFormTemplate = (e, type) => {
        e.preventDefault();

        setFromTemplate(type);
        setIsUseFromTemplate(true);
    };

    const handleDownload = async (e, obj) => {
        e.preventDefault();
        props.setLoading(true);
        await Utils.downloadAnyFile(obj.path, obj.file_name);
        props.setLoading(false);
    };

    const onRequestSignDocumentDelete = (e, data) => {
        e.preventDefault();

        props.setLoading(true);
        let obj = {
            client_id: client,
            id: data.id,
        };
        adminRemoveEnvelopeSignDocument(obj)
            .then((response) => {
                let envelopeData = {...props.formObj};
                let index = envelopeData.sign_documents.findIndex((x) => x.id === obj.id);
                envelopeData.sign_documents.splice(index, 1);
                props.setFormObj(envelopeData);
                toast.success(response.data.message);
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };


    const onRequestSignDocumentRender = async (e, data) => {
        console.log("Render make fillable form");
        e.preventDefault();

        const keysToRemove = ["mousePosition", "pagesPosition", "placeholders"];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        props.setLoading(true);
        await setSignatureDocumentData(data);
        await setMakeFillable(true);
        btnSignDocumentPopup.current?.click();
    };



    const handleMakeFillable = () => {
        let current = (makeFillable === false) ? true : false; 
        setMakeFillable(current);
    }

    useEffect(() => {
        const makeFillableAsync = async () => {
            if (directMakeFillableOpen === true) {
                const keysToRemove = ["mousePosition", "pagesPosition", "placeholders"];
                keysToRemove.forEach(key => localStorage.removeItem(key));
                await setMakeFillable(true);
                btnSignDocumentPopup.current?.click();
                setDirectMakeFillableOpen(false);
            }
        };
    
        makeFillableAsync(); // Call the async function
    }, [directMakeFillableOpen]);


    return (
        <>
            <div className="step_wizard_content">
                <div className="floating_btn">
                    <span className="btn modal_btn" data-bs-toggle="modal"
                          data-bs-target="#resendEnvelope">Preview</span>
                </div>

                <div className="custom_container templates_page">
                    <div className="p-4 mb-0 mt-3">
                        <h2 className="main_title template_main_title d-flex align-items-center justify-content-between flexWrap px-3 w-100">
                            <div>
                                <span>Envelope </span>
                            </div>
                            <div className="d-flex">
							    {props?.isTemplate === true && (
                                <button type="button" className="btn shadow load_template_btn"
                                        data-toggle="tooltip"
                                        data-bs-toggle="offcanvas" data-bs-target="#AddDocFormTemplate"
                                        onClick={(e) => handleUseDocFormTemplate(e, 1)}
                                        title={Lang.env_add_doc_template}>Add From Templates
                                </button>
                                )}

						    </div>
                        </h2>

                        <div className="row shadow-lg border_radius mx-0" style={{ background: "#fff" }}>
                            
                            <div className="col-lg-2 pt-3 border_right">
                                <div className="nav nav-tabs flex-column" id="nav-tab" role="tablist">
                                    <button className="nav-link active" id="MyTemplatesDetails" data-bs-toggle="tab" data-bs-target="#MyTemplates-detail" type="button" role="tab" aria-controls="MyTemplates-detail" aria-selected="true"><i className="fa fa-file-pdf-o" aria-hidden="true"></i> Document Request 
                                    {(props.formObj.documents.length > 0) &&
                                        <span className="ms-2">
                                            <span className="badge bg-warning text-dark">{props.formObj.documents.length}</span>
                                        </span>
                                    }
                                    </button>

                                    <button className="nav-link" id="sharedWithMe-tab" data-bs-toggle="tab" data-bs-target="#sharedWithMe" type="button" role="tab" aria-controls="sharedWithMe" aria-selected="false"><i className="fa fa-list-alt" aria-hidden="true"></i> Information Request {(props.formObj.fill_forms.length > 0) &&
                                        <span className="ms-2">
                                            <span className="badge bg-warning text-dark">{props.formObj.fill_forms.length}</span>
                                        </span>
                                    }</button>

                                    <button className="nav-link" id="DocutikTemplates-tab" data-bs-toggle="tab" data-bs-target="#DocutikTemplates" type="button" role="tab" aria-controls="DocutikTemplates" aria-selected="false"><i className="fa fa-pencil-square-o" aria-hidden="true"></i> Signature Request {(props.formObj.sign_documents.length > 0) &&
                                        <span className="ms-2">
                                            <span className="badge bg-warning text-dark">{props.formObj.sign_documents.length}</span>
                                        </span>
                                    }</button>              
                                </div>
                            </div>
                            
                            <div className="col-lg-10 pt-3 px-0">
                                <div className="tab-content" id="nav-tabContent" style={{ minHeight: "calc(100vh - 397px)" }}>

                                    <div className="tab-pane fade active show" id="MyTemplates-detail" role="tabpanel" aria-labelledby="MyTemplatesDetails">

                                        <div className="d-flex align-items-center justify-content-between w-100 px-4">
                                            <div>
                                                <h2 className="main_title d-flex align-items-center justify-content-between bread_crumb flexWrap p-0">
                                                <span>
                                                    <i className="fa fa-file-pdf-o" aria-hidden="true"></i> Document Request 
                                                </span>
                                                </h2>
                                            </div>
                                            <div>
                                                <button type="button" data-bs-toggle="offcanvas" data-bs-target="#Add-document"
                                                        ref={btnDocument} aria-controls="Add-document" data-toggle="tooltip"
                                                        title={Lang.env_add_document}
                                                        className="btn shadow add_recipients_btn">
                                                    <span className="me-3">+</span>Add Request
                                                </button>
                                            </div>
                                        </div>


                                        <div className="mt-4 mb-3 card p-3">
                                            {props.formObj.documents.map((item, index) => (
                                                <h2 key={index} className="request_document_tab  mb-2">
                                                    <div className="d-flex justify-content-between flex_wrap">
                                                        <div className="accordion_text" style={{cursor: "grab"}}
                                                            onDragStart={(e) => docDragStart(e, index)}
                                                            onDragEnter={(e) => docDragEnter(e, index)} onDragEnd={docDrop} draggable>
                                                            <img src="/images/dots_rectangle.png" alt="rectangle" className="me-3"/>
                                                            {item.name}
                                                        </div>
                                                        <div className="functional_icons">
                                                            {parseInt(item.request_id) === 0 ? (
                                                                <span className="functional_icon_round">
                                                                    <i className="fa fa-users" data-toggle="tooltip" data-placement="right"
                                                                    title="" data-bs-original-title="Everyone" aria-hidden="true"/>
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    {item.request_display.map((recipient, i) =>
                                                                        <span key={i} className="functional_icon_round"
                                                                            data-toggle="tooltip" data-placement="right" title=""
                                                                            data-bs-original-title={recipient.full_name}>{recipient.display}</span>
                                                                    )}
                                                                </>
                                                            )}
                                                            <span>
                                                                <i onClick={(e) => onDocumentEdit(e, item)}
                                                                className="fa fa-pencil me-3 cur-pointer" aria-hidden="true"
                                                                data-toggle="tooltip" title="click me to Edit"
                                                                data-bs-original-title="click me to Edit"/>
                                                            </span>
                                                            <span>
                                                                <i onClick={(e) => onDocumentClone(e, item)}
                                                                className="fa fa-clone me-3 cur-pointer" aria-hidden="true"
                                                                data-toggle="tooltip" title="click me to copy"
                                                                data-bs-original-title="click me to copy"/>
                                                            </span>
                                                            <span>
                                                                <i onClick={(e) => onDocumentDelete(e, item)}
                                                                className="fa fa-trash-o cur-pointer" aria-hidden="true"
                                                                data-toggle="tooltip" title="click me to delete"
                                                                data-bs-original-title="click me to delete"/>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </h2>
                                            ))}
                                        </div>


                                    </div>

                                    <div className="tab-pane fade" id="sharedWithMe" role="tabpanel" aria-labelledby="sharedWithMe-tab">
                                            
                                        <div className="d-flex align-items-center justify-content-between w-100 px-4">
                                            <div>
                                                <h2 className="main_title d-flex align-items-center justify-content-between bread_crumb flexWrap p-0">
                                                <span>
                                                    <i className="fa fa-list-alt" aria-hidden="true"></i> Information Request (Form Builder)
                                                </span>
                                                </h2>
                                            </div>
                                            <div>
                                                <button type="button" className="btn shadow add_recipients_btn" data-bs-toggle="offcanvas"
                                                        ref={btnRequestForm} data-bs-target="#MakeForm" data-toggle="tooltip"
                                                        title={Lang.env_add_question}>
                                                    <span className="me-3">+</span>Create a Form
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 mb-3 card p-3">
                                            {props.formObj.fill_forms.map((item, index) => (
                                                <h2 key={index} className="request_document_tab yellow mb-2">
                                                    <div className="d-flex justify-content-between flex_wrap">
                                                        <div className="accordion_text" style={{cursor: "grab"}}
                                                            onDragStart={(e) => formDragStart(e, index)}
                                                            onDragEnter={(e) => formDragEnter(e, index)} onDragEnd={formDrop} draggable>
                                                            <img src="/images/dots_rectangle.png" alt="image4" className="me-3"/>
                                                            {item.name}
                                                        </div>
                                                        <div className="functional_icons">
                                                            {parseInt(item.request_id) === 0 ? (
                                                                <span className="functional_icon_round">
                                                                    <i className="fa fa-users" data-toggle="tooltip" data-placement="right"
                                                                    title="" data-bs-original-title="Everyone" aria-hidden="true"/>
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    {item.request_display.map((recipient, i) =>
                                                                        <span key={i} className="functional_icon_round"
                                                                            data-toggle="tooltip" data-placement="right" title=""
                                                                            data-bs-original-title={recipient.full_name}>{recipient.display}</span>
                                                                    )}
                                                                </>
                                                            )}
                                                            <span>
                                                                <i onClick={(e) => onRequestFormEdit(e, item)}
                                                                className="fa fa-pencil me-3 cur-pointer" aria-hidden="true"
                                                                data-toggle="tooltip" title="click me to edit"
                                                                data-bs-original-title="click me to edit"/>
                                                            </span>
                                                            <span>
                                                                <i onClick={(e) => onRequestClone(e, item)}
                                                                className="fa fa-clone me-3 cur-pointer" aria-hidden="true"
                                                                data-toggle="tooltip" title="click me to copy"
                                                                data-bs-original-title="click me to copy"/>
                                                            </span>
                                                            <span>
                                                                <i onClick={(e) => onRequestFormDelete(e, item)}
                                                                className="fa fa-trash-o cur-pointer" aria-hidden="true"
                                                                data-toggle="tooltip" title="click me to delete"
                                                                data-bs-original-title="click me to delete"/>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </h2>
                                            ))}
                                        </div>

                                    </div>
                                    
                                    
                                    <div className="tab-pane fade" id="DocutikTemplates" role="tabpanel" aria-labelledby="DocutikTemplates-tab">
                                        
                                        <div className="d-flex align-items-center justify-content-between w-100 px-4">
                                            <div>
                                                <h2 className="main_title d-flex align-items-center justify-content-between bread_crumb flexWrap p-0">
                                                <span>
                                                    <i className="fa fa-file-pdf-o" aria-hidden="true"></i> Signature Request
                                                </span>
                                                </h2>
                                            </div>
                                            <div>
                                                <button type="button" className="btn shadow add_recipients_btn" data-bs-toggle="offcanvas"
                                                        data-bs-target="#pdfUploadForm" data-toggle="tooltip">
                                                    <span className="me-3">+</span>Create a Form
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 mb-3 card p-3">
                                            
                                            {props.formObj.sign_documents.map((item, index) => (
                                                <h2 key={index} className={(index + 1 === props.formObj.sign_documents.length) ? "request_document_tab dt-alert-info mb-0" : "request_document_tab dt-alert-info mb-2" }>
                                                    <div className="d-flex justify-content-between flex_wrap align-items-center">
                                                        <div className="accordion_text" style={{cursor: "grab"}}
                                                            onDragStart={(e) => signDragStart(e, index)}
                                                            onDragEnter={(e) => signDragEnter(e, index)} onDragEnd={signDrop} draggable>
                                                            <img src="/images/dots_rectangle.png" alt="image4" className="me-3"/>
                                                            {item.name}
                                                        </div>
                                                        <div className="functional_icons d-flex align-items-center">
                                                            
                                                            {parseInt(item.request_id) === 0 ? (
                                                                <span className="functional_icon_round">
                                                                    <i className="fa fa-users" data-toggle="tooltip" data-placement="right"
                                                                    title="" data-bs-original-title="Everyone" aria-hidden="true"/>
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    {item.request_display.map((recipient, i) =>
                                                                        <span key={i} className="functional_icon_round"
                                                                            data-toggle="tooltip" data-placement="right" title=""
                                                                            data-bs-original-title={recipient.full_name}>{recipient.display}</span>
                                                                    )}
                                                                </>
                                                            )}


                                                            {/* <span className="make_fillable_btn me-3 cur-pointer" data-bs-toggle="offcanvas"
                                                            data-bs-target="#makeFillableForm" data-toggle="tooltip">
                                                                <i className="fa fa-pencil-square-o" data-toggle="tooltip" data-placement="right"
                                                                    title="" data-bs-original-title="Make fillable" aria-hidden="true"/> Make fillable
                                                            </span> */}
                                                            
                                                            {(item.request_display.length === 0 && item.request_id !== "0")? (
                                                                <span onClick={(e) => onRequestSignDocumentRender(e, item)} className="make_fillable_btn me-3 cur-pointer" >
                                                                    <i className="fa fa-pencil-square-o" data-toggle="tooltip" data-placement="right"
                                                                        title="" data-bs-original-title={(item.request_display.length === 0) ? 'Make fillable' : 'Edit Live Form'} aria-hidden="true"/> {(item.request_display.length === 0) ? 'Make fillable' : 'Edit Live Form'}
                                                                </span>
                                                                ):(
                                                                <span onClick={(e) => onRequestSignDocumentRender(e, item)} className="make_fillable_btn edit_live_form_btn me-3 cur-pointer" >
                                                                    <i className="fa fa-pencil-square-o" data-toggle="tooltip" data-placement="right"
                                                                        title="" data-bs-original-title={(item.request_display.length === 0 && item.request_id !== "0") ? 'Make fillable' : 'Edit Live Form'} aria-hidden="true"/> {(item.request_display.length === 0 && item.request_id !== "0") ? 'Make fillable' : 'Edit Live Form'}
                                                                </span>
                                                                )
                                                            }

                                                                <span className="functional_icon_round">
                                                                    <i className="fa fa-download cur-pointer" onClick={(e) => handleDownload(e, item)}  data-toggle="tooltip" data-placement="right"
                                                                        title="" data-bs-original-title="Download" aria-hidden="true"/>
                                                                </span>
                                                            
                                                            <span>
                                                                <i onClick={(e) => onRequestSignDocumentDelete(e, item)}
                                                                className="fa fa-trash-o cur-pointer" aria-hidden="true"
                                                                data-toggle="tooltip" title="click me to delete"
                                                                data-bs-original-title="click me to delete"/>
                                                            </span>
                                                        </div>  
                                                    </div>
                                                </h2>
                                            ))}

                                            <span className="d-none" ref={btnSignDocumentPopup} data-bs-toggle="offcanvas" data-bs-target="#makeFillableForm" ></span>

                                        </div>
                                                        

                                    </div>


                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>

                


                <AdminEnvelopePreview senderList={props.senderList} formObj={props.formObj}/>

                <AdminEnvelopeDocument formObj={props.formObj} setFormObj={props.setFormObj}
                                       setLoading={props.setLoading} docData={docData} setDocData={setDocData}/>

                <AdminEnvelopeRequestForm formObj={props.formObj} setFormObj={props.setFormObj}
                                          setLoading={props.setLoading} requestFormData={requestFormData}
                                          setRequestFormData={setRequestFormData}/>

                
                <AdminPdfUploadPopup formObj={props.formObj} setFormObj={props.setFormObj} setLoading={props.setLoading} setDirectMakeFillableOpen={setDirectMakeFillableOpen} setSignatureDocumentData={setSignatureDocumentData}></AdminPdfUploadPopup>

                <AdminMakeFillablePopup formObj={props.formObj} signatureDocumentData={signatureDocumentData} setFormObj={props.setFormObj} setLoading={props.setLoading}  makeFillable={makeFillable} handleMakeFillable={handleMakeFillable}></AdminMakeFillablePopup>
                                
            </div>
            <div className="step_wizard_button shadow">
                <button type="button" onClick={onBack} className="btn btn_outline">Back</button>
                <button type="button" onClick={onSaveExit} data-toggle="tooltip" title={Lang.env_save_exit}
                        className="btn btn_outline">Save & Exit
                </button>
                <button type="button" onClick={onSave} className="btn btn-primary">Next</button>
            </div>

            <AdminDocFormTemplate fromTemplate={fromTemplate} setFromTemplate={setFromTemplate}
                                  formObj={props.formObj} setFormObj={props.setFormObj}
                                  isUseFromTemplate={isUseFromTemplate} setIsUseFromTemplate={setIsUseFromTemplate}/>
        </>
    );
}

export default AdminClientEnvelopeStep3;