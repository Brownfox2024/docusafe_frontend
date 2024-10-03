import React, {useRef} from "react";
import {destroyGroupPost} from "../../../../services/UserService";
import {toast} from "react-toastify";
import Utils from "../../../../utils";

function DeleteGroup(props) {

    const clsGroupModalRef = useRef(null);

    const handleCloseGroupModal = (e) => {
        e.preventDefault();

        props.setGroupData({
            id: 0,
            name: '',
            users: []
        });
    };

    const onGroupDestroy = (e) => {
        e.preventDefault();

        props.setLoading(true);

        destroyGroupPost({id: props.groupData.id})
            .then(response => {
                clsGroupModalRef?.current.click();
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
        <div className="modal fade" id="deleteGroupModal" tabIndex="-1" aria-labelledby="deleteGroupModalLabel"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="deleteGroupModalLabel">Delete Group</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                data-bs-dismiss="modal" ref={clsGroupModalRef}
                                onClick={handleCloseGroupModal} aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure want to delete this group?</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={handleCloseGroupModal} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={onGroupDestroy} className="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteGroup;