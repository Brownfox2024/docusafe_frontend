import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {manageEnvelopeClose} from "../../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";

function CloseEnvelope(props) {
    const clsCloseEnvelopeRef = useRef(null);
    const navigate = useNavigate();

    const handleCloseEnvelope = (e) => {
        e.preventDefault();

        props.setCloseEnvelope({
            envelope_id: 0,
            recipient_id: 0
        });
    };

    const onSubmitCloseEnvelope = (e) => {
        e.preventDefault();

        let obj = props.closeEnvelope;

        props.setLoading(true);
        manageEnvelopeClose(obj)
            .then(response => {
                props.setLoading(false);
                clsCloseEnvelopeRef?.current.click();
                if (response.data.is_finish === true) {
                    navigate("/manage/completed");
                }
                toast.success(response.data.message);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    return (
        <div className="modal fade" id="closeEnvelope" tabIndex="-1" aria-labelledby="CloseEnvelopeLabel"
             data-bs-keyboard="false" data-bs-backdrop="static" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="CloseEnvelopeLabel">Complete Envelope</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                ref={clsCloseEnvelopeRef} onClick={handleCloseEnvelope} data-bs-dismiss="modal"
                                aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p className="py-2">Are you sure you want to complete the envelope ?</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={handleCloseEnvelope} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={onSubmitCloseEnvelope} className="btn btn-primary">Complete
                            Envelope
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CloseEnvelope;