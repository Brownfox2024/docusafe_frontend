import React, {useRef} from "react";
import {removeShareTemplateFolder} from "../../../../services/Templates";
import {toast} from "react-toastify";
import Utils from "../../../../utils";

function RemoveShareFolder(props) {
    const clsRemoveShareFolderModal = useRef(null);

    const handleHideRemoveShareFolder = () => {
        props.setRemoveShareData({
            id: '',
            type: ''
        });
    };

    const handleRemoveShareFolder = (e) => {
        e.preventDefault();

        props.setLoading(true);
        let obj = {
            id: props?.removeShareData.id,
            type: props?.removeShareData.type
        };
        removeShareTemplateFolder(obj)
            .then(response => {
                clsRemoveShareFolderModal?.current.click();
                props.setLoading(false);
                props.setIsRefresh(!props.isRefresh);
                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <div className="modal fade" id="removeShareFolder" tabIndex="-1" aria-labelledby="removeShareFolderLabel"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="MoveTemplateLabel">Remove from Shared with me</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                ref={clsRemoveShareFolderModal} onClick={handleHideRemoveShareFolder}
                                data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p className="py-2">Are you sure you want to
                            remove {parseInt(props?.removeShareData.type) === 1 ? `Folder` : `Template`}?</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-secondary" onClick={handleHideRemoveShareFolder}
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={handleRemoveShareFolder}
                                className="btn btn-primary">Remove {parseInt(props?.removeShareData.type) === 1 ? `Folder` : `Template`}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RemoveShareFolder;