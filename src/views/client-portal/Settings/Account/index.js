import React, {useEffect, useState} from 'react';
import CompanyDetails from "./CompanyDetails";
import UserProfile from "./UserProfile";
import Theme from "./Theme";
import Security from "./Security";
import ChangePassword from "./ChangePassword";
import {getCompanyDetails} from "../../../../services/CommonService";
import Utils from "../../../../utils";

function SettingAccount() {
    const [loading, setLoading] = useState(false);

    const [companyData, setCompanyData] = useState({});
    const [themeList, setThemeList] = useState([]);
    const [isThemeTab, setIsThemeTab] = useState(true);

    useEffect(() => {
        setLoading(true);
        getCompanyDetails()
            .then((response) => {
                setLoading(false);
                setCompanyData(response.data.data);
                setThemeList(response.data.themeList);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let loginData = Utils.loginUserData();
        if (Object.keys(loginData).length > 0) {
            if (loginData.role_id > 3) {
                setIsThemeTab(false);
            }
        }
    }, []);

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <div className="tab-pane active show" id="Account-detail" role="tabpanel" aria-labelledby="AccountDetails">
                <div className="breadcrumbs pt-4">
                    <ul>
                        <li>Settings /</li>
                        <li>Account</li>
                    </ul>
                </div>

                <div className="nav nav-tabs pt-4" id="nav-tab" role="tablist">
                    <button className="nav-link active" id="nav-companyDetails" data-bs-toggle="tab"
                            data-bs-target="#nav-company-detail" type="button" role="tab"
                            aria-controls="nav-company-detail" aria-selected="true">
                        Company Details
                    </button>
                    <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-profile" type="button" role="tab"
                            aria-controls="nav-profile" aria-selected="false">
                        User Profile
                    </button>
                    {isThemeTab === true && (
                        <button className="nav-link" id="nav-theme-tab" data-bs-toggle="tab"
                                data-bs-target="#nav-theme" type="button" role="tab"
                                aria-controls="nav-theme" aria-selected="false">
                            Theme
                        </button>
                    )}
                    <button className="nav-link" id="nav-Security-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-Security" type="button" role="tab"
                            aria-controls="nav-Security" aria-selected="false">
                        Security
                    </button>
                    <button className="nav-link" id="nav-Change-Password-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-Change-Password" type="button" role="tab"
                            aria-controls="nav-Change-Password" aria-selected="false">
                        Change Password
                    </button>
                </div>
                <div className="tab-content account_accordiom " id="nav-tabContent"
                     style={{minHeight: "calc(100vh - 259px)", marginBottom: 30}}>

                    <CompanyDetails companyData={companyData} setCompanyData={setCompanyData}
                                    setLoading={setLoading}/>

                    <UserProfile companyData={companyData} setLoading={setLoading}/>

                    <Theme themeList={themeList} setThemeList={setThemeList} setLoading={setLoading}/>

                    <Security/>

                    <ChangePassword/>

                </div>
            </div>
        </>
    );
}

export default SettingAccount;