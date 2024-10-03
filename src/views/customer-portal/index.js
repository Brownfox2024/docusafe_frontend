import React, {useEffect, useState, useRef} from "react";
import {useParams} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import DocumentsAndForm from "./DocumentsAndForm";
import Messages from "./Messages";
import Contact from "./Contact";
import Help from "./Help";
import {envelopeVerifyOtp, getCustomerEnvelopeData} from "../../services/CommonService";
import Utils from "../../utils";
import CustomerPortalTab from "./CustomerPortalTab";
import {Lang} from "../../lang";
import {toast} from "react-toastify";
import {CUSTOMER_PORTAL} from "../../configs/AppConfig";

function CustomerPortal(props) {
    let {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [envelopeData, setEnvelopeData] = useState({});
    const [contactData, setContactData] = useState({});
    const [theme, setTheme] = useState('');
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(true);

    const [firstLetter, setFirstLetter] = useState('');
    const [secondLetter, setSecondLetter] = useState('');
    const [thirdLetter, setThirdLetter] = useState('');
    const [fourthLetter, setFourthLetter] = useState('');
    const [fifthLetter, setFifthLetter] = useState('');
    const [sixthLetter, setSixthLetter] = useState('');

    const secondLetterRef = useRef(null);
    const thirdLetterRef = useRef(null);
    const fourthLetterRef = useRef(null);
    const fifthLetterRef = useRef(null);
    const sixthLetterRef = useRef(null);

    let errorsObj = {
        password: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const openPasswordModal = useRef(null);
    const clsPasswordModal = useRef(null);

    useEffect(function () {
        document.title = Lang.client_portal_title;

        getCustomerEnvelopeData({uuid: id})
            .then((response) => {
                //console.log(response.data.data);
                setEnvelopeData(response.data.data);
                setTheme(response.data.data.theme_color);
                setContactData(response.data.data.contact_detail);

                let localStore = sessionStorage.getItem(CUSTOMER_PORTAL);
                if (localStore) {
                    if (localStore === id) {
                        setOtp(false);
                    }
                }

                setLoading(false);
            })
            .catch((err) => {
                setError(Utils.getErrorMessage(err));
                setLoading(false);
            });
    }, [id]);

    const handlePasswordForm = (e) => {
        e.preventDefault();
        let errorObj = {...errorsObj};
        let error = false;

        if (!password) {
            errorObj.password = 'Please enter password';
            error = true;
        } else if (password !== envelopeData.password) {
            errorObj.password = 'Enter password is wrong.';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        clsPasswordModal?.current.click();
    };

    const handleOtpInput = (e, type) => {
        let value = e.target.value;
        if (value.length > 1) return;
        if (type === 1) {
            setFirstLetter(value);
            secondLetterRef?.current.focus();
        } else if (type === 2) {
            setSecondLetter(value);
            thirdLetterRef?.current.focus();
        } else if (type === 3) {
            setThirdLetter(value);
            fourthLetterRef?.current.focus();
        } else if (type === 4) {
            setFourthLetter(value);
            fifthLetterRef?.current.focus();
        } else if (type === 5) {
            setFifthLetter(value);
            sixthLetterRef?.current.focus();
        } else if (type === 6) {
            setSixthLetter(value);
        }
    };

    const handleOptClear = (e, type) => {
        if (e.key === 'Backspace') {
            if (type === 1) {
                setFirstLetter('');
            } else if (type === 2) {
                setSecondLetter('');
            } else if (type === 3) {
                setThirdLetter('');
            } else if (type === 4) {
                setFourthLetter('');
            } else if (type === 5) {
                setFifthLetter('');
            }
        }
    };

    const handleOtp = async (e) => {
        e.preventDefault();

        let otpValue = firstLetter + secondLetter + thirdLetter + fourthLetter + fifthLetter + sixthLetter;

        if (otpValue.length === 6) {
            setLoading(true);
            let ipAddress = '';
            await Utils.getIpAddress().then(response => {
                ipAddress = response;
            });

            let obj = {
                ip_address: ipAddress,
                otp: otpValue,
                id: envelopeData.id,
                recipient_id: envelopeData.recipient_detail.id,
                recipient_email: envelopeData.recipient_detail.email
            };

            envelopeVerifyOtp(obj)
                .then(response => {
                    setLoading(false);
                    setOtp(false);
                    if (envelopeData.password) {
                        setTimeout(function () {
                            openPasswordModal?.current.click();
                        }, 0);
                    }
                    sessionStorage.setItem(CUSTOMER_PORTAL, id);
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        } else {
            toast.error('Invalid OTP');
        }
    };

    const handlePasteValue = (e) => {
        let value = e.clipboardData.getData('text');
        let length = value.length;
        if (length === 6) {
            for (let i = 0; i < length; i++) {
                if (i === 0) {
                    setFirstLetter(value[i]);
                } else if (i === 1) {
                    setSecondLetter(value[i]);
                } else if (i === 2) {
                    setThirdLetter(value[i]);
                } else if (i === 3) {
                    setFourthLetter(value[i]);
                } else if (i === 4) {
                    setFifthLetter(value[i]);
                } else if (i === 5) {
                    setSixthLetter(value[i]);
                }
            }
        }
    };

    return (
        <>
            {loading && (
                <div className="page-loading">
                    <img src="/images/loader.gif" alt="loader"/>
                </div>
            )}
            <div className={`wrapper clientPortal ${theme}`}>
                <Header envelopeData={envelopeData}/>

                {otp === true && (
                    <div className=" background_grey_400">
                        <section
                            className="setting_tab client_portal px-3 pb-2 d-flex align-items-center justify-content-center"
                            style={{minHeight: 'calc(100vh - 105px)'}}>
                            <div className=" otp-box h-100">
                                
                            <p className="fz_25 mb-5">
                                {contactData?.first_name && contactData?.last_name &&
                                    `${contactData.first_name} ${contactData.last_name}`}

                                {contactData?.company_name &&
                                    ` from ${contactData.company_name} requested you to upload Documents`}

                                {envelopeData?.request_form_list && envelopeData.request_form_list.length > 0 &&
                                    ` & Information`}
                                </p>
                                <div className="card shadow ">
                                    <div
                                        className="card-body d-flex align-items-center justify-content-center flex-column">
                                        <div className="mb-4">
                                            <img src="/images/logo.png" className="h-8" alt="..."/>
                                        </div>
                                        <p className="mb-4">Please enter 6 digit Access Code <br/> received in the email
                                        </p>
                                        <div className="verification-code--inputs mb-4">
                                            <input type="number" value={firstLetter} maxLength="1"
                                                   onPaste={handlePasteValue}
                                                   onKeyDown={(e) => handleOptClear(e, 1)}
                                                   onChange={(e) => handleOtpInput(e, 1)}/>
                                            <input type="number" value={secondLetter} maxLength="1"
                                                   onPaste={handlePasteValue}
                                                   ref={secondLetterRef} onKeyDown={(e) => handleOptClear(e, 2)}
                                                   onChange={(e) => handleOtpInput(e, 2)}/>
                                            <input type="number" value={thirdLetter} maxLength="1" ref={thirdLetterRef}
                                                   onPaste={handlePasteValue}
                                                   onKeyDown={(e) => handleOptClear(e, 3)}
                                                   onChange={(e) => handleOtpInput(e, 3)}/>
                                            <input type="number" value={fourthLetter} maxLength="1"
                                                   onPaste={handlePasteValue}
                                                   ref={fourthLetterRef} onKeyDown={(e) => handleOptClear(e, 4)}
                                                   onChange={(e) => handleOtpInput(e, 4)}/>
                                            <input type="number" value={fifthLetter} maxLength="1" ref={fifthLetterRef}
                                                   onPaste={handlePasteValue}
                                                   onKeyDown={(e) => handleOptClear(e, 5)}
                                                   onChange={(e) => handleOtpInput(e, 5)}/>
                                            <input type="number" value={sixthLetter} maxLength="1" ref={sixthLetterRef}
                                                   onPaste={handlePasteValue}
                                                   onChange={(e) => handleOtpInput(e, 6)}/>
                                        </div>
                                        <div className="accordion_primary_btn w-75">
                                            <button type="button" onClick={handleOtp}
                                                    className="btn btn-primary w-100">Verify
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {otp === false && (
                    <>
                        {!error &&
                        <>
                            {!envelopeData.is_finish &&
                            <div className=" background_grey_400">
                                <section className="setting_tab client_portal px-3 pb-2 custom_container_portal"
                                         style={{minHeight: "calc(100vh - 104px)"}}>

                                    <CustomerPortalTab envelopeData={envelopeData}/>

                                    <div className="tab-content  px-5 py-4" id="nav-tabContent"
                                         style={{minHeight: "calc(100vh - 219px)"}}>

                                        <DocumentsAndForm envelopeData={envelopeData} setLoading={setLoading}/>

                                        <Messages envelopeData={envelopeData}/>

                                        <Contact contactData={contactData}/>

                                        <Help/>
                                    </div>
                                </section>

                                <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal"
                                        ref={openPasswordModal} data-bs-target="#passwordModal">
                                </button>
                                <div className="modal fade" id="passwordModal" tabIndex="-1"
                                     aria-labelledby="exampleModalLabel"
                                     data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Enter
                                                    Password</h1>
                                            </div>
                                            <div className="modal-body">
                                                <div className="form-group">
                                                    <input type="password" className="form-control" value={password}
                                                           onChange={(e) => setPassword(e.target.value)}
                                                           placeholder="Enter password"/>
                                                    {errors.password &&
                                                    <div className="text-danger mt-1 ms-2">{errors.password}</div>}
                                                </div>
                                            </div>
                                            <div className="modal-footer justify-content-center">
                                                <button type="button" className="btn btn-secondary d-none"
                                                        ref={clsPasswordModal} data-bs-dismiss="modal">Close
                                                </button>
                                                <button type="button" onClick={handlePasswordForm}
                                                        className="btn btn-primary">Submit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }

                            {envelopeData.is_finish && <div className="error_Wrapper">
                                <div className="card">
                        <span className="text-success mb-3 error_icon">
                            <i className="fa fa-check-circle-o" aria-hidden="true"/>
                        </span>
                                    <h2 className=" mb-2"><b>Completed</b></h2>
                                    {envelopeData.finish_message}
                                </div>
                            </div>
                            }
                        </>
                        }

                        {error && <div className="error_Wrapper">
                            <div className="card">
                        <span className="text-danger mb-3 error_icon">
                            <i className="fa fa-exclamation-triangle" aria-hidden="true"/>
                        </span>
                                <h2 className=" mb-2"><b>ERROR</b></h2>
                                {error}
                            </div>
                        </div>
                        }

                    </>
                )}
                <Footer/>
            </div>
        </>
    );
}

export default CustomerPortal;
