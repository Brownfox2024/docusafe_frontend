import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {
    searchEnvelopeRecipient,
    updateEnvelopeRecipientStep,
} from "../../../../services/CommonService";
import Utils from "../../../../utils";
import EnvelopeRecipients from "./Recipients";
import {Lang} from "../../../../lang";

function EnvelopeStep2(props) {
    const navigate = useNavigate();

    const [docData, setDocData] = useState({
        id: 0,
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        country_id: 13,
        company_name: "",
        address_1: "",
        address_2: "",
        city: "",
        state: "",
        address_country_id: "",
        zip_code: "",
    });

    const buttonRef = useRef(null);

    const [searchRecipientList, setSearchRecipientList] = useState([]);
    const [recipientSearch, setRecipientSearch] = useState("");
    const [subject, setSubject] = useState("");
    const [emailText, setEmailText] = useState("");

    let errorsObj = {
        recipient: "",
        subject: "",
        email_text: "",
    };
    const [errors, setErrors] = useState(errorsObj);

    useEffect(function () {
        setSubject((props.formObj.subject) ? props.formObj.subject : '');
        setEmailText((props.formObj.email_text) ? props.formObj.email_text : '');
    }, [props]);

    function onBack(e) {
        e.preventDefault();
        const formData = {...props.formObj};
        formData.current_step = 1;
        props.setFormObj(formData);
        navigate('/client-portal/envelope/edit/' + formData.envelope_uuid + '/1');
    }

    function onRemoveRecipient(e, index) {
        e.preventDefault();
        const formData = {...props.formObj};
        formData.recipient_List.splice(index, 1);
        props.setFormObj(formData);
    }

    function onRecipientSearch(e) {
        e.preventDefault();
        if (recipientSearch.trim()) {
            searchEnvelopeRecipient({search: recipientSearch})
                .then((response) => {
                    setSearchRecipientList(response.data.data);
                })
                .catch((err) => {
                    toast.error(Utils.getErrorMessage(err));
                    setRecipientSearch("");
                });
        }
    }

    const handleSearchRecipient = (e, obj) => {
        e.preventDefault();
        const formData = {...props.formObj};
        let index = formData.recipient_List.findIndex((x) => x.email === obj.email);
        if (index === -1) {
            formData.recipient_List.push(obj);
            props.setFormObj(formData);
            setRecipientSearch("");
        } else {
            toast.error("Recipient already exist.");
        }
        setSearchRecipientList([]);
    };

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
        const formData = {...props.formObj};

        if (formData.recipient_List.length === 0) {
            errorObj.recipient = "Please add recipient";
            error = true;
        }
        if (!subject) {
            errorObj.subject = "Subject must be required";
            error = true;
        }
        if (!emailText) {
            errorObj.email_text = "Email text must be required";
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        props.setLoading(true);

        let recipientIds = "";
        for (let i = 0; i < formData.recipient_List.length; i++) {
            recipientIds += formData.recipient_List[i]["id"];
            if (formData.recipient_List.length !== i + 1) {
                recipientIds += ",";
            }
        }

        let obj = {
            envelope_id: formData.envelope_id,
            recipient_ids: recipientIds,
            email_subject: subject,
            email_text: emailText,
        };

        updateEnvelopeRecipientStep(obj)
            .then((response) => {
                if (type === 2) {
                    formData.current_step = 3;
                    formData.subject = subject;
                    formData.email_text = emailText;
                    props.setFormObj(formData);
                    navigate('/client-portal/envelope/edit/' + formData.envelope_uuid + '/3');
                } else {
                    navigate("/manage/draft");
                }
                toast.success(response.data.message);
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    }

    function onEditRecipient(e, obj) {
        e.preventDefault();
        let formData = {...docData};
        formData.id = obj.id;
        formData.first_name = obj.first_name;
        formData.last_name = obj.last_name;
        formData.email = obj.email;
        formData.mobile = obj.mobile;
        formData.country_id = obj.country_id;
        formData.company_name = obj.company_name ? obj.company_name : "";
        formData.address_1 = obj.address_1 ? obj.address_1 : "";
        formData.address_2 = obj.address_2 ? obj.address_2 : "";
        formData.city = obj.city ? obj.city : "";
        formData.state = obj.state ? obj.state : "";
        formData.zip_code = obj.zip_code ? obj.zip_code : "";
        formData.address_country_id = obj.address_country_id ? obj.address_country_id : "";
        setDocData(formData);
        buttonRef.current?.click();
    }

    const handleEnvInput = (e, type) => {

        let envelopeData = {...props.formObj};

        if (type === 'subject') {
            setSubject(e.target.value);
            envelopeData.subject = e.target.value;
        } else if (type === 'email_text') {
            setEmailText(e.target.value);
            envelopeData.email_text = e.target.value;
        }

        props.setFormObj(envelopeData);
    };

    const handleSearchOverlay = (e) => {
        e.preventDefault();
        setSearchRecipientList([]);
    };

    return (
        <>
            <div className=" step_wizard_content ">
                {searchRecipientList && searchRecipientList.length > 0 && (
                    <div className="list-group-overlay" onClick={handleSearchOverlay}/>
                )}
                <div className=" container">
                    <h2 className="main_title ">
                        Recipient Details
                        <i className="fa fa-question-circle ms-1" aria-hidden="true" data-toggle="tooltip"
                           data-placement="left" title={Lang.env_recipient_detail}/>
                    </h2>
                    <div className="card mb-4">
                        <div className="mb-4 search_input">
                            <div className="input-group position-relative me-3">
                                <input className="form-control border-end-0 border rounded-pill input-search-envelope"
                                       type="text" value={recipientSearch}
                                       onChange={(e) => setRecipientSearch(e.target.value)}
                                       onKeyUp={onRecipientSearch} placeholder="Search Recipient"/>
                                <span onClick={onRecipientSearch} className="input-group-append position-absolute">
                                    <i className="fa fa-search"/>
                                </span>
                                <ul className="list-group w-100"
                                    style={{position: "absolute", top: "45px", zIndex: "99"}}>
                                    {searchRecipientList && searchRecipientList.map((item, index) => (
                                        <li className="list-group-item cur-pointer"
                                            onClick={(e) => handleSearchRecipient(e, item)}
                                            key={index}>{item.first_name + " " + item.last_name + " (" + item.email + ")"}</li>
                                    ))}
                                </ul>
                            </div>
                            <button type="button" className="btn  add_recipients_btn" data-bs-toggle="offcanvas"
                                    ref={buttonRef} data-bs-target="#addRecipients" aria-controls="addRecipients"
                                    data-toggle="tooltip" title={Lang.env_add_recipient}>
                                <span className="me-3">+</span>Add Recipients
                            </button>
                        </div>
                        {props.formObj.recipient_List.map((item, index) => (
                            <div className="mb-3 recipients_data" key={index}>
                                <span className="recipients_name">
                                  {item.first_name + " " + item.last_name}
                                </span>
                                <span className="recipients_mail">{item.email}</span>
                                <span
                                    className="recipients_num">{Utils.mobileFormat(item)}</span>
                                <span className="edit" onClick={(event) => onEditRecipient(event, item)}>
                                    <i className="fa fa-pencil" aria-hidden="true" data-toggle="tooltip"
                                       title="click me to edit" data-bs-original-title="click me to edit"/>
                                </span>
                                <span className="close_btn" onClick={(e) => onRemoveRecipient(e, index)}>
                                    <i className="fa fa-times-circle" aria-hidden="true" data-toggle="tooltip"
                                       title="click to delete" data-bs-original-title="click to delete"/>
                                </span>
                            </div>
                        ))}
                        {errors.recipient && (
                            <div className="text-danger">{errors.recipient}</div>
                        )}
                    </div>
                    <h2 className="main_title ">Email Details</h2>
                    <div className="card">
                        <div className="mb-4">
                            <label htmlFor="email_subject" className="form-label mb-2">
                                Subject
                                <i className="fa fa-question-circle ms-1" aria-hidden="true" data-toggle="tooltip"
                                   data-placement="right" title={Lang.env_subject}/>
                            </label>
                            <input type="text" className="form-control" id="email_subject" value={subject}
                                   onChange={(e) => handleEnvInput(e, 'subject')} aria-describedby="emailHelp"
                                   placeholder="Enter Email Subject"/>
                            {errors.subject && (
                                <div className="text-danger">{errors.subject}</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email_text" className="form-label mb-2">
                                Email Text
                                <i className="fa fa-question-circle ms-1" aria-hidden="true" data-toggle="tooltip"
                                   data-placement="right" title={Lang.env_email_text}/>
                            </label>
                            <textarea className="form-control" id="email_text" rows={13} value={emailText}
                                      onChange={(e) => handleEnvInput(e, 'email_text')}
                                      placeholder="Enter Email text box"/>
                            {errors.email_text && (
                                <div className="text-danger">{errors.email_text}</div>
                            )}
                        </div>
                    </div>
                </div>

                <EnvelopeRecipients formObj={props.formObj} setFormObj={props.setFormObj} setLoading={props.setLoading}
                                    recipData={docData} setDocData={setDocData}/>
            </div>
            <div className="step_wizard_button shadow">
                <button type="button" onClick={onBack} className="btn btn_outline">Back</button>
                <button type="button" onClick={onSaveExit} className="btn btn_outline" data-toggle="tooltip"
                        title={Lang.env_save_exit}>Save & Exit
                </button>
                <button type="button" onClick={onNext} className="btn btn-primary">Next</button>
            </div>
        </>
    );
}

export default EnvelopeStep2;
