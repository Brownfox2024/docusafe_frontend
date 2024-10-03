import React, {useRef, useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../../../utils";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {DATE_FORMAT_LIST, EVERY_ONE_OBJECT, FORM_OPTIONS, QUILL_MODULES, QUILL_FORMATS} from "../../../../../../../configs/AppConfig";
import {
    adminModifyEnvelopeRequestInformation
} from "../../../../../../../services/AdminService";

// import {CKEditor} from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the Quill stylesheet

import DatePicker from "react-datepicker";

function AdminManageForm(props) {
    const {client} = useParams();
    const [formId, setFormId] = useState(0);
    const [formRequestId, setFormRequestId] = useState([]);
    const [formRecipients, setFormRecipients] = useState([]);
    const [formName, setFormName] = useState('');
    const [formQuestions, setFormQuestions] = useState([]);
    const [removeQuestionId, setRemoveQuestionId] = useState([]);
    const [removeOptionId, setRemoveOptionId] = useState([]);

    const animatedComponents = makeAnimated();

    const [previewButtonText, setPreviewButtonText] = useState("Preview");
    const [previewContent, setPreviewContent] = useState("");


    const questionDragItem = useRef();
    const questionDragOverItem = useRef();
    const dateRef = useRef(null);

    const questionDragStart = (e, position) => {
        questionDragItem.current = position;
    };

    const questionDragEnter = (e, position) => {
        questionDragOverItem.current = position;
    };

    const questionDrop = (e) => {
        const copyListItems = [...formQuestions];
        const dragItemContent = copyListItems[questionDragItem.current];
        copyListItems.splice(questionDragItem.current, 1);
        copyListItems.splice(questionDragOverItem.current, 0, dragItemContent);
        questionDragItem.current = null;
        questionDragOverItem.current = null;
        setFormQuestions(copyListItems);
    };

    useEffect(() => {
        setFormId(props?.requestFormData?.id);
        setFormName(props?.requestFormData?.form_name);
        setFormQuestions(props?.requestFormData?.form_questions);

        let recipientObj = EVERY_ONE_OBJECT;
        if (props?.requestFormData?.request_id) {
            let selectedRecipient = [];
            let recipientIds = props?.requestFormData?.request_id.split(',');
            let index = recipientIds.findIndex(x => parseInt(x) === 0);
            if (index > -1) {
                selectedRecipient = [recipientObj];
            } else {
                for (let i = 0; i < recipientIds.length; i++) {
                    let index = props.recipientsList.findIndex(x => parseInt(x.id) === parseInt(recipientIds[i]));
                    if (index > -1) {
                        selectedRecipient.push({
                            value: props.recipientsList[index]['id'],
                            label: props.recipientsList[index]['first_name'] + ' ' + props.recipientsList[index]['last_name']
                        })
                    }
                }
            }
            setFormRequestId(selectedRecipient);
        } else {
            setFormRequestId([recipientObj]);
        }

        let recipients = [recipientObj];
        for (let i = 0; i < props.recipientsList.length; i++) {
            recipients.push({
                value: props.recipientsList[i]['id'],
                label: props.recipientsList[i]['first_name'] + ' ' + props.recipientsList[i]['last_name']
            });
        }
        setFormRecipients(recipients);
    }, [props?.requestFormData, props.recipientsList]);

    let errorsObj = {
        recipients: '',
        form_name: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsFormButtonRef = useRef(null);

    function onCloseForm(e) {
        e.preventDefault();
        clsFormButtonRef.current?.click();
        clearForm(e);
    }

    function clearForm(e) {
        e.preventDefault();
        setFormId(0);
        setFormRequestId([EVERY_ONE_OBJECT]);
        setFormRecipients([]);
        setFormName('');
        setFormQuestions([]);

        let errorsObj = {
            recipients: '',
            form_name: ''
        };
        setErrors(errorsObj);
    }

    function onSaveAddForm(e) {
        e.preventDefault();
        storeFormField(e, 2);
    }

    function onSaveForm(e) {
        e.preventDefault();
        storeFormField(e, 1);
    }

    function storeFormField(e, type) {
        let error = false;
        const errorObj = {...errorsObj};

        let list = [...formQuestions];
        if (formRequestId.length === 0) {
            errorObj.recipients = 'Please select request from';
            error = true;
        }
        if (!formName) {
            errorObj.form_name = 'Name must be required';
            error = true;
        } else if (list.length === 0) {
            toast.error('Please add any one option');
            error = true;
        }
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (!list[i].name) {
                    if(list[i].type !== 7){
                        list[i].error = "Question is required";
                        error = true;
                    }
                } else if (list[i].type > 2 && list[i].type < 6 && list[i].options.length === 0) {
                    list[i].error = "Please add option";
                    error = true;
                } else {
                    list[i].error = "";
                }
                if (list[i].options.length > 0) {
                    for (let j = 0; j < list[i].options.length; j++) {
                        if (!list[i].options[j].name) {
                            list[i].options[j].error = "Option is required";
                            error = true;
                        } else {
                            list[i].options[j].error = '';
                        }
                    }
                }
            }
        }
        setFormQuestions(list);

        setErrors(errorObj);

        if (error) return;

        let recipientIds = '';
        for (let i = 0; i < formRequestId.length; i++) {
            if (parseInt(formRequestId[i]['value']) === 0) {
                recipientIds = 0;
                break;
            } else {
                recipientIds += formRequestId[i]['value'];
                if (formRequestId.length !== (i + 1)) {
                    recipientIds += ',';
                }
            }
        }

        props.setLoading(true);
        let obj = {
            client_id: client,
            envelope_id: props.envelopeId,
            form_id: formId,
            form_request_id: recipientIds,
            name: formName,
            fields: formQuestions,
            remove_question: removeQuestionId,
            remove_option: removeOptionId
        };

        adminModifyEnvelopeRequestInformation(obj)
            .then(response => {
                if (type === 1) {
                    clsFormButtonRef.current?.click();
                    clearForm(e);
                } else {
                    clearForm(e);
                }

                let requestDisplay = [];
                if (recipientIds !== 0) {
                    let recipients = recipientIds.split(',');
                    for (let i = 0; i < recipients.length; i++) {
                        let index = props.recipientsList.findIndex(x => parseInt(x.id) === parseInt(recipients[i]));
                        if (index > -1) {
                            let firstName = props.recipientsList[index]['first_name'];
                            let lastName = props.recipientsList[index]['last_name'];
                            let firstLetter = firstName.charAt(0);
                            let lastLetter = lastName.charAt(0);
                            requestDisplay.push({
                                full_name: firstName + ' ' + lastName,
                                display: firstLetter + lastLetter
                            });
                        }
                    }
                }

                let fList = [...props.formList];
                if (formId > 0) {
                    let index = fList.findIndex(x => parseInt(x.id) === parseInt(formId));
                    if (index > -1) {
                        fList[index]['name'] = formName;
                        fList[index]['request_id'] = recipientIds;
                        fList[index]['request_display'] = requestDisplay;
                        fList[index]['questions'] = formQuestions;
                    }
                } else {
                    fList.push({
                        id: response.data.id,
                        name: formName,
                        request_id: recipientIds,
                        request_display: requestDisplay,
                        questions: formQuestions
                    });
                }

                let frmObj = {
                    id: 0,
                    request_id: 0,
                    form_name: '',
                    form_questions: []
                };
                props.setRequestFormData(frmObj);

                props.setFormList(fList);

                props.setLoading(false);
                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    }

    const handleFormRequestRecipient = (options) => {
        let checkEveryone = options.findIndex(x => parseFloat(x.value) === 0);
        if (checkEveryone > -1) {
            setFormRequestId([EVERY_ONE_OBJECT]);
        } else {
            if (props.recipientsList.length === options.length) {
                setFormRequestId([EVERY_ONE_OBJECT]);
            } else {
                setFormRequestId(options);
            }
        }
    };

    function onAddField(e, type) {
        setPreviewContent('');
        setPreviewButtonText('Preview');

        e.preventDefault();
        let list = [...formQuestions];

        let options = [];
        if (type === 4 || type === 5) {
            for (let i = 1; i <= 3; i++) {
                options.push({
                    id: 0,
                    name: ''
                });
            }
        }

        list.push({
            id: 0,
            type: type,
            name: '',
            sub_label: '',
            is_show: false,
            options: options,
            select_options: ''
        });
        setFormQuestions(list);
    }

    function handleFieldInput(e, index) {
        e.preventDefault();
        let list = [...formQuestions];
        list[index].name = e.target.value;
        setFormQuestions(list);
    }

    function handleSubLabel(e, index) {
        e.preventDefault();
        let list = [...formQuestions];
        list[index].sub_label = e.target.value;
        setFormQuestions(list);
    }

    function onAddFieldOption(e, index) {
        e.preventDefault();
        let list = [...formQuestions];
        list[index].options.push({
            id: 0,
            name: ''
        });
        setFormQuestions(list);
    }

    const showDatePlaceholder = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['text'];
        }
        return value;
    };

    function onRemoveFieldOption(e, index, idx, data) {
        e.preventDefault();
        let list = [...formQuestions];
        list[index].options.splice(idx, 1);
        setFormQuestions(list);
        if (data.id > 0) {
            let rmOptionIds = [...removeOptionId];
            rmOptionIds.push(data.id);
            setRemoveOptionId(rmOptionIds);
        }
    }

    function handleOptionInput(e, index, idx) {
        e.preventDefault();
        let list = [...formQuestions];
        list[index].options[idx].name = e.target.value;
        setFormQuestions(list);
    }

    const handleSelectBox = (e, index) => {
        e.preventDefault();
        let list = [...formQuestions];
        list[index].is_show = true;
        setFormQuestions(list);
    };

    const handleSelectBoxHide = (e, index) => {
        e.preventDefault();
        let list = [...formQuestions];

        let existOptions = list[index].options;
        let value = list[index].select_options;
        if (value) {
            let split = value.split('\n');
            let options = [];
            for (let i = 0; i < split.length; i++) {
                if (split[i].trim()) {
                    let id = 0;
                    if (existOptions[i] && existOptions[i]['id']) {
                        id = parseInt(existOptions[i]['id']);
                    }
                    options.push({
                        id: id,
                        name: split[i].trim()
                    });
                }
            }

            if (split.length < existOptions.length) {
                let rmOptionIds = [...removeOptionId];
                for (let i = split.length; i < existOptions.length; i++) {
                    if (existOptions[i]['id']) {
                        if (parseInt(existOptions[i]['id']) > 0) {
                            rmOptionIds.push(parseInt(existOptions[i]['id']));
                        }
                    }
                }
                setRemoveOptionId(rmOptionIds);
            }
            list[index].options = options;
        }

        list[index].is_show = false;
        setFormQuestions(list);
    };

    const handleSelectOption = (e, index) => {
        e.preventDefault();
        let list = [...formQuestions];

        list[index].select_options = e.target.value;
        setFormQuestions(list);
    };

    function onRemoveField(e, index, data) {
        e.preventDefault();
        let list = [...formQuestions];
        list.splice(index, 1);
        setFormQuestions(list);
        if (data.id > 0) {
            let rmQuestionIds = [...removeQuestionId];
            rmQuestionIds.push(data.id);
            setRemoveQuestionId(rmQuestionIds);
        }
    }


    function togglePreview() {
        let list = [...formQuestions];
        if(list.length > 0){

            setPreviewContent("");
            if (previewButtonText === "Preview") {
                let blankNameRecord = list.some(item => (item.name === "" && item.type !== 7) );
                if(blankNameRecord){
                    toast.error("Please enter the field name.");
                    return false;
                }

                setPreviewButtonText("Turn Off Preview");
                
                // Create preview content based on formQuestions
                const previewElements = list.map((item, index) => (
                    <div key={index} className="mb-4">
                        <label className="form-label mb-2">{item.name}</label>
                        {item.type === 1 &&
                            <input type="text" disabled={true} className="form-control"/>
                        }
                        {item.type === 2 &&
                            <textarea className="form-control" value="" disabled={true} rows="3"/>
                        }
                        {item.type === 3 &&
                        <select className="form-select" value="" disabled={true}>
                            <option value="">Please select</option>
                        </select>
                        }
                        {item.type === 4 && (
                            <>
                                {item.options.map((option, o) => (
                                    <div key={o} className="form-check">
                                        <input type="radio"
                                                disabled={true}
                                                name={`radio_option_${index}`}
                                                value={option.id}
                                                id={`radio_option_${index}_${o}`}
                                                className="form-check-input"/>
                                        <label
                                            htmlFor={`radio_option_${index}_${o}`}
                                            className="form-check-label">{option.name}</label>
                                    </div>
                                ))}
                            </>
                        )}
                        {item.type === 5 && (
                            <>
                                {item.options.map((option, o) => (
                                    <div key={o} className="form-check">
                                        <input type="checkbox"
                                                disabled={true}
                                                value={option.id}
                                                checked={option.checked}
                                                id={`checkbox_option_${index}_${o}`}
                                                className="form-check-input"/>
                                        <label
                                            htmlFor={`checkbox_option_${index}_${o}`}
                                            className="form-check-label">{option.name}</label>
                                    </div>
                                ))}
                            </>
                        )}
                        {item.type === 6 && (
                            <>
                            <div className="card p-2 w-100">
                                <div className="drag-area">
                                    <div className="icon">
                                        <i className="fa fa-cloud-upload"
                                            aria-hidden="true"/>
                                    </div>
                                    <h5>Drag &amp; Drop to Upload File here
                                        or click
                                        to
                                        upload</h5>
                                </div>
                            </div>
                            </>
                        )}
                        {item.type === 7 && (
                            <>
                                <div className="mb-0" dangerouslySetInnerHTML={{__html: item.select_options}} />
                            </>
                        )}

                        {item.type === 8 &&
                        <div className="">
                            <div className="position-relative">
                                <DatePicker
                                    ref={dateRef}
                                    className="form-control"
                                    placeholderText={showDatePlaceholder(2)}
                                    disabled/>
                                <i className="fa fa-calendar" style={{top: "15px"}}
                                onClick={(e) => dateRef?.current.setFocus(true)}/>
                            </div>
                        </div>
                        }

                        <div className="mt-2">{item.sub_label}</div>
                    </div>
                ));
                
                // Set the generated preview content
                setPreviewContent(previewElements);
            }else{
                setPreviewButtonText("Preview");
            }
        }else{
            toast.error(
                "Please select any one form field."
            );
            return false;
        }
    }


    function handleModelChange(value, index){
        const updatedQuestions = [...formQuestions];
        updatedQuestions[index].select_options = value;
        setFormQuestions(updatedQuestions);
    }
    
    useEffect(() => {
        const offcanvasElement = document.getElementById('ManageRequestForm');
    
        const handleShown = () => {
            setPreviewContent('');
            setPreviewButtonText('Preview');
        };
    
        const handleHidden = () => {
            setPreviewContent('');
            setPreviewButtonText('Preview');
        };
    
        offcanvasElement.addEventListener('shown.bs.offcanvas', handleShown);
        offcanvasElement.addEventListener('hidden.bs.offcanvas', handleHidden);
    
        return () => {
          offcanvasElement.removeEventListener('shown.bs.offcanvas', handleShown);
          offcanvasElement.removeEventListener('hidden.bs.offcanvas', handleHidden);
        };
    }, []);

    return (
        <div className="offcanvas offcanvas-end AddDocument MakeForm" data-bs-scroll="true" data-bs-backdrop="static"
             data-bs-keyboard="false" tabIndex="-1" id="ManageRequestForm" aria-labelledby="ManageRequestFormLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title"
                    id="ManageRequestFormLabel">{formId > 0 ? `Edit Form` : `Create Form`}</h5>
                <button type="button" ref={clsFormButtonRef} className="btn close_btn text-reset"
                        data-bs-dismiss="offcanvas" onClick={clearForm} aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body p-0 " style={{overflowX: 'hidden'}}>
                <div className="row">
                    <div className="col-lg-3 py-0">
                        <ul className="left_canvas border-end ">
                            {FORM_OPTIONS && FORM_OPTIONS.map((item, index) =>
                                <li key={index} onClick={(event) => onAddField(event, item.type)}
                                    className="background_grey_400" style={{cursor: 'pointer'}}>
                                        <span className="icon_wrap">
                                            <img src={`/images/${item.icon}`} alt={item.name}/>{item.name}
                                        </span>
                                </li>
                            )}
                        </ul>
                        <div className="accordion ps-2" id="">
                            <div className="accordion-item bg-blue mb-3">
                                <h2 className="accordion-header" id="RequestField">
                                    <button className="accordion-button bg-blue" type="button"
                                            data-bs-toggle="collapse" data-bs-target="#RequestFieldMessage"
                                            aria-expanded="true" aria-controls="RequestFieldMessage">
                                        Request Information From
                                        <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                           data-toggle="tooltip" data-placement="right"
                                           title="Select the recipient's name from whom you want to collect information."/>
                                    </button>
                                </h2>
                                <div id="RequestFieldMessage" className="accordion-collapse collapse show"
                                     aria-labelledby="RequestField" data-bs-parent="#AdditionalField">
                                    <div className="accordion-body pt-0">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div>
                                                    <Select closeMenuOnSelect={true} value={formRequestId}
                                                            components={animatedComponents} isMulti
                                                            onChange={handleFormRequestRecipient}
                                                            options={formRecipients}/>
                                                    {errors.recipients &&
                                                    <div className="text-danger">{errors.recipients}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item bg-blue">
                                <h2 className="accordion-header" id="typeNote">
                                    <button className="accordion-button bg-blue" type="button"
                                            data-bs-toggle="collapse" data-bs-target="#typeNoteMessage"
                                            aria-expanded="true" aria-controls="typeNoteMessage">
                                         Enter Form Name
                                        <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                           data-toggle="tooltip" data-placement="right"
                                           title="Give any name to Information list."/>
                                    </button>
                                </h2>
                                <div id="typeNoteMessage" className="accordion-collapse collapse show"
                                     aria-labelledby="typeNote" data-bs-parent="#AdditionalField">
                                    <div className="accordion-body pt-1">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div>
                                                    <input type="text" className="form-control" value={formName}
                                                           onChange={(e) => setFormName(e.target.value)}
                                                           placeholder="Enter Form Name"/>
                                                    {errors.form_name &&
                                                    <div className="text-danger">{errors.form_name}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div className="accordion ps_sm_4 px-4 mt-3" id="AdditionalField">
                            {/* <div className="accordion-item bg-blue mb-3">
                                <h2 className="accordion-header" id="RequestField">
                                    <button className="accordion-button bg-blue" type="button"
                                            data-bs-toggle="collapse" data-bs-target="#RequestFieldMessage"
                                            aria-expanded="true" aria-controls="RequestFieldMessage">
                                        Request Information From
                                        <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                           data-toggle="tooltip" data-placement="right"
                                           title="Select the recipient's name from whom you want to collect information."/>
                                    </button>
                                </h2>
                                <div id="RequestFieldMessage" className="accordion-collapse collapse show"
                                     aria-labelledby="RequestField" data-bs-parent="#AdditionalField">
                                    <div className="accordion-body pt-0">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div>
                                                    <Select closeMenuOnSelect={true} value={formRequestId}
                                                            components={animatedComponents} isMulti
                                                            onChange={handleFormRequestRecipient}
                                                            options={formRecipients}/>
                                                    {errors.recipients &&
                                                    <div className="text-danger">{errors.recipients}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item bg-blue">
                                <h2 className="accordion-header" id="typeNote">
                                    <button className="accordion-button bg-blue" type="button"
                                            data-bs-toggle="collapse" data-bs-target="#typeNoteMessage"
                                            aria-expanded="true" aria-controls="typeNoteMessage">
                                        Enter Information Name
                                        <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                           data-toggle="tooltip" data-placement="right"
                                           title="Give any name to Information list."/>
                                    </button>
                                </h2>
                                <div id="typeNoteMessage" className="accordion-collapse collapse show"
                                     aria-labelledby="typeNote" data-bs-parent="#AdditionalField">
                                    <div className="accordion-body pt-1">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div>
                                                    <input type="text" className="form-control" value={formName}
                                                           onChange={(e) => setFormName(e.target.value)}
                                                           placeholder="Enter Information Name"/>
                                                    {errors.form_name &&
                                                    <div className="text-danger">{errors.form_name}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {previewContent === "" ? (
                            <div>
                                {formQuestions.map((item, index) =>
                                    <div key={index} className="d-flex align-items-center pe-3 box-item">
                                        <div className="card my-3 w-100">
                                            <div className={`d-flex align-items-center mb-3 ${item.type === 7 ? 'pt-3' : 'pt-3'}`}>
                                                <img src="/images/dots_rectangle.png"
                                                onDragStart={(e) => questionDragStart(e, index)} draggable
                                                onDragEnter={(e) => questionDragEnter(e, index)} onDragEnd={questionDrop}
                                                alt="img" className="me-3"/>
                                                {item.type !== 7 && (
                                                <input type="text" value={item.name} className="border-0 mb-0 p-0 w-100 rubik-semi-bold"
                                                    onChange={(e) => handleFieldInput(e, index)}
                                                    placeholder={`${item.type === 7 ? `Enter Comments Title` : `Type a Question`}`}/>
                                                )}
                                            </div>
                                            {item.error && <div className="text-danger mb-1">{item.error}</div>}

                                            {item.type === 1 && (
                                                <input type="text" className="form-control mb-1" readOnly
                                                    onChange={(e) => console.log(e)}/>
                                            )}

                                            {item.type === 2 && (
                                                <textarea className="form-control mb-1 me-2" rows="3" readOnly
                                                        onChange={(e) => console.log(e)} style={{height: 'unset'}}/>
                                            )}

                                            {item.type === 3 && (
                                                <>
                                                    {/* <img src="/images/select-dropdown.png"
                                                        onClick={(e) => handleSelectBox(e, index)} alt="..."/> */}
                                                    <select className="form-builder-dropdown" readOnly={true} name="" id=""  onClick={(e) => handleSelectBox(e, index)}>
                                                        <option value="">Please select</option>
                                                    </select>

                                                    {item.is_show && (
                                                            <textarea placeholder="Please enter each options in a separate line" className="form-control mb-1 me-2" rows="5"
                                                            value={item.select_options}
                                                            onChange={(e) => handleSelectOption(e, index)}
                                                            style={{height: 'unset'}}/>
                                                    )}
                                                </>
                                            )}

                                            {item.type > 3 && item.type < 6 && (
                                                <>
                                                    {item.options.map((option, idx) =>
                                                        <div key={idx} className="row">
                                                            <div className="col-md-1 pe-0 text-center">
                                                                {item.type === 4 && (
                                                                    <input className="form-check-input" type="radio"/>
                                                                )}
                                                                {item.type === 5 && (
                                                                    <input className="form-check-input" type="checkbox"/>
                                                                )}
                                                            </div>
                                                            <div className="col-md-10 ps-0">
                                                                <input type="text" value={option.name}
                                                                    placeholder={`Type Option ${idx + 1}`}
                                                                    onChange={(e) => handleOptionInput(e, index, idx)}
                                                                    className="border-0 mb-0 p-0 w-100"
                                                                    style={{height: '25px'}}/>
                                                                {option.error &&
                                                                <div className="text-danger">{option.error}</div>}
                                                            </div>
                                                            <div className="col-md-1">
                                                                <i onClick={(e) => onRemoveFieldOption(e, index, idx, option)}
                                                                className="fa fa-remove"/>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {item.type === 6 && (
                                                <div className="drag-area">
                                                    <div className="icon">
                                                        <i className="fa fa-cloud-upload" aria-hidden="true"/>
                                                    </div>
                                                    <h5>Drag & Drop to Upload File here or click to upload</h5>
                                                </div>
                                            )}
                                            {item.type > 3 && item.type < 6 && (
                                                <span className="edit_option mt-2 mb-3"
                                                    onClick={(e) => onAddFieldOption(e, index)}
                                                    style={{cursor: 'pointer'}}>Add option</span>
                                            )}

                                            {item.type === 3 && (
                                                <>
                                                    {item.is_show === false && (
                                                        <span className="edit_option mt-2 mb-3"
                                                            onClick={(e) => handleSelectBox(e, index)}
                                                            style={{cursor: 'pointer'}}>Edit option</span>
                                                    )}
                                                    {item.is_show === true && (
                                                        <span className="edit_option mt-2 mb-3"
                                                            onClick={(e) => handleSelectBoxHide(e, index)}
                                                            style={{cursor: 'pointer'}}>Save option</span>
                                                    )}
                                                </>
                                            )}

                                            {item.type === 7 && (
                                                <div className="mb-2 mt-2" style={{ height: '200px' }}>
                                                    <ReactQuill
                                                        value={item.select_options}
                                                        onChange={(value) => handleModelChange(value, index)}
                                                        modules={QUILL_MODULES}
                                                        formats={QUILL_FORMATS}
                                                        placeholder="Enter your comments here"
                                                        style={{ maxHeight:'160px', height: '100%', display: 'flex', flexDirection: 'column' }}
                                                    />
                                                </div>

                                                // <CKEditor
                                                //     editor={ClassicEditor}
                                                //     data={item.select_options}
                                                //     config={{placeholder: "Enter your comments here"}}
                                                //     onReady={editor => {
                                                //         editor.editing.view.change((writer) => {
                                                //             writer.setStyle(
                                                //                 "height",
                                                //                 "200px",
                                                //                 editor.editing.view.document.getRoot()
                                                //             );
                                                //         });
                                                //     }}
                                                //     onChange={(event, editor) => {
                                                //         const data = editor.getData();
                                                //         let list = [...formQuestions];
                                                //         list[index].select_options = data;
                                                //         setFormQuestions(list);
                                                //     }}
                                                //     onBlur={(event, editor) => {
                                                //     }}
                                                //     onFocus={(event, editor) => {
                                                //     }}
                                                // />
                                            )}

                                            {item.type === 8 &&
                                            <div
                                                className="position-relative">
                                                <DatePicker
                                                    className="form-control mt-3"
                                                    // selected={date}
                                                    // onChange={(date) => setDate(date)}
                                                    ref={dateRef}
                                                    placeholderText={showDatePlaceholder(2)}
                                                    disabled
                                                />
                                                <i className="fa fa-calendar" style={{top: "30px"}}
                                                onClick={(e) => dateRef?.current.setFocus(true)}/>
                                            </div>
                                            }
                                            {item.type !== 7 && (
                                                <input type="text" value={item.sub_label}
                                                    className="form-control sub_total ps-0"
                                                    onChange={(e) => handleSubLabel(e, index)}
                                                    placeholder="Enter Question help text here"/>
                                            )}
                                        </div>
                                        <i className="fa fa-trash ms-2" onClick={(e) => onRemoveField(e, index, item)}
                                        aria-hidden="true"/>
                                    </div>
                                )}
                            </div>
                            ):(
                                <div className="form-preview">
                                   {previewContent}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="modal-footer  mb-0">
                    <button
                        type="button"
                        onClick={togglePreview}
                        className="toggle_btn_preview"
                    >
                        <strong><i className="fa fa-eye"></i> {previewButtonText}</strong>
                    </button>

                    <button type="button" onClick={onCloseForm} className="btn grey_btn_outline">Cancel</button>
                    {formId === 0 &&
                    <button type="button" onClick={onSaveAddForm} className="btn modal_btn_outline">Save & Add
                        Another
                    </button>}
                    <button type="button" onClick={onSaveForm} className="btn modal_btn">Save</button>
                </div>
            </div>
        </div>
    );
}

export default AdminManageForm;