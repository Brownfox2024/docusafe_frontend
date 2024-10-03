import React, {useState, useEffect, useRef} from "react";
import {useNavigate, useParams} from 'react-router-dom';
import Utils from "../../../../../../utils";
import {toast} from "react-toastify";
import {
    adminGetEnvelopeExpireDocuments,
    adminSendEnvelopeExpireDocuments
} from "../../../../../../services/AdminService";
import {DATE_FORMAT_LIST} from "../../../../../../configs/AppConfig";
import {Lang} from "../../../../../../lang";
import DatePicker from "react-datepicker";

function AdminExpiredDocument() {
    const [loading, setLoading] = useState(true);
    const {client, id} = useParams();
    const navigate = useNavigate();

    const [envelopeData, setEnvelopeData] = useState({});
    const [pastDate, setPastDate] = useState(new Date());
    const [envelopeName, setEnvelopeName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [clientMessage, setClientMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [emailText, setEmailText] = useState('');
    const [recipientList, setRecipientList] = useState([]);
    const [isInvited, setIsInvited] = useState(0);

    let errorsObj = {
        envelope_date: '',
        client_message: '',
        subject: '',
        email_text: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const dueDateRef = useRef(null);

    useEffect(function () {

        setPastDate(Utils.pastDate());

        let obj = {
            id: id,
            client_id: client
        };
        adminGetEnvelopeExpireDocuments(obj)
            .then(response => {
                setEnvelopeData(response.data.data);
                setEnvelopeName(response.data.data.envelope_name);
                setDueDate(response.data.data.envelope_date);
                setClientMessage(response.data.data.message);
                setSubject(response.data.data.email_subject);
                setEmailText(response.data.data.email_text);
                setRecipientList(response.data.data.recipient_list);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
                navigate('/back-admin/client-portal/' + client + '/manage/completed');
            });
    }, [client, id, navigate]);

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

    const showDatePlaceholder = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['text'];
        }
        return value;
    };

    const onRemoveRecipient = (e, index) => {
        e.preventDefault();
        let list = [...recipientList];
        list.splice(index, 1);
        setRecipientList(list);
    };

    const handleRecipientCheck = (e, index) => {
        let list = [...recipientList];
        list[index]['checked'] = e.target.checked;

        for (let i = 0; i < list[index]['documents'].length; i++) {
            list[index]['documents'][i]['checked'] = e.target.checked;
        }

        setRecipientList(list);
    };

    const handleRecipientDocumentCheck = (e, index, idx) => {
        let list = [...recipientList];
        list[index]['documents'][idx]['checked'] = e.target.checked;

        let count = 0;
        for (let i = 0; i < list[index]['documents'].length; i++) {
            if (list[index]['documents'][i]['checked']) {
                count++;
            }
        }

        if (list[index]['documents'].length === count) {
            list[index]['checked'] = true;
        } else {
            list[index]['checked'] = false;
        }

        setRecipientList(list);
    };

    const handleSendEnvelope = (e) => {
        e.preventDefault();
        let error = false;
        let errorObj = {...errorsObj};
        if (!dueDate) {
            errorObj.envelope_date = 'Please select date';
            error = true;
        }
        if (!clientMessage) {
            errorObj.client_message = 'Client message must be required.';
            error = true;
        }
        if (!subject) {
            errorObj.subject = 'Subject must be required.';
            error = true;
        }
        if (!emailText) {
            errorObj.email_text = 'Email text must be required.';
            error = true;
        }

        setErrors(errorObj);
        if (error) return;

        let list = [...recipientList];
        let recipients = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i]['checked']) {
                recipients.push({id: list[i]['id'], docsId: []});
            }
            for (let d = 0; d < list[i]['documents'].length; d++) {
                if (list[i]['documents'][d]['checked']) {
                    let index = recipients.findIndex(x => x.id === list[i]['id']);
                    if (index > -1) {
                        recipients[index]['docsId'].push(list[i]['documents'][d]['id']);
                    } else {
                        recipients.push({id: list[i]['id'], docsId: [list[i]['documents'][d]['id']]});
                    }
                }
            }
        }

        if (recipients.length > 0) {
            setLoading(true);
            let obj = {
                client_id: client,
                uuid: envelopeData.uuid,
                due_date: dueDate,
                client_message: clientMessage,
                subject: subject,
                email_text: emailText,
                recipients: recipients
            };
            adminSendEnvelopeExpireDocuments(obj)
                .then(response => {
                    setLoading(false);
                    setIsInvited(1);
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        } else {
            toast.error('Please select any one documents');
        }
    };

    function onViewEnvelope(e) {
        e.preventDefault();
        navigate('/back-admin/client-portal/' + client + "/manage/" + envelopeData.uuid);
    }

    const onEnvelopeStart = (e) => {
        e.preventDefault();
        navigate('/back-admin/client-portal/' + client);
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}

            {isInvited === 1 && (
                <div className=" step_wizard_content invite_card_section" style={{minHeight: 'calc(100vh - 119px)'}}>
                    <div className=" container">
                        <div className="card invite_card">
                            <img src="/images/invite.png" alt="invite img" className="invite_img mb-5"/>
                            <label className="mb-4 text-center">Your Envelope has been successfully sent.</label>
                            <p className="mb-4 text-center">We will notify you when there is activity on the
                                Envelope.</p>
                            <div className="mb-4 text-center">
                                <button className="modal_btn_outline me-3 mb-3" data-toggle="tooltip"
                                        title={Lang.env_view_envelope} onClick={onViewEnvelope}>View your Envelope
                                </button>
                                <button className="modal_btn" data-toggle="tooltip"
                                        title={Lang.env_create_another} onClick={onEnvelopeStart}>Create another
                                    Envelope
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isInvited === 0 && (
                <section className="main_wrapper background_grey_400 detail_page"
                         style={{minHeight: 'calc(100vh - 119px)'}}>
                    <div className="step_wizard">
                        <div className="container">
                            <ul className="steps_list">
                                <li className="active">Envelope Details</li>
                                <li className="dashed_border"/>
                                <li className="active">Recipients</li>
                                <li className="dashed_border"/>
                                <li className="active">Request Documents</li>
                                <li className="dashed_border"/>
                                <li className="">Review & Send</li>
                            </ul>
                        </div>
                    </div>

                    <div className="step_wizard_content">
                        <div className=" container">
                            <h2 className="main_title text_blue ps-0">Envelope Details</h2>
                            <div className="card mb-5">
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="mb-4">
                                            <label htmlFor="envelop_name" className="form-label mb-2">
                                                Envelope Name
                                                <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                                   data-toggle="tooltip" data-placement="right"
                                                   title={Lang.env_envelope_name}/>
                                            </label>
                                            <input type="text" className="form-control" id="envelop_name" readOnly
                                                   value={envelopeName}
                                                   onChange={(e) => setEnvelopeName(e.target.value)}
                                                   aria-describedby="emailHelp" placeholder="Enter Envelope Name"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-4 position-relative">
                                            <label htmlFor="due_date" className="form-label mb-2">
                                                Due Date
                                                <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                                   data-toggle="tooltip" data-placement="right"
                                                   title={Lang.env_due_date}/>
                                            </label>
                                            <DatePicker className="form-control" selected={showDate(dueDate)}
                                                        dateFormat={showDateFormat(1)} minDate={pastDate}
                                                        ref={dueDateRef}
                                                        placeholderText={showDatePlaceholder(1)}
                                                        onChange={(date) => setDueDate(date)}/>
                                            <i className="fa fa-calendar"
                                               onClick={(e) => dueDateRef?.current.setFocus(true)}/>
                                            {errors.envelope_date &&
                                            <div className="text-danger">{errors.envelope_date}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-0">
                                            <label className="form-label mb-2">
                                                Client Portal Message
                                                <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                                   data-toggle="tooltip" data-placement="right"
                                                   title={Lang.env_client_message}/>
                                            </label>
                                            <textarea className="form-control" rows={10} value={clientMessage}
                                                      onChange={(e) => setClientMessage(e.target.value)}
                                                      placeholder="Enter Message to Client"/>
                                            {errors.client_message && (
                                                <div className="text-danger">{errors.client_message}</div>)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className=" mb-4 d-flex justify-content-between flex_wrap">
                                <h2 className="main_title ps-0 text_blue">Recipient Details</h2>
                            </div>
                            <div className="card mb-5 p-3">
                                {recipientList && recipientList.map((item, index) => (
                                    <div className="mb-3 recipients_data" key={index}>
                                    <span className="recipients_name">
                                        {item.first_name + " " + item.last_name}
                                    </span>
                                        <span className="recipients_mail">{item.email}</span>
                                        <span
                                            className="recipients_num">{Utils.mobileFormat(item)}</span>
                                        <span className="close_btn" onClick={(e) => onRemoveRecipient(e, index)}>
                                        <i className="fa fa-times-circle" aria-hidden="true" data-toggle="tooltip"
                                           title="click to delete" data-bs-original-title="click to delete"/>
                                    </span>
                                    </div>
                                ))}
                            </div>

                            <h2 className="main_title text_blue ps-0">Email Details</h2>
                            <div className="card mb-5">
                                <div className="mb-4">
                                    <label htmlFor="email_subject" className="form-label mb-2">
                                        Subject
                                        <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                           data-toggle="tooltip" data-placement="right" title={Lang.env_subject}/>
                                    </label>
                                    <input type="text" className="form-control" id="email_subject" value={subject}
                                           onChange={(e) => setSubject(e.target.value)}
                                           placeholder="Enter Email Subject"/>
                                    {errors.subject && (
                                        <div className="text-danger">{errors.subject}</div>)}
                                </div>
                                <div className="mb-0">
                                    <label htmlFor="email_text" className="form-label mb-2">
                                        Email Text
                                        <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                           data-toggle="tooltip" data-placement="right" title={Lang.env_email_text}/>
                                    </label>
                                    <textarea className="form-control" id="email_text" rows={13} value={emailText}
                                              onChange={(e) => setEmailText(e.target.value)}
                                              placeholder="Enter Email text box"/>
                                    {errors.email_text && (
                                        <div className="text-danger">{errors.email_text}</div>)}
                                </div>
                            </div>

                            <div className=" mb-4 d-flex justify-content-between flex_wrap">
                                <h2 className="main_title ps-0 text_blue">Request Documents</h2>
                            </div>
                            <div className="mt-4 mb-5 card p-3">
                                {recipientList && recipientList.map((item, index) => (
                                    <div className="accordion" key={index} id={`recipientAccordion_${index}`}>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id={`heading_${index}`}>
                                                <button className="accordion-button py-2 rounded-0" type="button"
                                                        data-bs-toggle="collapse" data-bs-target={`#collapse_${index}`}
                                                        aria-expanded="true" aria-controls={`collapse_${index}`}>
                                                    <label data-bs-toggle="collapse">
                                                        <input className="form-check-input me-2 mt-2"
                                                               checked={item.checked}
                                                               onChange={(e) => handleRecipientCheck(e, index)}
                                                               type="checkbox"/>
                                                        {item.first_name + " " + item.last_name}
                                                    </label>
                                                </button>
                                            </h2>
                                            <div id={`collapse_${index}`} className="accordion-collapse collapse show"
                                                 aria-labelledby={`heading_${index}`}
                                                 data-bs-parent={`recipientAccordion_${index}`}>
                                                <div className="accordion-body">
                                                    {item.documents.map((data, idx) => (
                                                        <div key={idx}
                                                             className="d-block rounded-pill background_grey_400 w-100 px-4 py-3 my-3">
                                                            <label>
                                                                <input className="form-check-input me-2 mt-1"
                                                                       type="checkbox" checked={data.checked}
                                                                       onChange={(e) => handleRecipientDocumentCheck(e, index, idx)}/>
                                                                {data.name}
                                                            </label>
                                                            <span className="float-end">{data.expiry_date}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="step_wizard_button shadow justify-content-end">
                        <button type="button" onClick={handleSendEnvelope} data-toggle="tooltip" title={Lang.env_send}
                                className="btn btn-primary">Send Envelope
                        </button>
                    </div>
                </section>
            )}
        </>
    );
}

export default AdminExpiredDocument;