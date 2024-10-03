import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Lang} from "../../../../lang";

function BoxCloud(props) {
    const navigate = useNavigate();

    useEffect(function () {
        if (props.type === 1) {
            toast.success(Lang.box_success);
            navigate('/settings/integration');
        } else {
            toast.error(Lang.oops_message);
            navigate('/settings/integration');
        }
    }, [props, navigate]);

    return (
        <div/>
    );
}

export default BoxCloud;