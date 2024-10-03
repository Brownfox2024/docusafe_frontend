import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../../utils";
import {adminSendCustomerMessage} from "../../../../../../services/AdminService";

function AdminEnvMessages(props) {
    const {client} = useParams();
    const [recipientsList, setRecipientsList] = useState([]);
    const [senderId, setSenderId] = useState(0);

    useEffect(function () {
        if (props.recipientList) {
            setRecipientsList(props.recipientList);
        }

        if (props.envelopeData) {
            setSenderId(props.envelopeData.sender_id);
        }

    }, [props]);

    const handleTextMessage = (e, index) => {
        let list = [...recipientsList];
        list[index]['msg'] = e.target.value;
        setRecipientsList(list);
    };

    const handleMessageClick = (e, index) => {
        if (e.key === 'Enter') {
            handleSendMessage(e, index);
        }
    };

    const handleSendMessage = (e, index) => {
        e.preventDefault();
        let error = false;
        let list = [...recipientsList];
        if (!list[index]['msg'].trim()) {
            list[index]['error'] = 'Please enter message';
            error = true;
        } else if (list[index]['msg'].length > 5000) {
            list[index]['error'] = "Message length should be 5000 or smaller only";
            error = true;
        } else {
            list[index]['error'] = '';
        }

        setRecipientsList(list);

        if (error) return;

        let obj = {
            client_id: client,
            from_id: senderId,
            to_id: list[index]['id'],
            entity_type: 1,
            entity_id: props.envelopeData.id,
            table_type: 1,
            message: list[index]['msg'].trim(),
        };

        props.setLoading(true);
        adminSendCustomerMessage(obj)
            .then(response => {
                let recList = [...recipientsList];
                recList[index]['msg'] = '';
                let msgData = response.data.data;
                msgData['sender_name'] = props.envelopeData.sender_name;
                recList[index]['messages'].push(msgData);
                setRecipientsList(recList);
                toast.success(response.data.message);
                props.setLoading(false);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    return (
        <>
            <div className="mb-3 d-flex justify-content-end">
                <button type="btn" className="bulk_btn" data-bs-toggle="offcanvas" data-bs-target="#BulkMessage"
                        aria-controls="BulkMessage">Send Bulk Message
                </button>
            </div>

            <div className="accordion" id="accordionMessage">
                {recipientsList && recipientsList.map((item, index) =>
                    <div key={index} className="accordion-item">
                        <h2 className="accordion-header" id={`heading_one_${index}`}>
                            <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target={`#collapse_message_${index}`} aria-expanded="true"
                                    aria-controls={`collapse_message_${index}`}>
                                <i className="fa fa-comments-o me-2" aria-hidden="true"/>
                                Message with {item.first_name + ` ` + item.last_name}
                            </button>
                        </h2>
                        <div id={`collapse_message_${index}`}
                             className={`accordion-collapse collapse ${item.active ? `show` : ``}`}
                             aria-labelledby={`heading_one_${index}`} data-bs-parent="#accordionMessage">
                            <div className="accordion-body chat_box">
                                {item.messages && item.messages.map((message, i) =>
                                    <div key={i}
                                         className={`chat_message card ${parseInt(senderId) === parseInt(message.created_by) ? `chat_message_left green_bg` : `chat_message_right`}`}>
                                        <h6>{message.sender_name}</h6>
                                        <p dangerouslySetInnerHTML={{__html: message.message}}/>
                                        <div className="d-flex messages_timing">
                                            <span className="me-3">
                                                <i className="fa fa-clock-o" aria-hidden="true"/> {message.time}
                                            </span>
                                            <span>
                                                <i className="fa fa-calendar" aria-hidden="true"/> {message.date}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 mb-2 d-flex align-items-center">
                                    <input type="text" className="form-control" value={item.msg}
                                           onKeyDown={(e) => handleMessageClick(e, index)}
                                           onChange={(e) => handleTextMessage(e, index)} placeholder="Enter Message.."/>
                                    <i className="fa fa-arrow-right black_bg"
                                       onClick={(e) => handleSendMessage(e, index)}
                                       aria-hidden="true"/>
                                </div>
                                {item.error &&
                                <div className="text-danger ms-3">{item.error}</div>
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminEnvMessages;