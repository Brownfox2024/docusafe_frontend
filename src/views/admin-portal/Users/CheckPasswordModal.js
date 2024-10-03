import React, {useRef, useState} from "react";
import {adminCheckPassword} from "../../../services/AdminService";
import {toast} from "react-toastify";
import Utils from "../../../utils";

function CheckPasswordModal(props) {

    const [password, setPassword] = useState("");

    let errorsObj = {password: ''};
    const [errors, setErrors] = useState(errorsObj);
    const clsCheckPwdModal = useRef(null);

    const onSubmit = (e) => {
        e.preventDefault();
        let error = false;
        const errorObj = {...errorsObj};

        if (password === '') {
            errorObj.password = 'Password is required';
            error = true;
        }

        setErrors(errorObj);
        if (error) return;

        props.setLoading(true);

        const obj = {
            id: props.modalId,
            password: password
        };

        adminCheckPassword(obj)
            .then(res => {
                setPassword("");
                props.setLoading(false);
                clsCheckPwdModal?.current.click();
                window.open("/back-admin/client-portal/" + props.modalId, '_blank');
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (

        <div className="modal fade" id="verifyPasswordModal" tabIndex="-1" aria-hidden="true"
             aria-labelledby="verifyPasswordLabel" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="verifyPasswordLabel">Password</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2" ref={clsCheckPwdModal}
                                data-bs-dismiss="modal" aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <input type="password" className="form-control" value={password}
                               placeholder="Enter your password"
                               onChange={(e) => setPassword(e.target.value)} id="password"/>
                        {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={onSubmit}>Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckPasswordModal;