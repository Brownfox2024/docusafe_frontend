import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import {adminUpdatePreferenceData} from "../../../../../services/AdminService";

function AdminClientMessage(props) {
    let {client} = useParams();
    const [emailSubject, setEmailSubject] = useState('');
    const [clientMessage, setClientMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');

    useEffect(function () {

        setClientMessage((props?.preferenceData.client_portal_message) ? props?.preferenceData.client_portal_message : '');
        setEmailMessage((props?.preferenceData.email_message) ? props?.preferenceData.email_message : '');
        setEmailSubject((props?.preferenceData.email_subject) ? props?.preferenceData.email_subject : '');

    }, [props?.preferenceData]);

    const handleUpdateMessage = (e) => {
        e.preventDefault();

        if (!emailSubject.trim() && !clientMessage.trim() && !emailMessage.trim()) {
            toast.error('Please enter message any one');
        } else {

            props.setLoading(true);

            let updateList = [
                {slug: 'client_portal_message', value: clientMessage.trim()},
                {slug: 'email_subject', value: emailSubject.trim()},
                {slug: 'email_message', value: emailMessage.trim()},
            ];

            adminUpdatePreferenceData({client_id: client, list: updateList})
                .then(response => {
                    props.setLoading(false);
                    toast.success(response.data.message);
                })
                .catch(err => {
                    props.setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        }
    };

    return (
        <div className="tab-pane  p-4" id="Message" role="tabpanel" aria-labelledby="Message-tab">
            <div className="table-responsive mb-3">
                <table className="table mb-0 in_progress_table shadow-sm mb-4">
                    <thead>
                    <tr className="bg_blue">
                        <th>Details</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr style={{backgroundColor: '#f4f4f4'}}>
                        <td colSpan="2" className="text-primary font_bold"
                            ref={(el) => el && el.style.setProperty('padding', '10px 25px', "important")}>Default Client
                            Portal Message
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Please write the default client portal message
                            <div className="mt-3">
                                <textarea className="form-control" rows={9} value={clientMessage}
                                          onChange={(e) => setClientMessage(e.target.value)}/>
                            </div>
                        </td>
                    </tr>
                    <tr style={{backgroundColor: '#f4f4f4'}}>
                        <td colSpan="2" className="text-primary font_bold"
                            ref={(el) => el && el.style.setProperty('padding', '10px 25px', "important")}>Email Subject
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Please write the default email subject
                            <div className="mt-3">
                                <input className="form-control" value={emailSubject}
                                       onChange={(e) => setEmailSubject(e.target.value)}/>
                            </div>
                        </td>
                    </tr>
                    <tr style={{backgroundColor: '#f4f4f4'}}>
                        <td colSpan="2" className="text-primary font_bold"
                            ref={(el) => el && el.style.setProperty('padding', '10px 25px', "important")}>Email Message
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Please write the default email message
                            <div className="mt-3">
                                <textarea className="form-control" rows={12} value={emailMessage}
                                          onChange={(e) => setEmailMessage(e.target.value)}/>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <button type="button" onClick={handleUpdateMessage}
                                className="btn btn-primary rounded-5">Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminClientMessage;