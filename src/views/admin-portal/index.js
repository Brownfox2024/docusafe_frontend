import React from "react";
import {Outlet} from "react-router-dom";
import AdminHeader from "./partials/AdminHeader";
import AdminFooter from "./partials/AdminFooter";

function AdminPortal() {

    return (
        <div className="wrapper manage_page admin-portal">

            <AdminHeader/>


            <section className="main_wrapper background_grey_400" style={{minHeight: 'calc(100vh - 119px)'}}>

                <Outlet/>

            </section>

            <AdminFooter/>
        </div>
    );
}

export default AdminPortal;