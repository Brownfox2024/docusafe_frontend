import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {
    getBillingPlanList,
    postChangePlan,
    postPurchaseBillingPlan,
    postSmsBuy,
    purchasePlanPromoCode
} from "../../../services/BilingService";
import Utils from "../../../utils";
import {toast} from "react-toastify";
import {MONTH_LIST} from "../../../configs/AppConfig";

let yearList = Utils.cardYearList();

function PricingPlan() {

    const navigate = useNavigate();

    const [isCall, setIsCall] = useState(true);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(1);
    const [planTypeId, setPlanTypeId] = useState(1);
    const [planType, setPlanType] = useState('Month');
    const [currency, setCurrency] = useState([]);
    const [currentCurrency, setCurrentCurrency] = useState('AUD');
    const [tax, setTax] = useState(0);
    const [monthDiscount, setMonthDiscount] = useState(0);
    const [yearDiscount, setYearDiscount] = useState(0);
    const [selectPlanId, setSelectPlanId] = useState(1);

    const [proAmount, setProAmount] = useState(0);
    const [proEnvelopeSelect, setProEnvelopeSelect] = useState(1);
    const [proEnvelopeList, setProEnvelopeList] = useState([]);
    const [proPlanList, setProPlanList] = useState([]);
    const [proButton, setProButton] = useState('Buy Now');
    const [proPlanStorage, setProPlanStorage] = useState(0);

    const [teamAmount, setTeamAmount] = useState(0);
    const [teamEnvelopeSelect, setTeamEnvelopeSelect] = useState(1);
    const [teamEnvelopeList, setTeamEnvelopeList] = useState([]);
    const [teamPlanList, setTeamPlanList] = useState([]);
    const [teamButton, setTeamButton] = useState('Buy Now');
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
        total_amount: 0
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

    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiryMonth, setCardExpiryMonth] = useState('');
    const [cardExpiryYear, setCardExpiryYear] = useState('');
    const [cardCvv, setCardCvv] = useState('');

    let errorsObj = {
        card_holder_name: '',
        card_number: '',
        card_expiry_date: '',
        card_cvv: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const [smsSelected, setSmsSelected] = useState('');
    const [smsList, setSmsList] = useState([]);
    const [smsPlan, setSmsPlan] = useState({
        amount: 0,
        sms: 0
    });

    const [changePlan, setChangePlan] = useState({
        cur_envelope: 0,
        new_envelope: 0,
        next_date: ''
    });

    const [isPendingPlan, setIsPendingPlan] = useState(false);
    const [currentPlan, setCurrentPlan] = useState({});
    const [deductAmount, setDeductAmount] = useState(0);
    const [promoCode, setPromoCode] = useState('');

    const confirmChangePlanRef = useRef(null);
    const closeConfirmChangePlanRef = useRef(null);

    useEffect(function () {

        if (isCall === true) {
            setLoading(true);

            getBillingPlanList({})
                .then(response => {
                    setCurrency(response.data.currency);
                    setFreePlan(response.data.free_plan);
                    setDeductAmount(response.data.deduct_amount);

                    if (response.data.current_plan_data.plan_type_id) {
                        let buttonsList = [...buttons];
                        for (let i = 0; i < buttonsList.length; i++) {
                            let active = false;
                            if (parseInt(response.data.current_plan_data.plan_type_id) === parseInt(buttonsList[i]['id'])) {
                                active = true;
                            }
                            buttonsList[i]['active'] = active;
                        }
                        setButtons(buttonsList);
                    }

                    setProAmount(response.data.pro_plan[0]['price'][0]['amount']);
                    let proEnvelopeLists = response.data.pro_plan[0]['price'][0]['envelope'];
                    if (response.data.current_plan_data.plan_type_id) {
                        if (parseInt(response.data.current_plan_data.plan_type_id) === 2) {
                            proEnvelopeLists = response.data.pro_plan[1]['price'][0]['envelope'];
                        }
                        setPlanTypeId(parseInt(response.data.current_plan_data.plan_type_id));
                    }
                    setProEnvelopeList(proEnvelopeLists);
                    setProPlanList(response.data.pro_plan);

                    let tAmount = response.data.team_plan[0]['price'][0]['amount'];
                    setTeamAmount(tAmount);
                    let teamEnvelopeLists = response.data.team_plan[0]['price'][0]['envelope'];
                    if (response.data.current_plan_data.plan_type_id) {
                        if (parseInt(response.data.current_plan_data.plan_type_id) === 2) {
                            teamEnvelopeLists = response.data.team_plan[1]['price'][0]['envelope'];
                        }
                    }
                    setTeamEnvelopeList(teamEnvelopeLists);
                    setTeamPlanList(response.data.team_plan);

                    setTax(response.data.tax);
                    setMonthDiscount(response.data.month_discount);
                    setYearDiscount(response.data.year_discount);

                    setPlanFeatures(response.data.plan_features_list);

                    setIsPendingPlan(response.data.is_pending_plan);
                    if (response.data.current_plan_data) {
                        setCurrentPlan(response.data.current_plan_data);

                        if (response.data.current_plan_data.plan_id === 1) {
                            for (let i = 0; i < proEnvelopeLists.length; i++) {
                                if (proEnvelopeLists[i]['total'] === parseInt(response.data.current_plan_data.total_envelope) && proEnvelopeLists[i]['sms'] === parseInt(response.data.current_plan_data.total_sms)) {
                                    setProEnvelopeSelect(parseInt(proEnvelopeLists[i]['id']));
                                    setProAmount(proEnvelopeLists[i]['amount']);
                                    setProPlanStorage(proEnvelopeLists[i]['storage']);
                                }
                            }
                        } else {
                            setProPlanStorage(proEnvelopeLists[0]['storage']);
                            setProAmount(proEnvelopeLists[0]['amount']);
                        }

                        if (response.data.current_plan_data.plan_id === 2) {
                            for (let i = 0; i < teamEnvelopeLists.length; i++) {
                                if (teamEnvelopeLists[i]['total'] === parseInt(response.data.current_plan_data.total_envelope) && teamEnvelopeLists[i]['sms'] === parseInt(response.data.current_plan_data.total_sms)) {
                                    setTeamEnvelopeSelect(parseInt(teamEnvelopeLists[i]['id']));
                                    tAmount = teamEnvelopeLists[i]['amount'];
                                    setTeamPlanStorage(teamEnvelopeLists[i]['storage']);
                                }
                            }
                        } else {
                            setTeamPlanStorage(teamEnvelopeLists[0]['storage']);
                            setTeamAmount(teamEnvelopeLists[0]['amount']);
                        }

                        let planTotalUser = response.data.current_plan_data.total_user;
                        if (response.data.current_plan_data.plan_id === 2) {
                            if (parseInt(planTotalUser) > 1) {
                                let userAmount = (planTotalUser - 1) * 5;
                                if (response.data.current_plan_data.plan_type_id) {
                                    if (parseInt(response.data.current_plan_data.plan_type_id) === 2) {
                                        userAmount = (planTotalUser - 1) * 60;
                                    }
                                }
                                let teamAmount = parseInt(tAmount) + parseInt(userAmount);
                                setTeamAmount(teamAmount);
                                setUser(planTotalUser);
                            } else {
                                setTeamAmount(parseInt(tAmount));
                            }
                        }

                        if (response.data.current_plan_data.plan_id === 1 && response.data.current_plan_data.plan_type_id === 1) {
                            setProButton('Update Plan');
                            setTeamButton('Update Plan');
                        }
                        if (response.data.current_plan_data.plan_id === 2 && response.data.current_plan_data.plan_type_id === 1) {
                            setProButton('Update Plan');
                            setTeamButton('Update Plan');
                        }
                    }

                    setSmsList(response.data.sms_list);
                    setLoading(false);
                    setIsCall(false);
                })
                .catch(err => {
                    setLoading(false);
                    setIsCall(false);
                });
        }
    }, [isCall, buttons]);

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

        changeButtonText(data.id, currentCurrency);

        calculatePlan(buyType, data.id);
    };

    const changeButtonText = (planTypeId, currency) => {

        let data = {...currentPlan};

        if (Object.keys(data).length > 0) {
            if (data.plan_id === 1) {
                if (parseInt(data.plan_type_id) === parseInt(planTypeId) && data.currency === currency) {
                    setProButton('Update Plan');
                    setTeamButton('Update Plan');
                } else {
                    setProButton('Update Plan');
                    setTeamButton('Update Plan');
                }
            } else if (data.plan_id === 2) {
                if (parseInt(data.plan_type_id) === parseInt(planTypeId) && data.currency === currency) {
                    setProButton('Update Plan');
                    setTeamButton('Update Plan');
                } else {
                    setProButton('Update Plan');
                    setTeamButton('Update Plan');
                }
            }
        }
    };

    const handleCurrency = (e) => {
        let value = e.target.value;
        setCurrentCurrency(value);

        changeButtonText(planTypeId, value);

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
        

        if (isPendingPlan === true && type !== 0) {
            toast.warning('Your one plan already pending.');
            return;
        }

        setSelectPlanId(type);
        let isHigherPlan = true;
        let userPlanData = {...currentPlan};
        if (userPlanData.is_plan_purchase === true && parseInt(userPlanData.plan_id) > 0) {
            if (parseInt(userPlanData.plan_id) > parseInt(type)) {
                isHigherPlan = false;
            } else if (parseInt(userPlanData.plan_id) >= parseInt(type) && parseInt(userPlanData.plan_type_id) > parseInt(planTypeId)) {
                isHigherPlan = false;
            } else {
                if (parseInt(userPlanData.plan_id) === parseInt(type) && parseInt(userPlanData.plan_type_id) === parseInt(planTypeId)) {
                    if (parseInt(type) === 1) {
                        let selectList = [...proEnvelopeList];
                        let index = selectList.findIndex(x => parseInt(x.total) === parseInt(userPlanData.total_envelope) && parseInt(x.sms) === parseInt(userPlanData.total_sms));
                        if (index > -1) {
                            if (parseInt(proEnvelopeSelect) < parseInt(selectList[index]['id'])) {
                                isHigherPlan = false;
                            }
                        }
                    } else {
                        let selectList = [...teamEnvelopeList];
                        let index = selectList.findIndex(x => parseInt(x.total) === parseInt(userPlanData.total_envelope) && parseInt(x.sms) === parseInt(userPlanData.total_sms));
                        if (index > -1) {
                            if (parseInt(teamEnvelopeSelect) < parseInt(selectList[index]['id'])) {
                                isHigherPlan = false;
                            }
                        }
                    }
                } else if (parseInt(userPlanData.plan_id) === 1 && parseInt(userPlanData.plan_type_id) === 2 && parseInt(type) === 2 && parseInt(planTypeId) === 1) {
                    isHigherPlan = false;
                }
            }
        }

        if (isHigherPlan) {
            setBuyType(type);
            calculatePlan(type, planTypeId);

            setIsBuyNow(2);
        } else {
            let newEnvelope = 0;
            if (parseInt(type) === 1) {
                let index = proEnvelopeList.findIndex(x => parseInt(x.id) === parseInt(proEnvelopeSelect));
                if (index > -1) {
                    newEnvelope = proEnvelopeList[index]['total'];
                }
            } else if(parseInt(type) === 2) {
                let index = teamEnvelopeList.findIndex(x => parseInt(x.id) === parseInt(teamEnvelopeSelect));
                if (index > -1) {
                    newEnvelope = teamEnvelopeList[index]['total'];
                }
            }else {
                // Free Plan
                newEnvelope = freePlan.envelope;
            }


            if (newEnvelope > 0) {
                setChangePlan({
                    cur_envelope: userPlanData.total_envelope,
                    new_envelope: newEnvelope,
                    next_date: userPlanData.expired_at_format
                });
                confirmChangePlanRef?.current.click();
            } else {
                toast.error('Oops...Something went wrong.');
            }
        }
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
        if (!taxAmount) {
            taxAmount = 0;
        }
        let totalAmount = Math.round(amount + taxAmount);

        let isNew = false;
        let dedAmount = 0;
        if (Object.keys(currentPlan).length > 0) {

            if (currentPlan.currency !== currentCurrency) {
                isNew = true;
            } else if (parseInt(currentPlan.plan_type_id) === 2 && planId === 1) {
                isNew = true;
            } else {
                if (currentPlan.plan_id === 2 && type === 1) {
                    isNew = true;
                } else {
                    dedAmount = amount - deductAmount;
                    if (dedAmount >= 1) {
                        dedAmount = deductAmount;
                        totalAmount = amount - deductAmount;
                    } else {
                        dedAmount = 0;
                        isNew = true;
                    }
                }
            }
        }

        let obj = {
            plan_id: type,
            plan_name: planName,
            plan_amount: planAmount,
            amount: amount,
            envelope: envelope,
            sms: sms,
            is_new: isNew,
            user: totalUser,
            save_amount: discountAmount,
            deduct_amount: dedAmount,
            total_amount: totalAmount,
            storage: storage
        };
        setPlanData(obj);
    };

    const handleBackButton = (e) => {
        e.preventDefault();

        let errorObj = {...errorsObj};
        setErrors(errorObj);

        setCardHolderName('');
        setCardNumber('');
        setCardExpiryMonth('');
        setCardExpiryYear('');
        setCardCvv('');

        setIsBuyNow(1);
    };

    const handlePayNow = (e) => {
        e.preventDefault();
        let error = false;
        let errorObj = {...errorsObj};

        if (!cardHolderName) {
            errorObj.card_holder_name = 'Please enter name';
            error = true;
        }
        if (!cardNumber) {
            errorObj.card_number = 'Please enter card number';
            error = true;
        }
        if (!cardExpiryMonth) {
            errorObj.card_expiry_date = 'Please select month';
            error = true;
        } else if (!cardExpiryYear) {
            errorObj.card_expiry_date = 'Please select year';
            error = true;
        }
        if (!cardCvv) {
            errorObj.card_cvv = 'Please enter card cvv';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        setLoading(true);

        planData.plan_type_id = planTypeId;
        planData.currency = currentCurrency;

        let obj = {
            card_holder_name: cardHolderName,
            card_number: cardNumber,
            card_expiry_month: cardExpiryMonth,
            card_expiry_year: cardExpiryYear,
            card_cvv: cardCvv,
            plan_data: planData
        };

        postPurchaseBillingPlan(obj)
            .then(response => {
                setLoading(false);
                toast.success(response.data.message);
                navigate('/billing');
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleSmsBuy = (e) => {
        e.preventDefault();

        if (smsSelected) {
            let index = smsList.findIndex(x => parseInt(x.id) === parseInt(smsSelected));
            if (index > -1) {

                setSmsPlan({
                    amount: smsList[index]['amount'],
                    sms: smsList[index]['total'],
                });

                setIsBuyNow(3);
            } else {
                toast.error('Oops...something went wrong. Please try again.');
            }
        } else {
            toast.error('Please select option');
        }
    };

    const handleSmsBuyNow = (e) => {
        e.preventDefault();

        let error = false;
        let errorObj = {...errorsObj};

        if (!cardHolderName) {
            errorObj.card_holder_name = 'Please enter name';
            error = true;
        }
        if (!cardNumber) {
            errorObj.card_number = 'Please enter card number';
            error = true;
        }
        if (!cardExpiryMonth) {
            errorObj.card_expiry_date = 'Please select month';
            error = true;
        } else if (!cardExpiryYear) {
            errorObj.card_expiry_date = 'Please select year';
            error = true;
        }
        if (!cardCvv) {
            errorObj.card_cvv = 'Please enter card cvv';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        let index = smsList.findIndex(x => parseInt(x.id) === parseInt(smsSelected));
        if (index > -1) {

            setLoading(true);

            let obj = {
                card_holder_name: cardHolderName,
                card_number: cardNumber,
                card_expiry_month: cardExpiryMonth,
                card_expiry_year: cardExpiryYear,
                card_cvv: cardCvv,
                amount: smsList[index]['amount'],
                sms: smsList[index]['total'],
            };

            postSmsBuy(obj)
                .then(response => {
                    setLoading(false);
                    toast.success(response.data.message);
                    navigate('/billing');
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        } else {
            toast.error('Oops...something went wrong. Please try again.');
        }
    };

    const handleChangePlan = (e) => {
        e.preventDefault();

        setLoading(true);

        let envelope = 0;
        let sms = 0;
        let totalUser = 1;
        let amount = 0;
        let storage = 0;
        if (parseInt(selectPlanId) === 1) {
            let index = proEnvelopeList.findIndex(x => parseInt(x.id) === parseInt(proEnvelopeSelect));
            if (index > -1) {
                envelope = proEnvelopeList[index]['total'];
                sms = proEnvelopeList[index]['sms'];
                storage = proEnvelopeList[index]['storage'];
            }
            amount = proAmount;
        } else if (parseInt(selectPlanId) === 2){
            let index = teamEnvelopeList.findIndex(x => parseInt(x.id) === parseInt(teamEnvelopeSelect));
            if (index > -1) {
                envelope = teamEnvelopeList[index]['total'];
                sms = teamEnvelopeList[index]['sms'];
                storage = teamEnvelopeList[index]['storage'];
            }
            totalUser = user;
            amount = teamAmount;
        }else {
            envelope = freePlan.envelope;
            sms = freePlan.sms;
            storage = freePlan.storage;
        }

        let obj = {
            plan_id: selectPlanId,
            plan_type_id: planTypeId,
            total_envelope: envelope,
            total_sms: sms,
            total_user: totalUser,
            storage: storage,
            amount: amount,
            currency: currentCurrency,
            date: currentPlan.expired_at
        };
        
        postChangePlan(obj)
            .then(response => {
                setLoading(false);
                closeConfirmChangePlanRef?.current.click();
                toast.success(response.data.message);
                navigate('/billing');
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handlePromoCode = (e) => {
        e.preventDefault();
        let error = false;

        if (!promoCode.trim()) {
            toast.error('Promo code is required');
            error = true;
        }

        let envelope = 0;
        let sms = 0;
        let totalUser = 1;
        let amount = 0;
        let storage = 0;
        if (parseInt(selectPlanId) === 1) {
            let index = proEnvelopeList.findIndex(x => parseInt(x.id) === parseInt(proEnvelopeSelect));
            if (index > -1) {
                envelope = proEnvelopeList[index]['total'];
                sms = proEnvelopeList[index]['sms'];
                storage = proEnvelopeList[index]['storage'];
            }
            amount = proAmount;
        } else {
            let index = teamEnvelopeList.findIndex(x => parseInt(x.id) === parseInt(teamEnvelopeSelect));
            if (index > -1) {
                envelope = teamEnvelopeList[index]['total'];
                sms = teamEnvelopeList[index]['sms'];
                storage = teamEnvelopeList[index]['storage'];
            }
            totalUser = user;
            amount = teamAmount;
        }

        if (sms > 0) {
            toast.error('Invalid promo code for selected plan');
            error = true;
        }

        if (error) return;

        setLoading(true);

        let obj = {
            promo_code: promoCode,
            plan_id: selectPlanId,
            plan_type_id: planTypeId,
            total_envelope: envelope,
            total_sms: sms,
            total_user: totalUser,
            storage: storage,
            amount: amount,
            currency: currentCurrency,
            date: currentPlan.expired_at
        };
        purchasePlanPromoCode(obj)
            .then(response => {
                setLoading(false);
                toast.success(response.data.message);
                navigate('/billing');
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

            {isBuyNow === 1 &&
            <div className="tab-pane bg_transparent active show" id="integration" role="tabpanel"
                 aria-labelledby="integration-tab" style={{minHeight: 'calc(100vh - 149px)'}}>
                <div className="d-flex justify-content-between my-4 flexWrap justify_center">
                    <div className="d-flex justify-content-between">
                        <h2 className="main_title ps-0">Pricing Plan</h2>
                    </div>
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
                        <select className="form-select w-auto currency background_grey_400" value={currentCurrency}
                                onChange={handleCurrency}
                                aria-label="Default select example" data-toggle="tooltip" data-placement="right"
                                title="" data-bs-original-title="click Me">
                            {currency && currency.map((item, index) =>
                                <option key={index} value={item}>{item}</option>
                            )}
                        </select>
                    </div>
                </div>

                <div className="table-responsive mt-3 mb-5 price-table">
                    <table className="table mb-0 table-striped shadow-sm price-plan-table"
                           style={{borderRadius: '25px'}}>
                        <thead>
                        <tr className="">
                            <th className="p-3" style={{minWidth: '200px'}}>
                                <div className="d-flex flexWrap">
                                    <div className="switch-content ms-2">Pay Annually and Save upto 17% of the plan
                                        price.
                                    </div>
                                </div>
                            </th>
                            <th style={{minWidth: '380px'}} className="text-center position-relative">
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
                                {currentPlan.plan_id !== 0 && (
                                <button type="button" onClick={(e) => handleBoyNow(e, 0)}
                                        className="btn btn-primary updateplan-button align-items-center justify-content-center"
                                        data-toggle="tooltip" data-placement="right" title=""
                                        data-bs-original-title="click Me">Update Plan
                                </button>
                                )}

                                {currentPlan.plan_id === 0 && (
                                    <div className="pricing_plan ribbon"><span>Current Plan</span></div>
                                )}
                            </th>
                            <th ref={(el) => el && el.style.setProperty('min-width', '320px', "important")}
                                className="text-center position-relative">
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
                                        data-bs-original-title="click Me">{proButton}
                                </button>
                                {currentPlan.plan_id === 1 && (
                                    <div className="pricing_plan ribbon"><span>Current Plan</span></div>
                                )}
                            </th>
                            <th style={{minWidth: '340px'}} className="text-center position-relative">
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
                                        data-bs-original-title="click Me">{teamButton}
                                </button>
                                {currentPlan.plan_id === 2 && (
                                    <div className="pricing_plan ribbon"><span>Current Plan</span></div>
                                )}
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
                                        data-toggle="tooltip" data-placement="right" title="" value={proEnvelopeSelect}
                                        data-bs-original-title="click Me" onChange={handleChangeProEnvelope}>
                                    {proEnvelopeList.map((item, index) =>
                                        <option key={index} value={item.id}>{item.text}</option>
                                    )}
                                </select>
                            </td>
                            <td className="text-center">
                                <select className="form-select price-select" aria-label="Default select example"
                                        data-toggle="tooltip" data-placement="right" title="" value={teamEnvelopeSelect}
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

                <div className="overview_Card card mb-40px">
                    <div className="card-title border-bottom p-3 bill-section-heading">
                        Additional SMS Credits (No Expiry)
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <select className="form-select price-select" value={smsSelected}
                                            onChange={(e) => setSmsSelected(e.target.value)}>
                                        <option value="">Select Additional SMS</option>
                                        {smsList.map((item, index) =>
                                            <option key={index} value={item.id}>{item.text}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <button type="button" onClick={handleSmsBuy}
                                        className="btn btn-primary updateplan-button">Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }

            {isBuyNow === 2 &&
            <div className="login-wrapper mt-5">
                <div className=" row sing-up-payment mx-0 justify-content-between d-flex mb-4">
                    <div className=" col-lg-6 col-xl-7 mb-4 mb-lg-0">
                        <div className="card shadow payment-method" style={{height: '100%'}}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="mb-4">
                                            <label className="form-label mb-3">Name on Card</label>
                                            <input type="text" value={cardHolderName}
                                                   onChange={(e) => setCardHolderName(e.target.value)}
                                                   className="form-control"/>
                                            {errors.card_holder_name && (
                                                <div className="text-danger">{errors.card_holder_name}</div>)}
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-4">
                                            <label className="form-label mb-3">Card Number</label>
                                            <input type="text" value={Utils.ccFormat(cardNumber)}
                                                   onChange={(e) => setCardNumber(e.target.value)}
                                                   className="form-control"/>
                                            {errors.card_number && (
                                                <div className="text-danger">{errors.card_number}</div>)}
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
                                        {errors.card_expiry_date && (
                                            <div className="text-danger">{errors.card_expiry_date}</div>)}
                                    </div>
                                    <div className="col-lg-6 ">
                                        <div className="mb-4">
                                            <label className="form-label mb-3">CVV
                                                <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                                                   data-toggle="tooltip" data-placement="right" title=""
                                                   data-bs-original-title="How Can i help you?"
                                                   aria-label="How Can i help you?"/>
                                            </label>
                                            <input type="number" value={cardCvv}
                                                   onChange={(e) => setCardCvv(e.target.value)}
                                                   className="form-control"/>
                                            {errors.card_cvv && (<div className="text-danger">{errors.card_cvv}</div>)}
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
                                            <button type="button" onClick={handlePayNow}
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
                                        <p className="p-detail-discount">{monthDiscount}% Discount on Monthly</p>
                                        }

                                        {planTypeId === 2 && yearDiscount > 0 &&
                                        <p className="p-detail-discount">{yearDiscount}% Discount on Yearly</p>
                                        }
                                    </div>
                                    <div
                                        className="col-xl-4 col-lg-5 col-sm-4 d-flex align-items-center justify-content-end order-sm-2 order-1 mb-3 mb-sm-0">
                                        <div className="p-1 switch-box border-secondary" style={{borderRadius: '25px'}}>
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
                                <div className="w-100 p-detail-box mb-4 mt-3">
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
                                {planData.deduct_amount > 0 && (
                                    <div className="row bill-price-table border-bottom gx-0 px-2">
                                        <div className="col">
                                            <p className="text-dark">Deduction from current plan</p>
                                        </div>
                                        <div className="col">
                                            <p className="text-dark text-end">{currentCurrency} {planData.deduct_amount}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="row bill-price-table border-bottom gx-0 px-2">
                                    <div className="col">
                                        <p className="text-primary">Order Total</p>
                                    </div>
                                    <div className="col">
                                        <p className="text-primary text-end">{currentCurrency} {planData.total_amount}</p>
                                    </div>
                                </div>
                                {planData.save_amount > 0 &&
                                <div className="saving-amount-box my-3" style={{borderRadius: '8px'}}>
                                    <span
                                        className="mb-1">Your total savings {currentCurrency} {planData.save_amount}</span>
                                </div>
                                }
                                {currentPlan && currentPlan.is_promo_used === false && (
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <div className="mb-3">
                                                <input type="type" className="form-control px-4"
                                                       value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                                                       placeholder="Enter Promo Code"/>
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
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }

            {isBuyNow === 3 &&
            <div className="login-wrapper mt-5">
                <div className=" row sing-up-payment mx-0 justify-content-between d-flex mb-4">
                    <div className=" col-lg-6 col-xl-7 mb-4 mb-lg-0">
                        <div className="card shadow payment-method" style={{height: '100%'}}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="mb-4">
                                            <label className="form-label mb-3">Name on Card</label>
                                            <input type="text" value={cardHolderName}
                                                   onChange={(e) => setCardHolderName(e.target.value)}
                                                   className="form-control"/>
                                            {errors.card_holder_name && (
                                                <div className="text-danger">{errors.card_holder_name}</div>)}
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-4">
                                            <label className="form-label mb-3">Card Number</label>
                                            <input type="text" value={Utils.ccFormat(cardNumber)}
                                                   onChange={(e) => setCardNumber(e.target.value)}
                                                   className="form-control"/>
                                            {errors.card_number && (
                                                <div className="text-danger">{errors.card_number}</div>)}
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
                                        {errors.card_expiry_date && (
                                            <div className="text-danger">{errors.card_expiry_date}</div>)}
                                    </div>
                                    <div className="col-lg-6 ">
                                        <div className="mb-4">
                                            <label className="form-label mb-3">CVV
                                                <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                                                   data-toggle="tooltip" data-placement="right" title=""
                                                   data-bs-original-title="How Can i help you?"
                                                   aria-label="How Can i help you?"/>
                                            </label>
                                            <input type="number" value={cardCvv}
                                                   onChange={(e) => setCardCvv(e.target.value)}
                                                   className="form-control"/>
                                            {errors.card_cvv && (<div className="text-danger">{errors.card_cvv}</div>)}
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
                                            <button type="button" onClick={handleSmsBuyNow}
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
                                <div className="w-100 p-detail-box mb-4 mt-3">
                                    <p>Additional SMS - No Expiry</p>
                                    <p>AUD {smsPlan.amount}</p>
                                    <p>{smsPlan.sms} SMS Credit</p>
                                </div>
                                <div className="row bill-price-table border-bottom gx-0 px-2">
                                    <div className="col">
                                        <p className="text-dark">Subtotal</p>
                                    </div>
                                    <div className="col">
                                        <p className="text-dark text-end">AUD {smsPlan.amount}</p>
                                    </div>
                                </div>
                                <div className="row bill-price-table gx-0 px-2">
                                    <div className="col">
                                        <p className="text-primary">Order Total</p>
                                    </div>
                                    <div className="col">
                                        <p className="text-primary text-end">AUD {smsPlan.amount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }

            <span ref={confirmChangePlanRef} data-bs-toggle="modal" data-bs-target="#confirmPlanChange"/>
            <div className="modal" id="confirmPlanChange" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header text-center border-0 pb-0">
                            <h5 className="modal-title w-100">Confirm Plan Change</h5>
                        </div>
                        <div className="modal-body">
                            <p>Do you want to Change your plan from {changePlan.cur_envelope} Envelops
                                to {changePlan.new_envelope} envelops next billing cycle ({changePlan.next_date})
                                onwards.</p>
                            <div className="mt-3 w-100">
                                <button type="button" ref={closeConfirmChangePlanRef} className="btn btn-secondary"
                                        data-bs-dismiss="modal">Cancel
                                </button>
                                <button type="button" onClick={handleChangePlan}
                                        className="btn btn-primary float-end">Change Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PricingPlan;