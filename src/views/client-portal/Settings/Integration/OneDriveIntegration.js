import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from 'react-router-dom';
import {postOneDriveConnect} from "../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../utils";

function OneDriveIntegration() {
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(function () {
        let obj = {
            code: searchParams.get('code')
        };

        postOneDriveConnect(obj)
            .then(response => {
                setLoading(false);
                toast.success(response.data.message);
                navigate('/settings/integration');
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
                navigate('/settings/integration');
            });
    }, [searchParams, navigate]);

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
        </>
    );
}

export default OneDriveIntegration;