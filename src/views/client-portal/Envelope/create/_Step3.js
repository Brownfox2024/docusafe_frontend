import React, {useRef, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
    getEnvelopeDocumentDetail,
    getEnvelopeRequestInformationDetail,
    modifyDocumentRequestFormOrders,
    removeEnvelopeDocument,
    removeEnvelopeRequestForm,
    removeEnvelopeSignDocument
} from "../../../../services/CommonService";
import Utils from "../../../../utils";
import {toast} from "react-toastify";
import EnvelopeDocument from "./Document";
import EnvelopePreview from "./Preview";
import DocFormTemplate from "./DocFormTemplate";
import {Lang} from "../../../../lang";
import EnvelopeRequestForm from "./RequestForm";
//import DocFormSelectionPopup from "./DocFormSelectionPopup";
import PdfUploadPopup from "./PdfUploadPopup";
import MakeFillablePopup from "./MakeFillablePopup";

function EnvelopeStep3(props) {
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
    const docDragItem = useRef();
    const docDragOverItem = useRef();

    const btnRequestForm = useRef(null);
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

    const formDragStart = (e, position) => {
        formDragItem.current = position;
    };

    const formDragEnter = (e, position) => {
        formDragOverItem.current = position;
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
        navigate('/client-portal/envelope/edit/' + formData.envelope_uuid + '/2');
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
        if (envelopeFormData.documents.length === 0 && envelopeFormData.sign_documents.length === 0) {
            toast.error("Please create Document");
        } else {

            //Validation of check sign documents fillable or not.
            /*
            if (envelopeFormData.documents.length === 0){
                let checkAnyOneFillable = false;
                for (let i = 0; i < envelopeFormData.sign_documents.length; i++) {
                    if(envelopeFormData.sign_documents[i].request_id !== ""){
                        checkAnyOneFillable = true;
                        break;
                    }
                }
                if(checkAnyOneFillable === false){
                    toast.error("Please make fillable sign request.");
                    return false;
                }
            }
            */
            
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
                id: envelopeFormData.envelope_id,
                document: envelopeFormData.documents,
                request_form: envelopeFormData.fill_forms,
                sign_document: envelopeFormData.sign_documents,
            };

            props.setLoading(true);
            modifyDocumentRequestFormOrders(obj)
                .then((response) => {
                    if (type === 1) {
                        navigate("/manage/draft");
                    } else {
                        envelopeFormData.current_step = 4;
                        props.setFormObj(envelopeFormData);
                        navigate('/client-portal/envelope/edit/' + envelopeFormData.envelope_uuid + '/4');
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
            id: data.id,
        };
        removeEnvelopeSignDocument(obj)
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

                <div className="container">
                    <div className=" mb-4 d-flex justify-content-between flex_wrap">
                        <h3 className="mt-4 mb-5 text_blue fw_bold"><b>Envelope Request Bundle</b></h3>
                    </div>
                    <div className=" mb-4 d-flex justify-content-between flex_wrap">
                        <h2 className="main_title ps-0">Request Documents</h2>
                        <div className="d-flex flex_wrap">
                            {props?.isTemplate === true && (
                                <button type="button" className="btn shadow load_template_btn me-2"
                                        data-toggle="tooltip"
                                        data-bs-toggle="offcanvas" data-bs-target="#AddDocFormTemplate"
                                        onClick={(e) => handleUseDocFormTemplate(e, 1)}
                                        title={Lang.env_add_doc_template}>Add From Templates
                                </button>
                            )}
                            <button type="button" data-bs-toggle="offcanvas" data-bs-target="#Add-document"
                                    ref={btnDocument} aria-controls="Add-document" data-toggle="tooltip"
                                    title={Lang.env_add_document}
                                    className="btn shadow add_recipients_btn">
                                <span className="me-3">+</span>Add Documents
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 mb-5 card p-3">
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

                    <div className=" mb-4 d-flex justify-content-between flex_wrap">
                        <h2 className="main_title ps-0">Request Information (Form Builder)</h2>
                        <div className="d-flex flex_wrap">
                            <button type="button" className="btn shadow add_recipients_btn min-w-300" data-bs-toggle="offcanvas"
                                    ref={btnRequestForm} data-bs-target="#MakeForm" data-toggle="tooltip"
                                    title={Lang.env_add_question}>
                                <span className="me-3">+</span>Add Information Request
                            </button>
                            {/* <button type="button" className="btn shadow add_recipients_btn" data-bs-toggle="offcanvas"
                                    data-bs-target="#selectionRequestForm" data-toggle="tooltip">
                                <span className="me-3">+</span>Add Form
                            </button> */}
                        </div>
                    </div>

                    <div className="mt-4 mb-5 card p-3">
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

                    
                    <div className=" mb-4 d-flex justify-content-between flex_wrap">
                        <h2 className="main_title ps-0">Request Signature (PDF Fillable Form & Signature)</h2>
                        <div className="d-flex flex_wrap">
                            {/* <button type="button" className="btn shadow add_recipients_btn" data-bs-toggle="offcanvas"
                                    ref={btnRequestForm} data-bs-target="#MakeForm" data-toggle="tooltip"
                                    title={Lang.env_add_question}>
                                <span className="me-3">+</span>Add Sign Request
                            </button> */}
                            <button type="button" className="btn shadow add_recipients_btn" data-bs-toggle="offcanvas"
                                    data-bs-target="#pdfUploadForm" data-toggle="tooltip">
                                <span className="me-3">+</span>Add Sign Request
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-4 mb-5 card p-3">
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
                                        

                                        {/* <span>
                                            <i onClick={(e) => onRequestFormEdit(e, item)}
                                               className="fa fa-pencil me-3 cur-pointer" aria-hidden="true"
                                               data-toggle="tooltip" title="click me to edit"
                                               data-bs-original-title="click me to edit"/>
                                        </span> */}
                                        
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

                <EnvelopePreview senderList={props.senderList} formObj={props.formObj}/>

                <EnvelopeDocument formObj={props.formObj} setFormObj={props.setFormObj} setLoading={props.setLoading}
                                  docData={docData} setDocData={setDocData}/>

                <EnvelopeRequestForm formObj={props.formObj} setFormObj={props.setFormObj} setLoading={props.setLoading}
                                     requestFormData={requestFormData} setRequestFormData={setRequestFormData}/>

                {/* <DocFormSelectionPopup formObj={props.formObj} setFormObj={props.setFormObj} setLoading={props.setLoading}></DocFormSelectionPopup> */}

                <PdfUploadPopup formObj={props.formObj} setFormObj={props.setFormObj} setLoading={props.setLoading} setDirectMakeFillableOpen={setDirectMakeFillableOpen} setSignatureDocumentData={setSignatureDocumentData}></PdfUploadPopup>

                <MakeFillablePopup formObj={props.formObj} signatureDocumentData={signatureDocumentData} setFormObj={props.setFormObj} setLoading={props.setLoading}  makeFillable={makeFillable} handleMakeFillable={handleMakeFillable}></MakeFillablePopup>
                                 
            
            </div>
            <div className="step_wizard_button shadow">
                <button type="button" onClick={onBack} className="btn btn_outline">Back</button>
                <button type="button" onClick={onSaveExit} data-toggle="tooltip" title={Lang.env_save_exit}
                        className="btn btn_outline">Save & Exit
                </button>
                <button type="button" onClick={onSave} className="btn btn-primary">Next</button>
            </div>

            <DocFormTemplate fromTemplate={fromTemplate} setFromTemplate={setFromTemplate}
                             formObj={props.formObj} setFormObj={props.setFormObj}
                             isUseFromTemplate={isUseFromTemplate} setIsUseFromTemplate={setIsUseFromTemplate}/>
        </>
    );
}

export default EnvelopeStep3;
