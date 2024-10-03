import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import AdminCompanyDetails from "./AdminCompanyDetails";
import AdminClientUserProfile from "./AdminClientUserProfile";
import AdminClientTheme from "./AdminClientTheme";
import AdminClientSecurity from "./AdminClientSecurity";
import AdminClientChangePassword from "./AdminClientChangePassword";
import Utils from "../../../../../utils";
import {adminGetCompanyDetails} from "../../../../../services/AdminService";

function AdminSettingAccount() {
    let {client} = useParams();
    const [loading, setLoading] = useState(false);

    const [companyData, setCompanyData] = useState({});
    const [themeList, setThemeList] = useState([]);
    const [isThemeTab, setIsThemeTab] = useState(true);

    useEffect(() => {
        setLoading(true);
        adminGetCompanyDetails({client_id: client})
            .then((response) => {
                setLoading(false);
                setCompanyData(response.data.data);
                setThemeList(response.data.themeList);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, [client]);

    useEffect(() => {
        let loginData = Utils.loginClientUserData(client);
        if (Object.keys(loginData).length > 0) {
            if (loginData.role_id > 3) {
                setIsThemeTab(false);
            }
        }
    }, [client]);

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

                    <AdminCompanyDetails companyData={companyData} setCompanyData={setCompanyData}
                                         setLoading={setLoading}/>

                    <AdminClientUserProfile companyData={companyData} setLoading={setLoading}/>

                    <AdminClientTheme themeList={themeList} setThemeList={setThemeList} setLoading={setLoading}/>

                    <AdminClientSecurity/>

                    <AdminClientChangePassword/>

                </div>
            </div>
        </>
    );
}

export default AdminSettingAccount;