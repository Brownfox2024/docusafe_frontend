import React, {useRef} from "react";
import {recipientDelete} from "../../../services/Recipients";
import {toast} from "react-toastify";
import Utils from "../../../utils";

function DeleteRecipient(props) {
    const closeModalRef = useRef(null);

    const handleCloseRecipientModal = (e) => {
        e.preventDefault();
        props.setDelId(0);
    };

    const onRecipientDestroy = (e) => {
        e.preventDefault();
        recipientDelete({recipient_id: props.delId})
            .then(response => {
                closeModalRef.current?.click();
                props.setDelId(0);
                props.setIsEffect(!props.isEffect);
                toast.success(response.data.message);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="deleteModalLabel">Delete Recipient</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                data-bs-dismiss="modal" ref={closeModalRef}
                                onClick={handleCloseRecipientModal} aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure want to delete this recipient?</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={handleCloseRecipientModal} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={onRecipientDestroy} className="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteRecipient;