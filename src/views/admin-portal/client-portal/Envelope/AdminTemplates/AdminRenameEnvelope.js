import React, {useEffect, useState, useRef} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import {adminRenameEnvelopeTemplate} from "../../../../../services/AdminService";

function AdminRenameEnvelope(props) {
    let {client} = useParams();
    const [name, setName] = useState('');
    let errorsObj = {
        name: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsRenameEnvelope = useRef(null);

    useEffect(function () {
        setName(props.folderData.name);
    }, [props.folderData]);

    const handleRenameEnvelope = (e) => {
        e.preventDefault();
        let errorObj = {...errorsObj};
        let error = false;

        if (!name) {
            errorObj.name = 'Please Enter Name';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        let obj = {
            client_id: client,
            id: props.folderData.id,
            name: name
        };
        props.setLoading(true);

        adminRenameEnvelopeTemplate(obj)
            .then(response => {
                props.setLoading(false);
                toast.success(response.data.message);
                clsRenameEnvelope?.current.click();
                props.setIsRefresh(!props.isRefresh);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const hideRenameEnvelope = (e) => {
        e.preventDefault();

        setName('');
        setErrors(errorsObj);
        props.setFolderData({
            id: '',
            name: ''
        });
    };

    return (
        <div className="modal fade" id="renameTemplate" tabIndex="-1" data-bs-backdrop="static"
             data-bs-keyboard="false" aria-labelledby="renameTemplate" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="RenameTemplateLabel">Rename Template</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                onClick={hideRenameEnvelope}
                                ref={clsRenameEnvelope} data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleRenameEnvelope} className="py-2">
                            <label htmlFor="Select_two" className="form-label mb-3">Template Name
                                <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                                   data-placement="right" title="How Can i help you?"/>
                            </label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                   className="form-control" placeholder="Enter template name"/>
                            {errors.name && <div className="text-danger mt-2">{errors.name}</div>}
                        </form>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={hideRenameEnvelope} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button onClick={handleRenameEnvelope} type="button" className="btn btn-primary">Rename</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminRenameEnvelope;