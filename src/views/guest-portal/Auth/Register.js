import React, {useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {toast} from 'react-toastify';
import validator from 'validator';

import {getCountryList} from "../../../services/CommonService";
import {register, resendEmailCode} from "../../../services/AuthService";
import Utils from "../../../utils";
import {
    CLIENT_LOCAL_STORE,
    COUNTRY_ID,
    PASSWORD_RULES,
    SALT
} from "../../../configs/AppConfig";
import {encryptData} from "../../../utils/crypto";
import {Lang} from "../../../lang";

function Register() {
    const navigate = useNavigate();

    document.title = Lang.sign_up_title;
    document.getElementsByTagName("META")[4].content = Lang.sign_up_meta_desc;
    document.getElementsByTagName("META")[5].content = Lang.sign_up_meta_keyword;

    let passwordRuleList = PASSWORD_RULES;
    const [passwordRules, setPasswordRules] = useState(passwordRuleList);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [country, setCountry] = useState(COUNTRY_ID);
    const [countryList, setCountryList] = useState([]);
    const [isVerify, setIsVerify] = useState(1);
    const [code, setCode] = useState('');
    const [verificationCode, setVerificationCode] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [isShowPasswordContain, setIsShowPasswordContain] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    let errorsObj = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        company_name: '',
        confirm_password: '',
        mobile: '',
        country: '',
        code: '',
        isCheck: '',
    };
    const [errors, setErrors] = useState(errorsObj);

    useEffect(() => {
        Utils.getCurrentCountryCode()
            .then(countryCode => {
                getCountryList()
                    .then(response => {
                        let countryList = response.data.data;
                        if (countryCode) {
                            let index = countryList.findIndex(x => x.icon === countryCode);
                            if (index > -1) {
                                setCountry(parseInt(countryList[index]['id']));
                            }
                        }
                        setCountryList(countryList);
                    })
                    .catch(err => {
                    });
            });
    }, []);

    const handleCountry = (e) => {
        setCountry(e.target.value);
    };

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

    function onRegister(e) {
        e.preventDefault();
        let error = false;
        const errorObj = {...errorsObj};
        const isContainsSymbol = /^(?=.*[~!@#$%^&]).*$/;
        const noSpecialChar = /^[^*|":<>[\]{}`\\()';@&$]+$/;
        let passwordRule = [...passwordRules];

        if (!firstName) {
            errorObj.first_name = 'First name is required';
            error = true;
        } else {
            if (!noSpecialChar.test(firstName)) {
                errorObj.first_name = 'Special characters not allowed';
                error = true;
            }
        }
        if (!lastName) {
            errorObj.last_name = 'Last name is required';
            error = true;
        } else {
            if (!noSpecialChar.test(lastName)) {
                errorObj.last_name = 'Special characters not allowed';
                error = true;
            }
        }
        if (companyName && !noSpecialChar.test(companyName)) {
            errorObj.company_name = 'Special characters not allowed';
            error = true;
        }
        if (!email) {
            errorObj.email = 'Email is required';
            error = true;
        } else if (!validator.isEmail(email)) {
            errorObj.email = 'Please enter valid email address';
            error = true;
        }
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
        if (!country) {
            errorObj.country = 'Country is required';
            error = true;
        }

        if (!isChecked) {
            errorObj.isCheck = "Terms & condition is required";
            error = true;
        }

        setErrors(errorObj);
        setPasswordRules(passwordRule);

        if (error) return;

        setLoading(true);
        let obj = {
            email: email,
            first_name: firstName,
            last_name: lastName,
        };

        resendEmailCode(obj)
            .then(response => {
                setLoading(false);
                setIsVerify(2);
                setVerificationCode(response.data.code);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    }

    function onVerify(e) {
        e.preventDefault();
        let error = false;
        const errorObj = {...errorsObj};
        if (!code) {
            errorObj.code = 'Code is required';
            error = true;
        } else if (parseInt(code) !== verificationCode) {
            errorObj.code = 'Code is wrong.';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        setLoading(true);
        let obj = {
            first_name: firstName,
            last_name: lastName,
            company_name: companyName,
            email: email,
            password: password,
            mobile: '',
            country_id: country
        };
        register(obj)
            .then(response => {
                setUserData(response.data.data);
                setIsVerify(3);
                setLoading(false);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    }

    const onDashboard = (e) => {
        e.preventDefault();
        let encryptedData = encryptData(userData, SALT);
        localStorage.setItem(CLIENT_LOCAL_STORE, encryptedData);
        navigate('/client-portal');
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}

            <div className="body_part background_grey_400 d-flex align-items-center justify-content-center"
                 style={{minHeight: 'calc(100vh - 374px)'}}>
                <div className="login-wrapper">
                    <h2 className="d-flex align-items-center justify-content-center text-dark mb-3">Sign Up</h2>
                    <div className="process_graph mb-4">
                        <ul>
                            <li className="active"><span>1</span>Details</li>
                            <li className="dashed_border w-50"/>
                            <li className={`${isVerify > 1 ? `active` : ``}`}><span>2</span>Email Confirmation</li>
                        </ul>
                    </div>

                    {isVerify === 1 &&
                        <div className="card shadow sign-up mb-3">
                            <div className="card-body">
                                <form onSubmit={onRegister}>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">First name<sup>*</sup></label>
                                                <input type="text" value={firstName} maxLength="50"
                                                       onChange={(e) => setFirstName(e.target.value)}
                                                       className="form-control"/>
                                                {errors.first_name &&
                                                    <div className="text-danger mt-1">{errors.first_name}</div>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="mb-4">
                                                <label className="form-label">Last name<sup>*</sup></label>
                                                <input type="text" value={lastName} maxLength="50"
                                                       onChange={(e) => setLastName(e.target.value)}
                                                       className="form-control"/>
                                                {errors.last_name &&
                                                    <div className="text-danger mt-1">{errors.last_name}</div>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Email<sup>*</sup></label>
                                                <input type="text" value={email} maxLength="50"
                                                       onChange={(e) => setEmail(e.target.value)}
                                                       className="form-control"/>
                                                {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Country<sup>*</sup></label>
                                                <select value={country} onChange={handleCountry}
                                                        className="form-select">
                                                    <option value="">Select Country</option>
                                                    {countryList.map((item, i) =>
                                                        <option value={item.id} key={i}>{item.name}</option>
                                                    )}
                                                </select>
                                                {errors.country &&
                                                    <div className="text-danger mt-1">{errors.country}</div>}
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="mb-3">
                                                <label className="form-label">Company name</label>
                                                <input type="text" value={companyName} maxLength="50"
                                                       onChange={(e) => setCompanyName(e.target.value)}
                                                       className="form-control"/>
                                                {errors.company_name &&
                                                    <div className="text-danger mt-1">{errors.company_name}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="mb-4">
                                                <label className="form-label">Password<sup>*</sup></label>
                                                <input type="password" value={password}
                                                       maxLength="15"
                                                       onChange={handlePassword}
                                                       onFocus={(e) => setIsShowPasswordContain(true)}
                                                       className="form-control"/>
                                                {errors.password &&
                                                    <div className="text-danger mt-1">{errors.password}</div>}
                                            </div>
                                            {isShowPasswordContain === true && (
                                                <div
                                                    className="password_instruction background_grey_400 border rounded-3 mb-3 px-2 py-2">
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
                                        <div className="col-lg-6">
                                            <div className="mb-4">
                                                <label className="form-label">Confirm Password<sup>*</sup></label>
                                                <input type="password" value={confirmPassword}
                                                       maxLength="15"
                                                       onChange={(e) => setConfirmPassword(e.target.value)}
                                                       className="form-control"/>
                                                {errors.confirm_password &&
                                                    <div className="text-danger mt-1">{errors.confirm_password}</div>}
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="mb-4">
                                                <input className="h-auto"
                                                       type="checkbox" checked={isChecked}
                                                       onChange={(e) => setIsChecked(e.target.checked)}/>
                                                <span className="ms-2 font_18 text-black">I agree with <NavLink
                                                    to={"/terms-condition"}
                                                    target={"_blank"}>Terms & Conditions</NavLink> and <NavLink
                                                    to={"/privacy-policy"} target={"_blank"}> Privacy Policy </NavLink>
                                        </span>
                                                {errors.isCheck &&
                                                    <div className="text-danger mt-1">{errors.isCheck}</div>}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 text-center">
                                            <button type="submit" className="btn btn-primary px-5 mb-3">Next</button>
                                        </div>
                                        <div className="col-lg-6">
                                            <p>Already Have an Account ? <NavLink to={"/login"}>Login Now</NavLink></p>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    }

                    {isVerify === 2 &&
                        <div className="card shadow sign-up mb-3 confirmation_mail_card text-center">
                            <div className="card-body d-flex align-items-center justify-content-center flex-column">
                                <p className=" mb-3">Please verify your email by entering the activation code that has
                                    been
                                    send to your email (<a href={`mailto:${email}`}>{email}</a>).</p>
                                <p className=" mb-4">If you haven't received this Email within a few minutes, please
                                    check
                                    your spam folder.</p>
                                <form onSubmit={onVerify}>
                                    <div className="mb-3">
                                        <label className="form-label mb-3 text-center d-block">Please Enter the email
                                            verification Code</label>
                                        <input type="number" value={code} onChange={(e) => setCode(e.target.value)}
                                               className="form-control w-75 mx-auto"/>
                                        {errors.code && <div className="text-danger mt-1">{errors.code}</div>}
                                    </div>
                                    <button type="submit" className="btn btn-primary w-75 ">Confirm Email</button>
                                </form>
                            </div>
                        </div>
                    }

                    {isVerify === 3 &&
                        <div className="card shadow sign-up mb-3 sucessful_mail_card" style={{minHeight: '362px'}}>
                            <div className="card-body d-flex align-items-center justify-content-center flex-column">
                                <label className="form-label mb-4 text-center d-block">You have successfully completed
                                    the
                                    sign up process.</label>
                                <button onClick={onDashboard} type="button" className="btn btn-primary w-50 mb-3">Go to
                                    Dashboard
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

export default Register;