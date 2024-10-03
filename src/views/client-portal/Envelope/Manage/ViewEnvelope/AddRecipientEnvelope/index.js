import React, {useEffect, useState, useRef} from "react";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {addRecipientViewEnvelope, getEnvelopeDataInAddRecipient} from "../../../../../../services/CommonService";
import SearchRecipient from "./SearchRecipient";
import AddRecipient from "./AddRecipient";
import {toast} from "react-toastify";
import Utils from "../../../../../../utils";
import {Lang} from "../../../../../../lang";

function AddRecipientEnvelope() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [pastDate, setPastDate] = useState('2022-11-14');
    const [loading, setLoading] = useState(false);
    const [recipientList, setRecipientList] = useState([]);
    const [envelopeName, setEnvelopeName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [clientMessage, setClientMessage] = useState('');
    const [envelopeId, setEnvelopeId] = useState(0);
    const [documentList, setDocumentList] = useState([]);
    const [formList, setFormList] = useState([]);
    const [envelopeData, setEnvelopeData] = useState();

    let errorsObj = {
        envelope_name: '',
        due_date: '',
        client_message: '',
        recipients: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const [recipientData, setRecipientData] = useState({
        id: 0,
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        country_code: '',
        country_id: '',
        company_name: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        address_country_id: '',
        zip_code: ''
    });

    const openRecipientModalRef = useRef(null);
    const dueDateRef = useRef(null);

    useState(function () {
        setPastDate(Utils.pastDate());
    }, []);

    useEffect(function () {
        setLoading(true);
        getEnvelopeDataInAddRecipient({id: id})
            .then(response => {
                setEnvelopeData(response.data.data);
                setEnvelopeId(parseInt(response.data.data.id));
                setDueDate(response.data.data.due_date);
                setEnvelopeName(response.data.data.envelope_name);
                setClientMessage(response.data.data.message);
                setRecipientList(response.data.data.recipients);
                setDocumentList(response.data.data.documents);
                setFormList(response.data.data.forms);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                navigate("/manage/" + id);
            });

    }, [id, navigate]);

    const handleSendInvite = async (e) => {
        e.preventDefault();
        let errorObj = {...errorsObj};
        let error = false;

        if (!envelopeName) {
            errorObj.envelope_name = "Please enter envelope name.";
            error = true;
        }
        if (!dueDate) {
            errorObj.due_date = "Please select date";
            error = true;
        }
        if (!clientMessage) {
            errorObj.client_message = "Please enter client message";
            error = true;
        }
        if (recipientList.length === 0) {
            errorObj.recipients = "Please add recipient";
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        setLoading(true);

        let recipientIds = "";
        for (let i = 0; i < recipientList.length; i++) {
            recipientIds += recipientList[i]["id"];
            if (recipientList.length !== i + 1) {
                recipientIds += ",";
            }
        }

        let newRecipientList = [];
        let existList = envelopeData.recipient_ids.split(',');
        for (let i = 0; i < recipientList.length; i++) {
            let index = existList.findIndex(x => parseInt(x) === parseInt(recipientList[i]["id"]));
            if (index === -1) {
                newRecipientList.push({
                    id: recipientList[i]["id"],
                    name: recipientList[i]["first_name"] + " " + recipientList[i]["last_name"],
                    email: recipientList[i]["email"]
                });
            }
        }

        let dList = [...documentList];
        for (let i = 0; i < dList.length; i++) {
            let requestIds = dList[i]['request_id'].split(',');
            let index = requestIds.findIndex(x => parseInt(x) === 0);
            if (index === -1) {
                for (let r = 0; r < recipientList.length; r++) {
                    if (recipientList[r]['doc_id']) {
                        if ((recipientList[r]['doc_id'].findIndex(x => parseInt(x.value) === parseInt(dList[i]['id']))) === -1) {
                            let idx = requestIds.findIndex(x => parseInt(x) === parseInt(recipientList[r]['id']));
                            if (idx === -1) {
                                dList[i]['request_id'] = dList[i]['request_id'] + ',' + recipientList[r]['id'];
                            }
                        }
                    }
                }
            }
        }

        let fList = [...formList];
        for (let i = 0; i < fList.length; i++) {
            let requestIds = fList[i]['request_id'].split(',');
            let index = requestIds.findIndex(x => parseInt(x) === 0);
            if (index === -1) {
                for (let r = 0; r < recipientList.length; r++) {
                    if (recipientList[r]['form_id']) {
                        if ((recipientList[r]['form_id'].findIndex(x => parseInt(x.value) === parseInt(fList[i]['id']))) === -1) {
                            let idx = requestIds.findIndex(x => parseInt(x) === parseInt(recipientList[r]['id']));
                            if (idx === -1) {
                                fList[i]['request_id'] = fList[i]['request_id'] + ',' + recipientList[r]['id'];
                            }
                        }
                    }
                }
            }
        }

        let ipAddress = '';
        await Utils.getIpAddress().then(response => {
            ipAddress = response;
        });

        let obj = {
            id: envelopeId,
            uuid: id,
            sender_id: envelopeData.sender_id,
            email_subject: envelopeData.email_subject,
            email_text: envelopeData.email_text,
            envelope_name: envelopeName,
            due_date: dueDate,
            client_message: clientMessage,
            recipient_ids: recipientIds,
            new_recipient_list: newRecipientList,
            doc_list: dList,
            form_list: fList,
            ip_address: ipAddress
        };

        addRecipientViewEnvelope(obj)
            .then(response => {
                setLoading(false);
                navigate("/manage/" + id);
                toast.success(response.data.message);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleRemoveRecipient = (e, index) => {
        e.preventDefault();
        let recipients = [...recipientList];
        recipients.splice(index, 1);
        setRecipientList(recipients);
    };

    const handleEditRecipient = (e, item) => {
        e.preventDefault();

        setRecipientData(item);

        openRecipientModalRef?.current.click();
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <section className="main_wrapper background_grey_400" style={{minHeight: 'calc(100vh - 119px)'}}>
                <h2 className="main_title mb-4 d-flex align-items-center py-3 px-5 border-bottom bread_crumb flexWrap">
                    <NavLink to={"/manage"} className="text_blue">Envelopes</NavLink>
                    <i className="fa fa-angle-double-right mx-3"/>
                    <NavLink to={"/manage/" + id} className="text_blue">{envelopeName}</NavLink>
                    <i className="fa fa-angle-double-right mx-3"/>
                    Add Recipients
                </h2>
                <div className="step_wizard_content">
                    <div className="container">
                        <div className="mb-4 d-flex justify-content-between flex_wrap">
                            <h2 className="main_title ps-0">New Recipient Details</h2>
                            <div className="d-flex flex_wrap">
                                <button type="button" className="btn shadow load_template_btn me-2"
                                        data-bs-toggle="offcanvas" data-bs-target="#SearchRecipients"
                                        aria-controls="SearchRecipients">
                                    <i className="fa fa-search me-3"/> Search Recipients
                                </button>
                                <button type="button" className="btn shadow add_recipients_btn"
                                        data-bs-toggle="offcanvas" data-bs-target="#addRecipients"
                                        data-toggle="tooltip" title={Lang.env_add_recipient}
                                        ref={openRecipientModalRef} aria-controls="addRecipients">
                                    <span className="me-3">+</span>Add Recipients
                                </button>
                            </div>
                        </div>
                        <div className="card mb-5 p-3">
                            {recipientList.map((item, index) =>
                                <div key={index} className="mb-3 recipients_data">
                                    <span className="recipients_name">{item.first_name + ` ` + item.last_name}</span>
                                    <span className="recipients_mail">{item.email}</span>
                                    <span className="recipients_num">{item.mobile}</span>
                                    <span className="edit">
                                        <i className="fa fa-pencil" onClick={(e) => handleEditRecipient(e, item)}
                                           aria-hidden="true"/>
                                    </span>
                                    <span className="close_btn">
                                        <i className="fa fa-times-circle"
                                           onClick={(e) => handleRemoveRecipient(e, index)} aria-hidden="true"/>
                                    </span>
                                </div>
                            )}
                            {errors.recipients && <div className="text-danger">{errors.recipients}</div>}
                        </div>
                        <h2 className="main_title ps-0">Envelope Details</h2>
                        <div className="card mb-5">
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="mb-4">
                                        <label htmlFor="envelop_name" className="form-label mb-2">Envelope Name
                                            <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                               data-toggle="tooltip" data-placement="right"
                                               title={Lang.env_envelope_name}/>
                                        </label>
                                        <input type="text" className="form-control" id="envelop_name"
                                               value={envelopeName} onChange={(e) => setEnvelopeName(e.target.value)}
                                               placeholder="Enter Envelope Name"/>
                                        {errors.envelope_name &&
                                        <div className="text-danger mt-1 ms-2">{errors.envelope_name}</div>}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-4 position-relative">
                                        <label htmlFor="due_date" className="form-label mb-2">Update Due Date
                                            <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                               data-toggle="tooltip" data-placement="right"
                                               title={Lang.env_due_date}/>
                                        </label>
                                        <input type="date" className="form-control" id="due_date" value={dueDate}
                                               onChange={(e) => setDueDate(e.target.value)} min={pastDate}
                                               ref={dueDateRef} placeholder="Enter Due Date"/>
                                        <i className="fa fa-calendar" onClick={(e) => dueDateRef?.current.click()}/>
                                        {errors.due_date &&
                                        <div className="text-danger mt-1 ms-2">{errors.due_date}</div>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="mb-0">
                                        <label htmlFor="client_message" className="form-label mb-2">Client Portal
                                            Message (optional)
                                            <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                               data-toggle="tooltip" data-placement="right"
                                               title={Lang.env_client_message}/>
                                        </label>
                                        <textarea className="form-control" id="client_message" rows={10}
                                                  value={clientMessage}
                                                  onChange={(e) => setClientMessage(e.target.value)}
                                                  placeholder="Enter Message to Client"/>
                                        {errors.client_message &&
                                        <div className="text-danger mt-1 ms-2">{errors.client_message}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <AddRecipient docList={documentList} formList={formList} recipientList={recipientList}
                                  setRecipientList={setRecipientList} recipientData={recipientData}
                                  setRecipientData={setRecipientData} setLoading={setLoading} envelopeId={envelopeId}/>

                    <SearchRecipient docList={documentList} formList={formList} recipientList={recipientList}
                                     setRecipientList={setRecipientList}/>
                </div>

                <div className="step_wizard_button shadow justify-content-center">
                    <button type="button" onClick={handleSendInvite} className="btn btn-primary">Send Invite</button>
                </div>
            </section>
        </>
    );
}

export default AddRecipientEnvelope;