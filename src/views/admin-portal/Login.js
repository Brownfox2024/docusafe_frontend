import React, {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import validator from "validator";
import {toast} from "react-toastify";
import Utils from "../../utils";
import {ADMIN_LOCAL_STORE, CURRENT_YEAR, SALT} from "../../configs/AppConfig";
import {adminPost2FAVerifyQrCode, login} from "../../services/AdminService";
import {encryptData} from "../../utils/crypto";

function AdminPortalLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVerify, setIsVerify] = useState(false);
    const [userData, setUserData] = useState({});
    const [code, setCode] = useState('');

    let errorsObj = {email: '', password: ''};
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
        login(obj)
            .then(response => {
                if (response.data.data.qr_code) {
                    setIsVerify(true);
                    setLoading(false);
                    setUserData(response.data.data);
                } else {
                    let encryptedData = encryptData(response.data.data, SALT);
                    localStorage.setItem(ADMIN_LOCAL_STORE, encryptedData);
                    navigate('/back-admin');
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
            id: data.id,
            code: code
        };

        adminPost2FAVerifyQrCode(obj)
            .then(response => {
                let encryptedData = encryptData(userData, SALT);
                localStorage.setItem(ADMIN_LOCAL_STORE, encryptedData);
                setLoading(false);
                navigate('/back-admin');
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    };

    return (
        <div className="wrapper guest-portal">
            <nav className="navbar navbar-expand-lg px-3 px-sm-5  shadow-sm login_nav">
                <NavLink className="navbar-brand" to={"/"}>
                    <img src="/images/logo.png" className="h-8" alt="..."/>
                </NavLink>
            </nav>

            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <div className="body_part background_grey_400 d-flex align-items-center justify-content-center"
                 style={{minHeight: 'calc(100vh - 126px)'}}>
                <div className="login-wrapper">
                    <h2 className="d-flex align-items-center justify-content-center text-dark mb-3"> {isVerify ? `Two Factor Authentication Code` : `Login`}</h2>
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
                                        <input type="text" className="form-control" id="email" value={email}
                                               onChange={(e) => setEmail(e.target.value)}
                                               aria-describedby="emailHelp" placeholder="user@example.com"/>
                                        {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input type="password" className="form-control" value={password}
                                               onChange={(e) => setPassword(e.target.value)} id="password"/>
                                        {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 mb-3">Submit</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="bg-dark text-center text-lg-start text-white">
                <div className="py-2" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
                    <div className="container my-2">
                        <div className="row">
                            <div className="col-md-12">
                                <p className="text-center text-white">
                                    © {CURRENT_YEAR} <NavLink to={"/"} className="text-white">Docutick Pty Ltd.</NavLink> All rights
                                    reserved</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default AdminPortalLogin;