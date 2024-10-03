import React, {useEffect, useRef, useState} from "react";
import DatePicker from "react-datepicker";
import {DATE_FORMAT_LIST} from "../../../../configs/AppConfig";
import Utils from "../../../../utils";

function DocumentsAndForm(props) {
    const [contactName, setContactName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [envelopeName, setEnvelopeName] = useState("");
    const [documentList, setDocumentList] = useState([]);
    const [requestFormList, setRequestFormList] = useState([]);
    const [signDocumentList, setSignDocumentList] = useState([]);
    const [isEnvelopeEdit, setIsEnvelopeEdit] = useState(false);
    const dateRef = useRef(null);

    useEffect(function () {
        if (props.envelopeData?.id > 0) {
            setContactName(props.envelopeData.contact_detail.first_name + " " + props.envelopeData.contact_detail.last_name);
            setCompanyName(props.envelopeData.contact_detail.company_name);
            setEnvelopeName(props.envelopeData.envelope_name);
            setDocumentList(props.envelopeData.document_list);
            setRequestFormList(props.envelopeData.request_form_list);
            setSignDocumentList(props.envelopeData.sign_document_list);
            setIsEnvelopeEdit(props.envelopeData.isEnvelopeEdit);
        }
    }, [props.envelopeData]);

    const handleDownload = async (e, data) => {
        e.preventDefault();

        await Utils.downloadAnyFile(data.file_path, data.file_name);
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
                                                                        className="download_box text_blue me-2">{doc.name} ({doc.kb} KB)</span>
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
                                                                    <div className="col-md-3">
                                                                        <DatePicker
                                                                            selected={showDate(item.date_format_text)}
                                                                            dateFormat={showDateFormat(item.date_format)}
                                                                            className="form-control"
                                                                            disabled={!item.is_edit}
                                                                            placeholderText={showDatePlaceholder(item.date_format)}
                                                                            onChange={(date) => handleDateFormat(date, index)}/>
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
                                                                          value={item.notes} disabled={true}
                                                                          placeholder="Write a Note"/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {item.is_edit &&
                                            <>
                                                <button type="button" className="btn modal_btn_outline mt-4">Cancel
                                                </button>
                                                <button type="button" className="btn modal_btn mt-4">Save</button>
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
                                                        {item.questions.map((question, q) => (
                                                            <div key={q} className="mb-4">
                                                                <label
                                                                    className="form-label mb-2">{question.name}</label>
                                                                {question.type === 1 && (
                                                                    <input type="text" value={question.selected_answer}
                                                                           disabled={true} className="form-control"/>
                                                                )}
                                                                {question.type === 2 && (
                                                                    <textarea className="form-control"
                                                                              value={question.selected_answer}
                                                                              disabled={true} rows="3"/>
                                                                )}
                                                                {question.type === 3 &&
                                                                <select className="form-select"
                                                                        value={question.selected_answer}
                                                                        disabled={true}>
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
                                                                                       disabled={true}
                                                                                       name={`radio_option_${index}`}
                                                                                       checked={parseInt(question.selected_answer) === parseInt(option.id)}
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
                                                                {question.type === 5 && (
                                                                    <>
                                                                        {question.answers.map((option, o) => (
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
                                                                {question.type === 6 && (
                                                                    <>
                                                                        {question.selected_answer &&
                                                                        <div className="mb-3 download_document">
                                                                                <span
                                                                                    className="download_box text_blue me-2">{question.selected_answer.name} ({question.selected_answer.kb} KB)
                                                                                </span>
                                                                        </div>
                                                                        }
                                                                        <div className="card p-2 w-100">
                                                                            <div className="drag-area">
                                                                                <div className="icon">
                                                                                    <i className="fa fa-cloud-upload"
                                                                                       aria-hidden="true"/>
                                                                                </div>
                                                                                <h5>Drag &amp; Drop to Upload File here
                                                                                    or click to upload</h5>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {question.type === 7 && (
                                                                    <>
                                                                        <div className="mb-2"
                                                                             dangerouslySetInnerHTML={{__html: question.que_comment}}/>
                                                                        <input type="text"
                                                                               value={question.selected_answer}
                                                                               disabled={true}
                                                                               className="form-control"/>
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
                                                                        ref={dateRef}
                                                                        readOnly={true}
                                                                    />
                                                                    <i className="fa fa-calendar" style={{top: "15px"}}
                                                                       onClick={(e) => dateRef?.current.setFocus(true)}/>
                                                                </div>
                                                                }
                                                                <div className="mt-1">{question.sub_label}</div>
                                                            </div>
                                                        ))}
                                                    </>
                                                    :
                                                    <>
                                                        <textarea className="form-control" value={item.selected_answer}
                                                                  disabled={true} rows="3"/>
                                                    </>
                                                }
                                            </div>

                                            {item.is_edit &&
                                            <div className="modal-footer mt-3 p-0 ">
                                                <button type="button" className="btn modal_btn_outline mt-4">Cancel
                                                </button>
                                                <button type="button" className="btn modal_btn mt-4">Save</button>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </>
                    }

                    {signDocumentList.length > 0 &&
                    <>
                        <h2 className="main_title text_blue mb-2 mt-3 ps-0">Sign Documents</h2>
                        {signDocumentList.map((item, index) =>
                            <React.Fragment key={index}>
                                <div className="accordion-item background_grey_400 c-sign-document-wrapper">
                                    <h2 className="accordion-header " id={`signAccordion_${index}`}>
                                        <button className="accordion-button background_grey_400" type="button"
                                                data-bs-toggle="collapse" data-bs-target={`#sign_accordion_${index}`}
                                                aria-expanded="true" aria-controls={`sign_accordion_${index}`}>
                                            {item.doc_name}
                                        </button>
                                        <span data-bs-toggle="collapse" data-bs-target={`#sign_accordion_${index}`}
                                              className={item.status_id === 1 ? `bg_light_blue` : item.status_id === 2 ? `bg_light_yellow` : item.status_id === 3 ? `bg_light_green` : `bg_light_ping`}>{item.status_name}</span>
                                    </h2>
                                    <div id={`sign_accordion_${index}`} className="accordion-collapse collapse"
                                         aria-labelledby={`sign_accordion_${index}`}>
                                        <div className="accordion-body pt-0 px-0">
                                            {item.status_id === 4 && item.reason_notes &&
                                            <div className="rejected_note mx-3 mb-3">
                                                <p>{item.reason_notes}</p>
                                                <span className="side_image">
                                                <img src="/images/note.png" alt="..."/>
                                            </span>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </>
                    }


                    <div className="d-flex align-items-center justify-content-center mt-4 accordion_primary_btn">
                        {isEnvelopeEdit &&
                        <button type="button" className="btn btn-primary">Finish & Send</button>
                        }
                    </div>
                </div>
            </div>


        </div>
    );
}

export default DocumentsAndForm;