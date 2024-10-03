import React, {useRef, useState} from "react";
import {transferEnvelopePost} from "../../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";

function TransferEnvelope(props) {
    const clsTransferEnvelope = useRef(null);
    const [userId, setUserId] = useState('');

    let errorsObj = {
        user_id: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const hideTransferEnvelope = (e) => {
        e.preventDefault();
        setUserId('');
        let errorObj = {...errorsObj};
        setErrors(errorObj);
        props.setCloseEnvelope({envelope_id: 0, recipient_id: 0});
    };

    const handleTransferEnvelope = (e) => {
        e.preventDefault();

        if (props?.closeEnvelope.envelope_id > 0) {
            let errorObj = {...errorsObj};
            let error = false;

            if (!userId) {
                errorObj.user_id = 'Please select user';
                error = true;
            }

            setErrors(errorObj);

            if (error) return;

            props?.setLoading(true);
            let obj = {
                id: props?.closeEnvelope.envelope_id,
                user_id: userId
            };
            transferEnvelopePost(obj)
                .then(response => {
                    props.setIsRefresh(true);
                    props?.setLoading(false);
                    clsTransferEnvelope?.current.click();
                    toast.success(response.data.message);
                })
                .catch(err => {
                    props?.setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        } else {
            toast.error('Oops...something went wrong.');
        }
    };

    return (
        <div className="modal fade" id="transferEnvelope" tabIndex="-1" aria-labelledby="transferEnvelopeLabel"
             data-bs-keyboard="false" data-bs-backdrop="static" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="transferEnvelopeLabel">Transfer Envelope</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                ref={clsTransferEnvelope} onClick={hideTransferEnvelope} data-bs-dismiss="modal"
                                aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p className="py-2">Select the user to whom you want to transfer the Envelope.
                            <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                               data-placement="right"
                               title="Transfer the envelope to your staff or user, so they can manage envelope too"/>
                        </p>
                        <div className="py-2">
                            <select className="form-select" value={userId} onChange={(e) => setUserId(e.target.value)}>
                                <option value="">Select User</option>
                                {props?.senderList && props?.senderList.map((user, index) => (
                                    <option value={user.id}
                                            key={index}>{user.first_name + ' ' + user.last_name}</option>
                                ))}
                            </select>
                            {errors.user_id && (<div className="ms-2 text-danger">{errors.user_id}</div>)}
                        </div>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-secondary" onClick={hideTransferEnvelope}
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={handleTransferEnvelope} className="btn btn-primary">Transfer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransferEnvelope;