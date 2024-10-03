import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from 'react-router-dom';
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import {adminPostOneDriveConnect} from "../../../../../services/AdminService";

function AdminOneDriveIntegration() {
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(function () {
        if (searchParams.get('state')) {
            let obj = {
                code: searchParams.get('code'),
                client_id: searchParams.get('state')
            };

            adminPostOneDriveConnect(obj)
                .then(response => {
                    setLoading(false);
                    toast.success(response.data.message);
                    navigate('/back-admin/client-portal/' + searchParams.get('state') + '/settings/integration');
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                    navigate('/back-admin/client-portal/' + searchParams.get('state') + '/settings/integration');
                });
        } else {
            navigate('/back-admin');
        }
    }, [searchParams, navigate]);

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
        </>
    );
}

export default AdminOneDriveIntegration;