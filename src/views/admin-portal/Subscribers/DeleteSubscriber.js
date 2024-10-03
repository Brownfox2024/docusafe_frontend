import React, {useRef} from "react";
import {destroySubscriber} from "../../../services/AdminService";
import {toast} from "react-toastify";
import Utils from "../../../utils";

function DeleteSubscriber(props) {

    const clsDeleteSubscriberModal = useRef(null);

    const onSubscriberDestroy = (e) => {
        e.preventDefault();
        props.setLoading(true);
        destroySubscriber({id: props.subscriberId})
            .then(response => {
                props.setLoading(false);
                props.setSubscriberId(0);
                props.setIsEffect(!props.isEffect);
                clsDeleteSubscriberModal?.current.click();
                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleCloseDeleteSubscriberModal = (e) => {
        e.preventDefault();
        props.setSubscriberId(0);
    };

    return (
        <div className="modal fade" id="deleteSubscriberModal" tabIndex="-1"
             aria-labelledby="deleteSubscriberModalLabel" data-bs-backdrop="static" data-bs-keyboard="false"
             aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="deleteSubscriberModalLabel">Delete Subscriber</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                data-bs-dismiss="modal" ref={clsDeleteSubscriberModal}
                                onClick={handleCloseDeleteSubscriberModal} aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure want to delete this subscriber?</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={handleCloseDeleteSubscriberModal} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={onSubscriberDestroy} className="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteSubscriber;