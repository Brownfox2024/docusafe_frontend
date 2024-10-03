import React, {useRef} from "react";
import {destroyUser} from "../../../services/AdminService";
import {toast} from "react-toastify";
import Utils from "../../../utils";

function DeleteFrontEndUser(props) {

    const clsDeleteUserModal = useRef(null);

    const handleCloseDeleteUserModal = (e) => {
        e.preventDefault();
        props.setUserId(0);
    };

    const onUserDestroy = (e) => {
        e.preventDefault();
        props.setLoading(true);

        destroyUser({id: props.userId})
            .then(response => {

                let data = {...props.dataParams};
                data.is_reload = true;
                props.setDataParams(data);

                props.setUserId(0);
                props.setLoading(false);
                clsDeleteUserModal?.current.click();

                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <div className="modal fade" id="deleteUserModal" tabIndex="-1" aria-hidden="true"
             aria-labelledby="deleteUserModalLabel" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="deleteUserModalLabel">Delete User</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                data-bs-dismiss="modal" ref={clsDeleteUserModal}
                                onClick={handleCloseDeleteUserModal} aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure want to delete this user?</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={handleCloseDeleteUserModal} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={onUserDestroy} className="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteFrontEndUser;