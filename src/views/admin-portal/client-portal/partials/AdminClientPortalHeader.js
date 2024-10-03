import React, {useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import ClientPortalMessageAlert from "./ClientPortalMessageAlert";
import ClientPortalNotificationAlert from "./ClientPortalNotificationAlert";
import {adminGetMessageAlert, adminGetNotificationAlert} from "../../../../services/AdminService";
import {IS_CALL} from "../../../../configs/AppConfig";

function AdminClientPortalHeader(props) {
    let {client} = useParams();

    const [loading, setLoading] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loginUserName, setLoginUserName] = useState('');
    const [loginUserEmail, setLoginUserEmail] = useState('');
    const [totalNotification, setTotalNotification] = useState(0);
    const [notificationList, setNotificationList] = useState([]);
    const [totalMessage, setTotalMessage] = useState(0);
    const [messageAlertList, setMessageAlertList] = useState([]);
    const [isShowBilling, setIsShowBilling] = useState(true);

    useEffect(function () {
        let loginData = props?.clientUserData;
        if (Object.keys(loginData).length > 0) {
            setDisplayName(loginData.first_name.charAt(0) + loginData.last_name.charAt(0));
            setLoginUserName(loginData.first_name + ' ' + loginData.last_name);
            setLoginUserEmail(loginData.email);
            setCompanyName(loginData.company_name);

            if (loginData.role_id > 2) {
                setIsShowBilling(false);
            }
        }
    }, [props?.clientUserData]);

    useEffect(() => {
        onLoadGetNotificationAlert(client);

        if (IS_CALL === true) {
            const interval = setInterval(() => {
                onLoadGetNotificationAlert(client);
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [client]);

    const onLoadGetNotificationAlert = (client) => {
        adminGetNotificationAlert({client_id: client})
            .then(response => {
                setTotalNotification(response.data.data.length);
                setNotificationList(response.data.data);
            })
            .catch(err => {

            });
    };

    useEffect(() => {
        onLoadGetMessageAlert(client);

        if (IS_CALL === true) {
            const interval = setInterval(() => {
                onLoadGetMessageAlert(client);
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [client]);

    const onLoadGetMessageAlert = (client) => {
        adminGetMessageAlert({client_id: client, entity_type: 1})
            .then(response => {
                setTotalMessage(response.data.data.length);
                setMessageAlertList(response.data.data);
            })
            .catch(err => {

            });
    };

    const onLogout = () => {
        localStorage.removeItem(client);
        window.close();
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <nav className="navbar navbar-expand-lg px-5 py-0 shadow-sm">
                <NavLink className="navbar-brand" to="#">
                    <img src="/images/logo.png" className="h-8" alt="..."/>
                </NavLink>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"><i className="fa fa-bars"/></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav mx-lg-auto">
                        <NavLink className="nav-item nav-link" to={`/back-admin/client-portal/` + client}
                                 aria-current="page" end>Home</NavLink>
                        <NavLink className="nav-item nav-link"
                                 to={`/back-admin/client-portal/` + client + `/manage`}>Manage</NavLink>
                        <NavLink className="nav-item nav-link"
                                 to={`/back-admin/client-portal/` + client + `/recipients`}>Recipients</NavLink>
                        <NavLink className="nav-item nav-link"
                                 to={`/back-admin/client-portal/` + client + `/templates`}>Templates</NavLink>
                        <NavLink className="nav-item nav-link"
                                 to={`/back-admin/client-portal/` + client + `/settings`}>Settings</NavLink>
                        {isShowBilling === true && (
                            <NavLink className="nav-item nav-link"
                                     to={`/back-admin/client-portal/` + client + `/billing`}>Billing</NavLink>
                        )}
                    </div>

                    <div className="d-flex align-items-lg-center mt-3 mt-lg-0 justify-content-end max_width_right_nav">
                        <div className="w-full w-lg-auto bg_grey cur-pointer" data-bs-toggle="offcanvas"
                             data-bs-target="#message_box" aria-controls="message_box" data-toggle="tooltip"
                             title="" data-bs-original-title="Messages">
                            <div className="position-relative">
                                <i className="fa fa-comments-o" aria-hidden="true"/>
                                {totalMessage > 0 &&
                                <span className="position-absolute top-0 start-100 translate-middle badge  badge_email">
                                    {totalMessage}
                                </span>
                                }
                            </div>
                        </div>

                        <div className=" w-full w-lg-auto bg_grey cur-pointer" data-bs-toggle="offcanvas"
                             data-bs-target="#notification_box" aria-controls="notification_box"
                             data-toggle="tooltip" title="" data-bs-original-title="Alert Notification">
                            <div className="position-relative">
                                <i className="fa fa-bell-o" aria-hidden="true"/>
                                {totalNotification > 0 &&
                                <span className="position-absolute top-0 start-100 translate-middle badge  bg-danger">
                                    {totalNotification}
                                </span>
                                }
                            </div>
                        </div>

                        <div className="nav-item dropdown">
                            <NavLink className=" nav-link dropdown-toggle user_login" to="#"
                                     id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown"
                                     aria-expanded="false">{displayName}
                            </NavLink>
                            <ul className="dropdown-menu" aria-labelledby="navbarDarkDropdownMenuLink">
                                <li className="Company_name">{companyName}</li>
                                <li className="d-flex user_icon_list">
                                    <span className="user_icon">{displayName}</span>
                                    <p>
                                        <span className="user_name">{loginUserName}</span>
                                        <span className="user_email">{loginUserEmail}</span>
                                        <span className="user_profile user_profile_list">
                                            <NavLink to={`/back-admin/client-portal/` + client + `/settings`}
                                                     className="text-decoration-underline">Profile</NavLink>
                                        </span>
                                    </p>
                                </li>
                                <li className="sign_out">
                                    <span onClick={onLogout}
                                          className="text-decoration-underline cur-pointer">Sign Out</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <ClientPortalMessageAlert messageAlertList={messageAlertList} setMessageAlertList={setMessageAlertList}
                                      setTotalMessage={setTotalMessage} setLoading={setLoading}/>

            <ClientPortalNotificationAlert notificationList={notificationList} setNotificationList={setNotificationList}
                                           setTotalNotification={setTotalNotification} setLoading={setLoading}/>
        </>
    );
}

export default AdminClientPortalHeader;