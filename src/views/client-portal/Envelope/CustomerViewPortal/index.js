import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import DocumentsAndForm from "./DocumentsAndForm";
import Messages from "./Messages";
import Contact from "./Contact";
import Help from "./Help";
import {envelopeCustomerViewPortal} from "../../../../services/CommonService";
import Utils from "../../../../utils";
import CustomerPortalTab from "./CustomerPortalTab";
import {toast} from "react-toastify";
import {Lang} from "../../../../lang";

function CustomerViewPortal() {
    let {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [envelopeData, setEnvelopeData] = useState({});
    const [contactData, setContactData] = useState({});
    const [theme, setTheme] = useState('');

    useEffect(function () {
        document.title = Lang.client_portal_title;

        envelopeCustomerViewPortal({uuid: id})
            .then((response) => {
                setEnvelopeData(response.data.data);
                setTheme(response.data.data.theme_color);
                setContactData(response.data.data.contact_detail);
                setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    }, [id]);

    return (
        <>
            {loading && (
                <div className="page-loading">
                    <img src="/images/loader.gif" alt="loader"/>
                </div>
            )}
            <div className={`wrapper clientPortal ${theme}`}>
                <Header envelopeData={envelopeData}/>

                {!envelopeData.is_finish && (
                    <div className=" background_grey_400">
                        <section className="setting_tab client_portal px-3 pb-2 custom_container_portal"
                                 style={{minHeight: "calc(100vh - 104px)"}}>

                            <CustomerPortalTab envelopeData={envelopeData}/>

                            <div className="tab-content  px-5 py-4" id="nav-tabContent"
                                 style={{minHeight: "calc(100vh - 219px)"}}>

                                <DocumentsAndForm envelopeData={envelopeData} setLoading={setLoading}/>

                                <Messages envelopeData={envelopeData}/>

                                <Contact contactData={contactData}/>

                                <Help/>
                            </div>
                        </section>
                    </div>
                )}

                {envelopeData.is_finish && (
                    <div className="error_Wrapper">
                        <div className="card">
                        <span className="text-success mb-3 error_icon">
                            <i className="fa fa-check-circle-o" aria-hidden="true"/>
                        </span>
                            <h2 className=" mb-2"><b>Completed</b></h2>
                            {envelopeData.finish_message}
                        </div>
                    </div>
                )}

                <Footer/>
            </div>
        </>
    );
}

export default CustomerViewPortal;
