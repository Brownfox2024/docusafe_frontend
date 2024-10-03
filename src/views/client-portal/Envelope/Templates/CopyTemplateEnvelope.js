import React, {useState, useRef} from "react";
import {copyTemplateEnvelope} from "../../../../services/Templates";
import {toast} from "react-toastify";
import Utils from "../../../../utils";

function CopyTemplateEnvelope(props) {
    const [name, setName] = useState('');
    let errorsObj = {name: ''};
    const [errors, setErrors] = useState(errorsObj);

    const hideCopyEnvelopeRef = useRef(null);

    const handleSubmitCopyEnvelope = (e) => {
        e.preventDefault();
        let error = false;
        let errorObj = {...errorsObj};
        if (!name) {
            errorObj.name = 'Please enter name';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        props.setLoading(true);
        let obj = {
            name: name,
            id: props.folderData.id,
            type: 1
        };
        copyTemplateEnvelope(obj)
            .then(response => {
                hideCopyEnvelopeRef?.current.click();
                props.setLoading(false);
                toast.success(response.data.message);
                props.setIsRefresh(!props.isRefresh);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleCloseCopyEnvelope = (e) => {
        e.preventDefault();

        setName('');
        setErrors(errorsObj);
        props.setFolderData({
            id: '',
            name: ''
        });
    };

    return (
        <div className="modal fade" id="copyTemplateEnvelope" tabIndex="-1" aria-labelledby="copyTemplateEnvelope"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="CloseEnvelopeLabel">Copy Template</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                onClick={handleCloseCopyEnvelope}
                                ref={hideCopyEnvelopeRef} data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmitCopyEnvelope} className="py-2">
                            <label className="form-label mb-3">What would you like to name the new Template
                                <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                                   data-placement="right" title="How Can i help you?"/>
                            </label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                   className="form-control" placeholder="Template Name"/>
                            {errors.name && <div className="text-danger mt-2">{errors.name}</div>}
                        </form>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={handleCloseCopyEnvelope} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button onClick={handleSubmitCopyEnvelope} type="button" className="btn btn-primary">Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CopyTemplateEnvelope;