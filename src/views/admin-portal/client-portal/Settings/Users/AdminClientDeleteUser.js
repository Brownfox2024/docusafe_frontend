import React, {useRef} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import {adminDestroyUserPost} from "../../../../../services/AdminService";

function AdminClientDeleteUser(props) {
    let {client} = useParams();
    const clsUserModalRef = useRef(null);

    const handleCloseUserModal = (e) => {
        e.preventDefault();

        props.setUsers({
            id: 0,
            first_name: '',
            last_name: '',
            email: '',
            role_id: '',
            role_name: '',
            group_name: ''
        });
    };

    const onUserDestroy = (e) => {
        e.preventDefault();

        props.setLoading(true);

        adminDestroyUserPost({client_id: client, id: props.users.id})
            .then(response => {
                clsUserModalRef?.current.click();
                props.setLoading(false);
                props.setIsCall(!props.isCall);
                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <div className="modal fade" id="deleteUserModal" tabIndex="-1" aria-labelledby="deleteUserModalLabel"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="deleteUserModalLabel">Delete User</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                data-bs-dismiss="modal" ref={clsUserModalRef}
                                onClick={handleCloseUserModal} aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure want to delete this user?</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={handleCloseUserModal} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={onUserDestroy} className="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminClientDeleteUser;