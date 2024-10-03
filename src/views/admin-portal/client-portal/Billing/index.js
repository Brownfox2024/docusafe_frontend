import React from "react";
import {Outlet} from "react-router-dom";
import AdminClientBillingNavTab from "./AdminClientBillingNavTab";

function AdminClientBilling() {
    return (
        <section className=" background_grey_400 setting_tab pe-3"
                 style={{minHeight: 'calc(100vh - 119px)', overflowX: 'hidden'}}>
            <div className="custom_container">
                <div className="row">

                    <AdminClientBillingNavTab/>

                    <div className="col-lg-10 col-md-9 border-end">
                        <div className="tab-content  px-3 bg_transparent" id="nav-tabContent"
                             style={{minHeight: 'calc(100vh - 259px)', marginBottom: '30px'}}>

                            <Outlet/>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminClientBilling;