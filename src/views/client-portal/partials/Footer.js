import React from "react";
import {CURRENT_YEAR} from "../../../configs/AppConfig";

function Footer() {
    return (
        <footer className="bg-dark text-center text-white">
            <div className="text-center p-3 footer_text">
                Copyright {CURRENT_YEAR} @
                <span className="text-white">DocuTick</span> All rights reserved
            </div>
        </footer>
    );
}

export default Footer;