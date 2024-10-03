import React, {useEffect, useState, useRef} from "react";
import {useParams} from "react-router-dom";
import {PASSWORD_RULES} from "../../../../../configs/AppConfig";
import validator from 'validator';
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import {adminModifyUserPost} from "../../../../../services/AdminService";

function AdminClientModifyUser(props) {
    let {client} = useParams();
    const [userId, setUserId] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isShowPasswordContain, setIsShowPasswordContain] = useState(false);
    const [groupType, setGroupType] = useState(1);
    const [groupId, setGroupId] = useState('');
    const [groupName, setGroupName] = useState('');

    const clsModifyUserRef = useRef(null);

    let errorsObj = {
        first_name: '',
        last_name: '',
        email: '',
        role_id: '',
        password: '',
        confirm_password: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    let passwordRuleList = PASSWORD_RULES;
    const [passwordRules, setPasswordRules] = useState(passwordRuleList);

    useEffect(function () {
        setUserId(parseInt(props?.users.id));
        setFirstName(props?.users.first_name ? props?.users.first_name : '');
        setLastName(props?.users.last_name ? props?.users.last_name : '');
        setEmail(props?.users.email ? props?.users.email : '');
        setRoleId(props?.users.role_id ? props?.users.role_id : '');
    }, [props?.users]);

    const handleCloseModifyUser = (e) => {
        e.preventDefault();

        props.setUsers({
            id: 0,
            first_name: '',
            last_name: '',
            email: '',
            role_id: '',
            role_name: '',
            group_name: '',
            group_ids: []
        });
        setPassword('');
        setConfirmPassword('');
        setIsShowPasswordContain(false);
        setErrors(errorsObj);

        let passwordList = [...passwordRuleList];
        for (let i = 0; i < passwordList.length; i++) {
            passwordList[i]['active'] = false;
        }
        setPasswordRules(passwordList);
        setGroupId('');
        setGroupName('');
        setGroupType(1);
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

    const handleModifyUser = (e) => {
        e.preventDefault();
        let errorObj = {...errorsObj};
        let error = false;
        const isContainsSymbol = /^(?=.*[~!@#$%^&]).*$/;
        let passwordRule = [...passwordRules];

        if (!firstName) {
            errorObj.first_name = 'First name is required';
            error = true;
        }
        if (!lastName) {
            errorObj.last_name = 'Last name is required';
            error = true;
        }
        if (!email) {
            errorObj.email = 'Email is required';
            error = true;
        } else if (!validator.isEmail(email)) {
            errorObj.email = 'Please enter valid email address';
            error = true;
        }
        if (!roleId) {
            errorObj.role_id = 'Please select role';
            error = true;
        }

        if (userId === 0) {
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
        } else {
            if (password) {
                if (!validator.isStrongPassword(password, {
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
                if (confirmPassword !== password) {
                    errorObj.confirm_password = 'Confirm password does not match';
                    error = true;
                }
            }
        }

        setErrors(errorObj);
        setPasswordRules(passwordRule);

        if (error) return;

        props.setLoading(true);

        let obj = {
            client_id: client,
            id: userId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            role_id: roleId,
            password: password,
            group_id: groupId,
            group_name: groupName
        };

        adminModifyUserPost(obj)
            .then(response => {
                props.setLoading(false);
                props.setIsCall(!props.isCall);
                toast.success(response.data.message);
                clsModifyUserRef?.current.click();
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleGroupType = (e) => {
        setGroupId('');
        setGroupName('');
        setGroupType(e.target.value);
    };

    return (
        <div className="offcanvas offcanvas-end Add-Recipients" data-bs-scroll="true" tabIndex={-1}
             data-bs-keyboard="false" data-bs-backdrop="static" id="modifyUser" aria-labelledby="modifyUserLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="modifyUserLabel">{userId > 0 ? `Edit User` : `Create User`}</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        onClick={handleCloseModifyUser} aria-label="Close" ref={clsModifyUserRef}>
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">

                <div className="row mx-2 ">
                    <div className="col-lg-6">
                        <div className="mb-4">
                            <label className="form-label mb-2">First Name<sup>*</sup></label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                   className="form-control"/>
                            {errors.first_name && (<div className="text-danger">{errors.first_name}</div>)}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-4">
                            <label className="form-label mb-2">Last Name<sup>*</sup></label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                                   className="form-control"/>
                            {errors.last_name && (<div className="text-danger">{errors.last_name}</div>)}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-4">
                            <label className="form-label mb-2">Email<sup>*</sup></label>
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value.trim())}
                                   className="form-control"/>
                            {errors.email && (<div className="text-danger">{errors.email}</div>)}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-4">
                            <label className="form-label mb-2">Role<sup>*</sup> (<span
                                onClick={(e) => props.userRoleAccessRef?.current.click()}
                                className="text-primary text-decoration-underline cur-pointer">Access Types</span>)</label>
                            <select className="form-select" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                                <option value="">Select Role</option>
                                {props.roleList.map((item, index) =>
                                    <option key={index} value={item.id}>{item.name}</option>
                                )}
                            </select>
                            {errors.role_id && (<div className="text-danger">{errors.role_id}</div>)}
                        </div>
                    </div>

                    {parseInt(userId) === 0 && (
                        <div className="accordion more--details mb-4" id="More_details">
                            <div className="accordion-item background_grey_400 border-0">
                                <h2 className="accordion-header " id="moreDetails">
                                    <button className="accordion-button background_grey_400 py-2 px-3"
                                            style={{boxShadow: "none"}} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#More-details" aria-expanded="true"
                                            aria-controls="More-details">
                                        More Details
                                    </button>
                                </h2>
                                <div id="More-details" className="accordion-collapse collapse show"
                                     aria-labelledby="moreDetails">
                                    <div className="accordion-body">
                                        <div className="row">
                                            <div className="col-lg-12 mb-3">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio"
                                                           checked={parseInt(groupType) === 1}
                                                           onChange={handleGroupType}
                                                           name="group_type" id="existGroup" value={1}/>
                                                    <label className="form-check-label" htmlFor="existGroup">
                                                        Select Group From List
                                                        <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                           data-toggle="tooltip" data-placement="right"
                                                           title="How Can I Help You?"/>
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio"
                                                           checked={parseInt(groupType) === 2}
                                                           onChange={handleGroupType}
                                                           name="group_type" id="addGroup" value={2}/>
                                                    <label className="form-check-label" htmlFor="addGroup">
                                                        Add New Group
                                                        <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                           data-toggle="tooltip" data-placement="right"
                                                           title="How Can I Help You?"/>
                                                    </label>
                                                </div>
                                            </div>
                                            {parseInt(groupType) === 1 && (
                                                <div className="col-lg-12">
                                                    <div className="mb-4">
                                                        <select className="form-select" value={groupId}
                                                                onChange={(e) => setGroupId(e.target.value)}>
                                                            <option value="">Select Group</option>
                                                            {props.groupList.map((item, index) =>
                                                                <option key={index} value={item.id}>{item.name}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            {parseInt(groupType) === 2 && (
                                                <div className="col-lg-12">
                                                    <div className="mb-4">
                                                        <input type="text" className="form-control" value={groupName}
                                                               onChange={(e) => setGroupName(e.target.value)}
                                                               placeholder="Enter Group Name"/>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="col-lg-6">
                        <div className="mb-4">
                            <label className="form-label mb-2">Password<sup>*</sup></label>
                            <input type="password" value={password} onChange={handlePassword}
                                   onFocus={(e) => setIsShowPasswordContain(true)} className="form-control"/>
                            {errors.password && (<div className="text-danger">{errors.password}</div>)}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-4">
                            <label className="form-label mb-2">Confirm Password<sup>*</sup></label>
                            <input type="password" value={confirmPassword}
                                   onChange={(e) => setConfirmPassword(e.target.value)}
                                   className="form-control"/>
                            {errors.confirm_password && (
                                <div className="text-danger">{errors.confirm_password}</div>)}
                        </div>
                    </div>

                    {isShowPasswordContain === true && (
                        <div className="col-lg-9">
                            <div
                                className="password_instruction background_grey_400 border px-3 py-2">
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
                        </div>
                    )}
                </div>
                <div className="modal-footer mt-3 justify-content-center">
                    <button type="button" onClick={handleCloseModifyUser} data-bs-dismiss="offcanvas"
                            className="btn grey_btn_outline">Cancel
                    </button>
                    <button type="button" onClick={handleModifyUser} className="btn btn-primary">
                        {userId > 0 ? `Update User` : `Create User`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminClientModifyUser;