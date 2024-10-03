import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {createEnvelope, updateEnvelope} from "../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../utils";
import {Lang} from "../../../../lang";
import DatePicker from "react-datepicker";
import {DATE_FORMAT_LIST} from "../../../../configs/AppConfig";

function EnvelopeStep1(props) {
    const navigate = useNavigate();
    const [pastDate, setPastDate] = useState(new Date());
    const [senderList, setSenderList] = useState([]);
    const [envelopeSenderId, setEnvelopeSenderId] = useState(0);
    const [envelopeName, setEnvelopeName] = useState('');
    const [envelopeDate, setEnvelopeDate] = useState('');
    const [clientMessage, setClientMessage] = useState('');

    const dueDateRef = useRef(null);

    let errorsObj = {
        sender_id: '',
        envelope_name: '',
        envelope_date: '',
        client_message: '',
    };
    const [errors, setErrors] = useState(errorsObj);

    useEffect(() => {

        setPastDate(Utils.pastDate());

        if (props?.senderList.length > 0) {
            setSenderList(props.senderList);
        }
        setEnvelopeSenderId((props.formObj.sender_id) ? props.formObj.sender_id : 0);

        if (!props.formObj.sender_id) {
            let index = props?.senderList.findIndex(x => x.is_login_user === true);
            if (index > -1) {
                setEnvelopeSenderId(props.senderList[index]['id']);
            }
        }

        setEnvelopeName((props.formObj.envelope_name) ? props.formObj.envelope_name : '');
        setEnvelopeDate((props.formObj.envelope_date) ? props.formObj.envelope_date : '');
        setClientMessage((props.formObj.client_message) ? props.formObj.client_message : '');
    }, [props]);

    function onBack(e) {
        e.preventDefault();
        navigate('/client-portal');
    }

    function onSaveExit(e) {
        e.preventDefault();
        onSubmitForm(1);
    }

    function onNext(e) {
        e.preventDefault();
        onSubmitForm(2);
    }

    function onSubmitForm(type) {
        let error = false;
        const errorObj = {...errorsObj};
        if (!envelopeSenderId) {
            errorObj.sender_id = 'Please select sender';
            error = true;
        }
        if (!envelopeName) {
            errorObj.envelope_name = 'Envelope name must be required';
            error = true;
        }
        if (!envelopeDate) {
            errorObj.envelope_date = 'Please select date';
            error = true;
        }
        if (!clientMessage) {
            errorObj.client_message = 'Please enter message';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        const formData = {...props.formObj};

        let obj = {
            sender_id: envelopeSenderId,
            envelope_name: envelopeName,
            due_date: envelopeDate,
            message: clientMessage
        };

        props.setLoading(true);
        if (formData.envelope_id > 0) {
            obj['envelope_id'] = formData.envelope_id;
            updateEnvelope(obj)
                .then(response => {
                    if (type === 2) {
                        formData.current_step = 2;
                        formData.sender_id = envelopeSenderId;
                        formData.envelope_name = envelopeName;
                        formData.envelope_date = envelopeDate;
                        formData.client_message = clientMessage;
                        props.setFormObj(formData);
                        navigate('/client-portal/envelope/edit/' + formData.envelope_uuid + '/2');
                    } else {
                        navigate('/manage/draft');
                    }
                    toast.success(response.data.message);
                    props.setLoading(false);
                })
                .catch(err => {
                    toast.error(Utils.getErrorMessage(err));
                    props.setLoading(false);
                });
        } else {
            obj['send_reminder'] = formData.send_reminder;
            obj['over_due_reminder'] = formData.over_due_reminder;
            createEnvelope(obj)
                .then(response => {
                    if (type === 2) {
                        formData.envelope_id = response.data.id;
                        formData.envelope_uuid = response.data.uuid;
                        formData.current_step = 2;
                        formData.sender_id = envelopeSenderId;
                        formData.envelope_name = envelopeName;
                        formData.envelope_date = envelopeDate;
                        formData.client_message = clientMessage;
                        props.setFormObj(formData);
                        navigate('/client-portal/envelope/edit/' + response.data.uuid + '/2');
                    } else {
                        navigate('/client-portal');
                    }
                    toast.success(response.data.message);
                    props.setLoading(false);
                })
                .catch(err => {
                    toast.error(Utils.getErrorMessage(err));
                    props.setLoading(false);
                });
        }
    }

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

    return (
        <>
            <div className=" step_wizard_content ">
                <div className=" container">
                    <h2 className="main_title ">Envelope Sender</h2>
                    <div className="card mb-5">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="mb-0">
                                    <select className="form-select bg_blue border-0" value={envelopeSenderId}
                                            onChange={(e) => setEnvelopeSenderId(e.target.value)}
                                            aria-label="Default select example">
                                        <option value="0">Select envelope sender</option>
                                        {senderList && senderList.map((item, i) =>
                                            <option value={item.id}
                                                    key={i}>{item.first_name + ' ' + item.last_name + ' (' + item.email + ')'}</option>
                                        )}
                                    </select>
                                    {errors.sender_id &&
                                    <div className="text-danger">{errors.sender_id}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2 className="main_title ">Envelope Details</h2>
                    <div className="card mb-5">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="mb-4">
                                    <label htmlFor="envelop_name" className="form-label mb-2">Envelope Name <i
                                        className="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip"
                                        data-placement="right" title={Lang.env_envelope_name}/></label>
                                    <input type="text" className="form-control" id="envelop_name"
                                           onChange={(e) => setEnvelopeName(e.target.value)} value={envelopeName}
                                           aria-describedby="emailHelp" placeholder="Enter Envelope Name"/>
                                    {errors.envelope_name &&
                                    <div className="text-danger">{errors.envelope_name}</div>}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mb-4 position-relative">
                                    <label htmlFor="due_date" className="form-label mb-2">Due Date <i
                                        className="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip"
                                        data-placement="right" title={Lang.env_due_date}/>
                                    </label>
                                    <DatePicker
                                        selected={showDate(envelopeDate)}
                                        dateFormat={showDateFormat(1)}
                                        minDate={pastDate} ref={dueDateRef}
                                        className="form-control"
                                        placeholderText={showDatePlaceholder(1)}
                                        onChange={(date) => setEnvelopeDate(date)}/>
                                    <i className="fa fa-calendar" onClick={(e) => dueDateRef?.current.setFocus(true)}/>
                                    {errors.envelope_date &&
                                    <div className="text-danger">{errors.envelope_date}</div>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="mb-0">
                                    <label htmlFor="due_date" className="form-label mb-2">Client Portal Message <i
                                        className="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip"
                                        data-placement="right" title={Lang.env_client_message}/>
                                    </label>
                                    <textarea className="form-control" id="exampleFormControlTextarea1" rows={10}
                                              onChange={(e) => setClientMessage(e.target.value)}
                                              value={clientMessage} placeholder="Enter Message to Client"/>
                                    {errors.client_message &&
                                    <div className="text-danger">{errors.client_message}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="step_wizard_button shadow">
                <button type="button" onClick={onBack} className="btn btn_outline">Back</button>
                <button type="button" onClick={onSaveExit} data-toggle="tooltip" title={Lang.env_save_exit}
                        className="btn btn_outline">Save & Exit
                </button>
                <button type="button" onClick={onNext} className="btn btn-primary">Next</button>
            </div>
        </>
    );
}

export default EnvelopeStep1;