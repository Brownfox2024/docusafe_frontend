import React, {useEffect, useState, useRef} from "react";
import {NavLink} from "react-router-dom";
import {getBillingPlanOverview, removeCreditCard} from "../../../services/BilingService";
import {toast} from "react-toastify";
import Utils from "../../../utils";
import CancelRenewPlan from "./CancelRenewPlan";
import PaymentCardEdit from "./PaymentCardEdit";
import EnableRenewPlan from "./EnableRenewPlan";

function BillingOverview() {

    const [companyData, setCompanyData] = useState({});
    const [loading, setLoading] = useState(false);

    const removeCreditCardRef = useRef(null);

    useEffect(function () {
        setLoading(true);

        getBillingPlanOverview({})
            .then(response => {
                setCompanyData(response.data.data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });

    }, []);

    const handleDeleteCard = (e) => {
        e.preventDefault();

        setLoading(true);
        removeCreditCard({})
            .then(response => {
                removeCreditCardRef?.current.click();
                toast.success(response.data.message);

                let data = {...companyData};
                data.card_type = '';
                setCompanyData(data);
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

            <div className="tab-pane active show" id="billing-overview" role="tabpanel"
                 aria-labelledby="AccountDetails" style={{minHeight: 'calc(100vh - 149px)'}}>
                <h2 className="main_title ps-0 py-4">Billing Overview</h2>
                <div className="overview_Card card mb-40px">
                    <div className="card-title border-bottom p-3 bill-section-heading">
                        Billing Profile
                    </div>
                    <div className="card-body">
                        <p className="bill-profile-laft">Billing Name:</p>
                        <p className="bill-profile-right">{companyData.full_name}</p>
                        <p className="bill-profile-laft">Company:</p>
                        <p className="bill-profile-right">{companyData.company_name}</p>
                        <p className="bill-profile-laft">Plan Type:</p>
                        <p className="bill-profile-right">{companyData.plan_type}
                            {companyData.new_plan && (
                                <span className="text-primary ms-2">{companyData.new_plan}</span>
                            )}
                            <NavLink to={"/billing/pricing"} className="ms-2 btn grey_btn_outline"
                                     data-toggle="tooltip" data-placement="right" title=""
                                     data-bs-original-title="click Me">Update</NavLink>
                        </p>

                        {companyData.billing_frequency && (
                            <>
                                <p className="bill-profile-laft">Billing Frequency:</p>
                                <p className="bill-profile-right">{companyData.billing_frequency}</p>
                            </>
                        )}

                        {companyData.next_billing_date && (
                            <>
                                <p className="bill-profile-laft">Next Billing Date:</p>
                                <p className="bill-profile-right">{companyData.next_billing_date}</p>
                            </>
                        )}

                        {companyData.billing_status > 0 && (
                            <>
                                <p className="bill-profile-laft">Billing Status:</p>
                                <p className="bill-profile-right">
                                    {parseInt(companyData.billing_status) === 1 ? `Paid` : `Not Paid`}
                                    {parseInt(companyData.billing_status) === 2 && (
                                        <NavLink to={"/billing/pricing"} className="ms-2 btn grey_btn_outline"
                                                 data-toggle="tooltip" data-placement="right" title=""
                                                 data-bs-original-title="click Me">Pay Now</NavLink>
                                    )}
                                </p>
                            </>
                        )}

                        {companyData.auto_renew && (
                            <>
                                <p className="bill-profile-laft">Auto Renew:</p>
                                <p className={`bill-profile-right ${companyData.is_auto_renew === 1 ? `` : ``}`}>{companyData.auto_renew}
                                    {companyData.is_auto_renew === 1 && (
                                        <button type="button" className="ms-2 btn grey_btn_outline"
                                                data-bs-toggle="modal" data-bs-target="#CancelRenewPlan"
                                                data-toggle="tooltip" data-placement="right" title=""
                                                data-bs-original-title="click Me">Change
                                        </button>
                                    )}

                                    {companyData.plan_id > 0 && companyData.is_auto_renew === 0 && (
                                        <button type="button" className="ms-2 btn grey_btn_outline"
                                                data-bs-toggle="modal" data-bs-target="#EnableRenewPlan"
                                                data-toggle="tooltip" data-placement="right" title=""
                                                data-bs-original-title="click Me">Change
                                        </button>
                                    )}
                                </p>

                                {companyData.is_auto_renew === 1 && (
                                    <CancelRenewPlan setLoading={setLoading} companyData={companyData}
                                                     setCompanyData={setCompanyData}/>
                                )}

                                {companyData.plan_id > 0 && companyData.is_auto_renew === 0 && (
                                    <EnableRenewPlan setLoading={setLoading} companyData={companyData}
                                                     setCompanyData={setCompanyData}/>
                                )}
                            </>
                        )}

                        {companyData.next_renew_amount && (
                            <>
                                <p className="bill-profile-laft">Next Renew Amount:</p>
                                <p className="bill-profile-right">{companyData.next_renew_amount}</p>
                            </>
                        )}

                        <p className="bill-profile-laft">Add on SMS Purchased :</p>
                        <p className="bill-profile-right">{companyData.sms_purchased}</p>

                        <p className="bill-profile-laft mt-3">Storage Used :</p>
                        <div className="bill-profile-laft p-0">
                            <p className="bill-profile-right text-end p-0 ">{companyData.used_storage}</p>
                            <div className="progress">
                                <div className="progress-bar" role="progressbar"
                                     style={{width: companyData.used_percentage + `%`}}
                                     aria-valuenow={companyData.used_percentage + `%`} aria-valuemin="0"
                                     aria-valuemax="100"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overview_Card card mb-40px">
                    <div className="card-title border-bottom p-3 bill-section-heading">
                        Billing History
                    </div>
                    <div className="card-body">
                        <p className="history-link">To view your invoices go
                            to <NavLink to={"/billing/history"} data-toggle="tooltip" data-placement="right" title=""
                                        data-bs-original-title="click Me">Billing History</NavLink> Page
                        </p>
                    </div>
                </div>

                <div className="overview_Card card mb-40px">
                    <div className="card-title border-bottom p-3 bill-section-heading">
                        Credit History
                    </div>
                    <div className="card-body">
                        <div className=" d-flex flex-wrap">
                            <div className="credit-envelope mb-30px">
                                {`Total Credit Left for this ${(companyData.plan_type_id) ? companyData.plan_type_id === 1 ? `month: ` : `year: ` : `month: `}`}
                                Envelope
                                <span className="mx-2">{companyData.total_envelope_credit}</span>
                                {companyData.total_sms > 0 && (
                                    <>
                                        SMS
                                        <span className="mx-2">{companyData.total_sms}</span>
                                    </>
                                )}
                            </div>
                            <div className="credit-sms mb-30px">
                                {`Total Ad on SMS Left`}
                                <span className="ms-2">{companyData.addon_sms}</span>
                            </div>
                        </div>
                        <p className="history-link">To view your envelope transaction history go
                            to <NavLink to={"/billing/credit-history"} data-toggle="tooltip" data-placement="right"
                                        title="" data-bs-original-title="click Me">Credit History</NavLink> Page
                        </p>
                    </div>
                </div>

                {companyData.card_type && (
                    <div className="overview_Card card mb-40px">
                        <div
                            className="card-title border-bottom p-3 bill-section-heading">
                            Payment Information
                            <button type="button" className="btn grey_btn_outline pull-right ms-3"
                                    data-bs-toggle="modal"
                                    data-bs-target="#PaymentCardEdit" data-toggle="tooltip"
                                    data-placement="right" title=""
                                    data-bs-original-title="click Me">Edit</button>
                            <button type="button" className="btn btn-outline-danger rounded-pill pull-right"
                                    data-bs-toggle="modal"
                                    data-bs-target="#removeCreditCard" data-toggle="tooltip"
                                    data-placement="right" title=""
                                    data-bs-original-title="click Me">Delete
                            </button>
                        </div>

                        <PaymentCardEdit setLoading={setLoading} companyData={companyData}
                                         setCompanyData={setCompanyData}/>

                        <div className="modal fade" id="removeCreditCard" tabIndex={-1}
                             aria-labelledby="removeCreditCardLabel" aria-hidden="true" data-bs-backdrop="static"
                             data-bs-keyboard="false">
                            <div className="modal-dialog ">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="removeCreditCardLabel">
                                            Delete Card
                                        </h5>
                                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                                ref={removeCreditCardRef} data-bs-dismiss="modal" aria-label="Close">
                                            <i className="fa fa-times-circle" aria-hidden="true"/>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <p className="pb-2">Are you sure you want to remove card?</p>
                                    </div>
                                    <div className="modal-footer justify-content-center">
                                        <button type="button" className="btn btn-secondary"
                                                data-bs-dismiss="modal">Cancel
                                        </button>
                                        <button type="button" onClick={handleDeleteCard}
                                                className="btn btn-danger">Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <p className="bill-profile-laft">Payment Method:</p>
                            <p className="bill-profile-right">Credit Card</p>
                            <p className="bill-profile-laft">Card Type:</p>
                            <p className="bill-profile-right">{companyData.card_type}</p>
                            <p className="bill-profile-laft">Card Number:</p>
                            <p className="bill-profile-right">{companyData.card_number}</p>
                            <p className="bill-profile-laft">Card Holder Name:</p>
                            <p className="bill-profile-right">{companyData.card_holder_name}</p>
                            <p className="bill-profile-laft">Expiry Date(MM/YY):</p>
                            <p className="bill-profile-right">{companyData.card_expired_date}</p>
                        </div>
                    </div>
                )}

                {companyData.address && (
                    <div className="overview_Card card mb-40px">
                        <div className="card-title border-bottom p-3 bill-section-heading">
                            Billing Address
                        </div>
                        <div className="card-body">
                            <p className="bill-profile-laft">Address:</p>
                            <p className="bill-profile-right">{companyData.address}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default BillingOverview;