import React, {useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import Utils from "../../../utils";
import {ADMIN_LOCAL_STORE} from "../../../configs/AppConfig";

function AdminHeader() {
    const navigate = useNavigate();

    const [adminDisplayName, setAdminDisplayName] = useState('');
    const [adminLoginUserName, setAdminLoginUserName] = useState('');
    const [adminLoginUserEmail, setAdminLoginUserEmail] = useState('');

    useEffect(() => {
        setAdminDisplayName(Utils.adminDisplayName());
        let loginData = Utils.adminLoginUserData();
        if (Object.keys(loginData).length > 0) {
            setAdminLoginUserName(loginData.first_name + ' ' + loginData.last_name);
            setAdminLoginUserEmail(loginData.email);
        }
    }, []);

    const onLogout = () => {
        localStorage.removeItem(ADMIN_LOCAL_STORE);
        navigate('/back-admin/login');
    };

    return (
        <nav className="navbar navbar-expand-lg px-5 py-0 shadow-sm">
            <NavLink to={"/back-admin"} className="navbar-brand">
                <img src="/images/logo.png" className="h-8" alt="..."/>
            </NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"><i className="fa fa-bars"/></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarCollapse">

                <div className="navbar-nav mx-lg-auto">
                    <NavLink to={"/back-admin"} className="nav-item nav-link text-dark" aria-current="page"
                             end>Admin</NavLink>
                    <NavLink to={"/back-admin/subscribers"} className="nav-item nav-link text-dark"
                             aria-current="page">Subscribers</NavLink>
                    <NavLink to={"/back-admin/plans"} className="nav-item nav-link text-dark"
                             aria-current="page">Plans</NavLink>
                    {/*<NavLink to={"/back-admin/blogs"} className="nav-item nav-link text-dark"*/}
                             {/*aria-current="page">Blogs</NavLink>*/}
                    <NavLink to={"/back-admin/2fa"} className="nav-item nav-link text-dark"
                             aria-current="page">Two Factor Authentication</NavLink>
                </div>

                <div className="d-flex align-items-lg-center mt-3 mt-lg-0 justify-content-end max_width_right_nav">
                    <div className="nav-item dropdown">
                        <span className=" nav-link dropdown-toggle user_login text-white"
                              id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown"
                              aria-expanded="false">{adminDisplayName}</span>
                        <ul className="dropdown-menu" aria-labelledby="navbarDarkDropdownMenuLink">
                            <li className="Company_name">Docutick Pty Ltd</li>
                            <li className="d-flex user_icon_list">
                                <span className="user_icon">{adminDisplayName}</span>
                                <p>
                                    <span className="user_name">{adminLoginUserName}</span>
                                    <span className="user_email">{adminLoginUserEmail}</span>
                                    <span className="user_profile user_profile_list">
                                        <NavLink to={"/back-admin"}
                                                 style={{textDecoration: 'underline'}}>Profile</NavLink>
                                    </span>
                                </p>
                            </li>
                            <li className="sign_out">
                                <span onClick={onLogout}
                                      className="cur-pointer text-decoration-underline">Sign Out</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default AdminHeader;