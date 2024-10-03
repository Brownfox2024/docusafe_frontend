import React, {useRef} from 'react';
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import {adminDeleteManageEnvelope} from "../../../../../services/AdminService";

function AdminDeleteEnvelope(props) {
    let {client} = useParams();
    const clsDeleteEnvelope = useRef(null);

    const hideDeleteEnvelope = (e) => {
        e.preventDefault();
        props.setDeleteEnvelope({id: 0, name: ''});
    };

    const onDestroyEnvelope = (e) => {
        e.preventDefault();
        if (props.deleteEnvelope.id > 0) {
            props.setLoading(true);
            adminDeleteManageEnvelope({client_id: client, envelope_id: props.deleteEnvelope.id})
                .then(response => {
                    let data = {...props.dataParams};
                    data.is_effect = !data.is_effect;
                    props.setDataParams(data);
                    clsDeleteEnvelope?.current.click();
                    props.setLoading(false);
                    toast.success(response.data.message);
                })
                .catch(err => {
                    props.setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        } else {
            toast.error('Oops...something went wrong. Please contact to support team.');
        }
    };

    return (
        <div className="modal fade" id="DeleteEnvelope" tabIndex={-1} aria-labelledby="DeleteEnvelopeLabel"
             aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog ">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="resendEnvelopeLabel">
                            Delete Envelope
                        </h5>
                        <button type="button" ref={clsDeleteEnvelope} onClick={hideDeleteEnvelope}
                                className="btn btn-close close_btn text-reset mb-2"
                                data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body ">
                        <p className="pb-2 pt-2">Are you Sure you want to delete the
                            envelope <b>'{props.deleteEnvelope.name}'</b> ?</p>
                        <p className="pb-2">Deleted invites and their files cannot be recovered.</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-secondary" onClick={hideDeleteEnvelope}
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={onDestroyEnvelope} className="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDeleteEnvelope;