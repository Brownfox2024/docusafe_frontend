import React, {useRef, useState} from "react";
import {useParams} from "react-router-dom";
import Utils from "../../../../utils";
import {toast} from "react-toastify";
import {MONTH_LIST} from "../../../../configs/AppConfig";
import {adminPostUpdateBillingCard} from "../../../../services/AdminService";

let yearList = Utils.cardYearList();

function AdminClientPaymentCardEdit(props) {
    let {client} = useParams();
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
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

    const clsPaymentCardEditRef = useRef(null);

    const handleCardUpdate = (e) => {
        e.preventDefault();
        let errorObj = {...errorsObj};
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
            errorObj.card_expiry_date = 'Please select month';
            error = true;
        } else if (!cardExpiryYear) {
            errorObj.card_expiry_date = 'Please select year';
            error = true;
        }
        if (!cardCvv) {
            errorObj.card_cvv = 'Please enter cvv';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        props.setLoading(true);

        let obj = {
            client_id: client,
            card_holder_name: cardHolderName,
            card_number: cardNumber,
            card_expiry_month: cardExpiryMonth,
            card_expiry_year: cardExpiryYear,
            card_cvv: cardCvv
        };

        adminPostUpdateBillingCard(obj)
            .then(response => {

                let companyData = {...props.companyData};

                companyData.card_type = response.data.data.card_type;
                companyData.card_number = response.data.data.card_number;
                companyData.card_holder_name = response.data.data.card_holder_name;
                companyData.card_expired_date = response.data.data.card_expired_date;

                props.setCompanyData(companyData);
                clsPaymentCardEditRef?.current.click();
                props.setLoading(false);
                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleClsCardInput = (e) => {
        e.preventDefault();

        setCardHolderName('');
        setCardNumber('');
        setCardExpiryMonth('');
        setCardExpiryYear('');
        setCardCvv('');

        let errorObj = {...errorsObj};
        setErrors(errorObj);
    };

    return (
        <div className="modal fade" id="PaymentCardEdit" data-bs-keyboard="false" data-bs-backdrop="static">
            <div className="modal-dialog"
                 ref={(el) => el && el.style.setProperty('max-width', '650px', "important")}
                 style={{borderRadius: '20px'}}>
                <div className="modal-content" style={{borderRadius: '20px'}}>
                    <div className="Payment-Edit-header d-flex p-3 justify-content-between">
                        <h4 className="Cancel-Renew-header">Edit Payment Method</h4>
                        <button type="button" className="btn-close" onClick={handleClsCardInput}
                                ref={clsPaymentCardEditRef} data-bs-dismiss="modal">
                            <i className="fa fa-times-circle Cancel-Renew-header" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="p-3">
                        <div className="mb-4 row">
                            <div className="col-lg-3">
                                <label className="form-label mt-3">Name on Card</label>
                            </div>
                            <div className="col-lg-9">
                                <input type="text" className="form-control card-detail" value={cardHolderName}
                                       onChange={(e) => setCardHolderName(e.target.value)}/>
                                {errors.card_holder_name && (
                                    <div className="text-danger">{errors.card_holder_name}</div>
                                )}
                            </div>
                        </div>
                        <div className="mb-4 row">
                            <div className="col-lg-3">
                                <label className="form-label mt-3">Card Number</label>
                            </div>
                            <div className="col-lg-9">
                                <input type="text" className="form-control card-detail"
                                       value={Utils.ccFormat(cardNumber)}
                                       onChange={(e) => setCardNumber(e.target.value)}/>
                                {errors.card_number && (
                                    <div className="text-danger">{errors.card_number}</div>
                                )}
                            </div>
                        </div>
                        <div className="mb-4 row">
                            <div className="col-lg-3">
                                <label className="form-label mt-3">Expiry Date</label>
                            </div>
                            <div className="col-lg-5">
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
                                    <div className="text-danger">{errors.card_expiry_date}</div>
                                )}
                            </div>
                            <div className="col-lg-1">
                                <label className="form-label mt-3">CVV</label>
                            </div>
                            <div className="col-lg-3">
                                <div className="d-flex align-items-center">
                                    <input type="number" className="form-control card-detail" value={cardCvv}
                                           onChange={(e) => setCardCvv(e.target.value)}/>
                                    <i className="fa fa-question-circle ms-2 fontSize"
                                       aria-hidden="true" data-toggle="tooltip"
                                       data-bs-html="true" data-placement="right"
                                       title='<img src="/images/cvv.png" alt="..." />'/>
                                </div>
                                {errors.card_cvv && (
                                    <div className="text-danger">{errors.card_cvv}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer auto-renew-btn">
                        <button type="button" onClick={handleClsCardInput} className="btn"
                                data-bs-dismiss="modal">Close
                        </button>
                        <button type="button" onClick={handleCardUpdate} className="btn btn-primary">Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminClientPaymentCardEdit;