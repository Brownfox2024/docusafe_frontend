import React, {useEffect, useState} from "react";
import Notification from "./Notification";
import Message from "./Message";
import FileOption from "./FileOption";
import EnvelopeProtected from "./EnvelopeProtected";
import {getPreferenceData} from "../../../../services/CommonService";

function SettingPreferences() {

    const [loading, setLoading] = useState(false);
    const [preferenceData, setPreferenceData] = useState({});
    const [cloudStorage, setCloudStorage] = useState([]);

    useEffect(function () {
        setLoading(true);
        getPreferenceData({})
            .then(response => {
                setLoading(false);
                setPreferenceData(response.data.data);
                setCloudStorage(response.data.cloud_storage);
            })
            .catch(err => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}

            <div className="tab-pane  bg_transparent active show" id="preferences" role="tabpanel"
                 aria-labelledby="preferences-tab">
                <div className="nav nav-tabs pt-4" id="navtab" role="tablist">
                    <button className="nav-link active" id="Notification" data-bs-toggle="tab"
                            data-bs-target="#Notification-detail" type="button" role="tab">Email Notifications
                    </button>
                    <button className="nav-link" id="Message-tab" data-bs-toggle="tab" data-bs-target="#Message"
                            type="button" role="tab">Default Messages
                    </button>
                    <button className="nav-link" id="FileOption-tab" data-bs-toggle="tab" data-bs-target="#FileOption"
                            type="button" role="tab">Storage & Naming Conventions
                    </button>
                    {/*<button className="nav-link" id="EnvelopeProtection-tab" data-bs-toggle="tab"
                            data-bs-target="#EnvelopeProtection" type="button" role="tab">Envelope Protection
                    </button>*/}
                </div>
                <div className="tab-content account_accordiom" id="navContent"
                     style={{minHeight: 'calc(100vh - 217px)', marginBottom: '30px'}}>

                    <Notification preferenceData={preferenceData} setPreferenceData={setPreferenceData}
                                  setLoading={setLoading}/>

                    <Message preferenceData={preferenceData} setPreferenceData={setPreferenceData}
                             setLoading={setLoading}/>

                    <FileOption preferenceData={preferenceData} setPreferenceData={setPreferenceData}
                                cloudStorage={cloudStorage} setLoading={setLoading}/>

                    <EnvelopeProtected preferenceData={preferenceData} setPreferenceData={setPreferenceData}
                                       setLoading={setLoading}/>
                </div>
            </div>
        </>
    );
}

export default SettingPreferences;