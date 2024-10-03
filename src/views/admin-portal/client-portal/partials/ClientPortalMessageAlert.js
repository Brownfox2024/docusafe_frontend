import React, {useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../utils";
import {adminReadMessageAlert} from "../../../../services/AdminService";

function ClientPortalMessageAlert(props) {
    let {client} = useParams();

    const navigate = useNavigate();

    const clsMessageAlertRef = useRef(null);

    const onReadMessageAlert = (e, data) => {
        e.preventDefault();

        let obj = {
            client_id: client,
            entity_id: data.entity_id,
            from_id: data.from_id,
            to_id: data.to_id,
        };

        props.setLoading(true);
        adminReadMessageAlert(obj)
            .then(response => {
                let list = [...props.messageAlertList];
                let indexs = [];
                for (let i = 0; i < list.length; i++) {
                    if (parseInt(list[i]['entity_id']) === parseInt(data.entity_id) && parseInt(list[i]['from_id']) === parseInt(data.from_id) && parseInt(list[i]['to_id']) === parseInt(data.to_id)) {
                        indexs.push(i);
                    }
                }

                if (indexs.length > 0) {
                    indexs.reverse();
                    for (let i = 0; i < indexs.length; i++) {
                        list.splice(indexs[i], 1);
                    }
                }
                props.setTotalMessage(list.length);
                props.setMessageAlertList(list);

                props.setLoading(false);
                clsMessageAlertRef?.current.click();
                navigate('/back-admin/client-portal/' + client + '/manage/' + data.uuid + '/message');
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <div className="offcanvas offcanvas-end notification" data-bs-scroll="true" data-bs-backdrop="false"
             tabIndex="-1" id="message_box" aria-labelledby="message_boxLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="message_boxLabel">Messages</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        ref={clsMessageAlertRef} aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                {props.messageAlertList && props.messageAlertList.map((item, index) =>
                    <div key={index} className="card shadow mb-4 rounded mx-3 p-0">
                        <div className="cur-pointer" onClick={(e) => onReadMessageAlert(e, item)}>
                            <div className="card-body">
                                <h5 className="card-title">{item.envelope_name}</h5>
                                <p className="Sender_name">{item.recipient_name}</p>
                                <p className="card-text" style={{height: 'auto'}}>{item.message}</p>
                                <div className="d-flex messages_timing">
                                    <span className="me-3">
                                        <i className="fa fa-clock-o" aria-hidden="true"/> {item.time}
                                    </span>
                                    <span>
                                        <i className="fa fa-calendar" aria-hidden="true"/> {item.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {props.messageAlertList && props.messageAlertList.length === 0 && (
                    <div className="text-center">No new messages received.</div>
                )}
            </div>
        </div>
    );
}

export default ClientPortalMessageAlert;