import React, {useState, useRef} from "react";
import {toast} from "react-toastify";
import {manageEnvelopeBulkMessage} from "../../../../../services/CommonService";
import Utils from "../../../../../utils";

function BulkMessage(props) {
    const [recipientId, setRecipientId] = useState(-1);
    const [message, setMessage] = useState('');
    let errorsObj = {
        recipient_id: '',
        message: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsBulkMessageRef = useRef(null);

    const handleSendBulkMessage = (e) => {
        e.preventDefault();
        let errorObj = {...errorsObj};
        let error = false;

        if (recipientId === -1) {
            errorObj.recipient_id = 'Please select recipient';
            error = true;
        }
        if (!message) {
            errorObj.message = 'Please enter message';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        let ids = [];
        if (parseInt(recipientId) === 0) {
            for (let i = 0; i < props.recipientList.length; i++) {
                ids.push(parseInt(props.recipientList[i]['id']));
            }
        } else {
            ids.push(parseInt(recipientId));
        }

        if (ids.length > 0) {
            props.setLoading(true);

            let obj = {
                ids: ids,
                from_id: props.envelopeData.sender_id,
                entity_id: props.envelopeData.id,
                message: message
            };

            manageEnvelopeBulkMessage(obj)
                .then(response => {
                    let list = [...props.recipientList];
                    for (let i = 0; i < list.length; i++) {
                        let index = ids.findIndex(x => x === parseInt(list[i]['id']));
                        if (index > -1) {
                            let msgData = response.data.data;
                            msgData['sender_name'] = props.envelopeData.sender_name;
                            list[i]['messages'].push(msgData);
                        }
                    }
                    props.setRecipientList(list);
                    clsBulkMessageRef?.current.click();
                    props.setLoading(false);
                    toast.success(response.data.message);
                })
                .catch(err => {
                    props.setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        } else {
            toast.error('Oops...something went wrong.');
        }
    };

    const handleCloseBulkMessage = (e) => {
        e.preventDefault();

        setRecipientId(-1);
        setMessage('');
        setErrors(errorsObj);
    };

    return (
        <div className="offcanvas offcanvas-end AddDocument" data-bs-scroll="true" tabIndex="-1" id="BulkMessage"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="BulkMessageLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="BulkMessageLabel">Bulk Messages</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        ref={clsBulkMessageRef} onClick={handleCloseBulkMessage} aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                <div className="mx-3">
                    <div className="mb-4 ">
                        <label htmlFor="Select_two" className="form-label mb-3">Message Recipient
                            <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true" data-toggle="tooltip"
                               data-placement="right" title="How Can i help you?"/>
                        </label>
                        <select className="form-select" value={recipientId}
                                onChange={(e) => setRecipientId(e.target.value)} aria-label="Default select example">
                            <option value={-1}>Select recipient</option>
                            <option value={0}>Everyone</option>
                            {props?.recipientList && props.recipientList.map((item, index) =>
                                <option key={index} value={item.id}>{item.first_name + ` ` + item.last_name}</option>
                            )}
                        </select>
                        {errors.recipient_id && <div className="text-danger mt-1">{errors.recipient_id}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="form-label mb-3">Message
                            <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true" data-toggle="tooltip"
                               data-placement="right" title="How Can i help you?"/>
                        </label>
                        <textarea className="form-control" value={message} onChange={(e) => setMessage(e.target.value)}
                                  rows="3" placeholder="Enter Message"/>
                        {errors.message && <div className="text-danger mt-1">{errors.message}</div>}
                    </div>
                </div>
                <div className="modal-footer justify-content-center">
                    <button type="button" onClick={handleCloseBulkMessage} className="btn btn-secondary"
                            data-bs-dismiss="offcanvas">Cancel
                    </button>
                    <button type="button" onClick={handleSendBulkMessage} className="btn btn-primary">Send</button>
                </div>
            </div>
        </div>
    );
}

export default BulkMessage;