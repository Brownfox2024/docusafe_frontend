import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import Utils from "../../../utils";

function SettingNavTab() {

    const [isPreferenceMenu, setIsPreferenceMenu] = useState(true);
    const [isIntegrationMenu, setIsIntegrationMenu] = useState(true);
    const [isUserMenu, setIsUserMenu] = useState(true);

    useEffect(function () {
        const loginData = Utils.loginUserData();
        if (Object.keys(loginData).length > 0) {
            if (loginData.role_id > 3) {
                setIsIntegrationMenu(false);
                setIsPreferenceMenu(false);
            }
            if (loginData.role_id > 4) {
                setIsUserMenu(false);
            }
        }
    }, []);

    return (
        <div className="col-lg-2 col-md-3">
            <div className="setting_sidebar ">
                <div className="nav nav-tabs " id="nav-tab" role="tablist">
                    <NavLink to={"/settings"} className="nav-link" end>
                        <i className="fa fa-user-circle-o me-2" aria-hidden="true"/>
                        Account
                    </NavLink>
                    {isUserMenu === true && (
                        <NavLink to={"/settings/users"} className="nav-link">
                            <i className="fa fa-users me-2" aria-hidden="true"/>
                            Users
                        </NavLink>
                    )}
                    {isPreferenceMenu === true && (
                        <NavLink to={"/settings/preferences"} className="nav-link d-flex align-items-center">
                            <img src="/images/preference.png" alt="..." className="me-2"/>
                            Preferences
                        </NavLink>
                    )}
                    {isIntegrationMenu === true && (
                        <NavLink to={"/settings/integration"} className="nav-link d-flex align-items-center">
                            <img src="/images/integration.png" alt="..." className="me-2"/>
                            Integration
                        </NavLink>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SettingNavTab;