import React, {useEffect, useState} from "react";
import {getCustomerMessageList, recipientSendMessage} from "../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../utils";

const Messages = (props) => {
    const [recipientName, setRecipientName] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");
    let errorsObj = {message: ""};
    const [errors, setErrors] = useState(errorsObj);

    useEffect(() => {
        if (props?.envelopeData?.id) {
            setRecipientName(props?.envelopeData?.recipient_detail.first_name + " " + props?.envelopeData?.recipient_detail.last_name);
            let obj = {
                from_id: props?.envelopeData?.recipient_detail?.id,
                to_id: props?.envelopeData?.sender_id,
                entity_type: 1,
                entity_id: props?.envelopeData?.id,
            };
            getCustomerMessageList(obj)
                .then((response) => {
                    setMessageList(response.data.data);
                })
                .catch((err) => {
                });
        }
    }, [props?.envelopeData]);

    const HandleClick = (e) => {
        e.preventDefault();
        let error = false;
        const errorObj = {...errorsObj};
        if (!message.trim()) {
            errorObj.message = "Message must be required";
            error = true;
        } else if (message.length > 5000) {
            errorObj.message = "Message length should be 5000 or smaller only";
            error = true;
        }

        setErrors(errorObj);
        if (error) return;

        if (props?.envelopeData?.id) {
            let obj = {
                from_id: props?.envelopeData?.recipient_detail?.id,
                to_id: props?.envelopeData?.sender_id,
                entity_type: 1,
                entity_id: props?.envelopeData?.id,
                table_type: 2,
                message: message.trim(),
            };
            recipientSendMessage(obj)
                .then((response) => {
                    toast.success(response.data.message);
                    setMessage("");
                    let msgObj = response.data.data;
                    msgObj["sender_name"] = recipientName;
                    let messages = [...messageList];
                    messages.push(msgObj);
                    setMessageList(messages);
                })
                .catch((err) => {
                    toast.error(Utils.getErrorMessage(err));
                });
        }
    };

    const handleSendMessage = (e) => {
        if (e.key === "Enter") {
            HandleClick(e);
        }

    };

    return (
        <div className="tab-pane fade  p-4 message_accordion" id="messages" role="tabpanel"
             aria-labelledby="messages-tab">
            <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseMessage" aria-expanded="true" aria-controls="collapseMessage">
                            <i className="fa fa-comments-o me-2" aria-hidden="true"/>
                            Message
                            with {props?.envelopeData?.contact_detail?.first_name + " " + props?.envelopeData?.contact_detail?.last_name}
                        </button>
                    </h2>
                    <div id="collapseMessage" className="accordion-collapse collapse show" aria-labelledby="headingOne"
                         data-bs-parent="#accordionExample">
                        <div className="accordion-body  chat_box">
                            {messageList &&
                            messageList.map((messages, index) => (
                                <div key={index}
                                     className={`${props?.envelopeData?.recipient_detail?.id === messages.created_by ? `chat_message_left green_bg` : `chat_message_right`} chat_message card`}>
                                    <h6>{messages.sender_name}</h6>
                                    <p dangerouslySetInnerHTML={{__html: messages.message}}/>
                                    <div className="d-flex messages_timing">
                                        <span className="me-3">
                                            <i className="fa fa-clock-o" aria-hidden="true"/>
                                            &nbsp; {messages.time}
                                            </span>
                                        <span>
                                            <i className="fa fa-calendar" aria-hidden="true"/>
                                            &nbsp; {messages.date}
                                            </span>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-4 mb-2 d-flex align-items-center">
                                <input type="text" className="form-control" placeholder="Enter Message.."
                                       onKeyDown={handleSendMessage} value={message}
                                       onChange={(e) => setMessage(e.target.value)}/>
                                <i className="fa fa-arrow-right black_bg" aria-hidden="true" role="button"
                                   onClick={HandleClick}/>
                            </div>
                            {errors.message && (
                                <div className="text-danger form-text">
                                    {errors.message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
