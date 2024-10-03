import React, {useEffect, useState, useRef} from "react";
import {editTemplateFolder} from "../../../../services/Templates";
import {toast} from "react-toastify";
import Utils from "../../../../utils";

function EditFolder(props) {
    const [name, setName] = useState('');

    let errorsObj = {
        name: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsEditFolder = useRef(null);

    useEffect(function () {
        setName(props.folderData.name);
    }, [props.folderData]);

    const handleEditFolder = (e) => {
        e.preventDefault();
        let errorObj = {...errorsObj};
        let error = false;

        if (!name) {
            errorObj.name = 'Name is required';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        props.setLoading(true);

        let obj = {
            id: props.folderData.id,
            name: name
        };

        editTemplateFolder(obj)
            .then(response => {
                props.setLoading(false);
                clsEditFolder?.current.click();
                toast.success(response.data.message);

                props.setIsRefresh(!props.isRefresh);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const hideEditFolder = (e) => {
        e.preventDefault();
        setName('');
        setErrors(errorsObj);

        props.setFolderData({
            id: '',
            name: ''
        });
    };

    return (
        <div className="modal fade" id="editTemplateFolder" tabIndex="-1"
             aria-labelledby="editTemplateFolder" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="CloseEnvelopeLabel">Rename Folder</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                ref={clsEditFolder}
                                onClick={hideEditFolder} data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleEditFolder} className="py-2">
                            <label htmlFor="Select_two" className="form-label mb-3">Folder Name
                                <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                                   data-placement="right" title="How Can i help you?"/>
                            </label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                   className="form-control" placeholder="Enter Folder Name"/>
                            {errors.name && <div className={`text-danger mt-2`}>{errors.name}</div>}
                        </form>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={hideEditFolder} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button onClick={handleEditFolder} type="button" className="btn btn-primary">Rename</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditFolder;