import React, {useState, useEffect} from "react";
import EnvelopeStepWizard from "../../partials/EnvelopeStepWizard";
import EnvelopeStep1 from "./Step1";
import EnvelopeStep2 from "./Step2";
import EnvelopeStep3 from "./Step3";
import EnvelopeStep4 from "./Step4";
import {
    checkTemplatePost,
    getEnvelopeDetail,
    getEnvelopeSenderList,
    getPreferenceData, postCloudList
} from "../../../../services/CommonService";
import {useParams} from 'react-router-dom';
import {toast} from "react-toastify";
import Utils from "../../../../utils";

function EnvelopeCreate() {
    const [loading, setLoading] = useState(false);
    const [senderList, setSenderList] = useState([]);
    const [isCall, setIsCall] = useState(false);
    const [isTemplate, setIsTemplate] = useState(false);
    const {uuid, id, direct} = useParams();

    let formData = {
        current_step: (id) ? id : 1,
        envelope_id: 0,
        envelope_uuid: '',
        sender_id: 0,
        envelope_name: '',
        envelope_date: '',
        client_message: '',
        recipient_List: [],
        subject: '',
        email_text: '',
        documents: [],
        fill_forms: [],
        is_done: false,
        send_envelope_by: 1,
        sms_type: 1,
        name_convention: 1,
        cloud_sync: 0,
        send_reminder: 0,
        over_due_reminder: 0,
        password: '',
        reference_id: '',
        sync_status_list: [],
        is_use: false,
        sign_documents: []
    };
    const [formObj, setFormObj] = useState(formData);

    useEffect(function () {
        getEnvelopeSenderList()
            .then(response => {
                setSenderList(response.data.data);
            })
            .catch(err => {
            });
    }, []);

    useEffect(function () {
        checkTemplatePost({})
            .then(response => {
                setIsTemplate(response.data.is_template);
            })
            .catch(err => {
            });
    }, []);

    useEffect(function () {
        let envelopeData = {...formObj};
        if (uuid && !envelopeData.envelope_uuid) {
            setLoading(true);
            postCloudList({})
                .then(response => {
                    envelopeData.sync_status_list = response.data.data;

                    getEnvelopeDetail({uuid: uuid})
                        .then(response => {
                            let data = response.data.data;
                            envelopeData.envelope_id = data.id;
                            envelopeData.envelope_uuid = data.uuid;
                            envelopeData.sender_id = parseInt(data.sender_id);
                            envelopeData.envelope_name = data.envelope_name;
                            envelopeData.envelope_date = data.envelope_date;
                            envelopeData.client_message = data.message;
                            envelopeData.recipient_List = data.recipient_list;
                            envelopeData.subject = data.email_subject;
                            envelopeData.email_text = data.email_text;
                            envelopeData.documents = data.documents;
                            envelopeData.fill_forms = data.fill_forms;
                            envelopeData.name_convention = (data.name_convention) ? data.name_convention : 1;
                            envelopeData.cloud_sync = data.cloud_sync;
                            envelopeData.send_reminder = data.send_reminder;
                            envelopeData.over_due_reminder = data.over_due_reminder;
                            envelopeData.password = (data.password) ? data.password : '';
                            envelopeData.reference_id = (data.reference_id) ? data.reference_id : '';
                            envelopeData.send_envelope_by = (data.sender_by) ? data.sender_by : 1;
                            envelopeData.sms_type = (data.sms_type) ? data.sms_type : 1;
                            envelopeData.sign_documents = data.sign_documents;
                            if (direct) {
                                envelopeData.is_use = true;
                            }
                            setFormObj(envelopeData);
                            setLoading(false);
                            setIsCall(true);
                        })
                        .catch(err => {
                            toast.error(Utils.getErrorMessage(err));
                            setLoading(false);
                            setIsCall(true);
                        });
                })
                .catch(err => {
                    setLoading(false);
                    setIsCall(true);
                });
        } else {
            if (isCall === false) {
                setLoading(true);
                postCloudList({})
                    .then(response => {
                        envelopeData.sync_status_list = response.data.data;

                        getPreferenceData({})
                            .then(response => {
                                if (response.data.data) {
                                    envelopeData.client_message = response.data.data.client_portal_message;
                                    envelopeData.subject = response.data.data.email_subject;
                                    envelopeData.email_text = response.data.data.email_message;
                                    envelopeData.name_convention = parseInt(response.data.data.default_naming_convention);
                                    envelopeData.cloud_sync = (response.data.data.default_cloud_storage) ? parseInt(response.data.data.default_cloud_storage) : 0;
                                    envelopeData.send_reminder = parseInt(response.data.data.recipient_send_reminder_type);
                                    envelopeData.over_due_reminder = parseInt(response.data.data.recipient_overdue_reminder_type);
                                    envelopeData.reference_id = response.data.data.default_reference_id;
                                    setFormObj(envelopeData);
                                }
                                setIsCall(true);
                                setLoading(false);
                            })
                            .catch(err => {
                                setIsCall(true);
                                setLoading(false);
                            });
                    })
                    .catch(err => {
                        setLoading(false);
                        setIsCall(true);
                    });
            }
        }
    }, [uuid, formObj, direct, isCall]);

    const renderStep = (step) => {
        if (parseInt(step) === 1) {
            return <EnvelopeStep1 senderList={senderList} formObj={formObj} setFormObj={setFormObj}
                                  setLoading={setLoading}/>

        } else if (parseInt(step) === 2) {
            return <EnvelopeStep2 formObj={formObj} setFormObj={setFormObj} setLoading={setLoading}/>

        } else if (parseInt(step) === 3) {
            return <EnvelopeStep3 senderList={senderList} formObj={formObj} setFormObj={setFormObj}
                                  setLoading={setLoading} isTemplate={isTemplate}/>

        } else if (parseInt(step) === 4) {
            return <EnvelopeStep4 senderList={senderList} formObj={formObj} setFormObj={setFormObj}
                                  setLoading={setLoading} isTemplate={isTemplate}/>
        }
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <section className="main_wrapper background_grey_400 detail_page"
                     style={{minHeight: 'calc(100vh - 119px)'}}>
                <EnvelopeStepWizard step={formObj.current_step} isDone={formObj.is_done}/>

                {renderStep(formObj.current_step)}

            </section>
        </>
    );
}

export default EnvelopeCreate;