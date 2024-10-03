import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {postCustomerEnvelopeStopReminder} from "../../services/CommonService";
import Utils from "../../utils";
import Footer from "./Footer";

function CustomerPortalStopReminder() {
    let {uuid, id} = useParams();
    const [loading, setLoading] = useState(true);
    const [msgType, setMessageType] = useState(0);
    const [showMessage, setShowMessage] = useState('');

    useEffect(function () {
        let obj = {
            uuid: uuid,
            id: id
        };
        postCustomerEnvelopeStopReminder(obj)
            .then(response => {
                setLoading(false);
                setMessageType(1);
                setShowMessage(response.data.message);
            })
            .catch(err => {
                setLoading(false);
                setMessageType(2);
                setShowMessage(Utils.getErrorMessage(err));
            });
    }, [uuid, id]);

    return (
        <>
            {loading && (
                <div className="page-loading">
                    <img src="/images/loader.gif" alt="loader"/>
                </div>
            )}

            <div className="wrapper clientPortal">
                <nav className="navbar navbar-expand-lg px-5 py-2 shadow-sm">
                    <span className="navbar-brand">
                        <img src="/images/logo.png" className="h-8" alt="..."/>
                    </span>
                </nav>

                {msgType > 0 && (
                    <div className="error_Wrapper">
                        <div className="card">
                            {msgType === 1 && (
                                <>
                                    <span className="text-success mb-3 error_icon">
                                        <i className="fa fa-check-circle-o" aria-hidden="true"/>
                                    </span>
                                    <h2 className=" mb-2"><b>Success</b></h2>
                                </>
                            )}
                            {msgType === 2 && (
                                <>
                                    <span className="text-danger mb-3 error_icon">
                                        <i className="fa fa-exclamation-triangle" aria-hidden="true"/>
                                    </span>
                                    <h2 className=" mb-2"><b>ERROR</b></h2>
                                </>
                            )}
                            {showMessage}
                        </div>
                    </div>
                )}

                <Footer/>
            </div>
        </>
    );
}

export default CustomerPortalStopReminder;