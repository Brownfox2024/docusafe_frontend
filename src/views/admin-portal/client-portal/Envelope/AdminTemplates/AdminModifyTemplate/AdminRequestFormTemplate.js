import React, {useEffect, useState, useRef} from "react";
import {toast} from "react-toastify";
import {DATE_FORMAT_LIST, FORM_OPTIONS, QUILL_MODULES, QUILL_FORMATS} from "../../../../../../configs/AppConfig";
// import {CKEditor} from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DatePicker from "react-datepicker";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the Quill stylesheet

function AdminRequestFormTemplate(props) {
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [formQuestions, setFormQuestions] = useState([]);
    const [removeQuestionId, setRemoveQuestionId] = useState([]);
    const [removeOptionId, setRemoveOptionId] = useState([]);

    const [previewButtonText, setPreviewButtonText] = useState("Preview");
    const [previewContent, setPreviewContent] = useState("");

    let errorsObj = {
        form_name: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsFormModelRef = useRef(null);
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

    useEffect(function () {
        setId(props.formData.id);
        setName(props.formData.name);
        setFormQuestions(props.formData.questions);
        setRemoveQuestionId(props.formData.remove_question_ids);
        setRemoveOptionId(props.formData.remove_option_ids);
    }, [props.formData]);

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

    function handleOptionInput(e, index, idx) {
        e.preventDefault();
        let list = [...formQuestions];
        list[index].options[idx].name = e.target.value;
        setFormQuestions(list);
    }

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

    const closeRequestFormModel = (e) => {
        e.preventDefault();

        props.setFormData({
            type: 'create',
            id: 0,
            name: '',
            questions: [],
            remove_question_ids: [],
            remove_option_ids: []
        });
        setErrors(errorsObj);
    };

    const handleFormModify = (e, type) => {
        e.preventDefault();
        e.preventDefault();
        let error = false;
        let errorObj = {...errorsObj};

        let formList = [...props.requestFormList];

        let list = [...formQuestions];
        if (!name) {
            errorObj.form_name = 'The name must be required';
            error = true;
        } else if (props.formData.type === 'create') {
            let index = formList.findIndex(x => x.name === name.trim());
            if (index > -1) {
                errorObj.form_name = 'The name Already exist.';
                error = true;
            }
        }
        if (name && list.length === 0) {
            toast.error('Please add any one option');
            error = true;
        }
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (!list[i].name) {
                    if(list[i].type !== 7){
                        list[i].error = "This field is required";
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
                            list[i].options[j].error = "Please add option";
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

        let obj = {
            id: id,
            name: name,
            questions: formQuestions,
            remove_question_ids: removeQuestionId,
            remove_option_ids: removeOptionId
        };

        if (props.formData.type === 'create') {
            formList.push(obj);
        } else {
            let index = formList.findIndex(x => x.name === props.formData.name);
            if (index > -1) {
                formList[index] = obj;
            }
        }
        props.setRequestFormList(formList);

        closeRequestFormModel(e);
        if (type === 2) {
            clsFormModelRef?.current.click();
        }
    };

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

    const showDatePlaceholder = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['text'];
        }
        return value;
    };


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
        const offcanvasElement = document.getElementById('MakeForm');
    
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
        <div className="offcanvas offcanvas-end AddDocument MakeForm" data-bs-scroll="true" tabIndex="-1" id="MakeForm"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="MakeFormLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title"
                    id="MakeFormLabel">{props.formData.type === 'create' ? `Create Form` : `Edit Form`}</h5>
                <button type="button" className="btn close_btn text-reset" ref={clsFormModelRef}
                        onClick={closeRequestFormModel} data-bs-dismiss="offcanvas" aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body p-0" style={{overflowX: 'hidden'}}>
                <div className="row">
                    <div className="col-lg-3 py-0">
                        <ul className="left_canvas border-end ">
                            {FORM_OPTIONS.map((item, index) =>
                                <li key={index} onClick={(event) => onAddField(event, item.type)}
                                    className="background_grey_400" style={{cursor: 'pointer'}}>
                                        <span className="icon_wrap">
                                            <img src={`/images/${item.icon}`} alt={item.name}/>{item.name}
                                        </span>
                                </li>
                            )}
                        </ul>
                        <div className="accordion-item bg-blue ps-2 step_wizard_content">
                            <h2 className="accordion-header" id="typeNote">
                                <button className="accordion-button bg-blue" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#typeNoteMessage" aria-expanded="true"
                                        aria-controls="typeNoteMessage">
                                    Enter Form Name
                                    <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                        data-toggle="tooltip" data-placement="right"
                                        title="Give any name to Information list."/>
                                </button>
                            </h2>
                            <div id="typeNoteMessage" className="accordion-collapse collapse show"
                                    aria-labelledby="typeNoteMessage" data-bs-parent="#typeNoteMessage">
                                <div className="accordion-body pt-0">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div>
                                                <input type="text" placeholder="Enter Form Name" value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="form-control mt-1"/>
                                                {errors.form_name &&
                                                <div className="text-danger">{errors.form_name}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div className="accordion ps_sm_4 pe-4 mt-3" id="AdditionalField">
                            
                            {previewContent === "" ? (
                                <div className="step_wizard_content">
                                    {formQuestions.map((item, index) =>
                                        <div key={index} className="d-flex align-items-center pe-3 box-item">
                                            <div className="card my-3 w-100">
                                                <div className={`d-flex align-items-center mb-2 ${item.type === 7 ? 'pt-3' : ''}`}>
                                                    <img src="/images/dots_rectangle.png" style={{cursor: "grab"}}
                                                    onDragStart={(e) => questionDragStart(e, index)} draggable
                                                    onDragEnter={(e) => questionDragEnter(e, index)} onDragEnd={questionDrop} alt="img" className="me-3"/>
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
                                                {item.type === 8 && (
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
                                                )}
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

                    <button type="button" onClick={closeRequestFormModel} className="btn grey_btn_outline"
                            data-bs-dismiss="offcanvas">Cancel
                    </button>
                    {props.formData.type === 'create' &&
                    <button type="button" onClick={(e) => handleFormModify(e, 1)} className="btn modal_btn_outline">Save
                        & Add Another
                    </button>
                    }
                    <button type="button" onClick={(e) => handleFormModify(e, 2)} className="btn modal_btn">Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminRequestFormTemplate;