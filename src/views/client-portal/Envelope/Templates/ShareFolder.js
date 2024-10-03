import React, {useState, useRef} from "react";
import {shareTemplateFolder} from "../../../../services/Templates";
import {toast} from "react-toastify";
import Utils from "../../../../utils";

function ShareFolder(props) {
    const [userId, setUserId] = useState('');

    let errorsObj = {
        user_id: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsShareFolderRef = useRef(null);

    const closeShareFolder = (e) => {
        e.preventDefault();
        setUserId('');
        setErrors({user_id: ''});
        props.setRemoveShareData({
            id: '',
            type: ''
        });
    };

    const handleShareFolder = (e) => {
        e.preventDefault();
        let error = false;
        let errorObj = {...errorsObj};
        if (!userId) {
            errorObj.user_id = 'Please select user';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        if (props?.removeShareData.id) {
            props.setLoading(true);

            let obj = {
                entity_type: props?.removeShareData.type,
                id: props?.removeShareData.id,
                user_id: userId
            };

            shareTemplateFolder(obj)
                .then(response => {
                    props.setLoading(false);
                    toast.success(response.data.message);
                    props.setIsRefresh(!props.isRefresh);
                    clsShareFolderRef?.current.click();
                })
                .catch(err => {
                    props.setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        } else {
            toast.error('Oops....something went wrong.');
        }
    };

    return (
        <div className="modal fade" id="shareFolder" tabIndex="-1" aria-labelledby="shareFolderLabel"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"
                            id="MoveTemplateLabel">Share {parseInt(props?.removeShareData.type) === 1 ? `Folder` : `Template`}</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                ref={clsShareFolderRef} onClick={closeShareFolder} data-bs-dismiss="modal"
                                aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p className="py-2">Select the user to whom you want to share
                            the {parseInt(props?.removeShareData.type) === 1 ? `Folder` : `Template`}</p>
                        <select className="form-select" value={userId} onChange={(e) => setUserId(e.target.value)}>
                            <option value="">Select User</option>
                            {props?.shareUserList && props?.shareUserList.map((user, index) => (
                                <option value={user.id}
                                        key={index}>{user.first_name + ' ' + user.last_name}</option>
                            ))}
                        </select>
                        {errors.user_id && (<div className="ms-2 text-danger">{errors.user_id}</div>)}
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={closeShareFolder} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={handleShareFolder}
                                className="btn btn-primary">Share {parseInt(props?.removeShareData.type) === 1 ? `Folder` : `Template`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShareFolder;