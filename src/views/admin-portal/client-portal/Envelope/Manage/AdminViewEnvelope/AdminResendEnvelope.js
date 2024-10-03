import React, {useRef, useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../../utils";
import validator from "validator";
import {adminManageEnvelopeResend} from "../../../../../../services/AdminService";

function AdminResendEnvelope(props) {
    const {client} = useParams();
    const clsResendEnvelopeRef = useRef(null);
    const [emails, setEmails] = useState([]);
    const [recipientName, setRecipientName] = useState('');

    useEffect(function () {
        if (props.resendEnvelope.emails) {
            setEmails(props.resendEnvelope.emails);

            if (props.resendEnvelope.emails.length > 0) {
                setRecipientName(props.resendEnvelope.emails[0]['name']);
            }
            if (props.resendEnvelope.emails.length > 1) {
                setRecipientName('All Recipients');
            }
        }
    }, [props.resendEnvelope]);

    const handleResendEnvelopeHide = (e) => {
        e.preventDefault();

        setRecipientName('');

        props.setResendEnvelope({
            envelope_id: 0,
            emails: []
        });
    };

    const handleEmail = (e, index) => {
        let emailList = [...emails];
        emailList[index]['email'] = e.target.value;
        setEmails(emailList);
    };

    const onSubmitReSendEnvelope = (e) => {
        e.preventDefault();

        let emailList = [...emails];

        if (emailList.length > 0) {
            let error = false;
            for (let i = 0; i < emailList.length; i++) {
                if (!emailList[i]['email']) {
                    emailList[i].error = 'Please enter email address';
                    error = true;
                } else if (!validator.isEmail(emailList[i]['email'])) {
                    emailList[i].error = 'Please enter valid email address';
                    error = true;
                }
            }

            setEmails(emailList);

            if (error) return;

            let obj = props.resendEnvelope;
            obj.client_id = client;

            props.setLoading(true);
            adminManageEnvelopeResend(obj)
                .then(response => {
                    props.setLoading(false);
                    clsResendEnvelopeRef?.current.click();
                    toast.success(response.data.message);
                })
                .catch(err => {
                    toast.error(Utils.getErrorMessage(err));
                    props.setLoading(false);
                });
        } else {
            toast.error('Oops...something went wrong. Please try again.');
        }
    };

    return (
        <div className="modal fade" id="resendEnvelope" tabIndex="-1" aria-labelledby="resendEnvelopeLabel"
             data-bs-keyboard="false" data-bs-backdrop="static" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="resendEnvelopeLabel">Resend Envelope</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                ref={clsResendEnvelopeRef} onClick={handleResendEnvelopeHide} data-bs-dismiss="modal"
                                aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        {emails.map((item, index) =>
                            <div className="mb-3" key={index}>
                                <input type="text" className="form-control" value={item.email}
                                       onChange={(e) => handleEmail(e, index)} placeholder="Enter email address"/>
                                {item.error && (<div className="text-danger ms-2">{item.error}</div>)}
                            </div>
                        )}
                        <p className="py-2">Do you want to resend envelope to {recipientName}?</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={handleResendEnvelopeHide} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={onSubmitReSendEnvelope} className="btn btn-primary">Resend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminResendEnvelope;