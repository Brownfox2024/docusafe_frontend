import React, {useRef} from "react";
import {deleteTemplateFolder} from "../../../../services/Templates";
import {toast} from "react-toastify";
import Utils from "../../../../utils";

function DeleteFolder(props) {

    const clsDeleteFolder = useRef(null);

    const handleDeleteFolder = (e) => {
        e.preventDefault();

        props.setLoading(true);
        let obj = {
            id: props.folderData.id
        };
        deleteTemplateFolder(obj)
            .then(response => {
                clsDeleteFolder?.current.click();
                props.setLoading(false);
                props.setIsRefresh(!props.isRefresh);
                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const hideDeleteFolder = (e) => {
        e.preventDefault();
        props.setFolderData({
            id: '',
            name: ''
        });
    };

    return (
        <div className="modal fade" id="deleteTemplateFolder" tabIndex="-1"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="deleteTemplateFolder"
             aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="resendEnvelopeLabel">Delete Folder</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                ref={clsDeleteFolder}
                                onClick={hideDeleteFolder} data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body ">
                        <p className="pb-2 pt-2">Are you Sure you want to delete the
                            invite <b>'{props.folderData.name}'</b> ? </p>
                        <p className="pb-2">Deleted Folders and it's envelope cannot be
                            recovered. </p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={hideDeleteFolder} className="btn btn-secondary"
                                data-bs-dismiss="modal">
                            Cancel
                        </button>
                        <button type="button" onClick={handleDeleteFolder} className="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteFolder;