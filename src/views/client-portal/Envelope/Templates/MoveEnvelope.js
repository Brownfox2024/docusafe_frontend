import React, {useEffect, useState, useRef} from 'react';
import {moveEnvelopeTemplate, templateFolderList} from "../../../../services/Templates";
import {toast} from "react-toastify";
import Utils from "../../../../utils";

function MoveEnvelope(props) {
    const [folderList, setFolderList] = useState([]);
    const [folderId, setFolderId] = useState(-1);

    let errorsObj = {
        folder_id: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsMoveEnvelope = useRef(null);

    useEffect(function () {
        if (props?.folderData?.id > 0) {
            templateFolderList({is_all: 1, folder_id: props.folderData.id})
                .then(response => {
                    setFolderList(response.data.data);
                })
                .catch(err => {

                });
        }
    }, [props?.folderData]);

    const handleMoveEnvelope = (e) => {
        e.preventDefault();

        let errorObj = {...errorsObj};
        let error = false;

        if (folderId === -1) {
            errorObj.folder_id = 'Please select folder';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        props.setLoading(true);

        let obj = {
            id: props.folderData.id,
            folder_id: folderId
        };

        moveEnvelopeTemplate(obj)
            .then(response => {
                clsMoveEnvelope?.current.click();
                toast.success(response.data.message);
                props.setIsRefresh(!props.isRefresh);
                props.setLoading(false);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const hideMoveEnvelope = (e) => {
        e.preventDefault();

        setFolderId('');
        setFolderList([]);
        props.setFolderData({
            id: '',
            name: ''
        });
    };

    return (
        <div className="modal fade" id="moveTemplate" tabIndex="-1" aria-labelledby="moveTemplate"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="MoveTemplateLabel">Move Template</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                onClick={hideMoveEnvelope}
                                ref={clsMoveEnvelope} data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="py-2">
                            <label className="form-label mb-3">Where do you want to move this Template
                                <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                                   data-placement="right" title="How Can i help you?"/>
                            </label>
                            <select className="form-select" value={folderId}
                                    onChange={(e) => setFolderId(e.target.value)} aria-label="Default select example">
                                <option value={-1}>Choose Folder</option>
                                <option value={0}>My Templates</option>
                                {folderList.map((item, index) =>
                                    <option key={index} value={item.entity_id}>{item.folder_name}</option>
                                )}
                            </select>
                            {errors.folder_id && <div className="text-danger mt-2">{errors.folder_id}</div>}
                        </div>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={hideMoveEnvelope} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button onClick={handleMoveEnvelope} type="button" className="btn btn-primary">Move</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MoveEnvelope;