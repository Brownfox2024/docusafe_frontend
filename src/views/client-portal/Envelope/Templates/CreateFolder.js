import React, {useState, useRef} from 'react';
import {createTemplateFolder} from "../../../../services/Templates";
import Utils from "../../../../utils";
import {toast} from "react-toastify";

function CreateFolder(props) {
    const [name, setName] = useState('');
    let errorsObj = {
        name: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsCreateFolder = useRef(null);

    const handleCreateFolder = (e) => {
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
        let template = {...props.currentTemplate};
        let obj = {
            name: name,
            folder_id: template.current_folder
        };
        createTemplateFolder(obj)
            .then(response => {
                props.setLoading(false);
                clsCreateFolder?.current.click();
                toast.success(response.data.message);

                props.setIsRefresh(!props.isRefresh);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const hideCreateFolder = (e) => {
        setErrors(errorsObj);
        setName('');
    };

    return (
        <div className="modal fade" id="createTemplateFolder" tabIndex="-1" aria-labelledby="createTemplateFolder"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="CloseEnvelopeLabel">Create Folder</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                onClick={hideCreateFolder} ref={clsCreateFolder}
                                data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleCreateFolder} className="py-2">
                            <label className="form-label mb-3">Folder Name
                                <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                                   data-placement="right" title="How Can i help you?"/>
                            </label>
                            <input type="text" className="form-control" value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   placeholder="Enter Folder Name"/>
                            {errors.name && <div className="text-danger mt-2">{errors.name}</div>}
                        </form>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={hideCreateFolder} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={handleCreateFolder} className="btn btn-primary">Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateFolder;