import React, {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {toast} from 'react-toastify';
import validator from 'validator';

import {login, loginVerifyCode} from "../../../services/AuthService";
import Utils from "../../../utils";
import {CLIENT_LOCAL_STORE, SALT} from "../../../configs/AppConfig";
import {encryptData} from "../../../utils/crypto";
import {Lang} from "../../../lang";

function Login() {

    document.title = Lang.login_title;
    document.getElementsByTagName("META")[4].content = Lang.login_meta_desc;
    document.getElementsByTagName("META")[5].content = Lang.login_meta_keyword;

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVerify, setIsVerify] = useState(false);
    const [userData, setUserData] = useState({});
    const [code, setCode] = useState('');

    let errorsObj = {email: '', password: '', code: ''};
    const [errors, setErrors] = useState(errorsObj);

    function onLogin(e) {
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
        if (password === '') {
            errorObj.password = 'Password is required';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        setLoading(true);
        let obj = {
            email: email,
            password: password
        };
        console.log('Login request data:', obj);
        login(obj)
            .then(response => {
                console.log('Response from server:', response);
                if (response.data.data.qr_code) {
                    
                    setIsVerify(true);
                    setLoading(false);
                    setUserData(response.data.data);
                } else {
                    console.log('Response from server:', response);
                    let encryptedData = encryptData(response.data.data, SALT);
                    localStorage.setItem(CLIENT_LOCAL_STORE, encryptedData);
                    navigate('/client-portal');
                    setLoading(false);
                }
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    }

    const onVerify = (e) => {
        e.preventDefault();
        let error = false;
        const errorObj = {...errorsObj};

        if (!code) {
            errorObj.code = 'Code is required';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        setLoading(true);
        let data = {...userData};
        let obj = {
            id: (data.id),
            company_login_id: (data.company_user_id),
            code: code
        };

        loginVerifyCode(obj)
            .then(response => {
                let encryptedData = encryptData(userData, SALT);
                localStorage.setItem(CLIENT_LOCAL_STORE, encryptedData);
                setLoading(false);
                navigate('/client-portal');
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
                <div className="login-wrapper">
                    <h2 className="d-flex align-items-center justify-content-center text-dark mb-3">
                        {isVerify ? `Two Factor Authentication Code` : `Login`}
                    </h2>
                    <div className="card shadow">
                        <div className="card-body">
                            {isVerify && (
                                <form onSubmit={onVerify}>
                                    <div className="mb-3">
                                        <label className="form-label">Google Authenticator App Code</label>
                                        <input type="number" className="form-control" value={code}
                                               onChange={(e) => setCode(e.target.value)}
                                               placeholder="Enter 6-digit code found in your App"/>
                                        {errors.code && <div className="text-danger mt-1">{errors.code}</div>}
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 mb-3">Verify</button>
                                </form>
                            )}

                            {!isVerify && (
                                <form onSubmit={onLogin}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="text" className="form-control" id="email" value={email} maxLength="50"
                                               onChange={(e) => setEmail(e.target.value)}
                                               aria-describedby="emailHelp" placeholder="user@example.com"/>
                                        {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input type="password" className="form-control" value={password} maxLength="15"
                                               onChange={(e) => setPassword(e.target.value)} id="password"/>
                                        {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
                                    </div>
                                    <p className="mb-3">Forgot your password? <NavLink to={"/forgot-password"}>Click
                                        here </NavLink>to reset
                                        it. </p>
                                    <button type="submit" className="btn btn-primary w-100 mb-3">Submit</button>
                                    <p>Don’t have an account? <NavLink to={"/sign-up"}>Register </NavLink>instead.</p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;