import React from "react";
import {NavLink} from "react-router-dom";

function BillingNavTab() {

    return (
        <div className="col-lg-2 col-md-3">
            <div className="setting_sidebar">
                <div className="nav nav-tab " id="nav-tab" role="tablist">
                    <NavLink to={'/billing'} className="nav-link" end>
                        <img src="/images/Billing_Overview.png" alt="..." className="me-2"/>
                        Billing Overview
                    </NavLink>
                    <NavLink to={"/billing/history"} className="nav-link">
                        <img src="/images/Billing_History.png" alt="..." className="me-2"/>
                        Billing History
                    </NavLink>
                    <NavLink to={"/billing/credit-history"} className="nav-link">
                        <img src="/images/Credit_History.png" alt="..." className="me-2"/>
                        Credit History
                    </NavLink>
                    <NavLink to={"/billing/pricing"} className="nav-link">
                        <img src="/images/Pricing_Plan.png" alt="..." className="me-2"/>
                        Pricing Plan
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default BillingNavTab;