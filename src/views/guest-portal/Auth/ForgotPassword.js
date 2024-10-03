import React, {useState} from 'react';
import {NavLink} from "react-router-dom";
import validator from 'validator';
import {forgotPassword} from "../../../services/AuthService";
import {toast} from "react-toastify";
import Utils from "../../../utils";

function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [email, setEmail] = useState('');

    let errorsObj = {email: ''};
    const [errors, setErrors] = useState(errorsObj);

    const onForgot = (e) => {
        e.preventDefault();
        let error = false;
        const errorObj = {...errorsObj};
        if (email === '') {
            errorObj.email = 'Email is required';
            error = true;
        } else if (!validator.isEmail(email)) {
            errorObj.email = 'Please enter valid email address';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        setLoading(true);
        let obj = {
            email: email
        };
        forgotPassword(obj)
            .then(response => {
                setIsLink(true);
                setLoading(false);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <div className="body_part background_grey_400 d-flex align-items-center justify-content-center"
                 style={{minHeight: 'calc(100vh - 374px)'}}>
                {!isLink &&
                <div className="login-wrapper">
                    <h2 className="d-flex align-items-center justify-content-center text-dark mb-3">Forgot Password</h2>
                    <div className="card shadow" style={{maxWidth: '300px'}}>
                        <div className="card-body">
                            <form onSubmit={onForgot}>
                                <p className="mb-4">Enter your registered email address and we will email you
                                    instructions
                                    on how to reset your password.</p>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                                           maxLength="50" className="form-control"/>
                                    {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mb-3">Reset password</button>
                                <p>Register it ? <NavLink to={"/login"}>Login here </NavLink></p>
                            </form>
                        </div>
                    </div>
                </div>
                }

                {isLink &&
                <div className="login-wrapper forgot_reset_page">
                    <h2 className="d-flex align-items-center justify-content-center text-dark mb-3">Forgot Password</h2>
                    <div className="card shadow" style={{maxWidth: '300px'}}>
                        <div className="card-body">
                            <p className="mb-4 fw-bold text-center text-dark">We have sent you an email with instruction
                                to reset your password.</p>
                            <p className="mb-4 text-center">If you haven't received this email within a few minutes,
                                please check your spam folder.</p>
                        </div>
                    </div>
                </div>
                }
            </div>
        </>
    );
}

export default ForgotPassword;