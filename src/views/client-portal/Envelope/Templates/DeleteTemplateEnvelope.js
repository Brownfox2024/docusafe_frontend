import React, {useRef} from 'react';
import {deleteEnvelopeTemplate} from "../../../../services/Templates";
import {toast} from "react-toastify";
import Utils from "../../../../utils";

function DeleteTemplateEnvelope(props) {

    const clsDeleteTemplateEnvelope = useRef(null);

    const handleDeleteTemplateEnvelope = (e) => {
        e.preventDefault();

        props.setLoading(true);
        let obj = {
            id: props.folderData.id
        };
        deleteEnvelopeTemplate(obj)
            .then(response => {
                clsDeleteTemplateEnvelope?.current.click();
                props.setLoading(false);
                toast.success(response.data.message);
                props.setIsRefresh(!props.isRefresh);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const hideDeleteTemplateEnvelope = (e) => {
        e.preventDefault();
        props.setFolderData({
            id: '',
            name: ''
        });
    };

    return (
        <div className="modal fade" id="deleteEnvelopeTemplate" tabIndex="-1" data-bs-backdrop="static"
             data-bs-keyboard="false" aria-labelledby="deleteEnvelopeTemplateLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="DeleteTemplateLabel">Delete Template</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                ref={clsDeleteTemplateEnvelope} onClick={hideDeleteTemplateEnvelope}
                                data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body ">
                        <p className="pb-2 pt-2">Are you Sure you want to delete the
                            invite <b>'{props.folderData.name}'</b> ? </p>
                        <p className="pb-2">It's envelope cannot be recovered.</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={hideDeleteTemplateEnvelope} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button onClick={handleDeleteTemplateEnvelope} type="button" className="btn btn-danger">Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteTemplateEnvelope;