import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import Utils from "../../../utils";
import {
    adminPost2FAGenerateQrCode,
    adminPost2FARemoveQrCode,
    adminPost2FAVerifyQrCode
} from "../../../services/AdminService";

function Admin2FA() {
    const [loading, setLoading] = useState(false);
    const [qrUrl, setQrUrl] = useState('');
    const [accountName, setAccountName] = useState('');
    const [yourKey, setYourKey] = useState('');
    const [yourCode, setYourCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [code, setCode] = useState('');
    let errorsObj = {
        code: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    useEffect(() => {
        adminPost2FAGenerateQrCode()
            .then(response => {
                setIsVerified(response.data.is_verified);
                setQrUrl(response.data.url);
                setAccountName(response.data.data.qr_account_name);
                setYourKey(response.data.data.qr_key);
                setYourCode(response.data.data.qr_code);
            })
            .catch(err => {

            });
    }, []);

    const handleVerifyCode = (e) => {
        e.preventDefault();

        let error = false;
        let errorObj = {...errorsObj};
        if (!code) {
            error = true;
            errorObj.code = 'Please enter the code';
        }

        setErrors(errorObj);

        if (error) return;

        setLoading(true);

        let obj = {
            code: code
        };

        adminPost2FAVerifyQrCode(obj)
            .then(response => {
                setIsVerified(true);
                setLoading(false);
                toast.success(response.data.message);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleRemoveCode = (e) => {
        e.preventDefault();

        setLoading(true);
        adminPost2FARemoveQrCode()
            .then(response => {
                setLoading(false);
                setIsVerified(false);
                setCode('');
                toast.success(response.data.message);
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
            <div className="tab-pane" id="nav-Security" role="tabpanel" aria-labelledby="nav-Security-tab">
                <h2 className="main_title mb-4 ">Setup Google Authentication App.</h2>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="security_steps mb-4">
                            <label>
                                <span className="security_count">1</span>Download Google Authentication App
                            </label>
                            <p>Install Google authenticator app from Apple App store or Google Play Store</p>
                        </div>
                        <div className="security_steps mb-4">
                            <label>
                                <span className="security_count">2</span>Scan this Barcode
                            </label>
                            <p>Use your authenticator app to scan the barcode below.</p>
                            <div className="d-flex align-items-center mt-3">
                                {qrUrl && (
                                    <img src={qrUrl} alt="qr img" className="me-3"/>
                                )}

                                {accountName && yourKey && (
                                    <div>
                                        <p>If you are unable to scan this barcode, manually enter the below Code.</p>
                                        <span className="scanner_id mt-2">Account Name : {accountName}</span>
                                        <br/>
                                        <span className="scanner_id mt-2">Your Key : {yourKey}</span>
                                        {yourCode && (
                                            <>
                                                <br/>
                                                <span className="scanner_id mt-2">Verification Code : {yourCode}</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        {!isVerified && (
                            <div className="security_steps mb-4 step_wizard_content ">
                                <label>
                                    <span className="security_count">3</span>Enter your Authentication Code
                                </label>
                                <p>Enter the 6-digit code generated by your authenticator app.</p>
                                <div className="mb-4 mt-3">
                                    <input type="text" className="form-control w-25 w_sm_100" value={code}
                                           onChange={(e) => setCode(e.target.value)} placeholder="Authentication Code"/>
                                    {errors.code && (<div className="text-danger">{errors.code}</div>)}
                                </div>
                            </div>
                        )}
                        <div className="tab_footer_button position-relative">
                            {!isVerified && (
                                <button type="button" onClick={handleVerifyCode} className="btn btn-primary">Submit
                                </button>
                            )}
                            {isVerified && (
                                <button type="button" onClick={handleRemoveCode}
                                        className="btn btn-danger rounded-pill">Delete Authentication
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Admin2FA;