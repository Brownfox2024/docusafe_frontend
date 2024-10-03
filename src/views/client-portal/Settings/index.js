import React from "react";
import {Outlet} from "react-router-dom";
import SettingNavTab from "./SettingNavTab";

function Settings() {

    return (
        <section className=" background_grey_400 setting_tab pe-3"
                 style={{minHeight: "calc(100vh - 119px)", overflowX: "hidden"}}>
            <div className="custom_container">
                <div className="row">
                    <SettingNavTab/>

                    <div className="col-lg-10 col-md-9 border-end">
                        <div className="tab-content  px-3 bg_transparent" id="nav-tabContent"
                             style={{minHeight: "calc(100vh - 259px)", marginBottom: 30}}>

                            <Outlet/>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Settings;