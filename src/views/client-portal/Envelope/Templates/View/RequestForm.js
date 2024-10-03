import React, {useEffect, useState, useRef} from "react";
import {FORM_OPTIONS} from "../../../../../configs/AppConfig";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function RequestForm(props) {
    const [name, setName] = useState('');
    const [questions, setQuestions] = useState([]);

    let errorsObj = {
        form_name: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsFormModelRef = useRef(null);

    useEffect(function () {
        setName(props.formData.name);
        setQuestions(props.formData.questions);
    }, [props.formData]);

    const closeRequestFormModel = (e) => {
        e.preventDefault();

        props.setFormData({
            id: 0,
            name: '',
            questions: []
        });
        setErrors(errorsObj);
    };

    return (
        <div className="offcanvas offcanvas-end AddDocument MakeForm" data-bs-scroll="true" tabIndex="-1" id="MakeForm"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="MakeFormLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title"
                    id="MakeFormLabel">View Information</h5>
                <button type="button" className="btn close_btn text-reset" ref={clsFormModelRef}
                        onClick={closeRequestFormModel} data-bs-dismiss="offcanvas" aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body p-0" style={{overflowX: 'hidden'}}>
                <div className="row">
                    {questions.length > 0 && (
                        <div className="col-lg-3 py-0">
                            <ul className="left_canvas border-end ">
                                {FORM_OPTIONS.map((item, index) =>
                                    <li key={index} className="background_grey_400" style={{cursor: 'pointer'}}>
                                        <span className="icon_wrap">
                                            <img src={`/images/${item.icon}`} alt={item.name}/>{item.name}
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                    <div className={`${questions.length === 0 ? `col-lg-12` : `col-lg-9`}`}>
                        <div className="accordion m-3" id="AdditionalField">
                            <div className="accordion-item bg-blue">
                                <h2 className="accordion-header" id="typeNote">
                                    <button className="accordion-button bg-blue" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#typeNoteMessage" aria-expanded="true"
                                            aria-controls="typeNoteMessage">
                                        Type a Question
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
                                                    <input type="text" placeholder="Enter Question" value={name}
                                                           onChange={(e) => setName(e.target.value)} readOnly
                                                           className="form-control"/>
                                                    {errors.form_name &&
                                                    <div className="text-danger">{errors.form_name}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {questions.map((item, index) =>
                                <div key={index} className="d-flex align-items-center pe-3">
                                    <div className="card my-3 w-100">
                                        <div className="d-flex align-items-center mb-2">
                                            <img src="/images/dots_rectangle.png" alt="img" className="me-3"/>
                                            <input type="text" value={item.name} className="border-0 mb-0 p-0 w-100"
                                                   disabled={true}
                                                   placeholder={`${item.type === 7 ? `Enter Comments Title` : `Type a Question`}`}/>
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
                                                <img src="/images/select-dropdown.png" alt="..."/>
                                                {item.is_show && (
                                                    <textarea className="form-control mb-1 me-2" rows="5"
                                                              value={item.select_options}
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
                                                                   readOnly={true}
                                                                   className="border-0 mb-0 p-0 w-100"
                                                                   style={{height: '25px'}}/>
                                                            {option.error &&
                                                            <div className="text-danger">{option.error}</div>}
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

                                        {item.type === 7 && (
                                            <CKEditor
                                                editor={ClassicEditor}
                                                disabled={true}
                                                data={item.select_options}
                                                config={{placeholder: "Enter your comments here"}}
                                                onReady={editor => {
                                                    editor.editing.view.change((writer) => {
                                                        writer.setStyle(
                                                            "height",
                                                            "200px",
                                                            editor.editing.view.document.getRoot()
                                                        );
                                                    });
                                                }}
                                                onChange={(event, editor) => {

                                                }}
                                                onBlur={(event, editor) => {
                                                }}
                                                onFocus={(event, editor) => {
                                                }}
                                            />
                                        )}
                                        {item.type !== 7 && (
                                            <input type="text" value={item.sub_label}
                                                   className="form-control sub_total ps-0"
                                                   placeholder="Enter Question help text here"/>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="modal-footer  mb-0">
                    <button type="button" onClick={closeRequestFormModel} className="btn grey_btn_outline"
                            data-bs-dismiss="offcanvas">Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RequestForm;