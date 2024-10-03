import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {NavLink} from "react-router-dom";
import validator from "validator";
import {checkResetToken, resetPassword} from "../../../services/AuthService";
import {toast} from "react-toastify";
import Utils from "../../../utils";
import {PASSWORD_RULES} from "../../../configs/AppConfig";

function ResetPassword() {
    let {token} = useParams();
    const [loading, setLoading] = useState(false);
    const [isReset, setIsReset] = useState(1);
    let passwordRuleList = PASSWORD_RULES;
    const [passwordRules, setPasswordRules] = useState(passwordRuleList);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isShowPasswordContain, setIsShowPasswordContain] = useState(false);

    let errorsObj = {
        password: '',
        confirm_password: '',
    };
    const [errors, setErrors] = useState(errorsObj);

    useEffect(function () {
        setLoading(true);
        checkResetToken({token: token})
            .then(response => {
                setLoading(false);
            })
            .catch(err => {
                setIsReset(3);
                setLoading(false);
            });
    }, [token]);

    const handlePassword = (e) => {
        let value = e.target.value;
        setPassword(value);
        let passwordRule = [...passwordRuleList];
        const isContainsUppercase = /^(?=.*[A-Z]).*$/;
        const isContainsLowercase = /^(?=.*[a-z]).*$/;
        const isContainsNumber = /^(?=.*[0-9]).*$/;
        const isContainsSymbol = /^(?=.*[~!@#$%^&]).*$/;
        if (value.length > 7) {
            let index = passwordRule.findIndex(x => x.id === 1);
            if (index > -1) {
                passwordRule[index]['active'] = true;
            }
        } else {
            passwordRule[0]['active'] = false;
        }
        if (isContainsUppercase.test(value)) {
            let index = passwordRule.findIndex(x => x.id === 2);
            if (index > -1) {
                passwordRule[index]['active'] = true;
            }
        } else {
            passwordRule[1]['active'] = false;
        }
        if (isContainsLowercase.test(value)) {
            let index = passwordRule.findIndex(x => x.id === 3);
            if (index > -1) {
                passwordRule[index]['active'] = true;
            }
        } else {
            passwordRule[2]['active'] = false;
        }
        if (isContainsNumber.test(value)) {
            let index = passwordRule.findIndex(x => x.id === 4);
            if (index > -1) {
                passwordRule[index]['active'] = true;
            }
        } else {
            passwordRule[3]['active'] = false;
        }
        if (isContainsSymbol.test(value)) {
            let index = passwordRule.findIndex(x => x.id === 5);
            if (index > -1) {
                passwordRule[index]['active'] = true;
            }
        } else {
            passwordRule[4]['active'] = false;
        }

        setPasswordRules(passwordRule);
    };

    const onResetPassword = (e) => {
        e.preventDefault();
        let error = false;
        const errorObj = {...errorsObj};
        const isContainsSymbol = /^(?=.*[~!@#$%^&]).*$/;
        let passwordRule = [...passwordRules];

        if (!password) {
            errorObj.password = 'Password is required';
            error = true;
        } else if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            error = true;
        } else {
            if (!isContainsSymbol.test(password)) {
                error = true;
            }
        }
        if (!confirmPassword) {
            errorObj.confirm_password = 'Confirm password is required';
            error = true;
        } else if (confirmPassword !== password) {
            errorObj.confirm_password = 'Confirm password does not match';
            error = true;
        }

        setErrors(errorObj);
        setPasswordRules(passwordRule);

        if (error) return;

        setLoading(true);
        let obj = {
            password: password,
            token: token
        };
        resetPassword(obj)
            .then(response => {
                setLoading(false);
                setIsReset(2);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}

            {isReset === 1 &&
            <div className="body_part background_grey_400 d-flex align-items-center justify-content-center"
                 style={{minHeight: 'calc(100vh - 374px)'}}>
                <div className="login-wrapper">
                    <h2 className="d-flex align-items-center justify-content-center text-dark mb-3">Reset Password</h2>
                    <div className="card shadow mb-3">
                        <div className="card-body">
                            <form onSubmit={onResetPassword}>
                                <div className="mb-4">
                                    <label className="form-label">New Password</label>
                                    <input type="password" value={password} onChange={handlePassword}
                                           onFocus={(e) => setIsShowPasswordContain(true)}
                                           className="form-control"/>
                                    {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
                                    {isShowPasswordContain === true && (
                                        <div
                                            className="password_instruction background_grey_400 border rounded-3 mt-3 px-3 py-2">
                                            <p className="mb-3 text_color">Password must contain:</p>
                                            <ul>
                                                {passwordRules.map((item, index) =>
                                                    <li key={index}
                                                        className={`${item.active ? `green_clr` : `red_clr`} mb-2`}>
                                                        <i className={`fa fa-${item.active ? `check` : `times`}-circle`}
                                                           aria-hidden="true"/> {item.text}
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Confirm Password</label>
                                    <input type="password" value={confirmPassword}
                                           onChange={(e) => setConfirmPassword(e.target.value)}
                                           className="form-control"/>
                                    {errors.confirm_password &&
                                    <div className="text-danger mt-1">{errors.confirm_password}</div>}
                                </div>
                                <button type="submit" className="btn btn-primary w-100 ">Reset Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            }

            {isReset > 1 &&
            <div className="body_part background_grey_400 d-flex align-items-center justify-content-center"
                 style={{minHeight: 'calc(100vh - 374px)'}}>
                <div className="login-wrapper forgot_reset_page">
                    <h2 className="d-flex align-items-center justify-content-center text-dark mb-3">Reset Password</h2>
                    <div className="card shadow" style={{maxWidth: '300px'}}>
                        <div className="card-body">
                            {isReset === 2 &&
                            <>
                                <p className="mb-4 fw-bold text-center text-dark">You have successfully changed your
                                    password.</p>
                                <p className="mb-4 text-center"><NavLink to={"/login"}>Click Here</NavLink> to Login</p>
                            </>
                            }
                            {isReset === 3 &&
                            <>
                                <p className="mb-4 fw-bold text-center text-dark">Your password reset link expired.</p>
                                <p className="mb-4 text-center"><NavLink to={"/forgot-password"}>Click Here</NavLink> to
                                    Forgot Password?</p>
                            </>
                            }

                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    );
}

export default ResetPassword;