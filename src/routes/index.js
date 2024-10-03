import React from "react";
import {Navigate, useLocation, Outlet, useParams} from "react-router-dom";
import Utils from "../utils";

export const WithAuthRoute = () => {
    const auth = Utils.loginUserData();
    const location = useLocation();
    if (Object.keys(auth).length === 0) {
        return <Navigate to="/login" state={{path: location.pathname}}/>
    } else {
        return <Outlet/>;
    }
};

export const WithoutAuthRoute = () => {
    const auth = Utils.loginUserData();
    const location = useLocation();
    if (Object.keys(auth).length > 0) {
        return <Navigate to="/client-portal" state={{path: location.pathname}}/>
    } else {
        return <Outlet/>;
    }
};

export const WithAdminAuthRoute = () => {
    const auth = Utils.adminLoginUserData();
    const location = useLocation();
    if (Object.keys(auth).length === 0) {
        return <Navigate to="/back-admin/login" state={{path: location.pathname}}/>
    } else {
        return <Outlet/>;
    }
};

export const WithoutAdminAuthRoute = () => {
    const auth = Utils.adminLoginUserData();
    const location = useLocation();
    if (Object.keys(auth).length > 0) {
        return <Navigate to="/back-admin" state={{path: location.pathname}}/>
    } else {
        return <Outlet/>;
    }
};

export const ProtectedRoute = () => {
    let loginData = Utils.loginUserData();
    const location = useLocation();
    if (Object.keys(loginData).length > 0) {
        if (['/billing', '/billing/history', '/billing/credit-history', '/billing/pricing'].findIndex(x => x === location.pathname) > -1) {
            if (loginData.role_id > 2) {
                return <Navigate to="/" state={{path: location.pathname}}/>
            } else {
                return <Outlet/>
            }
        } else if (['/settings/preferences', '/settings/integration', '/settings/integration/one-drive', '/settings/users/group'].findIndex(x => x === location.pathname) > -1) {
            if (loginData.role_id > 3) {
                return <Navigate to="/" state={{path: location.pathname}}/>
            } else {
                return <Outlet/>
            }
        } else if (['/settings/users'].findIndex(x => x === location.pathname) > -1) {
            if (loginData.role_id > 4) {
                return <Navigate to="/" state={{path: location.pathname}}/>
            } else {
                return <Outlet/>
            }
        } else {
            return <Navigate to="/" state={{path: location.pathname}}/>
        }
    } else {
        return <Navigate to="/login" state={{path: location.pathname}}/>
    }
};

export const AdminProtectedRoute = () => {
    let {client} = useParams();
    let loginData = Utils.loginClientUserData(client);
    const location = useLocation();
    if (Object.keys(loginData).length > 0) {
        if (['/back-admin/client-portal/' + client + '/billing', '/back-admin/client-portal/' + client + '/billing/history', '/back-admin/client-portal/' + client + '/billing/credit-history', '/back-admin/client-portal/' + client + '/billing/pricing'].findIndex(x => x === location.pathname) > -1) {
            if (loginData.role_id > 2) {
                return <Navigate to={`/back-admin/client-portal/` + client} state={{path: location.pathname}}/>
            } else {
                return <Outlet/>
            }
        } else if (['/back-admin/client-portal/' + client + '/settings/preferences', '/back-admin/client-portal/' + client + '/settings/integration', '/back-admin/client-portal/' + client + '/settings/users/group'].findIndex(x => x === location.pathname) > -1) {
            if (loginData.role_id > 3) {
                return <Navigate to={`/back-admin/client-portal/` + client} state={{path: location.pathname}}/>
            } else {
                return <Outlet/>
            }
        } else if (['/back-admin/client-portal/' + client + '/settings/users'].findIndex(x => x === location.pathname) > -1) {
            if (loginData.role_id > 4) {
                return <Navigate to={`/back-admin/client-portal/` + client} state={{path: location.pathname}}/>
            } else {
                return <Outlet/>
            }
        } else {
            return <Navigate to={`/back-admin/client-portal/` + client} state={{path: location.pathname}}/>
        }
    } else {
        return <Navigate to="/back-admin" state={{path: location.pathname}}/>
    }
};