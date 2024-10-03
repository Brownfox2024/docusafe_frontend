import React, {useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {getCountryList} from "../../../services/CommonService";
import {
    CLIENT_LOCAL_STORE,
    COUNTRY_ID,
    MONTH_LIST,
    PASSWORD_RULES,
    SALT
} from "../../../configs/AppConfig";
import validator from "validator";
import {registerWithPlan, registerWithPromoCode, resendEmailCode} from "../../../services/AuthService";
import {toast} from "react-toastify";
import Utils from "../../../utils";
import {getBillingPlanList} from "../../../services/BilingService";
import {encryptData} from "../../../utils/crypto";
import {Lang} from "../../../lang";

let yearList = Utils.cardYearList();

function Pricing() {
    const navigate = useNavigate();

    document.title = Lang.pricing_title;
    document.getElementsByTagName("META")[4].content = Lang.pricing_meta_desc;
    document.getElementsByTagName("META")[5].content = Lang.pricing_meta_keyword;

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(1);
    const [planTypeId, setPlanTypeId] = useState(1);
    const [planType, setPlanType] = useState('Month');
    const [currency, setCurrency] = useState([]);
    const [currentCurrency, setCurrentCurrency] = useState('AUD');
    const [tax, setTax] = useState(0);
    const [monthDiscount, setMonthDiscount] = useState(0);
    const [yearDiscount, setYearDiscount] = useState(0);

    const [proAmount, setProAmount] = useState(0);
    const [proEnvelopeSelect, setProEnvelopeSelect] = useState(1);
    const [proEnvelopeList, setProEnvelopeList] = useState([]);
    const [proPlanList, setProPlanList] = useState([]);
    const [proPlanStorage, setProPlanStorage] = useState(0);

    const [teamAmount, setTeamAmount] = useState(0);
    const [teamEnvelopeSelect, setTeamEnvelopeSelect] = useState(1);
    const [teamEnvelopeList, setTeamEnvelopeList] = useState([]);
    const [teamPlanList, setTeamPlanList] = useState([]);
    const [teamPlanStorage, setTeamPlanStorage] = useState(0);

    const [planFeatures, setPlanFeatures] = useState([]);

    const [planData, setPlanData] = useState({
        plan_id: 0,
        plan_name: '',
        plan_amount: 0,
        amount: 0,
        envelope: 0,
        sms: 0,
        user: 0,
        save_amount: 0,
        total_amount: 0,
        total_amount_show: 0,
        plan_type_id: 0,
        currency: '',
    });

    const [freePlan, setFreePlan] = useState({
        envelope: 0,
        sms: 0,
        user: 0,
        storage: 2
    });

    const [buttons, setButtons] = useState([
        {id: 1, name: 'Monthly', active: true},
        {id: 2, name: 'Yearly', active: false}
    ]);

    const [isBuyNow, setIsBuyNow] = useState(1);
    const [buyType, setBuyType] = useState(1);

    const [isConfirm, setIsConfirm] = useState(false);

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
    const [code, setCode] = useState('');
    const [verificationCode, setVerificationCode] = useState(0);
    const [isShowPasswordContain, setIsShowPasswordContain] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const [promoCode, setPromoCode] = useState('');
    const [successMsg, setSuccessMsg] = useState('You have successfully completed.');

    let errorsObj = {
        first_name: '',
        last_name: '',
        email: '',
        company_name: '',
        password: '',
        confirm_password: '',
        mobile: '',
        country: '',
        code: '',
        isCheck: '',
    };
    const [errors, setErrors] = useState(errorsObj);

    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiryMonth, setCardExpiryMonth] = useState('');
    const [cardExpiryYear, setCardExpiryYear] = useState('');
    const [cardCvv, setCardCvv] = useState('');

    let cardErrorsObj = {
        card_holder_name: '',
        card_number: '',
        card_expiry_date: '',
        card_cvv: ''
    };
    const [cardErrors, setCardErrors] = useState(cardErrorsObj);

    const [userData, setUserData] = useState({});

    useEffect(function () {
        setLoading(true);

        getBillingPlanList({})
            .then(response => {
                setCurrency(response.data.currency);
                setFreePlan(response.data.free_plan);
                setProAmount(response.data.pro_plan[0]['price'][0]['amount']);
                setProEnvelopeList(response.data.pro_plan[0]['price'][0]['envelope']);
                setProPlanStorage(response.data.pro_plan[0]['price'][0]['envelope'][0]['storage']);
                setProPlanList(response.data.pro_plan);

                setTeamAmount(response.data.team_plan[0]['price'][0]['amount']);
                setTeamEnvelopeList(response.data.team_plan[0]['price'][0]['envelope']);
                setTeamPlanStorage(response.data.team_plan[0]['price'][0]['envelope'][0]['storage']);
                setTeamPlanList(response.data.team_plan);

                setTax(response.data.tax);
                setMonthDiscount(response.data.month_discount);
                setYearDiscount(response.data.year_discount);

                setPlanFeatures(response.data.plan_features_list);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });
    }, []);

    useEffect(function () {
        Utils.getCurrentCountryCode()
            .then(countryCode => {
                getCountryList()
                    .then(response => {
                        setCountryList(response.data.data);
                    })
                    .catch(err => {
                    });
            });
    }, []);

    const handleUser = (e, type) => {
        let totalUser = user;
        if (type === 1) {
            if (totalUser === 1) return;

            totalUser = totalUser - 1;
        } else {
            totalUser = totalUser + 1;
        }
        setUser(totalUser);

        calculateTeamAmount(planTypeId, currentCurrency, teamEnvelopeSelect, totalUser);
    };

    const handlePackage = (e, data) => {
        e.preventDefault();
        let buttonList = [...buttons];
        for (let i = 0; i < buttonList.length; i++) {
            let active = false;
            if (buttonList[i]['id'] === data.id) {
                active = true;
            }
            if (data.id === 1) {
                setPlanType('Month');
            } else {
                setPlanType('Yearly');
            }
            buttonList[i]['active'] = active;
        }
        setPlanTypeId(data.id);
        setButtons(buttonList);

        let proList = [...proPlanList];
        let pIndex = proList.findIndex(x => x.id === data.id);
        if (pIndex > -1) {
            let priceList = proList[pIndex]['price'];
            let pIdx = priceList.findIndex(x => x.name === currentCurrency);
            if (pIdx > -1) {
                setProEnvelopeList(priceList[pIdx]['envelope']);

                calculateProAmount(data.id, currentCurrency, proEnvelopeSelect);
            }
        }

        let teamList = [...teamPlanList];
        let tIndex = teamList.findIndex(x => x.id === data.id);
        if (tIndex > -1) {
            let priceList = teamList[tIndex]['price'];
            let pIdx = priceList.findIndex(x => x.name === currentCurrency);
            if (pIdx > -1) {
                setTeamEnvelopeList(priceList[pIdx]['envelope']);

                calculateTeamAmount(data.id, currentCurrency, teamEnvelopeSelect, user);
            }
        }

        calculatePlan(buyType, data.id);
    };

    const handleCurrency = (e) => {
        let value = e.target.value;
        setCurrentCurrency(value);

        let proList = [...proPlanList];
        let pIndex = proList.findIndex(x => x.id === planTypeId);
        if (pIndex > -1) {
            let priceList = proList[pIndex]['price'];
            let pIdx = priceList.findIndex(x => x.name === value);
            if (pIdx > -1) {
                setProEnvelopeList(priceList[pIdx]['envelope']);

                calculateProAmount(planTypeId, value, proEnvelopeSelect);
            }
        }

        let teamList = [...teamPlanList];
        let tIndex = teamList.findIndex(x => x.id === planTypeId);
        if (tIndex > -1) {
            let priceList = teamList[tIndex]['price'];
            let pIdx = priceList.findIndex(x => x.name === value);
            if (pIdx > -1) {
                setTeamEnvelopeList(priceList[pIdx]['envelope']);

                calculateTeamAmount(planTypeId, value, teamEnvelopeSelect, user);
            }
        }
    };

    const handleChangeProEnvelope = (e) => {
        let value = e.target.value;
        setProEnvelopeSelect(value);

        calculateProAmount(planTypeId, currentCurrency, value);
    };

    const handleChangeTeamEnvelope = (e) => {
        let value = e.target.value;
        setTeamEnvelopeSelect(value);

        calculateTeamAmount(planTypeId, currentCurrency, value, user);
    };

    const calculateProAmount = (planId, currencyName, envelope) => {
        let proList = [...proPlanList];
        let amount = 0;
        let pIndex = proList.findIndex(x => x.id === planId);
        if (pIndex > -1) {
            let priceList = proList[pIndex]['price'];
            let pIdx = priceList.findIndex(x => x.name === currencyName);
            if (pIdx > -1) {
                let envelopeList = priceList[pIdx]['envelope'];
                let eIndex = envelopeList.findIndex(x => parseInt(x.id) === parseInt(envelope));
                if (eIndex > -1) {
                    amount = amount + envelopeList[eIndex]['amount'];
                    setProPlanStorage(envelopeList[eIndex]['storage']);
                }
            }
        }
        setProAmount(amount);
    };

    const calculateTeamAmount = (planId, currencyName, envelope, userNo) => {
        let teamList = [...teamPlanList];
        let amount = 0;
        let tIndex = teamList.findIndex(x => x.id === planId);
        if (tIndex > -1) {
            let priceList = teamList[tIndex]['price'];
            let pIdx = priceList.findIndex(x => x.name === currencyName);
            if (pIdx > -1) {
                let envelopeList = priceList[pIdx]['envelope'];
                let eIndex = envelopeList.findIndex(x => parseInt(x.id) === parseInt(envelope));
                if (eIndex > -1) {
                    amount = amount + envelopeList[eIndex]['amount'];
                    setTeamPlanStorage(envelopeList[eIndex]['storage']);
                }
            }
        }

        if (userNo > 1) {
            if (userNo === 2) {
                if (planId === 2) {
                    amount = amount + 60;
                } else {
                    amount = amount + 5;
                }
            } else {
                if (planId === 2) {
                    let userAmount = (userNo - 1) * 60;
                    amount = amount + userAmount;
                } else {
                    let userAmount = (userNo - 1) * 5;
                    amount = amount + userAmount;
                }
            }
        }
        setTeamAmount(amount);
    };

    const handleBoyNow = (e, type) => {
        e.preventDefault();

        setBuyType(type);
        calculatePlan(type, planTypeId);

        setIsBuyNow(2);
    };

    const calculatePlan = (type, planId) => {
        let amount = 0;
        let envelope = 0;
        let sms = 0;
        let totalUser = 1;
        let discountAmount = 0;
        let planName = '';
        let planAmount = 0;
        let storage = 0;
        if (type === 1) {
            planName = 'Pro';

            let proList = [...proPlanList];
            let pIndex = proList.findIndex(x => x.id === planId);
            if (pIndex > -1) {
                let priceList = proList[pIndex]['price'];
                let pIdx = priceList.findIndex(x => x.name === currentCurrency);
                if (pIdx > -1) {
                    let envelopeList = priceList[pIdx]['envelope'];
                    let eIndex = envelopeList.findIndex(x => parseInt(x.id) === parseInt(proEnvelopeSelect));
                    if (eIndex > -1) {
                        amount = amount + envelopeList[eIndex]['amount'];
                        envelope = envelopeList[eIndex]['total'];
                        sms = envelopeList[eIndex]['sms'];
                        storage = envelopeList[eIndex]['storage'];
                    }
                }
            }
            planAmount = amount;
        } else {
            planName = 'Team';
            totalUser = user;

            let teamList = [...teamPlanList];
            let tIndex = teamList.findIndex(x => x.id === planId);
            if (tIndex > -1) {
                let priceList = teamList[tIndex]['price'];
                let pIdx = priceList.findIndex(x => x.name === currentCurrency);
                if (pIdx > -1) {
                    let envelopeList = priceList[pIdx]['envelope'];
                    let eIndex = envelopeList.findIndex(x => parseInt(x.id) === parseInt(teamEnvelopeSelect));
                    if (eIndex > -1) {
                        amount = amount + envelopeList[eIndex]['amount'];
                        envelope = envelopeList[eIndex]['total'];
                        sms = envelopeList[eIndex]['sms'];
                        storage = envelopeList[eIndex]['storage'];
                    }
                }
            }

            if (user > 1) {
                if (user === 2) {
                    if (planId === 2) {
                        amount = amount + 60;
                    } else {
                        amount = amount + 5;
                    }
                } else {
                    if (planId === 2) {
                        let userAmount = (user - 1) * 60;
                        amount = amount + userAmount;
                    } else {
                        let userAmount = (user - 1) * 5;
                        amount = amount + userAmount;
                    }
                }
            }
            planAmount = amount;
        }

        let taxAmount = (amount * tax) / 100;
        let totalAmount = Math.round(amount + taxAmount);

        let obj = {
            plan_id: type,
            plan_name: planName,
            plan_amount: planAmount,
            amount: amount.toFixed(2),
            envelope: envelope,
            sms: sms,
            user: totalUser,
            save_amount: discountAmount,
            total_amount: totalAmount,
            total_amount_show: totalAmount.toFixed(2),
            plan_type_id: planId,
            currency: currentCurrency,
            storage: storage
        };

        setPlanData(obj);
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        navigate('/sign-up');
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

    const handleCountry = (e) => {
        setCountry(e.target.value);
    };

    const onSignUpNext = (e) => {
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
                setIsConfirm(true);
                setVerificationCode(response.data.code);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    };

    const handleSignUpConfirm = (e) => {
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

        setIsBuyNow(3);
    };

    const handleBackButton = (e) => {
        e.preventDefault();

        setIsBuyNow(2);
        setIsConfirm(false);
        setCode('');
    };

    const handlePlanPurchase = (e) => {
        e.preventDefault();
        let errorObj = {...cardErrorsObj};
        let error = false;

        if (!cardHolderName) {
            errorObj.card_holder_name = 'Please enter name';
            error = true;
        }
        if (!cardNumber) {
            errorObj.card_number = 'Please enter card number';
            error = true;
        }
        if (!cardExpiryMonth) {
            errorObj.card_expiry_date = 'Please select expiry month';
            error = true;
        } else if (!cardExpiryYear) {
            errorObj.card_expiry_date = 'Please select expiry year';
            error = true;
        }
        if (!cardCvv) {
            errorObj.card_cvv = 'Please enter card cvv';
            error = true;
        }

        setCardErrors(errorObj);

        if (error) return;

        setLoading(true);

        let obj = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            country_id: country,
            company_name: companyName,
            mobile: '',
            password: password,
            card_holder_name: cardHolderName,
            card_number: cardNumber,
            card_expiry_month: cardExpiryMonth,
            card_expiry_year: cardExpiryYear,
            card_cvv: cardCvv,
            plan_data: planData
        };

        registerWithPlan(obj)
            .then(response => {
                setIsBuyNow(4);
                setSuccessMsg(response.data.message);
                setUserData(response.data.data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });

    };

    const onDashboard = (e) => {
        e.preventDefault();
        let encryptedData = encryptData(userData, SALT);
        localStorage.setItem(CLIENT_LOCAL_STORE, encryptedData);
        navigate('/client-portal');
    };

    const handlePromoCode = (e) => {
        e.preventDefault();
        let error = false;

        if (!promoCode.trim()) {
            toast.error('Promo code is required');
            error = true;
        } else if (planData.sms > 0) {
            toast.error('Invalid promo code for selected plan');
            error = true;
        }

        if (error) return;

        setLoading(true);

        let obj = {
            promo_code: promoCode,
            first_name: firstName,
            last_name: lastName,
            email: email,
            country_id: country,
            company_name: companyName,
            mobile: '',
            password: password,
            card_holder_name: cardHolderName,
            card_number: cardNumber,
            card_expiry_month: cardExpiryMonth,
            card_expiry_year: cardExpiryYear,
            card_cvv: cardCvv,
            plan_data: planData
        };

        registerWithPromoCode(obj)
            .then(response => {
                setIsBuyNow(4);
                setSuccessMsg(response.data.message);
                setUserData(response.data.data);
                setLoading(false);
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

            {isBuyNow === 1 && (
                <div className="p-0" style={{minHeight: 'calc(100vh - 406px)'}}>
                    <div className="title_container px-4 py-5">
                        <h1 className="text-dark text-center mb-3">Pricing</h1>
                        <p className="text-dark text-center">Only pay for what you use, nothing more. Same features,
                            just low prices.
                            <span
                                className="d-block">We guarantee to offer you a lowest price than our competitors.</span>
                        </p>
                    </div>

                    <div className="custom_container">
                        <div className="d-flex justify-content-between my-4 flexWrap justify_center">
                            <div className="d-flex justify-content-between px-5 d-none d-md-block"/>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="p-1 switch-box border-secondary background_grey_400 me-3"
                                     style={{borderRadius: '25px'}}>
                                    <div className="btn-group btn-toggle" style={{width: '200px'}}>
                                        {buttons.map((item, index) =>
                                            <button key={index} onClick={(e) => handlePackage(e, item)}
                                                    className={`btn switch-button ${item.active ? `btn-dark active` : `btn-default`}`}
                                                    style={{borderRadius: '25px'}}>{item.name}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <select className="form-select w-auto currency background_grey_400"
                                        value={currentCurrency} onChange={handleCurrency}
                                        aria-label="Default select example" data-toggle="tooltip" data-placement="right"
                                        title="" data-bs-original-title="click Me">
                                    {currency && currency.map((item, index) =>
                                        <option key={index} value={item}>{item}</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="table-responsive mt-3 mb-5 price-table">
                            <table className="table mb-0 table-striped shadow-sm price-plan-table">
                                <thead>
                                <tr className="">
                                    <th className="p-3" style={{minWidth: '200px'}}>
                                        <div className="d-flex flexWrap">
                                            <div className="switch-content ms-2">Pay Annually and Save upto 17% of the
                                                plan price.
                                            </div>
                                        </div>
                                    </th>
                                    <th style={{minWidth: '380px'}} className="text-center">
                                        <h2 className="plan_name">
                                            Free
                                        </h2>
                                        <p className="plan_content">
                                            Try DocuTick for Free before you buy.
                                            <span className="d-block">No credit card Required.</span>
                                        </p>
                                        <p className="plan_price">
                                            Starts at <br/>
                                            <span><span>{currentCurrency} 0/Month</span></span>
                                        </p>
                                        <button type="button" onClick={handleSignUp}
                                                className="btn btn-primary updateplan-button align-items-center justify-content-center"
                                                data-toggle="tooltip" data-placement="right" title=""
                                                data-bs-original-title="click Me">Try Free
                                        </button>
                                    </th>
                                    <th ref={(el) => el && el.style.setProperty('min-width', '320px', "important")}
                                        className="text-center">
                                        <h2 className="plan_name">Pro</h2>
                                        <p className="plan_content">
                                            Perfectly suitable for start ups.
                                            <span className="d-block">Only one user allowed.</span>
                                        </p>
                                        <p className="plan_price">
                                            Starts at <br/>
                                            <span
                                                className="monthly_price"><span>{currentCurrency} {proAmount}</span>/{planType}</span>
                                        </p>
                                        <button type="button" onClick={(e) => handleBoyNow(e, 1)}
                                                className="btn btn-primary updateplan-button align-items-center justify-content-center"
                                                data-toggle="tooltip" data-placement="right" title=""
                                                data-bs-original-title="click Me">Buy Now
                                        </button>
                                    </th>
                                    <th style={{minWidth: '340px'}} className="text-center">
                                        <h2 className="plan_name">Team</h2>
                                        <p className="plan_content">
                                            Most suitable for small to Medium Teams.
                                            <span className="d-block">Add more users & many more.</span>
                                        </p>
                                        <p className="plan_price">
                                            Starts at <br/>
                                            <span
                                                className="monthly_price"><span>{currentCurrency} {teamAmount}</span>/{planType}</span>
                                        </p>
                                        <button type="button" onClick={(e) => handleBoyNow(e, 2)}
                                                className="btn btn-primary updateplan-button align-items-center justify-content-center"
                                                data-toggle="tooltip" data-placement="right" title=""
                                                data-bs-original-title="click Me">Buy Now
                                        </button>
                                    </th>
                                </tr>
                                </thead>
                                <tbody style={{borderTop: '0px'}}>
                                <tr>
                                    <td>Max. Number of Documents per Envelope</td>
                                    <td className="text-center">20</td>
                                    <td className="text-center">30</td>
                                    <td className="text-center">50</td>
                                </tr>
                                <tr>
                                    <td>Max. Number of Recipients per envelope</td>
                                    <td className="text-center">5</td>
                                    <td className="text-center">15</td>
                                    <td className="text-center">30</td>
                                </tr>
                                <tr>
                                    <td>Number of Envelopes
                                        <span
                                            className="d-block">(Send Unlimited Envelopes, Pay when the client uploads at least one document in the Request)</span>
                                    </td>
                                    <td className="text-center">{freePlan.envelope} Envelopes Free/Month</td>
                                    <td className="text-center">
                                        <select className="form-select price-select" aria-label="Default select example"
                                                data-toggle="tooltip" data-placement="right" title=""
                                                value={proEnvelopeSelect}
                                                data-bs-original-title="click Me" onChange={handleChangeProEnvelope}>
                                            {proEnvelopeList.map((item, index) =>
                                                <option key={index} value={item.id}>{item.text}</option>
                                            )}
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <select className="form-select price-select" aria-label="Default select example"
                                                data-toggle="tooltip" data-placement="right" title=""
                                                value={teamEnvelopeSelect}
                                                data-bs-original-title="click Me" onChange={handleChangeTeamEnvelope}>
                                            {teamEnvelopeList.map((item, index) =>
                                                <option key={index} value={item.id}>{item.text}</option>
                                            )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Number of Users</td>
                                    <td className="text-center">{freePlan.user} User</td>
                                    <td className="text-center">1 User</td>
                                    <td className="text-center">
                                        <div className="number-plus-minus">
                                            <span className="number-minus-button" onClick={(e) => handleUser(e, 1)}>
                                                <i className="fa fa-minus-circle" aria-hidden="true"/>
                                            </span>
                                            &nbsp;
                                            <input type="text" className="number-text-box" value={user} readOnly
                                                   onChange={(e) => setUser(e.target.value)}/>
                                            <span className="input-user">User</span>
                                            &nbsp;
                                            <span className="number-plus-button" onClick={(e) => handleUser(e, 2)}>
                                                <i className="fa fa-plus-circle" aria-hidden="true"/>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Storage Space</td>
                                    <td className="text-center">{freePlan.storage} GB</td>
                                    <td className="text-center">{proPlanStorage} GB</td>
                                    <td className="text-center">{teamPlanStorage} GB</td>
                                </tr>
                                <tr>
                                    <th colSpan="4" className="features-plan-headind"
                                        ref={(el) => el && el.style.setProperty('background-color', '#dfdfdf', "important")}>Plan
                                        Features
                                    </th>
                                </tr>
                                {planFeatures && planFeatures.map((item, index) =>
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        {item.plans.map((plan, i) =>
                                            <td key={i} className="text-center">
                                                <i className={`fa ${plan ? `fa-check-circle features-true` : `fa-times-circle features-false`}`}
                                                   aria-hidden="true"/>
                                            </td>
                                        )}
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {isBuyNow === 2 && (
                <div className="body_part background_grey_400 d-flex align-items-center justify-content-center"
                     style={{minHeight: 'calc(100vh - 374px)'}}>
                    <div className="login-wrapper">
                        <h2 className="d-flex align-items-center justify-content-center text-dark mb-3">Sign Up</h2>
                        <div className="process_graph mb-4">
                            <ul>
                                <li className="active"><span>1</span>Details</li>
                                <li className="dashed_border w-50"/>
                                <li><span>2</span>Payment</li>
                            </ul>
                        </div>

                        {!isConfirm && (
                            <div className="card shadow sign-up mb-3">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">First name<sup>*</sup></label>
                                                <input type="text" className="form-control" value={firstName}
                                                       maxLength="50" onChange={(e) => setFirstName(e.target.value)}/>
                                                {errors.first_name && (
                                                    <div className="text-danger mt-1">{errors.first_name}</div>)}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="mb-4">
                                                <label className="form-label">Last name<sup>*</sup></label>
                                                <input type="text" className="form-control" value={lastName}
                                                       maxLength="50" onChange={(e) => setLastName(e.target.value)}/>
                                                {errors.last_name && (
                                                    <div className="text-danger mt-1">{errors.last_name}</div>)}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Email<sup>*</sup></label>
                                                <input type="email" className="form-control" value={email}
                                                       maxLength="50" onChange={(e) => setEmail(e.target.value)}/>
                                                {errors.email && (
                                                    <div className="text-danger mt-1">{errors.email}</div>)}
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
                                                <input type="text" value={companyName}
                                                       maxLength="50" onChange={(e) => setCompanyName(e.target.value)}
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
                                                       onChange={handlePassword} maxLength="15"
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
                                                <input type="password" value={confirmPassword} maxLength="15"
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
                                            <button type="button" onClick={onSignUpNext}
                                                    className="btn btn-primary px-5 mb-3">Next
                                            </button>
                                        </div>
                                        <div className="col-lg-6">
                                            <p>Already Have an Account ? <NavLink to={"/login"}>Login
                                                Now</NavLink>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isConfirm && (
                            <div className="card shadow sign-up mb-3 confirmation_mail_card text-center">
                                <div
                                    className="card-body d-flex align-items-center justify-content-center flex-column">
                                    <p className=" mb-3">Please verify your email by entering the activation
                                        code that has been send to your email (<a href={`mailto:${email}`}>{email}</a>).
                                    </p>
                                    <p className=" mb-4">If you haven't received this Email within a few minutes, please
                                        check your spam folder.</p>
                                    <form onSubmit={handleSignUpConfirm}>
                                        <div className="mb-3">
                                            <label className="form-label mb-3 text-center d-block">Please Enter the
                                                email verification Code</label>
                                            <input type="text" className="form-control w-75 mx-auto" value={code}
                                                   onChange={(e) => setCode(e.target.value)}/>
                                            {errors.code && <div className="text-danger mt-1">{errors.code}</div>}
                                        </div>
                                        <button type="submit" className="btn btn-primary w-75 ">Confirm Email</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isBuyNow === 3 && (
                <div className="body_part background_grey_400 d-flex align-items-center justify-content-center"
                     style={{minHeight: 'calc(100vh - 427px)'}}>
                    <div className="login-wrapper">
                        <h2 className="d-flex align-items-center justify-content-center text-dark mb-3">Payment</h2>
                        <div className="process_graph mb-4 px-3">
                            <ul>
                                <li className="active"><span>1</span>Details</li>
                                <li className="dashed_border w-75"/>
                                <li className="active"><span>2</span>Payment</li>
                            </ul>
                        </div>
                        <div className="row sing-up-payment mx-0 justify-content-between d-flex mb-4">
                            <div className="col-lg-6 col-xl-7 mb-4 mb-lg-0">
                                <div className="card shadow payment-method" style={{height: '100%'}}>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="mb-4">
                                                    <label className="form-label mb-3">Name on Card</label>
                                                    <input type="text" value={cardHolderName}
                                                           onChange={(e) => setCardHolderName(e.target.value)}
                                                           className="form-control"/>
                                                    {cardErrors.card_holder_name && (
                                                        <div className="text-danger">{cardErrors.card_holder_name}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="mb-4">
                                                    <label className="form-label mb-3">Card Number</label>
                                                    <input type="text" value={Utils.ccFormat(cardNumber)}
                                                           onChange={(e) => setCardNumber(e.target.value)}
                                                           className="form-control"/>
                                                    {cardErrors.card_number && (
                                                        <div className="text-danger">{cardErrors.card_number}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <div className="mb-3">
                                                    <label className="form-label">Expiry Date</label>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <select className="form-select w-auto me-3" value={cardExpiryMonth}
                                                            onChange={(e) => setCardExpiryMonth(e.target.value)}>
                                                        <option value="">Month</option>
                                                        {MONTH_LIST.map((item, index) =>
                                                            <option key={index} value={item.id}>{item.value}</option>
                                                        )}
                                                    </select>
                                                    <select className="form-select w-auto" value={cardExpiryYear}
                                                            onChange={(e) => setCardExpiryYear(e.target.value)}>
                                                        <option value="">Year</option>
                                                        {yearList.map((item, index) =>
                                                            <option key={index} value={item}>{item}</option>
                                                        )}
                                                    </select>
                                                </div>
                                                {cardErrors.card_expiry_date && (
                                                    <div className="text-danger">{cardErrors.card_expiry_date}</div>
                                                )}
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-4">
                                                    <label className="form-label mb-3">CVV
                                                        <i className="fa fa-question-circle ms-2 fontSize"
                                                           aria-hidden="true" data-toggle="tooltip"
                                                           data-placement="right" title=""
                                                           data-bs-original-title="How Can i help you?"
                                                           aria-label="How Can i help you?"/>
                                                    </label>
                                                    <input type="number" value={cardCvv}
                                                           onChange={(e) => setCardCvv(e.target.value)}
                                                           className="form-control"/>
                                                    {cardErrors.card_cvv && (
                                                        <div className="text-danger">{cardErrors.card_cvv}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-lg-12 ">
                                                <div className="mb-4 d-flex justify-content-between">
                                                    <button type="button" onClick={handleBackButton}
                                                            className="btn  w-sm-25 mb-3 me-1 me-sm-0 text-white py-2 px-3"
                                                            style={{
                                                                background: '#949494',
                                                                maxWidth: '146px',
                                                                width: '100%'
                                                            }}>Back
                                                    </button>
                                                    <button type="button" onClick={handlePlanPurchase}
                                                            className="btn btn-primary w-sm-25 mb-3 py-2 px-3"
                                                            style={{maxWidth: '146px', width: '100%'}}>Pay Now
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="mb-4 text-end">
                                                    Your transaction is secured with SSL encryption
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-xl-5">
                                <div className="card shadow payment-detail" style={{height: '100%'}}>
                                    <div className="card-body">
                                        <div className="row">
                                            <div
                                                className="col-xl-8 col-lg-7 col-sm-8 d-flex justify-content-start align-items-center order-sm-1 order-2">
                                                {planTypeId === 1 && monthDiscount > 0 &&
                                                <p className="p-detail-discount">{monthDiscount}% Discount on
                                                    Monthly</p>
                                                }

                                                {planTypeId === 2 && yearDiscount > 0 &&
                                                <p className="p-detail-discount">{yearDiscount}% Discount on Yearly</p>
                                                }
                                            </div>
                                            <div
                                                className="col-xl-4 col-lg-5 col-sm-4 d-flex align-items-center justify-content-end order-sm-2 order-1 mb-3 mb-sm-0">
                                                <div className="p-1 switch-box border-secondary"
                                                     style={{borderRadius: '25px'}}>
                                                    <div className="btn-group btn-toggle">
                                                        {buttons.map((item, index) =>
                                                            <button key={index} onClick={(e) => handlePackage(e, item)}
                                                                    className={`btn switch-button ${item.active ? `btn-dark active` : `btn-default`}`}
                                                                    style={{borderRadius: '25px'}}>{item.name}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-100 p-detail-box mb-4 mt-3 ">
                                            <p>{planData.plan_name} Package -
                                                Billed {planTypeId === 1 ? `Monthly` : `Yearly`}</p>
                                            <p>{currentCurrency} {planData.plan_amount}</p>
                                            <p>Package Included per {planTypeId === 1 ? `month` : `year`}</p>
                                            <p>{planData.envelope} Envelope Credit</p>
                                            {planData.sms > 0 && (<p>{planData.sms} SMS Credit</p>)}
                                            <p>{planData.user} user</p>
                                        </div>
                                        <div className="row bill-price-table border-bottom gx-0 px-2">
                                            <div className="col">
                                                <p className="text-dark">{planTypeId === 1 ? `Monthly Amount` : `Yearly Amount`}</p>
                                            </div>
                                            <div className="col">
                                                <p className="text-dark text-end">{currentCurrency} {planData.amount}</p>
                                            </div>
                                        </div>
                                        {tax > 0 && (
                                            <div className="row bill-price-table border-bottom gx-0 px-2">
                                                <div className="col">
                                                    <p className="text-dark">Tax</p>
                                                </div>
                                                <div className="col">
                                                    <p className="text-dark text-end">{currentCurrency} {tax}%</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="row bill-price-table border-bottom gx-0 px-2">
                                            <div className="col">
                                                <p className="text-dark">Order Total</p>
                                            </div>
                                            <div className="col">
                                                <p className="text-dark text-end">{currentCurrency} {planData.total_amount_show}</p>
                                            </div>
                                        </div>
                                        {planData.save_amount > 0 &&
                                        <div className="saving-amount-box my-3" style={{borderRadius: '8px'}}>
                                            <span
                                                className="mb-1">Your total savings {currentCurrency} {planData.save_amount}</span>
                                        </div>
                                        }
                                        <div className="row">
                                            <div className="col-lg-8">
                                                <div className="mb-3">
                                                    <input type="text" maxLength={20} className="form-control px-4"
                                                           value={promoCode} placeholder="Enter Promo Code"
                                                           onChange={(e) => setPromoCode(e.target.value)}/>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="mb-3">
                                                    <button type="button" onClick={handlePromoCode}
                                                            className="btn me-3 apply_btn">Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isBuyNow === 4 && (
                <div className="body_part background_grey_400 d-flex align-items-center justify-content-center"
                     style={{minHeight: 'calc(100vh - 374px)'}}>
                    <div className="login-wrapper">
                        <h2 className="d-flex align-items-center justify-content-center text-dark mb-3">Sign Up</h2>
                        <div className="process_graph mb-4">
                            <ul>
                                <li className="active"><span>1</span>Details</li>
                                <li className="dashed_border w-50"/>
                                <li className="active"><span>2</span>Payment</li>
                            </ul>
                        </div>
                        <div className="card shadow sign-up mb-3 sucessful_mail_card" style={{minHeight: '362px'}}>
                            <div className="card-body d-flex align-items-center justify-content-center flex-column">
                                <label className="form-label mb-4 text-center d-block">{successMsg}</label>
                                <button type="button" onClick={onDashboard} className="btn btn-primary w-50 mb-3">Go to
                                    Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Pricing;