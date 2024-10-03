import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import validator from "validator";
import {PASSWORD_RULES} from "../../../../../configs/AppConfig";
import {adminChangePassword} from "../../../../../services/AdminService";

const AdminClientChangePassword = () => {
    let {client} = useParams();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    let errorsObj = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    };
    const [errors, setErrors] = useState(errorsObj);

    let passwordRuleList = PASSWORD_RULES;
    const [passwordRules, setPasswordRules] = useState(passwordRuleList);
    const [isShowPasswordContain, setIsShowPasswordContain] = useState(false);
    const [isViewReadOnly, setIsViewReadOnly] = useState(false);

    useEffect(function () {
        const userData = Utils.loginClientUserData(client);
        if (Object.keys(userData).length > 0) {
            if (userData.role_id > 4) {
                setIsViewReadOnly(true);
            }
        }
    }, [client]);

    function onChangePassword(e) {
        e.preventDefault();
        let error = false;
        const errorObj = {...errorsObj};
        const isContainsSymbol = /^(?=.*[~!@#$%^&]).*$/;

        if (oldPassword === "") {
            errorObj.oldPassword = "Old password must be required";
            error = true;
        }
        if (newPassword === "") {
            errorObj.newPassword = "New password must be required";
            error = true;
        } else if (!validator.isStrongPassword(newPassword, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            error = true;
        } else {
            if (!isContainsSymbol.test(newPassword)) {
                error = true;
            }
        }
        if (confirmPassword === "") {
            errorObj.confirmPassword = "Confirm password must be required";
            error = true;
        } else if (confirmPassword !== newPassword) {
            errorObj.confirmPassword =
                "New password and confirm password does not match";
            error = true;
        }
        setErrors(errorObj);

        if (error) return;

        let obj = {
            client_id: client,
            current_password: oldPassword,
            new_password: newPassword,
        };
        adminChangePassword(obj)
            .then((response) => {
                obj.current_password = confirmPassword;
                obj.new_password = newPassword;
                toast.success(response.data.message);
                setNewPassword("");
                setOldPassword("");
                setConfirmPassword("");
                setIsShowPasswordContain(false);
                let passwordRule = [...passwordRuleList];
                for (let i = 0; i < passwordRule.length; i++) {
                    passwordRule[i]['active'] = false;
                }
                setPasswordRules(passwordRule);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
            });
    }

    const handlePassword = (e) => {
        let value = e.target.value;
        setNewPassword(value);
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

    return (
        <div className="tab-pane  p-4 pt-5" id="nav-Change-Password" role="tabpanel"
             aria-labelledby="nav-Change-Password-tab">
            <div className="row ">
                <div className="col-lg-3"/>
                {isViewReadOnly === false && (
                    <div className="col-lg-6 step_wizard_content">
                        <div className="mb-3">
                            <label className="form-label">Old Password</label>
                            <input type="password" className="form-control" placeholder="Enter Old password"
                                   value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                            {errors.oldPassword &&
                            <div className="text-danger form-text">{errors.oldPassword}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-control" placeholder="Enter New password"
                                   onFocus={(e) => setIsShowPasswordContain(true)}
                                   value={newPassword} onChange={handlePassword}/>
                            {errors.newPassword &&
                            <div className="text-danger form-text">{errors.newPassword}</div>}

                            {isShowPasswordContain === true && (
                                <div
                                    className="password_instruction background_grey_400 border rounded-3 my-3 px-2 py-2">
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
                            <input type="password" className="form-control" placeholder="Enter Confirm password"
                                   value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            {errors.confirmPassword &&
                            <div className="text-danger form-text">{errors.confirmPassword}</div>}
                        </div>
                    </div>
                )}

                {isViewReadOnly === true && (
                    <div className="col-lg-6 step_wizard_content">
                        <div className="mb-3">
                            <label className="form-label">Old Password</label>
                            <input type="password" className="form-control" placeholder="Enter Old password"
                                   readOnly={true} value={oldPassword}
                                   onChange={(e) => setOldPassword(e.target.value)}/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-control" placeholder="Enter New password"
                                   readOnly={true} value={newPassword}
                                   onChange={(e) => setNewPassword(e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" placeholder="Enter Confirm password"
                                   readOnly={true} value={confirmPassword}
                                   onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </div>
                    </div>
                )}

                <div className="col-lg-3"/>
            </div>
            {isViewReadOnly === false && (
                <div className="tab_footer_button">
                    <button type="submit" className="btn btn-primary" onClick={onChangePassword}>Update Password
                    </button>
                </div>
            )}
        </div>
    );
};
export default AdminClientChangePassword;