import React, {useEffect, useState} from "react";
import {useParams, useNavigate, Outlet} from "react-router-dom";
import {getClientDetail} from "../../../services/AdminService";
import {toast} from "react-toastify";
import Utils from "../../../utils";
import AdminClientPortalHeader from "./partials/AdminClientPortalHeader";
import AdminClientPortalFooter from "./partials/AdminClientPortalFooter";
import {Lang} from "../../../lang";
import {encryptData} from "../../../utils/crypto";
import {SALT} from "../../../configs/AppConfig";

function AdminClientPortal() {
    let {client} = useParams();

    document.title = Lang.homepage_title;
    document.getElementsByTagName("META")[4].content = Lang.homepage_meta_desc;
    document.getElementsByTagName("META")[5].content = Lang.homepage_meta_keyword;

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [clientUserData, setClientUserData] = useState({});
    const [themeClass, setThemeClass] = useState('');

    useEffect(function () {
        setLoading(true);
        getClientDetail({id: client})
            .then(response => {
                let encryptedData = encryptData(response.data.data, SALT);
                localStorage.setItem(client, encryptedData);
                setClientUserData(response.data.data);
                setThemeClass(response.data.data.theme_color);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
                navigate('/back-admin');
            });

    }, [client, navigate]);

    useEffect(function () {
        const interval = setInterval(() => {
            let userData = Utils.loginClientUserData(client);
            if (Object.keys(userData).length > 0) {
                if (userData.theme_color) {
                    setThemeClass(userData.theme_color);
                } else {
                    setThemeClass('');
                }
            }
        }, 500);

        return () => clearInterval(interval);
    }, [client]);

    return (
        <div className={`wrapper ${themeClass}`}>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <AdminClientPortalHeader clientUserData={clientUserData}/>

            <Outlet/>

            <AdminClientPortalFooter/>
        </div>
    );
}

export default AdminClientPortal;