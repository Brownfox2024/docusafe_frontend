import React from "react";
import {Outlet} from "react-router-dom";
import GuestHeader from "../partials/GuestHeader";
import GuestFooter from "../partials/GuestFooter";

function GuestLayout() {
    return (
        <div className="wrapper guest-portal">
            <GuestHeader/>
            <Outlet/>
            <GuestFooter/>
        </div>
    );
}

export default GuestLayout;