import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import {adminAddTemplate, adminTemplateFolderList} from "../../../../../services/AdminService";

function AdminAddEnvelopeTemplate(props) {
    let {client} = useParams();
    const [envelopeName, setEnvelopeName] = useState('');
    const [folderId, setFolderId] = useState(0);
    const [folderList, setFolderList] = useState([]);

    let errorsObj = {
        envelope_name: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsAddEnvelopeTemplateRef = useRef(null);

    useEffect(function () {
        adminTemplateFolderList({client_id: client, is_all: 1, folder_id: 0})
            .then(response => {
                setFolderList(response.data.data);
            })
            .catch(err => {
                setFolderList([]);
            });
    }, [client]);

    useEffect(function () {
        setEnvelopeName(props?.deleteEnvelope.name);
    }, [props?.deleteEnvelope]);

    const hideAddEnvelopeTemplate = (e) => {
        e.preventDefault();
        props.setDeleteEnvelope({id: 0, name: ''});
        setFolderId(0);
    };

    const onAddEnvelopeTemplate = (e) => {
        e.preventDefault();
        if (props.deleteEnvelope.id > 0) {

            let error = false;
            let errorObj = {...errorsObj};
            if (!envelopeName) {
                error = true;
                errorObj.envelope_name = 'Envelope name is required';
            }

            setErrors(errorObj);
            if (error) return;

            props.setLoading(true);

            let obj = {
                client_id: client,
                name: envelopeName,
                folder_id: folderId,
                envelope_id: props.deleteEnvelope.id
            };

            adminAddTemplate(obj)
                .then(response => {
                    clsAddEnvelopeTemplateRef?.current.click();
                    if (props?.setAddTemplate) {
                        props?.setAddTemplate(true);
                    }
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
        <div className="modal fade" id="AddEnvelopeTemplate" tabIndex={-1} aria-labelledby="AddEnvelopeTemplateLabel"
             aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog ">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="AddEnvelopeTemplateLabel">Add Envelope in Templates</h5>
                        <button type="button" ref={clsAddEnvelopeTemplateRef} onClick={hideAddEnvelopeTemplate}
                                className="btn btn-close close_btn text-reset mb-2"
                                data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p className="pb-2 pt-2">Are you Sure you want to Add Envelope in Template?</p>
                        <div className="row mt-3">
                            <div className="col-md-12 mb-3">
                                <label className="form-label mb-2">Envelope Name
                                    <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                                       data-placement="right" title="How Can i help you?"/>
                                </label>
                                <input type="text" value={envelopeName}
                                       onChange={(e) => setEnvelopeName(e.target.value)} className="form-control"/>
                                {errors.envelope_name && (<div className="text-danger">{errors.envelope_name}</div>)}
                            </div>
                            <div className="col-md-12">
                                <label className="form-label mb-2">Choose Folder
                                    <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                                       data-placement="right" title="How Can i help you?"/>
                                </label>
                                <select className="form-select" value={folderId}
                                        onChange={(e) => setFolderId(e.target.value)}>
                                    <option value={0}>Choose Folder</option>
                                    {folderList && folderList.map((item, index) =>
                                        <option key={index} value={item.entity_id}>{item.folder_name}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-secondary" onClick={hideAddEnvelopeTemplate}
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={onAddEnvelopeTemplate} className="btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminAddEnvelopeTemplate;