import React from "react";
import {NavLink} from "react-router-dom";

function AdminFooter() {
    return (
        <footer className="bg-dark text-center text-white">
            <div className="text-center p-3 footer_text">
                <NavLink to={"/back-admin"} className="text-white">DocuTick</NavLink> All rights reserved
            </div>
        </footer>
    );
}

export default AdminFooter;