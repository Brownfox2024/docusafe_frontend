import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {Lang} from "../../../../../lang";

function AdminBoxCloud(props) {
    const navigate = useNavigate();
    let {client} = useParams();

    useEffect(function () {
        if (props.type === 1) {
            toast.success(Lang.box_success);
            navigate('/back-admin/client-portal/' + client + '/settings/integration');
        } else {
            toast.error(Lang.oops_message);
            navigate('/back-admin/client-portal/' + client + '/settings/integration');
        }
    }, [props, navigate, client]);

    return (
        <div/>
    );
}

export default AdminBoxCloud;