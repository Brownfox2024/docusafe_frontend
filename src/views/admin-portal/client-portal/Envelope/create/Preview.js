import React, {useState, useEffect, useRef} from "react";
import {getFaqList} from "../../../../../services/CommonService";
import DatePicker from "react-datepicker";
import {DATE_FORMAT_LIST} from "../../../../../configs/AppConfig";

const messageList = [];

function AdminEnvelopePreview(props) {
    const [dueDay, setDueDay] = useState(0);
    const [faqList, setFaqList] = useState([]);
    const [youTube, setYouTube] = useState('');
    const [totalDocs, setTotalDocs] = useState(0);
    const [userDetail, setUserDetail] = useState({
        full_name: '',
        company: '',
        icon: '',
        address: '',
        email: '',
        phone: '',
        web_site: ''
    });
    const [date, setDate] = useState(new Date());

    const dateRef = useRef(null);

    useEffect(function () {
        getFaqList()
            .then(response => {
                setFaqList(response.data.faqs);
                setYouTube(response.data.youtube);
            })
            .catch(err => {
            });
    }, []);

    useEffect(function () {
        let date1 = new Date();
        let diffDays = 0;
        if (props?.formObj?.envelope_date) {
            let date2 = new Date(props?.formObj?.envelope_date);
            let diffTime = date2.getTime() - date1.getTime();
            diffDays = Math.round(diffTime / (1000 * 3600 * 24));
        }
        setDueDay(diffDays);

        let totalDocuments = 0;

        if (props.formObj.fill_forms) {
            totalDocuments = totalDocuments + props.formObj.fill_forms.length;
        }

        if (props.formObj.documents) {
            totalDocuments = totalDocuments + props.formObj.documents.length;
        }

        setTotalDocs(totalDocuments);

        if (props?.formObj?.sender_id > 0) {
            let index = props.senderList.findIndex(x => parseInt(x.id) === parseInt(props?.formObj?.sender_id));
            if (index > -1) {
                let senderData = props.senderList[index];
                let senderAddress = '';
                if (senderData.address_1) {
                    senderAddress = senderData.address_1;

                    if (senderData.address_2) {
                        senderAddress += ', ' + senderData.address_2;
                    }
                    if (senderData.city) {
                        senderAddress += ', ' + senderData.city;
                    }
                    if (senderData.state) {
                        senderAddress += ', ' + senderData.state;
                    }
                    if (senderData.country_name) {
                        senderAddress += ', ' + senderData.country_name;
                    }
                    if (senderData.zip) {
                        senderAddress += '-' + senderData.zip;
                    }
                }
                let senderFirstLetter = senderData.first_name.charAt(0);
                let senderLastLetter = senderData.last_name.charAt(0);
                let obj = {
                    full_name: senderData.first_name + ' ' + senderData.last_name,
                    company: senderData.company_name,
                    icon: senderFirstLetter + senderLastLetter,
                    address: senderAddress,
                    email: senderData.email,
                    phone: senderData.mobile ? '+' + senderData.country_code + senderData.mobile : '',
                    web_site: senderData?.web_site
                };
                setUserDetail(obj);
            }
        }
    }, [props]);

    const showDatePlaceholder = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['text'];
        }
        return value;
    };

    const showDateFormat = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['format'];
        }
        return value;
    };


    return (
        <div className="modal fade " id="resendEnvelope" tabIndex="-1" aria-labelledby="resendEnvelopeLabel"
             aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header preview-modal-header justify-content-between py-2 flexWrap">
                        <h5 className="modal-title" id="resendEnvelopeLabel">Client Portal Preview</h5>
                        <div className="nav nav-tabs wrap_left flexWrap me-5 pe-5" id="nav-tab" role="tablist">
                            <button className="nav-link active shadow" id="Mobile" data-bs-toggle="tab"
                                    data-bs-target="#MobileView" type="button" role="tab" aria-controls="MobileView"
                                    aria-selected="true">
                                <img src="/images/mobile.png" alt="images"/>
                            </button>
                            <button className="nav-link shadow" id="laptop-tab" data-bs-toggle="tab"
                                    data-bs-target="#laptop" type="button" role="tab" aria-controls="laptop"
                                    aria-selected="false">
                                <img src="/images/laptop.png" alt="..."/>
                            </button>
                            <button className="nav-link shadow" id="desktop-tab" data-bs-toggle="tab"
                                    data-bs-target="#desktop" type="button" role="tab" aria-controls="desktop"
                                    aria-selected="false">
                                <img src="/images/desktop_s.png" alt=".."/>
                            </button>
                        </div>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2 m-0"
                                data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="tab-content pb-2" id="nav-tabContent">
                            <div className="tab-pane fade active show" id="MobileView" role="tabpanel"
                                 aria-labelledby="Mobile">
                                <div className="row">
                                    <div className="col-lg-4"/>
                                    <div className="col-lg-4 mobile_view_portal">
                                        <div className="wrapper clientPortal">
                                            <nav className="navbar navbar-expand-lg py-2 px-3 shadow-sm flex-column">
                                                <span className="navbar-brand" style={{width: '100px'}}>
                                                    <img src="/images/logo.png" className="h-8" alt="..."/>
                                                </span>
                                                <div className="navbar_client">
                                                    <div
                                                        className="d-flex align-items-center w-100 justify-content-center flex_wrap">
                                                        <p className="total_data">Total
                                                            Documents {props.formObj.fill_forms.length > 0 && `& Forms`} {totalDocs}</p>
                                                        <p className="due_days d-flex align-items-center">
                                                            <img src="/images/clock.png" className="me-2"
                                                                 alt="..."/> Due in {dueDay} Days
                                                        </p>
                                                    </div>
                                                </div>
                                            </nav>
                                            <section
                                                className=" background_grey_400 setting_tab client_portal px-2 pb-3">
                                                <div className="nav nav-tabs pt-4" id="nav-tab" role="tablist">
                                                    <button className="nav-link active" id="document-form"
                                                            data-bs-toggle="tab"
                                                            data-bs-target="#document-form-detail" type="button"
                                                            role="tab" aria-controls="document-form-detail"
                                                            aria-selected="true">
                                                        <i className="fa fa-drivers-license-o me-1"
                                                           aria-hidden="true"/>
                                                        Documents {props.formObj.fill_forms.length > 0 && ` & Data`}
                                                    </button>
                                                    <button className="nav-link" id="messages-tab" data-bs-toggle="tab"
                                                            data-bs-target="#messages" type="button" role="tab"
                                                            aria-controls="messages" aria-selected="false">
                                                        <i className="fa fa-comments-o me-1" aria-hidden="true"/>Messages<span
                                                        className="red_dot"/>
                                                    </button>
                                                    <button className="nav-link" id="contact-tab" data-bs-toggle="tab"
                                                            data-bs-target="#contact" type="button" role="tab"
                                                            aria-controls="contact" aria-selected="false">
                                                        <i className='fa fa-address-book-o me-1'/>Contact
                                                    </button>
                                                    <button className="nav-link" id="help-tab" data-bs-toggle="tab"
                                                            data-bs-target="#help" type="button" role="tab"
                                                            aria-controls="help" aria-selected="false">
                                                        <i className="fa fa-question-circle-o me-1"
                                                           aria-hidden="true"/>Help
                                                    </button>
                                                </div>
                                                <div className="tab-content  px-2 py-2" id="nav-tabContent">
                                                    <div className="tab-pane fade active show" id="document-form-detail"
                                                         role="tabpanel" aria-labelledby="document-form">
                                                        <label
                                                            className="tab_label">{userDetail.full_name} {userDetail.company && ` from ` + userDetail.company} requested
                                                            you to upload
                                                            Documents{props.formObj.fill_forms.length > 0 && ` & Forms.`}.</label>
                                                        <h2 className="main_title text_blue ps-0 pb-0">Documents to
                                                            Upload</h2>
                                                        <h6 className="tab_subtitle mb-3">{props.formObj.envelope_name}</h6>
                                                        <div className="form_card step_wizard_content">
                                                            <div className="accordion" id="mAccordionMedicare">
                                                                {props.formObj.documents && props.formObj.documents.map((item, index) =>
                                                                    <div key={index}
                                                                         className="accordion-item background_grey_400">
                                                                        <h2 className="accordion-header"
                                                                            id={`MedicareNeed-${index}`}>
                                                                            <button
                                                                                className="accordion-button background_grey_400"
                                                                                type="button"
                                                                                data-bs-toggle="collapse"
                                                                                data-bs-target={`#Medicare-Need-${index}`}
                                                                                aria-expanded="true"
                                                                                aria-controls={`Medicare-Need-${index}`}>
                                                                                {item.name}
                                                                            </button>
                                                                            <span
                                                                                className="bg_light_blue">Needs to upload</span>
                                                                        </h2>
                                                                        <div id={`Medicare-Need-${index}`}
                                                                             className="accordion-collapse collapse"
                                                                             aria-labelledby={`MedicareNeed-${index}`}
                                                                             data-bs-parent="#mAccordionMedicare">
                                                                            <div className="accordion-body  pt-0 px-0">
                                                                                <label
                                                                                    className="tab_label mx-3 mb-4">{item.doc_detail}</label>
                                                                                <div
                                                                                    className="card mb-4 rounded add_document bg_blue mx-3">
                                                                                    <div className="mb-3">
                                                                                        <label htmlFor="email_subject"
                                                                                               className="form-label mb-0">Upload
                                                                                            Document
                                                                                            <i className="fa fa-question-circle"
                                                                                               aria-hidden="true"
                                                                                               data-toggle="tooltip"
                                                                                               data-placement="right"
                                                                                               title="Click to upload or Drag & Drop file in the Box."/>
                                                                                        </label>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-lg-12">
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
                                                                                                        <h5>Drag &amp; Drop
                                                                                                            to Upload
                                                                                                            File here or
                                                                                                            click to
                                                                                                            upload</h5>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="ms-3 capture_image">
                                                                                                    <div
                                                                                                        className="icon_bg mx-1">
                                                                                                        <i className="fa fa-camera "
                                                                                                           aria-hidden="true"/>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="icon_bg mx-1">
                                                                                                        <i className="fa fa-cloud "
                                                                                                           aria-hidden="true"/>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {item.documents && item.documents.length > 0 &&
                                                                                    <div className="mx-3">
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                htmlFor="email_subject"
                                                                                                className="form-label mb-0 text_blue">Attachment
                                                                                                from Sender
                                                                                                <i className="fa fa-question-circle"
                                                                                                   aria-hidden="true"
                                                                                                   data-toggle="tooltip"
                                                                                                   data-placement="right"
                                                                                                   title="Sender sent you an Attachment file"/>
                                                                                            </label>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <div className="col-lg-12">
                                                                                                {item.documents.map((doc, d) =>
                                                                                                        <div key={d}
                                                                                                             className="mb-3 download_document">
                                                                                            <span
                                                                                                className="download_box text_blue background_document">{doc.name} ({doc.kb} KB)
                                                                                                <i className="fa fa-download ms-3 round_blue"
                                                                                                   aria-hidden="true"/>
                                                                                                <span
                                                                                                    className="close_btn">
                                                                                                    <i className="fa fa-times-circle"
                                                                                                       aria-hidden="true"/>
                                                                                                </span>
                                                                                            </span>
                                                                                                        </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                <div className="modal-footer mt-3 p-0 ">
                                                                                    <div
                                                                                        className="accordion w-100 mx-3"
                                                                                        id={`mAdditionalField-${index}`}>
                                                                                        {item.date_format > 0 && (
                                                                                            <div
                                                                                                className="accordion-item">
                                                                                                <h2 className="accordion-header"
                                                                                                    id={`mAddField-${index}`}>
                                                                                                    <button
                                                                                                        className="accordion-button"
                                                                                                        type="button"
                                                                                                        data-bs-toggle="collapse"
                                                                                                        data-bs-target={`#mAddFieldMessage-${index}`}
                                                                                                        aria-expanded="true"
                                                                                                        aria-controls={`mAddFieldMessage-${index}`}>
                                                                                                        Expiry Date <i
                                                                                                        className="fa fa-question-circle ms-2"
                                                                                                        aria-hidden="true"
                                                                                                        data-toggle="tooltip"
                                                                                                        data-placement="right"
                                                                                                        title="Enter details as requested"/>
                                                                                                    </button>
                                                                                                </h2>
                                                                                                <div
                                                                                                    id={`mAddFieldMessage-${index}`}
                                                                                                    className="accordion-collapse collapse show"
                                                                                                    aria-labelledby={`mAddField-${index}`}
                                                                                                    data-bs-parent={`#mAdditionalField-${index}`}>
                                                                                                    <div
                                                                                                        className="accordion-body pt-0">
                                                                                                        <div
                                                                                                            className="row">
                                                                                                            <div
                                                                                                                className="col-md-12">
                                                                                                                <input
                                                                                                                    type="text"
                                                                                                                    className="form-control"/>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}

                                                                                        <div className="accordion-item">
                                                                                            <h2 className="accordion-header"
                                                                                                id={`mTypeNoteMessage-${index}`}>
                                                                                                <button
                                                                                                    className="accordion-button"
                                                                                                    type="button"
                                                                                                    data-bs-toggle="collapse"
                                                                                                    data-bs-target={`#typeNoteMessage-${index}`}
                                                                                                    aria-expanded="true"
                                                                                                    aria-controls={`typeNoteMessage-${index}`}>
                                                                                                    Type a Note <i
                                                                                                    className="fa fa-question-circle ms-2"
                                                                                                    aria-hidden="true"
                                                                                                    data-toggle="tooltip"
                                                                                                    data-placement="right"
                                                                                                    title="Type a Note"/>
                                                                                                </button>
                                                                                            </h2>
                                                                                            <div
                                                                                                id={`typeNoteMessage-${index}`}
                                                                                                className="accordion-collapse collapse show"
                                                                                                aria-labelledby={`mTypeNoteMessage-${index}`}
                                                                                                data-bs-parent={`#mAdditionalField-${index}`}>
                                                                                                <div
                                                                                                    className="accordion-body pt-0">
                                                                                                    <div
                                                                                                        className="row">
                                                                                                        <div
                                                                                                            className="col-lg-12">
                                                                                                            <div
                                                                                                                className="mb-4">
                                                                                                                <textarea
                                                                                                                    className="form-control input_bg"
                                                                                                                    id="#"
                                                                                                                    rows="2"
                                                                                                                    readOnly
                                                                                                                    placeholder="Write a Note"/>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <button type="button"
                                                                                            className="btn modal_btn_outline mt-4">
                                                                                        Cancel
                                                                                    </button>
                                                                                    <button type="button"
                                                                                            className="btn modal_btn mt-4">
                                                                                        Save
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {props.formObj.fill_forms.length > 0 &&
                                                                    <>
                                                                        <h2 className="main_title text_blue mb-2 pb-0 mt-3 ps-0">
                                                                            Add Information</h2>
                                                                        {props.formObj.fill_forms.map((item, index) =>
                                                                            <div key={index}
                                                                                 className="accordion-item background_grey_400">
                                                                                <h2 className="accordion-header "
                                                                                    id={`Formuploaded-${index}`}>
                                                                                    <button
                                                                                        className="accordion-button background_grey_400"
                                                                                        type="button"
                                                                                        data-bs-toggle="collapse"
                                                                                        data-bs-target={`#Form-uploaded-${index}`}
                                                                                        aria-expanded="true"
                                                                                        aria-controls={`Form-uploaded-${index}`}>
                                                                                        {item.name}
                                                                                    </button>
                                                                                    <span className="bg_light_blue">Needs to Uploaded</span>
                                                                                </h2>
                                                                                <div id={`Form-uploaded-${index}`}
                                                                                     className="accordion-collapse collapse "
                                                                                     aria-labelledby={`Formuploaded-${index}`}
                                                                                     data-bs-parent="#accordionExample">
                                                                                    <div
                                                                                        className="accordion-body pt-0 px-0">
                                                                                        <div className="mx-3">
                                                                                            {item.questions && item.questions.map((question, i) =>
                                                                                                <div key={i}
                                                                                                     className="mb-4">
                                                                                                    <label
                                                                                                        className="form-label mb-2">{question.name}</label>
                                                                                                    {question.type === 1 &&
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            className="form-control"/>}
                                                                                                    {question.type === 2 &&
                                                                                                        <textarea
                                                                                                            className="form-control"
                                                                                                            rows="3"/>
                                                                                                    }
                                                                                                    {question.type === 3 &&
                                                                                                        <select
                                                                                                            className="form-select">
                                                                                                            <option
                                                                                                                value="0">Please
                                                                                                                select
                                                                                                            </option>
                                                                                                            {question.options.map((option, o) =>
                                                                                                                <option
                                                                                                                    key={o}
                                                                                                                    value={o}>
                                                                                                                    {option.name}
                                                                                                                </option>
                                                                                                            )}
                                                                                                        </select>
                                                                                                    }
                                                                                                    {question.type === 4 &&
                                                                                                        <>
                                                                                                            {question.options.map((option, o) =>
                                                                                                                <div
                                                                                                                    key={o}
                                                                                                                    className="form-check">
                                                                                                                    <input
                                                                                                                        type="radio"
                                                                                                                        className="form-check-input"
                                                                                                                        disabled/>{option.name}
                                                                                                                    <label
                                                                                                                        className="form-check-label"/>
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </>
                                                                                                    }
                                                                                                    {question.type === 5 &&
                                                                                                        <>
                                                                                                            {question.options.map((option, o) =>
                                                                                                                <div
                                                                                                                    key={o}
                                                                                                                    className="form-check">
                                                                                                                    <input
                                                                                                                        type="checkbox"
                                                                                                                        className="form-check-input"
                                                                                                                        disabled/>{option.name}
                                                                                                                    <label
                                                                                                                        className="form-check-label"/>
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </>
                                                                                                    }
                                                                                                    {question.type === 6 &&
                                                                                                        <div
                                                                                                            className="card p-2 w-100">
                                                                                                            <div
                                                                                                                className="drag-area">
                                                                                                                <div
                                                                                                                    className="icon">
                                                                                                                    <i className="fa fa-cloud-upload"
                                                                                                                       aria-hidden="true"/>
                                                                                                                </div>
                                                                                                                <h5>Drag &amp; Drop
                                                                                                                    to
                                                                                                                    Upload
                                                                                                                    File
                                                                                                                    here
                                                                                                                    or
                                                                                                                    click
                                                                                                                    to
                                                                                                                    upload</h5>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    }
                                                                                                    {question.type === 7 && (
                                                                                                        <>
                                                                                                            <div
                                                                                                                className="mb-2"
                                                                                                                dangerouslySetInnerHTML={{__html: question.select_options}}/>
                                                                                                            <input
                                                                                                                type="text"
                                                                                                                className="form-control"/>
                                                                                                        </>
                                                                                                    )}

                                                                                                    {question.type === 8 && (
                                                                                                        <>
                                                                                                            <div
                                                                                                                className="position-relative">
                                                                                                                <DatePicker
                                                                                                                    className="form-control"
                                                                                                                    selected={date}
                                                                                                                    dateFormat={showDateFormat(2)}
                                                                                                                    placeholderText={showDatePlaceholder(2)}
                                                                                                                    onChange={(date) => setDate(date)}
                                                                                                                    ref={dateRef}
                                                                                                                />
                                                                                                                <i className="fa fa-calendar"
                                                                                                                   style={{top: "15px"}}
                                                                                                                   onClick={(e) => dateRef?.current.setFocus(true)}/>
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}

                                                                                                    <label
                                                                                                        className="form-label mt-1">{question.sub_label}</label>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                        <div
                                                                                            className="modal-footer mt-3 p-0">
                                                                                            <button type="button"
                                                                                                    className="btn modal_btn_outline mt-4">
                                                                                                Cancel
                                                                                            </button>
                                                                                            <button type="button"
                                                                                                    className="btn modal_btn mt-4">
                                                                                                Save
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                }
                                                                <div
                                                                    className="d-flex align-items-center justify-content-center mt-4 accordion_primary_btn">
                                                                    <button type="submit"
                                                                            className="btn btn-primary">
                                                                        Finish & Send
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="tab-pane fade  p-4 message_accordion" id="messages"
                                                         role="tabpanel" aria-labelledby="messages-tab">
                                                        <div className="accordion" id="mAccordionExample">
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header" id="headingOne">
                                                                    <button className="accordion-button" type="button"
                                                                            data-bs-toggle="collapse"
                                                                            data-bs-target="#collapseMessage"
                                                                            aria-expanded="true"
                                                                            aria-controls="collapseMessage">
                                                                        <i className="fa fa-comments-o me-2"
                                                                           aria-hidden="true"/>Message
                                                                        with {userDetail.full_name}
                                                                    </button>
                                                                </h2>
                                                                <div id="collapseMessage"
                                                                     className="accordion-collapse collapse show"
                                                                     aria-labelledby="headingOne"
                                                                     data-bs-parent="#mAccordionExample">
                                                                    <div className="accordion-body  chat_box">
                                                                        {messageList && messageList.map((item, index) =>
                                                                            <div key={index}
                                                                                 className={`${index === 0 ? `chat_message_left` : `chat_message_right`} chat_message card`}>
                                                                                <h6>{item.name}</h6>
                                                                                <p>{item.message}</p>
                                                                                <div className="d-flex messages_timing">
                                                                                <span className="me-3">
                                                                                    <i className="fa fa-clock-o"
                                                                                       aria-hidden="true"/> {item.time}
                                                                                </span>
                                                                                    <span>
                                                                                    <i className="fa fa-calendar"
                                                                                       aria-hidden="true"/> {item.date}
                                                                                </span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <div
                                                                            className="mt-4 mb-2 d-flex align-items-center">
                                                                            <input type="text" className="form-control"
                                                                                   placeholder="Enter Message.."
                                                                                   readOnly/>
                                                                            <i className="fa fa-arrow-right black_bg"
                                                                               aria-hidden="true"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="tab-pane fade p-2" id="contact" role="tabpanel"
                                                         aria-labelledby="contact-tab">
                                                        <div className="card background_grey_400">
                                                            <div
                                                                className="d-flex user_icon_list align-items-center border-bottom w-100 justify-content-center">
                                                                <span className="user_icon">{userDetail.icon}</span>
                                                                <p>
                                                                    <span
                                                                        className="user_name">{userDetail.company}</span>
                                                                    {userDetail.address && (
                                                                        <span
                                                                            className="user_detail">{userDetail.address}</span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div className="contact_client_portal py-4 mx-auto">
                                                                <div className="py-2 d-flex">
                                                                    <span className="client_portal_title">User :</span>
                                                                    <span
                                                                        className="client_portal_text">{userDetail.full_name}</span>
                                                                </div>
                                                                <div className="py-2 d-flex">
                                                                    <span className="client_portal_title">Email :</span>
                                                                    <span
                                                                        className="client_portal_text">{userDetail.email}</span>
                                                                </div>
                                                                {userDetail.phone && (
                                                                    <div className="py-2 d-flex">
                                                                        <span
                                                                            className="client_portal_title">Phone :</span>
                                                                        <span
                                                                            className="client_portal_text">{userDetail.phone}</span>
                                                                    </div>
                                                                )}
                                                                {userDetail.address && userDetail.web_site && (
                                                                    <div className="py-2 d-flex">
                                                                        <span
                                                                            className="client_portal_title">Web :</span>
                                                                        <span
                                                                            className="client_portal_text">{userDetail.web_site}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="tab-pane fade Faq_tab p-4" id="help" role="tabpanel"
                                                         aria-labelledby="help-tab">
                                                        {youTube &&
                                                            <iframe width="100%" height="380" title="intro1"
                                                                    src={youTube}
                                                                    style={{
                                                                        borderRadius: '12px',
                                                                        marginBottom: '20px'
                                                                    }}/>
                                                        }
                                                        <h2 className="main_title ">FAQ</h2>
                                                        <div className="accordion" id="accordionExample">
                                                            {faqList && faqList.map((item, index) =>
                                                                <div className="accordion-item" key={index}>
                                                                    <h2 className="accordion-header"
                                                                        id={`help${index}`}>
                                                                        <button className="accordion-button"
                                                                                type="button"
                                                                                data-bs-toggle="collapse"
                                                                                data-bs-target={`#help${index}Message`}
                                                                                aria-expanded="true"
                                                                                aria-controls={`help${index}Message`}>
                                                                            {item.question}
                                                                        </button>
                                                                    </h2>
                                                                    <div id={`help${index}Message`}
                                                                         className="accordion-collapse collapse"
                                                                         aria-labelledby={`help${index}`}
                                                                         data-bs-parent="#accordionExample">
                                                                        <div className="accordion-body  chat_box">
                                                                            {item.answer}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                    <div className="col-lg-4"/>
                                </div>
                            </div>

                            <div className="tab-pane fade " id="laptop" role="tabpanel" aria-labelledby="laptop-tab">
                                <div className="row">
                                    <div className="col-lg-2"/>
                                    <div className="col-lg-8 laptop_view_portal">
                                        <div className="wrapper clientPortal">
                                            <nav
                                                className="navbar navbar-expand-lg py-2 px-0 shadow-sm justify-content-between">
                                                <span className="navbar-brand" style={{width: '100px'}}>
                                                    <img src="/images/logo.png" className="h-8" alt="..."/>
                                                </span>
                                                <div className="ms-autonavbar_client">
                                                    <div
                                                        className="d-flex align-items-center w-100 justify-content-end ">
                                                        <p className="total_data">Total
                                                            Documents {props.formObj.fill_forms.length > 0 && `& Forms`} {totalDocs}</p>
                                                        <p className="due_days d-flex align-items-center">
                                                            <img src="/images/clock.png" className="me-2" alt="..."/>
                                                            Due in {dueDay} Days</p>
                                                    </div>
                                                </div>
                                            </nav>
                                            <section
                                                className=" background_grey_400 setting_tab client_portal px-2 pb-3">
                                                <div className="nav nav-tabs pt-4" id="nav-tab" role="tablist">
                                                    <button className="nav-link active" id="document-form2"
                                                            data-bs-toggle="tab"
                                                            data-bs-target="#document-form-detail2" type="button"
                                                            role="tab" aria-controls="document-form-detail2"
                                                            aria-selected="true">
                                                        <i className="fa fa-drivers-license-o me-1"
                                                           aria-hidden="true"/>Documents {props.formObj.fill_forms.length > 0 && `& Data`}
                                                    </button>
                                                    <button className="nav-link" id="messages-tab2" data-bs-toggle="tab"
                                                            data-bs-target="#messages2" type="button" role="tab"
                                                            aria-controls="messages2" aria-selected="false">
                                                        <i className="fa fa-comments-o me-1" aria-hidden="true"/>Messages
                                                        <span className="red_dot"/>
                                                    </button>
                                                    <button className="nav-link" id="contact-tab2" data-bs-toggle="tab"
                                                            data-bs-target="#contact2" type="button" role="tab"
                                                            aria-controls="contact2" aria-selected="false">
                                                        <i className='fa fa-address-book-o me-1'/>Contact
                                                    </button>
                                                    <button className="nav-link" id="help-tab2" data-bs-toggle="tab"
                                                            data-bs-target="#helpId2" type="button" role="tab"
                                                            aria-controls="helpId2" aria-selected="false">
                                                        <i className="fa fa-question-circle-o me-1"
                                                           aria-hidden="true"/> Help
                                                    </button>
                                                </div>
                                                <div className="tab-content  px-2 py-2" id="nav-tabContent">
                                                    <div className="tab-pane fade active show"
                                                         id="document-form-detail2"
                                                         role="tabpanel" aria-labelledby="document-form2">
                                                        <label
                                                            className="tab_label">{userDetail.full_name} {userDetail.company && ` from ` + userDetail.company} requested
                                                            you to upload
                                                            Documents{props.formObj.fill_forms.length > 0 && ` & Forms`}.</label>
                                                        <h2 className="main_title text_blue ps-0 pb-0">Documents to
                                                            Upload</h2>
                                                        <h6 className="tab_subtitle mb-3  ">{props.formObj.envelope_name}</h6>
                                                        <div className="form_card step_wizard_content">
                                                            <div className="accordion" id="tAccordionMedicare">
                                                                {props.formObj.documents && props.formObj.documents.map((item, index) =>
                                                                    <div key={index}
                                                                         className="accordion-item background_grey_400">
                                                                        <h2 className="accordion-header "
                                                                            id={`tMedicareNeed-${index}`}>
                                                                            <button
                                                                                className="accordion-button background_grey_400"
                                                                                type="button"
                                                                                data-bs-toggle="collapse"
                                                                                data-bs-target={`#tMedicare-Need-${index}`}
                                                                                aria-expanded="true"
                                                                                aria-controls={`tMedicare-Need-${index}`}>
                                                                                {item.name}
                                                                            </button>
                                                                            <span
                                                                                className="bg_light_blue">Needs to upload</span>
                                                                        </h2>
                                                                        <div id={`tMedicare-Need-${index}`}
                                                                             className="accordion-collapse collapse "
                                                                             aria-labelledby={`tMedicareNeed-${index}`}
                                                                             data-bs-parent="#tAccordionMedicare">
                                                                            <div className="accordion-body  pt-0 px-0">
                                                                                <label
                                                                                    className="tab_label mx-3 mb-4">{item.doc_detail}</label>
                                                                                <div
                                                                                    className="card mb-4 rounded add_document bg_blue mx-3">
                                                                                    <div className="mb-3">
                                                                                        <label htmlFor="email_subject"
                                                                                               className="form-label mb-0">Upload
                                                                                            Document <i
                                                                                                className="fa fa-question-circle"
                                                                                                aria-hidden="true"
                                                                                                data-toggle="tooltip"
                                                                                                data-placement="right"
                                                                                                title="Click to upload or Drag & Drop file in the Box."/>
                                                                                        </label>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className="col-lg-12">
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
                                                                                                        <h5>Drag &amp; Drop
                                                                                                            to Upload
                                                                                                            File here or
                                                                                                            click to
                                                                                                            upload</h5>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="ms-3 capture_image">
                                                                                                    <div>
                                                                                                        <img
                                                                                                            src="/images/capture.png"
                                                                                                            alt="..."/>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <img
                                                                                                            src="/images/cloud.png"
                                                                                                            alt="..."/>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {item.documents && item.documents.length > 0 &&
                                                                                    <div className="mx-3">
                                                                                        <div className="mb-3">
                                                                                            <label
                                                                                                htmlFor="email_subject"
                                                                                                className="form-label mb-0 text_blue">Attachment
                                                                                                from Sender <i
                                                                                                    className="fa fa-question-circle"
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
                                                                                                                  className="me-1 download_box text_blue background_document">{doc.name} ({doc.kb} KB)
                                                                                                        <i className="fa fa-download ms-3 round_blue"
                                                                                                           aria-hidden="true"/>
                                                                                                        <span
                                                                                                            className="close_btn">
                                                                                                            <i className="fa fa-times-circle"
                                                                                                               aria-hidden="true"/>
                                                                                                        </span>
                                                                                                    </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                <div className="modal-footer mt-3 p-0 ">
                                                                                    <div
                                                                                        className="accordion w-100 mx-3"
                                                                                        id={`tAdditionalField-${index}`}>
                                                                                        {item.date_format > 0 && (
                                                                                            <div
                                                                                                className="accordion-item">
                                                                                                <h2 className="accordion-header"
                                                                                                    id={`tAddFieldMessage-${index}`}>
                                                                                                    <button
                                                                                                        className="accordion-button"
                                                                                                        type="button"
                                                                                                        data-bs-toggle="collapse"
                                                                                                        data-bs-target="#AddFieldMessage"
                                                                                                        aria-expanded="true"
                                                                                                        aria-controls="AddFieldMessage">
                                                                                                        Expiry Date <i
                                                                                                        className="fa fa-question-circle ms-2"
                                                                                                        aria-hidden="true"
                                                                                                        data-toggle="tooltip"
                                                                                                        data-placement="right"
                                                                                                        title="Enter details as requested"/>
                                                                                                    </button>
                                                                                                </h2>
                                                                                                <div
                                                                                                    id="AddFieldMessage"
                                                                                                    className="accordion-collapse collapse show"
                                                                                                    aria-labelledby={`tAddFieldMessage-${index}`}
                                                                                                    data-bs-parent={`#tAdditionalField-${index}`}>
                                                                                                    <div
                                                                                                        className="accordion-body pt-0">
                                                                                                        <div
                                                                                                            className="row">
                                                                                                            <div
                                                                                                                className="col-md-6">
                                                                                                                <input
                                                                                                                    type="text"
                                                                                                                    className="form-control"/>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                        <div className="accordion-item">
                                                                                            <h2 className="accordion-header"
                                                                                                id={`tTypeNoteMessage-${index}`}>
                                                                                                <button
                                                                                                    className="accordion-button"
                                                                                                    type="button"
                                                                                                    data-bs-toggle="collapse"
                                                                                                    data-bs-target={`#tTypeNoteMessage-${index}`}
                                                                                                    aria-expanded="true"
                                                                                                    aria-controls={`tTypeNoteMessage-${index}`}>
                                                                                                    Type a Note <i
                                                                                                    className="fa fa-question-circle ms-2"
                                                                                                    aria-hidden="true"
                                                                                                    data-toggle="tooltip"
                                                                                                    data-placement="right"
                                                                                                    title="Type a Note"/>
                                                                                                </button>
                                                                                            </h2>
                                                                                            <div
                                                                                                id={`tTypeNoteMessage-${index}`}
                                                                                                className="accordion-collapse collapse show"
                                                                                                aria-labelledby={`tTypeNoteMessage-${index}`}
                                                                                                data-bs-parent={`#tAdditionalField-${index}`}>
                                                                                                <div
                                                                                                    className="accordion-body pt-0">
                                                                                                    <div
                                                                                                        className="row">
                                                                                                        <div
                                                                                                            className="col-lg-12">
                                                                                                            <div
                                                                                                                className="mb-4">
                                                                                                            <textarea
                                                                                                                className="form-control input_bg"
                                                                                                                id="#"
                                                                                                                rows="2"
                                                                                                                readOnly
                                                                                                                placeholder="Write a Note"/>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <button type="button"
                                                                                            className="btn modal_btn_outline mt-4">
                                                                                        Cancel
                                                                                    </button>
                                                                                    <button type="button"
                                                                                            className="btn modal_btn mt-4">
                                                                                        Save
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {props.formObj.fill_forms.length > 0 &&
                                                                    <>
                                                                        <h2 className="main_title text_blue mb-2 pb-0 mt-3 ps-0">
                                                                            Add Information</h2>
                                                                        {props.formObj.fill_forms.map((item, index) =>
                                                                            <div key={index}
                                                                                 className="accordion-item background_grey_400">
                                                                                <h2 className="accordion-header "
                                                                                    id={`tFormuploaded-${index}`}>
                                                                                    <button
                                                                                        className="accordion-button background_grey_400"
                                                                                        type="button"
                                                                                        data-bs-toggle="collapse"
                                                                                        data-bs-target={`#tForm-uploaded-${index}`}
                                                                                        aria-expanded="true"
                                                                                        aria-controls={`tForm-uploaded-${index}`}>
                                                                                        {item.name}
                                                                                    </button>
                                                                                    <span className="bg_light_blue">Needs to Uploaded</span>
                                                                                </h2>
                                                                                <div id={`tForm-uploaded-${index}`}
                                                                                     className="accordion-collapse collapse "
                                                                                     aria-labelledby={`tFormuploaded-${index}`}
                                                                                     data-bs-parent="#tAccordionMedicare">
                                                                                    <div
                                                                                        className="accordion-body pt-0 px-0">
                                                                                        <div className="mx-3">
                                                                                            {item.questions && item.questions.map((question, i) =>
                                                                                                <div key={i}
                                                                                                     className="mb-4">
                                                                                                    <label
                                                                                                        className="form-label mb-2">{question.name}</label>
                                                                                                    {question.type === 1 &&
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            className="form-control"/>}
                                                                                                    {question.type === 2 &&
                                                                                                        <textarea
                                                                                                            className="form-control"
                                                                                                            rows="3"/>
                                                                                                    }
                                                                                                    {question.type === 3 &&
                                                                                                        <select
                                                                                                            className="form-select">
                                                                                                            <option
                                                                                                                value="0">Please
                                                                                                                select
                                                                                                            </option>
                                                                                                            {question.options.map((option, o) =>
                                                                                                                <option
                                                                                                                    key={o}
                                                                                                                    value={o}>
                                                                                                                    {option.name}
                                                                                                                </option>
                                                                                                            )}
                                                                                                        </select>
                                                                                                    }
                                                                                                    {question.type === 4 &&
                                                                                                        <>
                                                                                                            {question.options.map((option, o) =>
                                                                                                                <div
                                                                                                                    key={o}
                                                                                                                    className="form-check">
                                                                                                                    <input
                                                                                                                        type="radio"
                                                                                                                        className="form-check-input"
                                                                                                                        disabled/>{option.name}
                                                                                                                    <label
                                                                                                                        className="form-check-label"/>
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </>
                                                                                                    }
                                                                                                    {question.type === 5 &&
                                                                                                        <>
                                                                                                            {question.options.map((option, o) =>
                                                                                                                <div
                                                                                                                    key={o}
                                                                                                                    className="form-check">
                                                                                                                    <input
                                                                                                                        type="checkbox"
                                                                                                                        className="form-check-input"
                                                                                                                        disabled/>{option.name}
                                                                                                                    <label
                                                                                                                        className="form-check-label"/>
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </>
                                                                                                    }
                                                                                                    {question.type === 6 &&
                                                                                                        <div
                                                                                                            className="card p-2 w-100">
                                                                                                            <div
                                                                                                                className="drag-area">
                                                                                                                <div
                                                                                                                    className="icon">
                                                                                                                    <i className="fa fa-cloud-upload"
                                                                                                                       aria-hidden="true"/>
                                                                                                                </div>
                                                                                                                <h5>Drag &amp; Drop
                                                                                                                    to
                                                                                                                    Upload
                                                                                                                    File
                                                                                                                    here
                                                                                                                    or
                                                                                                                    click
                                                                                                                    to
                                                                                                                    upload</h5>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    }
                                                                                                    {question.type === 8 && (
                                                                                                        <>
                                                                                                            <div
                                                                                                                className="position-relative">
                                                                                                                <DatePicker
                                                                                                                    className="form-control"
                                                                                                                    selected={date}
                                                                                                                    dateFormat={showDateFormat(2)}
                                                                                                                    placeholderText={showDatePlaceholder(2)}
                                                                                                                    onChange={(date) => setDate(date)}
                                                                                                                    ref={dateRef}
                                                                                                                />
                                                                                                                <i className="fa fa-calendar"
                                                                                                                   style={{top: "15px"}}
                                                                                                                   onClick={(e) => dateRef?.current.setFocus(true)}/>
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                                    <label
                                                                                                        className="form-label mt-1">{question.sub_label}</label>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                        <div
                                                                                            className="modal-footer mt-3 p-0 ">
                                                                                            <button type="button"
                                                                                                    className="btn modal_btn_outline mt-4">
                                                                                                Cancel
                                                                                            </button>
                                                                                            <button type="button"
                                                                                                    className="btn modal_btn mt-4">
                                                                                                Save
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                }
                                                                <div
                                                                    className="d-flex align-items-center justify-content-center mt-4 accordion_primary_btn">
                                                                    <button type="submit" className="btn btn-primary">
                                                                        Finish & Send
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="tab-pane fade  p-4 message_accordion" id="messages2"
                                                         role="tabpanel" aria-labelledby="messages-tab2">
                                                        <div className="accordion" id="tAccordionExample">
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header" id="headingOne">
                                                                    <button className="accordion-button" type="button"
                                                                            data-bs-toggle="collapse"
                                                                            data-bs-target="#collapseMessage"
                                                                            aria-expanded="true"
                                                                            aria-controls="collapseMessage">
                                                                        <i className="fa fa-comments-o me-2"
                                                                           aria-hidden="true"/>Message
                                                                        with {userDetail.full_name}
                                                                    </button>
                                                                </h2>
                                                                <div id="collapseMessage"
                                                                     className="accordion-collapse collapse show"
                                                                     aria-labelledby="headingOne"
                                                                     data-bs-parent="#tAccordionExample">
                                                                    <div className="accordion-body  chat_box">
                                                                        {messageList && messageList.map((item, index) =>
                                                                            <div key={index}
                                                                                 className={`${index === 0 ? `chat_message_left` : `chat_message_right`} chat_message card`}>
                                                                                <h6>{item.name}</h6>
                                                                                <p>{item.message}</p>
                                                                                <div className="d-flex messages_timing">
                                                                                <span className="me-3">
                                                                                    <i className="fa fa-clock-o"
                                                                                       aria-hidden="true"/> {item.time}
                                                                                </span>
                                                                                    <span>
                                                                                    <i className="fa fa-calendar"
                                                                                       aria-hidden="true"/> {item.date}
                                                                                </span>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        <div
                                                                            className="mt-4 mb-2 d-flex align-items-center">
                                                                            <input type="text" className="form-control"
                                                                                   readOnly
                                                                                   placeholder="Enter Message.."/>
                                                                            <i className="fa fa-arrow-right black_bg"
                                                                               aria-hidden="true"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="tab-pane fade p-4" id="contact2" role="tabpanel"
                                                         aria-labelledby="contact-tab2">
                                                        <div className="card background_grey_400">
                                                            <div
                                                                className="d-flex user_icon_list align-items-center border-bottom w-100 justify-content-center">
                                                                <span className="user_icon">{userDetail.icon}</span>
                                                                <p>
                                                                    <span
                                                                        className="user_name">{userDetail.company}</span>
                                                                    {userDetail.address && (
                                                                        <span
                                                                            className="user_detail">{userDetail.address}</span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div className="contact_client_portal py-4 mx-auto">
                                                                <div className="py-2 d-flex">
                                                                    <span className="client_portal_title">User :</span>
                                                                    <span
                                                                        className="client_portal_text">{userDetail.full_name}</span>
                                                                </div>
                                                                <div className="py-2 d-flex">
                                                                    <span className="client_portal_title">Email :</span>
                                                                    <span
                                                                        className="client_portal_text">{userDetail.email}</span>
                                                                </div>
                                                                {userDetail.phone && (
                                                                    <div className="py-2 d-flex">
                                                                        <span
                                                                            className="client_portal_title">Phone :</span>
                                                                        <span
                                                                            className="client_portal_text">{userDetail.phone}</span>
                                                                    </div>
                                                                )}
                                                                {userDetail.address && userDetail.web_site && (
                                                                    <div className="py-2 d-flex">
                                                                        <span
                                                                            className="client_portal_title">Web :</span>
                                                                        <span
                                                                            className="client_portal_text">{userDetail.web_site}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="tab-pane fade Faq_tab p-4" id="helpId2"
                                                         role="tabpanel" aria-labelledby="help-tab2">
                                                        {youTube &&
                                                            <iframe width="100%" height="380" title="intro"
                                                                    src={youTube}
                                                                    style={{
                                                                        borderRadius: '12px',
                                                                        marginBottom: '20px'
                                                                    }}/>
                                                        }
                                                        <h2 className="main_title ">FAQ</h2>
                                                        <div className="accordion" id="tfAccordionExample">
                                                            {faqList && faqList.map((item, index) =>
                                                                <div key={index} className="accordion-item">
                                                                    <h2 className="accordion-header"
                                                                        id={`tHelp${index}`}>
                                                                        <button className="accordion-button"
                                                                                type="button"
                                                                                data-bs-toggle="collapse"
                                                                                data-bs-target={`#tHelp${index}Message`}
                                                                                aria-expanded="true"
                                                                                aria-controls={`tHelp${index}Message`}>
                                                                            {item.question}
                                                                        </button>
                                                                    </h2>
                                                                    <div id={`tHelp${index}Message`}
                                                                         className="accordion-collapse collapse"
                                                                         aria-labelledby={`tHelp${index}`}
                                                                         data-bs-parent="#tfAccordionExample">
                                                                        <div className="accordion-body  chat_box">
                                                                            {item.answer}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                            <footer className="bg-dark text-center text-white">
                                                <div className="text-center p-3 footer_text">
                                                    Copyright 2022 @
                                                    <span className="text-white">DocuTick</span> All rights
                                                    reserved
                                                </div>
                                            </footer>
                                        </div>
                                    </div>
                                    <div className="col-lg-2"/>
                                </div>
                            </div>

                            <div className="tab-pane fade " id="desktop" role="tabpanel" aria-labelledby="desktop-tab">
                                <div className="py-3 background_grey_400 shadow">
                                    <div className="wrapper clientPortal">
                                        <nav className="navbar navbar-expand-lg shadow-sm p-3 bg-white">
                                            <span className="navbar-brand">
                                                <img src="/images/logo.png" className="h-8" alt="..."/>
                                            </span>
                                            <div className=" ms-auto navbar_client">
                                                <div
                                                    className="d-flex align-items-center w-100 justify-content-end flex_wrap">
                                                    <p className="total_data">Total
                                                        Documents {props.formObj.fill_forms.length > 0 && `& Forms`} {totalDocs}</p>
                                                    <p className="due_days d-flex">
                                                        <img src="/images/clock.png" className="me-2" alt="..."/> Due
                                                        in {dueDay} Days
                                                    </p>
                                                </div>
                                            </div>
                                        </nav>
                                        <section className=" background_grey_400 setting_tab client_portal px-3 pb-3"
                                                 style={{minHeight: 'calc(100vh - 120px)'}}>
                                            <div className="nav nav-tabs pt-4" id="nav-tab" role="tablist">
                                                <button className="nav-link active" id="document-form3"
                                                        data-bs-toggle="tab" data-bs-target="#document-form-detail3"
                                                        type="button" role="tab"
                                                        aria-controls="document-form-detail" aria-selected="true">
                                                    <i className="fa fa-drivers-license-o me-1" aria-hidden="true"/>
                                                    Documents {props.formObj.fill_forms.length > 0 && ` & Data`}
                                                </button>
                                                <button className="nav-link" id="messages-tab3" data-bs-toggle="tab"
                                                        data-bs-target="#messages3" type="button" role="tab"
                                                        aria-controls="messages3" aria-selected="false">
                                                    <i className="fa fa-comments-o me-1" aria-hidden="true"/>Messages
                                                    <span className="red_dot"/>
                                                </button>
                                                <button className="nav-link" id="contact-tab3" data-bs-toggle="tab"
                                                        data-bs-target="#contact3" type="button" role="tab"
                                                        aria-controls="contact3" aria-selected="false">
                                                    <i className='fa fa-address-book-o me-1'/>Contact
                                                </button>
                                                <button className="nav-link" id="help-tab3" data-bs-toggle="tab"
                                                        data-bs-target="#dHelpTab" type="button" role="tab"
                                                        aria-controls="dHelpTab" aria-selected="false">
                                                    <i className="fa fa-question-circle-o me-1"/>
                                                    Help
                                                </button>
                                            </div>
                                            <div className="tab-content  px-5 py-4" id="nav-tabContent"
                                                 style={{minHeight: 'calc(100vh - 209px)'}}>
                                                <div className="tab-pane fade active show" id="document-form-detail3"
                                                     role="tabpanel" aria-labelledby="document-form3">
                                                    <label
                                                        className="tab_label mb-3 ps-4">{userDetail.full_name} {userDetail.company && ` from ` + userDetail.company}
                                                        requested you to upload
                                                        Documents{props.formObj.fill_forms.length > 0 && ` & Forms`}.</label>
                                                    <h2 className="main_title text_blue mb-2 ps-4">Documents to
                                                        Upload</h2>
                                                    <h6 className="tab_subtitle mb-4 ps-4">{props.formObj.envelope_name}</h6>
                                                    <div className="form_card step_wizard_content">
                                                        <div className="accordion" id="dAccordionMedicare">
                                                            {props.formObj.documents.map((item, index) =>
                                                                <div key={index}
                                                                     className="accordion-item background_grey_400">
                                                                    <h2 className="accordion-header"
                                                                        id={`dMedicareNeed-${index}`}>
                                                                        <button
                                                                            className="accordion-button background_grey_400"
                                                                            type="button" data-bs-toggle="collapse"
                                                                            data-bs-target={`#dMedicare-Need-${index}`}
                                                                            aria-expanded="true"
                                                                            aria-controls={`dMedicare-Need-${index}`}>
                                                                            {item.name}
                                                                        </button>
                                                                        <span
                                                                            className="bg_light_blue">Needs to upload</span>
                                                                    </h2>
                                                                    <div id={`dMedicare-Need-${index}`}
                                                                         className="accordion-collapse collapse "
                                                                         aria-labelledby={`dMedicareNeed-${index}`}
                                                                         data-bs-parent="#dAccordionMedicare">
                                                                        <div className="accordion-body  pt-0 px-0">
                                                                            <label
                                                                                className="tab_label mx-3 mb-4">{item.doc_detail}</label>
                                                                            <div
                                                                                className="card mb-4 rounded add_document bg_blue mx-3">
                                                                                <div className="mb-3">
                                                                                    <label htmlFor="email_subject"
                                                                                           className="form-label mb-0">Upload
                                                                                        Document <i
                                                                                            className="fa fa-question-circle"
                                                                                            aria-hidden="true"
                                                                                            data-toggle="tooltip"
                                                                                            data-placement="right"
                                                                                            title="Click to upload or Drag & Drop file in the Box."/>
                                                                                    </label>
                                                                                </div>
                                                                                <div className="row">
                                                                                    <div className="col-lg-12">
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
                                                                                                    <h5>Drag &amp; Drop
                                                                                                        to Upload File
                                                                                                        here or click to
                                                                                                        upload</h5>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div
                                                                                                className="ms-3 capture_image">
                                                                                                <div>
                                                                                                    <img
                                                                                                        src="/images/capture.png"
                                                                                                        alt="..."/>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <img
                                                                                                        src="/images/cloud.png"
                                                                                                        alt="..."/>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {item.documents && item.documents.length > 0 &&
                                                                                <div className="mx-3">
                                                                                    <div className="mb-3">
                                                                                        <label htmlFor="email_subject"
                                                                                               className="form-label mb-0 text_blue">Attachment
                                                                                            from Sender <i
                                                                                                className="fa fa-question-circle"
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
                                                                                                              className="me-1 download_box text_blue background_document">{doc.name} ({doc.kb} KB)
                                                                                                    <i className="fa fa-download ms-3 round_blue"
                                                                                                       aria-hidden="true"/>
                                                                                                    <span
                                                                                                        className="close_btn">
                                                                                                        <i className="fa fa-times-circle"
                                                                                                           aria-hidden="true"/>
                                                                                                    </span>
                                                                                                </span>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            }
                                                                            <div className="modal-footer mt-3 p-0 ">
                                                                                <div className="accordion w-100 mx-3"
                                                                                     id={`dAdditionalField-${index}`}>
                                                                                    {item.date_format > 0 && (
                                                                                        <div className="accordion-item">
                                                                                            <h2 className="accordion-header"
                                                                                                id={`dAddFieldMessage-${index}`}>
                                                                                                <button
                                                                                                    className="accordion-button"
                                                                                                    type="button"
                                                                                                    data-bs-toggle="collapse"
                                                                                                    data-bs-target={`#dAddFieldMessage-${index}`}
                                                                                                    aria-expanded="true"
                                                                                                    aria-controls={`dAddFieldMessage-${index}`}>
                                                                                                    Expiry Date <i
                                                                                                    className="fa fa-question-circle ms-2"
                                                                                                    aria-hidden="true"
                                                                                                    data-toggle="tooltip"
                                                                                                    data-placement="right"
                                                                                                    title="Enter details as requested"/>
                                                                                                </button>
                                                                                            </h2>
                                                                                            <div
                                                                                                id={`dAddFieldMessage-${index}`}
                                                                                                className="accordion-collapse collapse show"
                                                                                                aria-labelledby={`dAddFieldMessage-${index}`}
                                                                                                data-bs-parent={`#dAdditionalField-${index}`}>
                                                                                                <div
                                                                                                    className="accordion-body pt-0">
                                                                                                    <div
                                                                                                        className="row">
                                                                                                        <div
                                                                                                            className="col-lg-6">
                                                                                                            <input
                                                                                                                type="text"
                                                                                                                className="form-control"/>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                    <div className="accordion-item">
                                                                                        <h2 className="accordion-header"
                                                                                            id={`dTypeNoteMessage-${index}`}>
                                                                                            <button
                                                                                                className="accordion-button"
                                                                                                type="button"
                                                                                                data-bs-toggle="collapse"
                                                                                                data-bs-target={`#dTypeNoteMessage-${index}`}
                                                                                                aria-expanded="true"
                                                                                                aria-controls={`dTypeNoteMessage-${index}`}>
                                                                                                Type a Note <i
                                                                                                className="fa fa-question-circle ms-2"
                                                                                                aria-hidden="true"
                                                                                                data-toggle="tooltip"
                                                                                                data-placement="right"
                                                                                                title="Type a Note"/>
                                                                                            </button>
                                                                                        </h2>
                                                                                        <div
                                                                                            id={`dTypeNoteMessage-${index}`}
                                                                                            className="accordion-collapse collapse show"
                                                                                            aria-labelledby={`dTypeNoteMessage-${index}`}
                                                                                            data-bs-parent={`#dAdditionalField-${index}`}>
                                                                                            <div
                                                                                                className="accordion-body pt-0">
                                                                                                <div className="row">
                                                                                                    <div
                                                                                                        className="col-lg-12">
                                                                                                        <div
                                                                                                            className="mb-4">
                                                                                                        <textarea
                                                                                                            className="form-control input_bg"
                                                                                                            id="#"
                                                                                                            rows="2"
                                                                                                            readOnly
                                                                                                            placeholder="Write a Note"/>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <button type="button"
                                                                                        className="btn modal_btn_outline mt-4">Cancel
                                                                                </button>
                                                                                <button type="button"
                                                                                        className="btn modal_btn mt-4">Save
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {props.formObj.fill_forms.length > 0 &&
                                                                <>
                                                                    <h2 className="main_title text_blue mb-2 mt-3 ps-4">Add
                                                                        Information</h2>
                                                                    {props.formObj.fill_forms.map((item, index) =>
                                                                        <div key={index}
                                                                             className="accordion-item background_grey_400">
                                                                            <h2 className="accordion-header "
                                                                                id={`dFormuploaded-${index}`}>
                                                                                <button
                                                                                    className="accordion-button background_grey_400"
                                                                                    type="button"
                                                                                    data-bs-toggle="collapse"
                                                                                    data-bs-target={`#dForm-uploaded-${index}`}
                                                                                    aria-expanded="true"
                                                                                    aria-controls={`dForm-uploaded-${index}`}>
                                                                                    {item.name}
                                                                                </button>
                                                                                <span
                                                                                    className="bg_light_blue">Needs to Uploaded</span>
                                                                            </h2>
                                                                            <div id={`dForm-uploaded-${index}`}
                                                                                 className="accordion-collapse collapse "
                                                                                 aria-labelledby={`dFormuploaded-${index}`}
                                                                                 data-bs-parent="#dAccordionMedicare">
                                                                                <div
                                                                                    className="accordion-body pt-0 px-0">
                                                                                    <div className="mx-3">
                                                                                        {item.questions && item.questions.map((question, i) =>
                                                                                            <div key={i}
                                                                                                 className="mb-4">
                                                                                                <label
                                                                                                    className="form-label mb-2">{question.name}</label>
                                                                                                {question.type === 1 &&
                                                                                                    <input type="text"
                                                                                                           className="form-control"/>}
                                                                                                {question.type === 2 &&
                                                                                                    <textarea
                                                                                                        className="form-control"
                                                                                                        rows="3"/>
                                                                                                }
                                                                                                {question.type === 3 &&
                                                                                                    <select
                                                                                                        className="form-select">
                                                                                                        <option
                                                                                                            value="0">Please
                                                                                                            select
                                                                                                        </option>
                                                                                                        {question.options.map((option, o) =>
                                                                                                            <option
                                                                                                                key={o}
                                                                                                                value={o}>
                                                                                                                {option.name}
                                                                                                            </option>
                                                                                                        )}
                                                                                                    </select>
                                                                                                }
                                                                                                {question.type === 4 &&
                                                                                                    <>
                                                                                                        {question.options.map((option, o) =>
                                                                                                            <div key={o}
                                                                                                                 className="form-check">
                                                                                                                <input
                                                                                                                    type="radio"
                                                                                                                    className="form-check-input"
                                                                                                                    disabled/>{option.name}
                                                                                                                <label
                                                                                                                    className="form-check-label"/>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </>
                                                                                                }
                                                                                                {question.type === 5 &&
                                                                                                    <>
                                                                                                        {question.options.map((option, o) =>
                                                                                                            <div key={o}
                                                                                                                 className="form-check">
                                                                                                                <input
                                                                                                                    type="checkbox"
                                                                                                                    className="form-check-input"
                                                                                                                    disabled/>{option.name}
                                                                                                                <label
                                                                                                                    className="form-check-label"/>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </>
                                                                                                }
                                                                                                {question.type === 6 &&
                                                                                                    <div
                                                                                                        className="card p-2 w-100">
                                                                                                        <div
                                                                                                            className="drag-area">
                                                                                                            <div
                                                                                                                className="icon">
                                                                                                                <i className="fa fa-cloud-upload"
                                                                                                                   aria-hidden="true"/>
                                                                                                            </div>
                                                                                                            <h5>Drag &amp; Drop
                                                                                                                to
                                                                                                                Upload
                                                                                                                File
                                                                                                                here or
                                                                                                                click to
                                                                                                                upload</h5>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                }
                                                                                                {question.type === 8 && (
                                                                                                    <>
                                                                                                        <div
                                                                                                            className="position-relative">
                                                                                                            <DatePicker
                                                                                                                className="form-control"
                                                                                                                selected={date}
                                                                                                                dateFormat={showDateFormat(2)}
                                                                                                                placeholderText={showDatePlaceholder(2)}
                                                                                                                onChange={(date) => setDate(date)}
                                                                                                                ref={dateRef}
                                                                                                            />
                                                                                                            <i className="fa fa-calendar"
                                                                                                               style={{top: "15px"}}
                                                                                                               onClick={(e) => dateRef?.current.setFocus(true)}/>
                                                                                                        </div>
                                                                                                    </>
                                                                                                )}
                                                                                                <label
                                                                                                    className="form-label mt-1">{question.sub_label}</label>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div
                                                                                        className="modal-footer mt-3 p-0 ">
                                                                                        <button type="button"
                                                                                                className="btn modal_btn_outline mt-4">Cancel
                                                                                        </button>
                                                                                        <button type="button"
                                                                                                className="btn modal_btn mt-4">Save
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            }
                                                            <div
                                                                className="d-flex align-items-center justify-content-center mt-4 accordion_primary_btn">
                                                                <button type="submit" className="btn btn-primary">Finish
                                                                    & Send
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="tab-pane fade  p-4 message_accordion" id="messages3"
                                                     role="tabpanel" aria-labelledby="messages-tab3">
                                                    <div className="accordion" id="dAccordionExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="dHeadingOne">
                                                                <button className="accordion-button" type="button"
                                                                        data-bs-toggle="collapse"
                                                                        data-bs-target="#collapseMessage"
                                                                        aria-expanded="true"
                                                                        aria-controls="collapseMessage">
                                                                    <i className="fa fa-comments-o me-2"
                                                                       aria-hidden="true"/>Message
                                                                    with {userDetail.full_name}
                                                                </button>
                                                            </h2>
                                                            <div id="collapseMessage"
                                                                 className="accordion-collapse collapse show"
                                                                 aria-labelledby="dHeadingOne"
                                                                 data-bs-parent="#dAccordionExample">
                                                                <div className="accordion-body  chat_box">
                                                                    {messageList && messageList.map((item, index) =>
                                                                        <div key={index}
                                                                             className={`${index === 0 ? `chat_message_left` : `chat_message_right`} chat_message card`}>
                                                                            <h6>{item.name}</h6>
                                                                            <p>{item.message}</p>
                                                                            <div className="d-flex messages_timing">
                                                                            <span className="me-3">
                                                                                <i className="fa fa-clock-o"
                                                                                   aria-hidden="true"/> {item.time}
                                                                            </span>
                                                                                <span>
                                                                                <i className="fa fa-calendar"
                                                                                   aria-hidden="true"/> {item.date}
                                                                            </span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    <div
                                                                        className="mt-4 mb-2 d-flex align-items-center">
                                                                        <input type="text" className="form-control"
                                                                               readOnly
                                                                               placeholder="Enter Message.."/>
                                                                        <i className="fa fa-arrow-right black_bg"
                                                                           aria-hidden="true"/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="tab-pane fade p-4" id="contact3" role="tabpanel"
                                                     aria-labelledby="contact-tab3">
                                                    <div className="card background_grey_400">
                                                        <div
                                                            className="d-flex user_icon_list align-items-center border-bottom w-100 justify-content-center">
                                                            <span className="user_icon">{userDetail.icon}</span>
                                                            <p>
                                                                <span className="user_name">{userDetail.company}</span>
                                                                {userDetail.address && (
                                                                    <span
                                                                        className="user_detail">{userDetail.address}</span>
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="contact_client_portal py-4 mx-auto">
                                                            <div className="py-2 d-flex">
                                                                <span className="client_portal_title">User :</span>
                                                                <span
                                                                    className="client_portal_text">{userDetail.full_name}</span>
                                                            </div>
                                                            <div className="py-2 d-flex">
                                                                <span className="client_portal_title">Email :</span>
                                                                <span
                                                                    className="client_portal_text">{userDetail.email}</span>
                                                            </div>
                                                            {userDetail.phone && (
                                                                <div className="py-2 d-flex">
                                                                    <span className="client_portal_title">Phone :</span>
                                                                    <span
                                                                        className="client_portal_text">{userDetail.phone}</span>
                                                                </div>
                                                            )}
                                                            {userDetail.address && userDetail.web_site && (
                                                                <div className="py-2 d-flex">
                                                                    <span className="client_portal_title">Web :</span>
                                                                    <span
                                                                        className="client_portal_text">{userDetail.web_site}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="tab-pane fade Faq_tab p-4" id="dHelpTab" role="tabpanel"
                                                     aria-labelledby="help-tab3">
                                                    {youTube &&
                                                        <iframe width="100%" height="380" title="intro2"
                                                                src={youTube}
                                                                style={{borderRadius: '12px', marginBottom: '20px'}}/>
                                                    }
                                                    <h2 className="main_title ">FAQ</h2>
                                                    <div className="accordion" id="dfAccordionExample">
                                                        {faqList && faqList.map((item, index) =>
                                                            <div className="accordion-item" key={index}>
                                                                <h2 className="accordion-header" id={`dHelp${index}`}>
                                                                    <button className="accordion-button" type="button"
                                                                            data-bs-toggle="collapse"
                                                                            data-bs-target={`#dHelp${index}Message`}
                                                                            aria-expanded="true"
                                                                            aria-controls={`dHelp${index}Message`}>
                                                                        {item.question}
                                                                    </button>
                                                                </h2>
                                                                <div id={`dHelp${index}Message`}
                                                                     className="accordion-collapse collapse show"
                                                                     aria-labelledby={`dHelp${index}`}
                                                                     data-bs-parent="#dfAccordionExample">
                                                                    <div className="accordion-body  chat_box">
                                                                        {item.answer}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminEnvelopePreview;