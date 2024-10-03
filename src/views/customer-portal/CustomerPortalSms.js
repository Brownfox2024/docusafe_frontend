import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getCustomerPortalLink} from "../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../utils";

function CustomerPortalSms() {
    let {id} = useParams();
    const navigate = useNavigate();

    useEffect(function () {

        getCustomerPortalLink({id: id})
            .then(response => {
                navigate('/customer-portal/' + response.data.data.id + '-.' + response.data.data.r_id)
            })
            .catch(err => {
                navigate('/');
                toast.error(Utils.getErrorMessage(err));
            });
    }, [id, navigate]);

    return (
        <div className="page-loading">
            <img src="/images/loader.gif" alt="loader"/>
        </div>
    );
}

export default CustomerPortalSms;