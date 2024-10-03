import React, {useEffect, useState, useRef} from "react";
import RequestDocFormTemplate from "./RequestDocFormTemplate";
import {
    editRequestUpdateDocumentForm,
    getEnvelopeDocumentDetail,
    getEnvelopeRequestInformationDetail,
    removeEnvelopeDocument, removeEnvelopeRequestForm
} from "../../../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../../../utils";
import ManageDocument from "./ManageDocument";
import ManageForm from "./ManageForm";
import {Lang} from "../../../../../../lang";

function EditRequest(props) {
    const [envelopeId, setEnvelopeId] = useState(0);
    const [documentList, setDocumentList] = useState([]);
    const [recipientsList, setRecipientsList] = useState([]);
    const [formList, setFormList] = useState([]);
    const [fromTemplate, setFromTemplate] = useState(1);
    const [isUseFromTemplate, setIsUseFromTemplate] = useState(false);

    useEffect(function () {
        setDocumentList(props.envelopeData.documents);
        setFormList(props.envelopeData.fill_forms);
        setRecipientsList(props.envelopeData.recipient_list);
        setEnvelopeId(props.envelopeData.id);
    }, [props.envelopeData]);

    const btnDocument = useRef(null);
    const btnRequestForm = useRef(null);
    const docDragItem = useRef();
    const docDragOverItem = useRef();
    const formDragItem = useRef();
    const formDragOverItem = useRef();

    const [docData, setDocData] = useState({
        id: 0,
        request_id: 0,
        doc_name: "",
        doc_detail: "",
        documents: [],
        date_format: 0
    });

    const [requestFormData, setRequestFormData] = useState({
        id: 0,
        request_id: 0,
        form_name: "",
        form_questions: []
    });

    const handleBackView = (e) => {
        e.preventDefault();
        props.setIsEditRequest(false);
        props.setIsRefresh(true);
    };

    const handleUseDocFormTemplate = (e, type) => {
        e.preventDefault();

        setFromTemplate(type);
        setIsUseFromTemplate(true);
    };

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
        const copyListItems = [...formList];
        const dragItemContent = copyListItems[formDragItem.current];
        copyListItems.splice(formDragItem.current, 1);
        copyListItems.splice(formDragOverItem.current, 0, dragItemContent);
        formDragItem.current = null;
        formDragOverItem.current = null;
        setFormList(copyListItems);
    };

    const onDocumentEdit = (e, data) => {
        e.preventDefault();
        props.setLoading(true);
        let obj = {
            id: data.id,
        };
        getEnvelopeDocumentDetail(obj)
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
            id: data.id,
        };
        getEnvelopeDocumentDetail(obj)
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
            id: data.id,
        };
        removeEnvelopeDocument(obj)
            .then((response) => {
                let docList = [...documentList];
                let index = docList.findIndex((x) => parseInt(x.id) === parseInt(obj.id));
                docList.splice(index, 1);
                setDocumentList(docList);
                toast.success(response.data.message);
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const onRequestFormEdit = (e, data) => {
        e.preventDefault();
        props.setLoading(true);
        let obj = {
            id: data.id,
        };
        getEnvelopeRequestInformationDetail(obj)
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
            id: data.id,
        };
        getEnvelopeRequestInformationDetail(obj)
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
            id: data.id,
        };
        removeEnvelopeRequestForm(obj)
            .then((response) => {
                let fList = [...formList];
                let index = fList.findIndex((x) => parseInt(x.id) === parseInt(obj.id));
                fList.splice(index, 1);
                setFormList(fList);
                toast.success(response.data.message);
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const handleEditSave = async (e) => {
        e.preventDefault();

        props.setLoading(true);

        let ipAddress = '';
        await Utils.getIpAddress().then(response => {
            ipAddress = response;
        });

        let obj = {
            id: envelopeId,
            document: documentList,
            request_form: formList,
            ip_address: ipAddress
        };

        editRequestUpdateDocumentForm(obj)
            .then(response => {
                toast.success(response.data.message);
                props.setLoading(false);
                props.setIsEditRequest(false);
                props.setIsRefresh(true);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });

    };

    return (
        <div className={`tab-content p-5`}>
            <div className="edit_request">
                <h2 className="main_title ps-0 mb-3">Edit Request</h2>

                {documentList && documentList.length > 0 &&
                <>
                    <div className=" mb-4 d-flex justify-content-between flex_wrap">
                        <h2 className="main_title ps-0 text_blue">Document Request</h2>
                        <div className="d-flex flex_wrap">
                            {props?.isTemplate === true && (
                                <button type="button" className="btn shadow load_template_btn me-2"
                                        data-toggle="tooltip" title={Lang.env_add_doc_template}
                                        data-bs-toggle="offcanvas" data-bs-target="#AddDocFormTemplate"
                                        onClick={(e) => handleUseDocFormTemplate(e, 1)}>Add From Templates
                                </button>
                            )}
                            <button type="button" className="btn shadow add_recipients_btn" data-bs-toggle="offcanvas"
                                    data-toggle="tooltip" title={Lang.env_add_document}
                                    data-bs-target="#Add-document" ref={btnDocument}>
                                <span className="me-3">+</span>Add Request
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 mb-5">
                        {documentList.map((item, index) =>
                            <h2 key={index} className="request_document_tab mb-2">
                                <div className="d-flex justify-content-between">
                                    <div className="accordion_text" style={{cursor: "grab"}}
                                         onDragStart={(e) => docDragStart(e, index)}
                                         onDragEnter={(e) => docDragEnter(e, index)} onDragEnd={docDrop} draggable>
                                        <img src="/images/dots_rectangle.png" alt="..." className="me-3"/>
                                        {item.name}
                                    </div>
                                    <div className="functional_icons">
                                        {item.request_display.length === 0 ? (
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
                                               className="fa cur-pointer fa-pencil me-3" aria-hidden="true"/>
                                        </span>
                                        <span>
                                            <i onClick={(e) => onDocumentClone(e, item)}
                                               className="fa cur-pointer fa-clone me-3" aria-hidden="true"/>
                                        </span>
                                        <span>
                                            <i onClick={(e) => onDocumentDelete(e, item)}
                                               className="fa cur-pointer fa-trash-o" aria-hidden="true"/>
                                        </span>
                                    </div>
                                </div>
                            </h2>
                        )}
                    </div>
                </>
                }

                {formList && formList.length > 0 &&
                <>
                    <div className=" mb-4 d-flex justify-content-between flex_wrap">
                        <h2 className="main_title ps-0 text_blue">Information Request (Form Builder)</h2>
                        <div className="d-flex flex_wrap">
                            <button type="button" className="btn shadow add_recipients_btn" data-bs-toggle="offcanvas"
                                    data-toggle="tooltip" title={Lang.env_add_question}
                                    ref={btnRequestForm} data-bs-target="#ManageRequestForm">
                                <span className="me-3">+</span>Create a Form
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 mb-5 ">
                        {formList.map((item, index) =>
                            <h2 key={index} className="request_document_tab yellow mb-2">
                                <div className="d-flex justify-content-between flex_wrap">
                                    <div className="accordion_text" style={{cursor: "grab"}}
                                         onDragStart={(e) => formDragStart(e, index)}
                                         onDragEnter={(e) => formDragEnter(e, index)} onDragEnd={formDrop} draggable>
                                        <img src="/images/dots_rectangle.png" alt="..." className="me-3"/>
                                        {item.name}
                                    </div>
                                    <div className="functional_icons">
                                        {item.request_display.length === 0 ? (
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
                                               className="fa cur-pointer fa-pencil me-3" aria-hidden="true"/>
                                        </span>
                                        <span>
                                            <i onClick={(e) => onRequestClone(e, item)}
                                               className="fa cur-pointer fa-clone me-3" aria-hidden="true"/>
                                        </span>
                                        <span>
                                            <i onClick={(e) => onRequestFormDelete(e, item)}
                                               className="fa cur-pointer fa-trash-o" aria-hidden="true"/>
                                        </span>
                                    </div>
                                </div>
                            </h2>
                        )}
                    </div>
                </>
                }
            </div>

            <div className="text-center">
                <button type="button" onClick={handleBackView}
                        className="btn btn-outline-secondary me-2 rounded-5">
                    <i className="fa fa-arrow-left me-2" aria-hidden="true"/> Go Back
                </button>
                <button type="button" onClick={handleEditSave} className="btn btn-primary rounded-5 px-4">Save</button>
            </div>

            <ManageDocument documentList={documentList} setDocumentList={setDocumentList} setLoading={props.setLoading}
                            envelopeId={envelopeId} docData={docData} setDocData={setDocData}
                            recipientsList={recipientsList}/>

            <ManageForm formList={formList} setFormList={setFormList} setLoading={props.setLoading}
                        envelopeId={envelopeId} requestFormData={requestFormData}
                        setRequestFormData={setRequestFormData} recipientsList={recipientsList}/>

            <RequestDocFormTemplate fromTemplate={fromTemplate} setFromTemplate={setFromTemplate}
                                    envelopeId={envelopeId} documentList={documentList}
                                    setDocumentList={setDocumentList} formList={formList} setFormList={setFormList}
                                    isUseFromTemplate={isUseFromTemplate} setIsUseFromTemplate={setIsUseFromTemplate}/>
        </div>
    );
}

export default EditRequest;