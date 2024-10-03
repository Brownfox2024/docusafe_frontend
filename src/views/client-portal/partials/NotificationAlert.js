import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {readNotificationAlert} from "../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../utils";

function NotificationAlert(props) {
    const navigate = useNavigate();

    const clsNotificationAlertRef = useRef(null);

    const handleNotification = (e, data, index) => {
        e.preventDefault();

        props.setLoading(true);
        let obj = {
            envelope_id: data.envelope_id,
            recipient_id: data.recipient_id
        };
        readNotificationAlert(obj)
            .then(response => {
                let list = [...props.notificationList];
                list.splice(index, 1);

                props.setNotificationList(list);
                props.setTotalNotification(list.length);

                props.setLoading(false);

                clsNotificationAlertRef?.current.click();
                navigate('/manage/' + data.uuid);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <div className="offcanvas offcanvas-end notification" data-bs-scroll="true" data-bs-backdrop="false"
             tabIndex="-1" id="notification_box" aria-labelledby="notification_boxLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="notification_boxLabel">Envelope Alerts</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        ref={clsNotificationAlertRef} aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                {props.notificationList && props.notificationList.map((item, index) =>
                    <div key={index} className="card shadow mb-4 rounded mx-3 p-0">
                        <div className="cur-pointer" onClick={(e) => handleNotification(e, item, index)}>
                            <div className="card-body">
                                <h5 className="card-title">{item.envelope_name}</h5>
                                <p className="Sender_name">{item.recipient_name}</p>
                                <div className="progress_bar">
                                    <span className="progress_count">{parseFloat(item.percentage).toFixed(2)}% Completed</span>
                                    <div className="progress">
                                        <div className="progress-bar" role="progressbar"
                                             aria-label="Example with label" style={{width: item.percentage + '%'}}
                                             aria-valuenow={item.percentage} aria-valuemin="0" aria-valuemax="100"/>
                                    </div>
                                    <span
                                        className="progress_uploaded_count">Uploaded {item.upload_docs}/{item.total_docs}</span>
                                </div>
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

                {props.notificationList && props.notificationList.length === 0 && (
                    <div className="text-center">No new notifications received.</div>
                )}
            </div>
        </div>
    );
}

export default NotificationAlert;