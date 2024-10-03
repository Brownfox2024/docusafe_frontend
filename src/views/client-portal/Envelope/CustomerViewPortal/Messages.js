import React, {useEffect, useState} from "react";
import {getCustomerMessageList} from "../../../../services/CommonService";

const Messages = (props) => {
    const [messageList, setMessageList] = useState([]);

    useEffect(() => {
        if (props?.envelopeData?.id) {
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
                                <input type="text" className="form-control" placeholder="Enter Message.." readOnly={true}/>
                                <i className="fa fa-arrow-right black_bg" aria-hidden="true" role="button"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
