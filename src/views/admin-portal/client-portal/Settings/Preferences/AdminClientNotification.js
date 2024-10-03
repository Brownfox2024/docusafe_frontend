import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {OVERDUE_REMINDER, SEND_REMINDER} from "../../../../../configs/AppConfig";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import {adminUpdatePreferenceData} from "../../../../../services/AdminService";
import {Lang} from "../../../../../lang";

function AdminClientNotification(props) {
    let {client} = useParams();
    const [envelopeActivity, setEnvelopeActivity] = useState(1);
    const [envelopeCompleted, setEnvelopeCompleted] = useState(1);
    const [envelopeDueDate, setEnvelopeDueDate] = useState(1);
    const [messageReceivedRecipients, setMessageReceivedRecipients] = useState(1);
    const [recipientFirstViewed, setRecipientFirstViewed] = useState(1);
    const [envelopeSend, setEnvelopeSend] = useState(1);
    const [envelopeResend, setEnvelopeResend] = useState(1);
    const [sendReminderOption, setSendReminderOption] = useState(0);
    const [sendReminder, setSendReminder] = useState(1);
    const [overdueReminderOption, setOverdueReminderOption] = useState(0);
    const [overdueReminder, setOverdueReminder] = useState(1);
    const [messageReceivedSender, setMessageReceivedSender] = useState(1);
    const [requestRejected, setRequestRejected] = useState(1);

    useEffect(function () {
        setEnvelopeActivity((props?.preferenceData.sender_envelope_activity) ? parseInt(props?.preferenceData.sender_envelope_activity) : 1);
        setEnvelopeCompleted((props?.preferenceData.sender_envelope_complete) ? parseInt(props?.preferenceData.sender_envelope_complete) : 1);
        setEnvelopeDueDate((props?.preferenceData.sender_envelope_due_date) ? parseInt(props?.preferenceData.sender_envelope_due_date) : 1);
        setMessageReceivedRecipients((props?.preferenceData.sender_message_received) ? parseInt(props?.preferenceData.sender_message_received) : 1);
        setRecipientFirstViewed((props?.preferenceData.sender_recipient_view) ? parseInt(props?.preferenceData.sender_recipient_view) : 1);

        setEnvelopeSend((props?.preferenceData.recipient_envelope_send) ? parseInt(props?.preferenceData.recipient_envelope_send) : 1);
        setEnvelopeResend((props?.preferenceData.recipient_envelope_resend) ? parseInt(props?.preferenceData.recipient_envelope_resend) : 1);
        setSendReminderOption((props?.preferenceData.recipient_send_reminder_type) ? parseInt(props?.preferenceData.recipient_send_reminder_type) : 0);
        setSendReminder((props?.preferenceData.recipient_send_reminder) ? parseInt(props?.preferenceData.recipient_send_reminder) : 1);
        setOverdueReminderOption((props?.preferenceData.recipient_overdue_reminder_type) ? parseInt(props?.preferenceData.recipient_overdue_reminder_type) : 0);
        setOverdueReminder((props?.preferenceData.recipient_overdue_reminder) ? parseInt(props?.preferenceData.recipient_overdue_reminder) : 1);
        setMessageReceivedSender((props?.preferenceData.recipient_message_received) ? parseInt(props?.preferenceData.recipient_message_received) : 1);
        setRequestRejected((props?.preferenceData.recipient_request_rejected) ? parseInt(props?.preferenceData.recipient_request_rejected) : 1);

    }, [props?.preferenceData]);

    const handleNotification = (e, type) => {

        let envelopeActivityValue = envelopeActivity;
        let envelopeCompletedValue = envelopeCompleted;
        let envelopeDueDateValue = envelopeDueDate;
        let messageReceivedRecipientsValue = messageReceivedRecipients;
        let recipientFirstViewedValue = recipientFirstViewed;
        let envelopeSendValue = envelopeSend;
        let envelopeResendValue = envelopeResend;
        let sendReminderOptionValue = sendReminderOption;
        let sendReminderValue = sendReminder;
        let overdueReminderOptionValue = overdueReminderOption;
        let overdueReminderValue = overdueReminder;
        let messageReceivedSenderValue = messageReceivedSender;
        let requestRejectedValue = requestRejected;

        if (type === 'sender_envelope_activity') {
            setEnvelopeActivity((e.target.checked === true) ? 1 : 0);
            envelopeActivityValue = (e.target.checked === true) ? 1 : 0;
        } else if (type === 'sender_envelope_complete') {
            setEnvelopeCompleted((e.target.checked === true) ? 1 : 0);
            envelopeCompletedValue = (e.target.checked === true) ? 1 : 0;
        } else if (type === 'sender_envelope_due_date') {
            setEnvelopeDueDate((e.target.checked === true) ? 1 : 0);
            envelopeDueDateValue = (e.target.checked === true) ? 1 : 0;
        } else if (type === 'sender_message_received') {
            setMessageReceivedRecipients((e.target.checked === true) ? 1 : 0);
            messageReceivedRecipientsValue = (e.target.checked === true) ? 1 : 0;
        } else if (type === 'sender_recipient_view') {
            setRecipientFirstViewed((e.target.checked === true) ? 1 : 0);
            recipientFirstViewedValue = (e.target.checked === true) ? 1 : 0;
        } else if (type === 'recipient_envelope_send') {
            setEnvelopeSend((e.target.checked === true) ? 1 : 0);
            envelopeSendValue = (e.target.checked === true) ? 1 : 0;
        } else if (type === 'recipient_envelope_resend') {
            setEnvelopeResend((e.target.checked === true) ? 1 : 0);
            envelopeResendValue = (e.target.checked === true) ? 1 : 0;
        } else if (type === 'recipient_send_reminder_type') {
            setSendReminderOption(parseInt(e.target.value));
            sendReminderOptionValue = parseInt(e.target.value);
        } else if (type === 'recipient_send_reminder') {
            setSendReminder((e.target.checked === true) ? 1 : 0);
            sendReminderValue = (e.target.checked === true) ? 1 : 0;
        } else if (type === 'recipient_overdue_reminder_type') {
            setOverdueReminderOption(parseInt(e.target.value));
            overdueReminderOptionValue = parseInt(e.target.value);
        } else if (type === 'recipient_overdue_reminder') {
            setOverdueReminder((e.target.checked === true) ? 1 : 0);
            overdueReminderValue = (e.target.checked === true) ? 1 : 0;
        } else if (type === 'recipient_message_received') {
            setMessageReceivedSender((e.target.checked === true) ? 1 : 0);
            messageReceivedSenderValue = (e.target.checked === true) ? 1 : 0;
        } else if (type === 'recipient_request_rejected') {
            setRequestRejected((e.target.checked === true) ? 1 : 0);
            requestRejectedValue = (e.target.checked === true) ? 1 : 0;
        }

        props.setLoading(true);

        let updateList = [
            {slug: 'sender_envelope_activity', value: envelopeActivityValue},
            {slug: 'sender_envelope_complete', value: envelopeCompletedValue},
            {slug: 'sender_envelope_due_date', value: envelopeDueDateValue},
            {slug: 'sender_message_received', value: messageReceivedRecipientsValue},
            {slug: 'sender_recipient_view', value: recipientFirstViewedValue},
            {slug: 'recipient_envelope_send', value: envelopeSendValue},
            {slug: 'recipient_envelope_resend', value: envelopeResendValue},
            {slug: 'recipient_send_reminder_type', value: sendReminderOptionValue},
            {slug: 'recipient_send_reminder', value: sendReminderValue},
            {slug: 'recipient_overdue_reminder_type', value: overdueReminderOptionValue},
            {slug: 'recipient_overdue_reminder', value: overdueReminderValue},
            {slug: 'recipient_message_received', value: messageReceivedSenderValue},
            {slug: 'recipient_request_rejected', value: requestRejectedValue},
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
    };

    return (
        <div className="tab-pane  p-4 active" id="Notification-detail" role="tabpanel" aria-labelledby="Notification">
            <div className="table-responsive mb-3">
                <table className="table mb-0 in_progress_table shadow-sm mb-4">
                    <thead>
                    <tr className="bg_blue">
                        <th>Details</th>
                        <th style={{width: '12%'}}>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr style={{backgroundColor: '#f4f4f4'}}>
                        <td colSpan="2" className="text-primary font_bold"
                            ref={(el) => el && el.style.setProperty('padding', '10px 25px', "important")}>To Sender
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="font_bold mb-2">Envelope Activity</p>
                            {Lang.notification_envelope_activity}
                        </td>
                        <td>
                            <div className="form-check form-switch">
                                <input className="form-check-input" checked={envelopeActivity}
                                       onChange={(e) => handleNotification(e, 'sender_envelope_activity')}
                                       type="checkbox" role="switch"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="font_bold mb-2">Envelope Completed</p>
                            Send email to the sender when all requests in an envelope have saved or the “Finish
                            & Send” button is clicked.
                        </td>
                        <td>
                            <div className="form-check form-switch">
                                <input className="form-check-input" checked={envelopeCompleted}
                                       onChange={(e) => handleNotification(e, 'sender_envelope_complete')}
                                       type="checkbox" role="switch"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="font_bold mb-2">Envelope Due Date</p>
                            Send email to the sender on the day that an envelope is due.
                        </td>
                        <td>
                            <div className="form-check form-switch">
                                <input className="form-check-input" checked={envelopeDueDate}
                                       onChange={(e) => handleNotification(e, 'sender_envelope_due_date')}
                                       type="checkbox" role="switch"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="font_bold mb-2">Message received from the recipients</p>
                            Send email to the sender when a new message received from the recipient
                        </td>
                        <td>
                            <div className="form-check form-switch">
                                <input className="form-check-input" checked={messageReceivedRecipients}
                                       onChange={(e) => handleNotification(e, 'sender_message_received')}
                                       type="checkbox" role="switch"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="font_bold mb-2">Recipient First Viewed</p>
                            Send email to the sender when an envelope is first viewed by it’s recipient.
                        </td>
                        <td>
                            <div className="form-check form-switch">
                                <input className="form-check-input" checked={recipientFirstViewed}
                                       onChange={(e) => handleNotification(e, 'sender_recipient_view')}
                                       type="checkbox" role="switch"/>
                            </div>
                        </td>
                    </tr>
                    <tr style={{backgroundColor: '#f4f4f4'}}>
                        <td colSpan="2" className="text-primary font_bold"
                            ref={(el) => el && el.style.setProperty('padding', '10px 25px', "important")}>To Recipients
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="font_bold mb-2">Envelope Send</p>
                            Send email to your recipient when an envelope is sent to them.
                        </td>
                        <td>
                            <div className="form-check form-switch">
                                <input className="form-check-input" checked={envelopeSend}
                                       onChange={(e) => handleNotification(e, 'recipient_envelope_send')}
                                       type="checkbox" role="switch"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="font_bold mb-2">Envelope Resend</p>
                            Send email to your recipient when an envelope is resent to them.
                        </td>
                        <td>
                            <div className="form-check form-switch">
                                <input className="form-check-input" checked={envelopeResend}
                                       onChange={(e) => handleNotification(e, 'recipient_envelope_resend')}
                                       type="checkbox" role="switch"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="font_bold mb-2">Send Reminder</p>
                            Send email reminder email to your recipient when an envelope is almost due.
                            <select className="form-select w-100 mt-3" value={sendReminderOption}
                                    onChange={(e) => handleNotification(e, 'recipient_send_reminder_type')}
                                    style={{maxWidth: '370px'}}>
                                {SEND_REMINDER.map((item, index) =>
                                    <option key={index} value={item.id}>{item.value}</option>
                                )}
                            </select>
                        </td>
                        <td>
                            <div className="form-check form-switch">
                                <input className="form-check-input" checked={sendReminder}
                                       onChange={(e) => handleNotification(e, 'recipient_send_reminder')}
                                       type="checkbox" role="switch"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="font_bold mb-2">Overdue Reminder</p>
                            Send email to your recipient when an envelope is overdue (upto two weeks).
                            <select className="form-select w-100 mt-3" value={overdueReminderOption}
                                    onChange={(e) => handleNotification(e, 'recipient_overdue_reminder_type')}
                                    style={{maxWidth: '370px'}}>
                                {OVERDUE_REMINDER.map((item, index) =>
                                    <option key={index} value={item.id}>{item.value}</option>
                                )}
                            </select>
                        </td>
                        <td>
                            <div className="form-check form-switch">
                                <input className="form-check-input" checked={overdueReminder}
                                       onChange={(e) => handleNotification(e, 'recipient_overdue_reminder')}
                                       type="checkbox" role="switch"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="font_bold mb-2">Message Received from the sender </p>
                            Send email to the recipient when a new message received from the sender
                        </td>
                        <td>
                            <div className="form-check form-switch">
                                <input className="form-check-input" checked={messageReceivedSender}
                                       onChange={(e) => handleNotification(e, 'recipient_message_received')}
                                       type="checkbox" role="switch"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="font_bold mb-2">Request Rejected</p>
                            Send email to your recipient when a request is rejected.
                        </td>
                        <td>
                            <div className="form-check form-switch">
                                <input className="form-check-input" checked={requestRejected}
                                       onChange={(e) => handleNotification(e, 'recipient_request_rejected')}
                                       type="checkbox" role="switch"/>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminClientNotification;