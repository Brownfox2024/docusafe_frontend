import React, {useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import Utils from "../../../../../utils";
import {adminCopyManageEnvelope} from "../../../../../services/AdminService";

function AdminCopyEnvelope(props) {
    let {client} = useParams();
    const clsCopyEnvelope = useRef(null);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    let errorObj = {name: ''};
    const [errors, setErrors] = useState(errorObj);

    const hideCopyEnvelope = (e) => {
        e.preventDefault();
        props.setCopyEnvelope(0);
    };

    const handleCopyEnvelope = (e) => {
        e.preventDefault();
        if (props.copyEnvelope > 0) {
            let error = false;
            let errorObj = {...errors};
            if (!name) {
                errorObj.name = 'Please Enter envelope name';
                error = true;
            } else {
                errorObj.name = '';
            }
            setErrors(errorObj);

            if (error) return;

            props.setLoading(true);
            let obj = {
                client_id: client,
                name: name,
                id: props.copyEnvelope
            };
            adminCopyManageEnvelope(obj)
                .then(response => {
                    navigate('/back-admin/client-portal/' + client + '/envelope/edit/' + response.data.uuid + '/1');
                    props.setLoading(false);
                    clsCopyEnvelope?.current.click();
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
        <div className="modal fade" id="CopyEnvelope" tabIndex={-1} aria-labelledby="CopyEnvelopeLabel"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="CopyEnvelopeLabel">
                            Duplicate Envelope
                        </h5>
                        <button ref={clsCopyEnvelope} type="button" className="btn btn-close close_btn text-reset mb-2"
                                onClick={hideCopyEnvelope} data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p className="pb-3 pt-2">
                            What would you like to name the new envelope ?
                            <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true" data-toggle="tooltip"
                               data-placement="right" title="How Can i help you?"/>
                        </p>
                        <div className="mb-4">
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                   className="form-control" placeholder="Envelope Name"/>
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={hideCopyEnvelope} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={handleCopyEnvelope} className="btn btn-primary">Duplicate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCopyEnvelope;