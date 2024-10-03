import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import EnvelopeRecipients from "./Recipients";
import {
    envelopeFinish,
    getEnvelopeDocumentDetail,
    getEnvelopeRequestInformationDetail,
    removeEnvelopeDocument,
    removeEnvelopeRequestForm,
    removeEnvelopeSignDocument
} from "../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../utils";
import EnvelopeDocument from "./Document";
import EnvelopeRequestForm from "./RequestForm";
import SearchRecipient from "./SearchRecipient";
import {
    DATE_FORMAT_LIST,
    NAME_CONVENTION,
    OVERDUE_REMINDER,
    PASSWORD_LIST,
    SEND_REMINDER, SMS_SENDER_LIST, PER_SMS_AMOUNT,
    SYNC_STATUS
} from "../../../../configs/AppConfig";
import DocFormTemplate from "./DocFormTemplate";
import AddEnvelopeTemplate from "../Manage/AddEnvelopeTemplate";

//Sign Feature
//import DocFormSelectionPopup from "./DocFormSelectionPopup";
import PdfUploadPopup from "./PdfUploadPopup";
import MakeFillablePopup from "./MakeFillablePopup";

import {Lang} from "../../../../lang";
import DatePicker from "react-datepicker";
import {default as ReactSelect} from "react-select";
import {components} from "react-select";

function EnvelopeStep4(props) {
    const navigate = useNavigate();
    const [senderList, setSenderList] = useState([]);
    const [sendEnvelopeBy, setSendEnvelopeBy] = useState(1);
    const [smsType, setSmsType] = useState(1);
    const [smsAmount, setSmsAmount] = useState(0);
    const [envelopeSenderId, setEnvelopeSenderId] = useState(0);
    const [pastDate, setPastDate] = useState(new Date());
    const [envelopeName, setEnvelopeName] = useState('');
    const [envelopeDate, setEnvelopeDate] = useState('');
    const [clientMessage, setClientMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [emailText, setEmailText] = useState('');
    const [isInvited, setIsInvited] = useState(0);
    const [isEditRecipient, setIsEditRecipient] = useState(false);
    const [isEditDocument, setIsEditDocument] = useState(false);
    const [isEditRequestForm, setIsEditRequestForm] = useState(false);
    const [isEditSignDocumentForm, setIsEditSignDocumentForm] = useState(false);
    const [isAddTemplate, setAddTemplate] = useState(false);

    const [nameConvention, setNameConvention] = useState(1);
    const [syncStatusList, setSyncStatusList] = useState(SYNC_STATUS);
    const [cloudSync, setCloudSync] = useState([]);
    const [sendReminder, setSendReminder] = useState(0);
    const [overdueReminder, setOverdueReminder] = useState(0);
    const [isPassword, setIsPassword] = useState(0);
    const [password, setPassword] = useState('');
    const [referenceId, setReferenceId] = useState('');
    const [nameConventionText, setNameConventionText] = useState('');
    const [cloudSyncText, setCloudSyncText] = useState([]);
    const [sendReminderText, setSendReminderText] = useState('');
    const [overdueReminderText, setOverdueReminderText] = useState('');
    const [passwordText, setPasswordText] = useState('');
    const [referenceText, setReferenceText] = useState('');

    const [signatureDocumentData, setSignatureDocumentData] = useState(null);
    const [directMakeFillableOpen, setDirectMakeFillableOpen] = useState(false);
    
    
    const btnSignDocumentPopup = useRef(null);
    const addTemplateRef = useRef(null);
    const clsAddTemplateRef = useRef(null);
    const openCheckSMSCreditRef = useRef(null);
    const openCloudStorageRef = useRef(null);
    const dueDateRef = useRef(null);
    const signDragItem = useRef();
    const signDragOverItem = useRef();

    const [makeFillable, setMakeFillable] = useState(false);

    const [isAdditionalSetting, setIsAdditionalSetting] = useState(false);

    const [deleteEnvelope, setDeleteEnvelope] = useState({id: 0, name: ''});

    const [recipientData, setRecipientData] = useState({
        id: 0,
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        country_id: 13,
        company_name: "",
        address_1: "",
        address_2: "",
        city: "",
        state: "",
        address_country_id: "",
        zipcode: "",
    });

    const [docData, setDocData] = useState({
        id: 0,
        request_id: 0,
        doc_name: "",
        doc_detail: "",
        documents: [],
        date_format: 0
    });

    const [requestFormData, setRequestFormData] = useState({
        id: 0,
        request_id: 0,
        form_name: "",
        form_questions: []
    });

    let errorsObj = {
        sender_id: "",
        envelope_name: "",
        envelope_date: "",
        client_message: "",
        recipient: "",
        subject: "",
        email_text: "",
        documents: "",
        fill_forms: "",
        sign_documents: "",
        password: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const [fromTemplate, setFromTemplate] = useState(1);
    const [isUseFromTemplate, setIsUseFromTemplate] = useState(false);

    const btnDocument = useRef(null);
    const btnRequestForm = useRef(null);
    const docDragItem = useRef();
    const docDragOverItem = useRef();
    const formDragItem = useRef();
    const formDragOverItem = useRef();
    const buttonRef = useRef(null);

    useEffect(() => {
        setPastDate(Utils.pastDate());

        if (props?.senderList.length > 0) {
            setSenderList(props.senderList);
        }
        setSendEnvelopeBy((props.formObj.send_envelope_by) ? parseInt(props.formObj.send_envelope_by) : '');
        setEnvelopeSenderId((props.formObj.sender_id) ? props.formObj.sender_id : '');
        setEnvelopeName((props.formObj.envelope_name) ? props.formObj.envelope_name : '');
        setEnvelopeDate((props.formObj.envelope_date) ? props.formObj.envelope_date : '');
        setClientMessage((props.formObj.client_message) ? props.formObj.client_message : '');
        setSubject((props.formObj.subject) ? props.formObj.subject : '');
        setEmailText((props.formObj.email_text) ? props.formObj.email_text : '');

        setSmsType((props.formObj.sms_type) ? parseInt(props.formObj.sms_type) : 1);
        let smsIndex = SMS_SENDER_LIST.findIndex(x => x.id === parseInt(props.formObj.sms_type));
        if (smsIndex > -1) {
            setSmsAmount(SMS_SENDER_LIST[smsIndex]['amount'] * props.formObj.recipient_List.length);
        }

        let ncId = (props.formObj.name_convention) ? props.formObj.name_convention : 1;
        let ncIndex = NAME_CONVENTION.findIndex(x => parseInt(x.id) === parseInt(ncId));
        if (ncIndex > -1) {
            setNameConventionText(NAME_CONVENTION[ncIndex]['value']);
        }
        setNameConvention(parseInt(ncId));
        let csId = (props.formObj.cloud_sync) ? props.formObj.cloud_sync : 0;
        const array = String(csId).split(",").map(Number);

        if (props.formObj.sync_status_list && props.formObj.sync_status_list.length > 0) {
            setSyncStatusList(props.formObj.sync_status_list);
            const csIndex = array.map((value) =>
                props.formObj.sync_status_list.find(x => parseInt(x.id) === value)
            );
            setCloudSyncText(csIndex.map((value) => value.value));
            // if (csIndex > -1) {
            //     setCloudSyncText(props.formObj.sync_status_list[csIndex]['value']);
            // }
            setCloudSync(csIndex.map((value) => value));
        }

        if (parseInt(props.formObj.send_reminder) > -1) {
            let srIndex = SEND_REMINDER.findIndex(x => parseInt(x.id) === parseInt(props.formObj.send_reminder));
            if (srIndex > -1) {
                setSendReminderText(SEND_REMINDER[srIndex]['value']);
            }
            setSendReminder(props.formObj.send_reminder);
        }

        if (parseInt(props.formObj.over_due_reminder) > -1) {
            let orIndex = OVERDUE_REMINDER.findIndex(x => parseInt(x.id) === parseInt(props.formObj.over_due_reminder));
            if (orIndex > -1) {
                setOverdueReminderText(OVERDUE_REMINDER[orIndex]['value']);
            }
            setOverdueReminder(props.formObj.over_due_reminder);
        }

        if (props.formObj.password) {
            setPasswordText('Yes');
            setIsPassword(1);
            setPassword(props.formObj.password);
        } else {
            setPasswordText('No');
            setIsPassword(0);
        }

        if (props.formObj.reference_id) {
            setReferenceText(props.formObj.reference_id);
            setReferenceId(props.formObj.reference_id);
        }

        if (props.formObj.is_use) {
            setIsEditRecipient(true);
            setIsEditDocument(true);
            setIsEditRequestForm(true);
            setIsAdditionalSetting(true);
        }

    }, [props]);

    const docDragStart = (e, position) => {
        docDragItem.current = position;
    };

    const docDragEnter = (e, position) => {
        docDragOverItem.current = position;
    };

    const formDragStart = (e, position) => {
        formDragItem.current = position;
    };

    const formDragEnter = (e, position) => {
        formDragOverItem.current = position;
    };

    const signDragStart = (e, position) => {
        signDragItem.current = position;
    };

    const signDragEnter = (e, position) => {
        signDragOverItem.current = position;
    };

    const signDrop = (e) => {
        const formData = {...props.formObj};
        const copyListItems = [...formData.sign_documents];
        const dragItemContent = copyListItems[signDragItem.current];
        copyListItems.splice(signDragItem.current, 1);
        copyListItems.splice(signDragOverItem.current, 0, dragItemContent);
        signDragItem.current = null;
        signDragOverItem.current = null;
        formData.sign_documents = copyListItems;
        props.setFormObj(formData);
    };


    const docDrop = (e) => {
        const formData = {...props.formObj};
        const copyListItems = [...formData.documents];
        const dragItemContent = copyListItems[docDragItem.current];
        copyListItems.splice(docDragItem.current, 1);
        copyListItems.splice(docDragOverItem.current, 0, dragItemContent);
        docDragItem.current = null;
        docDragOverItem.current = null;
        formData.documents = copyListItems;
        props.setFormObj(formData);
    };

    const onRequestFormEdit = (e, data) => {
        e.preventDefault();
        props.setLoading(true);
        let obj = {
            id: data.id,
        };
        getEnvelopeRequestInformationDetail(obj)
            .then((response) => {
                let formData = {...requestFormData};
                formData.id = response.data.data.id;
                formData.request_id = response.data.data.request_id;
                formData.form_name = response.data.data.form_name;
                formData.form_questions = response.data.data.questions;
                setRequestFormData(formData);
                btnRequestForm.current?.click();
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const onRequestClone = (e, data) => {
        e.preventDefault();
        props.setLoading(true);
        let obj = {
            id: data.id,
        };
        getEnvelopeRequestInformationDetail(obj)
            .then((response) => {
                let formData = {...requestFormData};
                formData.id = 0;
                formData.request_id = response.data.data.request_id;
                formData.form_name = response.data.data.form_name;
                let questionList = response.data.data.questions;
                for (let i = 0; i < questionList.length; i++) {
                    questionList[i]['id'] = 0;
                    for (let j = 0; j < questionList[i]['options'].length; j++) {
                        questionList[i]['options'][j]['id'] = 0;
                    }
                }
                formData.form_questions = questionList;
                setRequestFormData(formData);
                btnRequestForm.current?.click();
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const onRequestFormDelete = (e, data) => {
        e.preventDefault();

        props.setLoading(true);
        let obj = {
            id: data.id,
        };
        removeEnvelopeRequestForm(obj)
            .then((response) => {
                let envelopeData = {...props.formObj};
                let index = envelopeData.fill_forms.findIndex((x) => x.id === obj.id);
                envelopeData.fill_forms.splice(index, 1);
                props.setFormObj(envelopeData);
                toast.success(response.data.message);
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const onDocumentEdit = (e, data) => {
        e.preventDefault();
        props.setLoading(true);
        let obj = {
            id: data.id,
        };
        getEnvelopeDocumentDetail(obj)
            .then((response) => {
                let formData = {...docData};
                formData.id = response.data.data.id;
                formData.request_id = response.data.data.request_id;
                formData.doc_name = response.data.data.doc_name;
                formData.doc_detail = response.data.data.doc_detail;
                let files = [];
                for (let i = 0; i < response.data.data.files.length; i++) {
                    files.push({
                        id: response.data.data.files[i]["id"],
                        name: response.data.data.files[i]["file_name"],
                        kb: response.data.data.files[i]["file_size"],
                        path: response.data.data.files[i]["file_path"],
                        file: "",
                    });
                }
                formData.documents = files;
                formData.date_format = response.data.data.date_format;
                setDocData(formData);
                btnDocument.current?.click();
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const onDocumentClone = (e, data) => {
        e.preventDefault();
        props.setLoading(true);
        let obj = {
            id: data.id,
        };
        getEnvelopeDocumentDetail(obj)
            .then((response) => {
                let formData = {...docData};
                formData.id = 0;
                formData.request_id = response.data.data.request_id;
                formData.doc_name = response.data.data.doc_name;
                formData.doc_detail = response.data.data.doc_detail;
                formData.documents = [];
                formData.date_format = response.data.data.date_format;
                setDocData(formData);
                btnDocument.current?.click();
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const onDocumentDelete = (e, data) => {
        e.preventDefault();

        props.setLoading(true);
        let obj = {
            id: data.id,
        };
        removeEnvelopeDocument(obj)
            .then((response) => {
                let envelopeData = {...props.formObj};
                let index = envelopeData.documents.findIndex((x) => x.id === obj.id);
                envelopeData.documents.splice(index, 1);
                props.setFormObj(envelopeData);
                toast.success(response.data.message);
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    const formDrop = (e) => {
        const formData = {...props.formObj};
        const copyListItems = [...formData.fill_forms];
        const dragItemContent = copyListItems[formDragItem.current];
        copyListItems.splice(formDragItem.current, 1);
        copyListItems.splice(formDragOverItem.current, 0, dragItemContent);
        formDragItem.current = null;
        formDragOverItem.current = null;
        formData.fill_forms = copyListItems;
        props.setFormObj(formData);
    };

    function onBack(e) {
        e.preventDefault();
        const formData = {...props.formObj};
        formData.current_step = 3;
        formData.is_use = false;
        props.setFormObj(formData);
        navigate('/client-portal/envelope/edit/' + formData.envelope_uuid + '/3');
    }

    const cloudeStoragehandleChange = (selectedValues) => {
        if (selectedValues.length > 0) {
            let index = selectedValues.length - 1;
            if (selectedValues[index].id === 0) {
                setCloudSync([{id: 0, value: "Disabled"}]);
            } else {
                let idx = selectedValues.findIndex(x => x.id === 0);
                if (idx > -1) {
                    selectedValues.splice(idx, 1);
                }
                setCloudSync(selectedValues);
            }
        } else {
            setCloudSync([{id: 0, value: "Disabled"}]);
        }

    };
    const customStyles = {
        option: (defaultStyles, state) => ({
            ...defaultStyles,
            color: state.isSelected ? "white" : "#fff",
            backgroundColor: "white",
            height: "40px"
        }),
    };

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                        style={{marginTop: "-10px"}}
                    />
                    <label style={{marginTop: "3px", marginLeft: 8, position: "absolute"}}>{props.label}</label>
                </components.Option>
            </div>
        );
    };


    async function onSubmitForm(e, type) {
        e.preventDefault();
        let error = false;
        let errorObj = {...errorsObj};
        let envelopeFormData = {...props.formObj};
        if (!envelopeSenderId) {
            errorObj.sender_id = "Please select sender";
            error = true;
        }
        if (!envelopeName) {
            errorObj.envelope_name = "Envelope name must be required";
            error = true;
        }
        if (!envelopeDate) {
            errorObj.envelope_date = "Please select date";
            error = true;
        }
        if (!clientMessage) {
            errorObj.client_message = "Please enter message";
            error = true;
        }
        if (envelopeFormData.recipient_List.length === 0) {
            errorObj.recipient = "Please add recipient";
            error = true;
        }
        if (!subject) {
            errorObj.subject = "Subject must be required";
            error = true;
        }
        if (!emailText) {
            errorObj.email_text = "Email text must be required";
            error = true;
        }
        //if (envelopeFormData.documents.length === 0 && envelopeFormData.sign_documents.length === 0) {
        if (envelopeFormData.documents.length === 0 && envelopeFormData.fill_forms.length === 0 && envelopeFormData.sign_documents.length === 0) {
            errorObj.documents = "Please create document";
            error = true;
        }

        //Validation of check sign documents fillable or not.
        if (envelopeFormData.sign_documents.length !== 0){
            let isAllFillable = true;
            for (let i = 0; i < envelopeFormData.sign_documents.length; i++) {
                if(envelopeFormData.sign_documents[i].request_id === null){
                    isAllFillable = false;
                    break;
                }
            }
            if(isAllFillable === false){
                toast.error("Please make fillable sign request.");
                return false;
            }
        }
        
        /*
        if (envelopeFormData.sign_documents.length !== 0){
            let checkAnyOneFillable = false;
            for (let i = 0; i < envelopeFormData.sign_documents.length; i++) {
                if(envelopeFormData.sign_documents[i].request_id !== ""){
                    checkAnyOneFillable = true;
                    break;
                }
            }
            if(checkAnyOneFillable === false){
                toast.error("Please make fillable sign request.");
                return false;
            }
        }
        */

        if (parseInt(isPassword) === 1 && !password) {
            errorObj.password = 'Please enter password';
            error = true;
        }

        setErrors(errorObj);

        setTimeout(function () {
            let classList = document.getElementsByClassName('text-danger');
            if (classList.length > 0) {
                let scrollDiv = classList[0].getBoundingClientRect().top + window.scrollY - 200;
                window.scrollTo({top: scrollDiv, behavior: 'smooth'});
            }
        }, 0);

        if (error) return;

        let recipientIds = "";
        for (let i = 0; i < envelopeFormData.recipient_List.length; i++) {
            recipientIds += envelopeFormData.recipient_List[i]["id"];
            if (envelopeFormData.recipient_List.length !== i + 1) {
                recipientIds += ",";
            }
        }

        const cloudOption = (cloudSync.map((i) => i.id).join(','));

        envelopeFormData.submit_type = type;
        envelopeFormData.sender_id = envelopeSenderId;
        envelopeFormData.envelope_name = envelopeName;
        envelopeFormData.envelope_date = envelopeDate;
        envelopeFormData.client_message = clientMessage;
        envelopeFormData.subject = subject;
        envelopeFormData.email_text = emailText;
        envelopeFormData.recipient_ids = recipientIds;
        envelopeFormData.name_convention = nameConvention;
        envelopeFormData.cloud_sync = cloudOption;
        envelopeFormData.send_reminder = sendReminder;
        envelopeFormData.over_due_reminder = overdueReminder;
        envelopeFormData.reference_id = referenceId;

        if (parseInt(isPassword) === 1) {
            envelopeFormData.password = password;
        } else {
            envelopeFormData.password = '';
        }

        props.setLoading(true);

        let ipAddress = '';
        await Utils.getIpAddress().then(response => {
            ipAddress = response;
        });

        const {timeZone} = Intl.DateTimeFormat().resolvedOptions();
        envelopeFormData.time_zone = (timeZone) ? timeZone : '';
        envelopeFormData.ip_address = ipAddress;

        envelopeFinish(envelopeFormData)
            .then((response) => {
                if (type === 1) {
                    navigate("/manage/draft");
                    toast.success(response.data.message);
                } else {
                    envelopeFormData.is_done = true;
                    props.setFormObj(envelopeFormData);
                    setIsInvited(1);
                }
                props.setLoading(false);
            })
            .catch((err) => {
                props.setLoading(false);
                if (err.response.status === 411) {
                    openCheckSMSCreditRef?.current.click();
                } else if (err.response.status === 415) {
                    openCloudStorageRef?.current.click();
                } else {
                    toast.error(Utils.getErrorMessage(err));
                }
            });
    }

    function onRemoveRecipient(e, index) {
        e.preventDefault();
        const formData = {...props.formObj};
        formData.recipient_List.splice(index, 1);
        props.setFormObj(formData);
    }

    function onEditRecipient(e, obj) {
        e.preventDefault();
        let formData = {...recipientData};
        formData.id = obj.id;
        formData.first_name = obj.first_name;
        formData.last_name = obj.last_name;
        formData.email = obj.email;
        formData.mobile = obj.mobile;
        formData.country_id = obj.country_id;
        formData.company_name = obj.company_name;
        formData.address_1 = obj.address_1;
        formData.address_2 = obj.address_2;
        formData.city = obj.city;
        formData.state = obj.state;
        formData.address_country_id = obj.address_country_id;
        formData.zip_code = obj.zip_code;
        setRecipientData(formData);
        buttonRef.current?.click();
    }

    function onEnvelopeStart(e) {
        e.preventDefault();
        navigate("/client-portal");
    }

    function onViewEnvelope(e) {
        e.preventDefault();
        const envelopeFormData = {...props.formObj};
        navigate("/manage/" + envelopeFormData.envelope_uuid);
    }

    function onAddTemplate(e) {
        e.preventDefault();
        const envelopeFormData = {...props.formObj};
        setDeleteEnvelope({id: envelopeFormData.envelope_id, name: envelopeFormData.envelope_name});
    }

    const goToHome = (e) => {
        clsAddTemplateRef?.current.click();
        navigate("/client-portal");
    };

    const handlePassword = (e) => {
        setIsPassword(e.target.value);
        setPassword('');
    };

    const handleUseDocFormTemplate = (e, type) => {
        e.preventDefault();

        setFromTemplate(type);
        setIsUseFromTemplate(true);
    };

    const handleEnvInput = (e, type) => {
        
        let envelopeData = {...props.formObj};

        if (type === 'name') {
            setEnvelopeName(e.target.value);
            envelopeData.envelope_name = e.target.value;
        } else if (type === 'date') {
            setEnvelopeDate(e);
            envelopeData.envelope_date = e;
        } else if (type === 'message') {
            setClientMessage(e.target.value);
            envelopeData.client_message = e.target.value;
        } else if (type === 'subject') {
            setSubject(e.target.value);
            envelopeData.subject = e.target.value;
        } else if (type === 'email_text') {
            setEmailText(e.target.value);
            envelopeData.email_text = e.target.value;
        } else if (type === 'send_envelope_by') {
            envelopeData.send_envelope_by = e.target.value;
            if(e.target.value === "1"){
                setSmsType(1);
                setSmsAmount(0);
                envelopeData.sms_type = 1;
            }
        } else if (type === 'sms_type') {
            envelopeData.send_envelope_by = 2; // 2 use for selected email and SMS
            let smsTypeList = [...SMS_SENDER_LIST];
            let index = smsTypeList.findIndex(x => parseInt(x.id) === parseInt(e.target.value));
            if (index > -1) {
                setSmsAmount(smsTypeList[index]['amount'] * props.formObj.recipient_List.length);
            }
            envelopeData.sms_type = e.target.value;
        }

        props.setFormObj(envelopeData);
    };

    const showDate = (date) => {
        let dateFormat = '';
        if (date) {
            dateFormat = new Date(date);
        }
        return dateFormat;
    };

    const showDateFormat = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['format'];
        }
        return value;
    };

    const showDatePlaceholder = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['text'];
        }
        return value;
    };

    //SignDocument Functions
    const handleDownload = async (e, obj) => {
        e.preventDefault();
        props.setLoading(true);
        await Utils.downloadAnyFile(obj.path, obj.file_name);
        props.setLoading(false);
    };


    const onRequestSignDocumentDelete = (e, data) => {
        e.preventDefault();
        props.setLoading(true);
        let obj = {
            id: data.id,
        };
        removeEnvelopeSignDocument(obj)
            .then((response) => {
                let envelopeData = {...props.formObj};
                let index = envelopeData.sign_documents.findIndex((x) => x.id === obj.id);
                envelopeData.sign_documents.splice(index, 1);
                props.setFormObj(envelopeData);
                toast.success(response.data.message);
                props.setLoading(false);
            })
            .catch((err) => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };


    const onRequestSignDocumentRender = (e, data) => {
        console.log("Render make fillable form");
        e.preventDefault();

        const keysToRemove = ["mousePosition", "pagesPosition", "placeholders"];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        props.setLoading(true);
        setSignatureDocumentData(data);
        setMakeFillable(true);
        btnSignDocumentPopup.current?.click();

    };


    const handleMakeFillable = () => {
        let current = (makeFillable === false) ? true : false; 
        setMakeFillable(current);
    }
   

    useEffect(() => {
        const makeFillableAsync = async () => {
            if (directMakeFillableOpen === true) {
                const keysToRemove = ["mousePosition", "pagesPosition", "placeholders"];
                keysToRemove.forEach(key => localStorage.removeItem(key));
                await setMakeFillable(true);
                btnSignDocumentPopup.current?.click();
                setDirectMakeFillableOpen(false);
            }
        };
    
        makeFillableAsync(); // Call the async function
    }, [directMakeFillableOpen]);



    return (
        <>
            {isInvited === 1 &&
            <div className=" step_wizard_content invite_card_section">
                <div className=" container">
                    <div className="card invite_card">
                        <img src="/images/invite.png" alt="invite img" className="invite_img mb-5"/>
                        <label className="mb-4 text-center">Your Envelope has been successfully sent.</label>
                        <p className="mb-4 text-center">We will notify you when there is activity on the
                            Envelope.</p>
                        {!isAddTemplate &&
                        <p className="envelope_text w-100">
                            Add this Envelope in Templates & You can Use it Again.
                            <button type="button" className="btn add_recipients_btn ms-3"
                                    data-toggle="tooltip" title={Lang.env_add_to_template}
                                    data-bs-toggle="modal" data-bs-target="#AddEnvelopeTemplate"
                                    onClick={onAddTemplate}>Add to Templates</button>
                        </p>
                        }
                        <div className="mb-4 text-center">
                            <button className="modal_btn_outline me-3 mb-3" data-toggle="tooltip"
                                    title={Lang.env_view_envelope} onClick={onViewEnvelope}>View your Envelope
                            </button>
                            <button className="modal_btn" data-toggle="tooltip" title={Lang.env_create_another}
                                    onClick={onEnvelopeStart}>Create another Envelope
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            }
            {isInvited === 0 &&
            <>
                <div className=" step_wizard_content ">
                    <div className=" container">
                        <h2 className="main_title text_blue pb-0 margin_bottom ps-0">
                            Send Envelope By
                        </h2>
                        <div className="row mb-5 radio_select">
                            <div className="col-lg-6">
                                <label htmlFor="radio-card-1" className="radio-card">
                                    <input type="radio" name="radio-card" id="radio-card-1" value={1}
                                           checked={sendEnvelopeBy === 1}
                                           onChange={(e) => handleEnvInput(e, 'send_envelope_by')}/>
                                    <div className="card-content-wrapper">
                                        <div className="card-content">
                                            <span className="check-icon"/>
                                            <div>
                                                <label htmlFor="radio-card-1"
                                                       className="d-flex justify-content-between form_check flexWrap">
                                                    Email Only <span style={{fontSize: '16px'}}>1 Envelope Credit</span>
                                                </label>
                                                <label>Send Envelope Via Email Only. Recipients will receive Email -
                                                    Email will have link to upload the Documents.</label>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div className="col-lg-6">
                                <label htmlFor="radio-card-2" className="radio-card">
                                    <input type="radio" name="radio-card" id="radio-card-2" value={2}
                                           checked={sendEnvelopeBy === 2}
                                           onChange={(e) => handleEnvInput(e, 'send_envelope_by')}/>
                                    <div className="card-content-wrapper">
                                        <div className="card-content">
                                            <span className="check-icon"/>
                                            <div>
                                                <label htmlFor="radio-card-2"
                                                       className="d-flex justify-content-between form_check flexWrap">
                                                    Email and SMS 
                                                    {/* <span style={{fontSize: '16px'}}>1 Envelope Credit + ${smsAmount}/request</span> */}
                                                    <span style={{fontSize: '16px'}}>1 Envelope Credit + {Math.round(smsAmount / PER_SMS_AMOUNT)} SMS</span>
                                                </label>
                                                <label className="mb-3">Send Envelope Via Email & SMS. Recipients
                                                    will receive Email & SMS - Both will have link to upload the
                                                    Documents.</label>
                                                <label htmlFor="Select_two" className="form-label mb-1">
                                                    SMS Types
                                                    <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                       data-toggle="tooltip" data-placement="right"
                                                       title={Lang.env_sms_type}/>
                                                </label>
                                                <select className="form-select" aria-label="Default select example"
                                                        value={smsType} onChange={(e) => handleEnvInput(e, 'sms_type')}>
                                                    {SMS_SENDER_LIST.map((item, index) =>
                                                        <option key={index} value={item.id}>{item.value}</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <h2 className="main_title text_blue ps-0 pt-4">Envelope Sender</h2>
                        <div className="card mb-4 p-3">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="mb-0">
                                        <select className="form-select bg_blue border-0" value={envelopeSenderId}
                                                onChange={(e) => setEnvelopeSenderId(e.target.value)}
                                                aria-label="Default select example">
                                            <option value="0">Select envelope sender</option>
                                            {senderList && senderList.map((item, i) => (
                                                <option value={item.id}
                                                        key={i}>{item.first_name + " " + item.last_name + " (" + item.email + ")"}</option>
                                            ))}
                                        </select>
                                        {errors.sender_id && (
                                            <div className="text-danger">{errors.sender_id}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h2 className="main_title text_blue ps-0">Envelope Details</h2>
                        <div className="card mb-5">
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="mb-4">
                                        <label htmlFor="envelop_name" className="form-label mb-2">
                                            Envelope Name
                                            <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                               data-toggle="tooltip" data-placement="right"
                                               title={Lang.env_envelope_name}/>
                                        </label>
                                        <input type="text" className="form-control" id="envelop_name"
                                               onChange={(e) => handleEnvInput(e, 'name')}
                                               value={envelopeName}
                                               aria-describedby="emailHelp" placeholder="Enter Envelope Name"/>
                                        {errors.envelope_name && (
                                            <div className="text-danger">{errors.envelope_name}</div>)}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-4 position-relative">
                                        <label htmlFor="due_date" className="form-label mb-2">
                                            Due Date
                                            <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                               data-toggle="tooltip" data-placement="right"
                                               title={Lang.env_due_date}/>
                                        </label>
                                        <DatePicker
                                            selected={showDate(envelopeDate)}
                                            dateFormat={showDateFormat(1)}
                                            minDate={pastDate} ref={dueDateRef}
                                            className="form-control"
                                            placeholderText={showDatePlaceholder(1)}
                                            onChange={(date) => handleEnvInput(date, 'date')}/>
                                        <i className="fa fa-calendar"
                                           onClick={(e) => dueDateRef?.current.setFocus(true)}/>
                                        {errors.envelope_date && (
                                            <div className="text-danger">{errors.envelope_date}</div>)}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="mb-0">
                                        <label className="form-label mb-2">
                                            Client Portal Message
                                            <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                               data-toggle="tooltip" data-placement="right"
                                               title={Lang.env_client_message}/>
                                        </label>
                                        <textarea className="form-control" rows={10}
                                                  placeholder="Enter Message to Client"
                                                  onChange={(e) => handleEnvInput(e, 'message')}
                                                  value={clientMessage}/>
                                        {errors.client_message && (
                                            <div className="text-danger">{errors.client_message}</div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" mb-4 d-flex justify-content-between flex_wrap">
                            <h2 className="main_title ps-0 text_blue">Recipient Details</h2>
                            {isEditRecipient && (
                                <div className="d-flex flex_wrap">
                                    <button type="button" className="btn shadow load_template_btn me-2"
                                            data-bs-toggle="offcanvas" data-bs-target="#SearchRecipients"
                                            aria-controls="SearchRecipients" data-toggle="tooltip" title=""
                                            data-bs-original-title="click to Search">
                                        <i className="fa fa-search me-3"/> Search Recipients
                                    </button>

                                    <button type="button" className="btn shadow add_recipients_btn"
                                            data-bs-toggle="offcanvas" data-bs-target="#addRecipients"
                                            aria-controls="addRecipients" data-toggle="tooltip"
                                            title={Lang.env_add_recipient}
                                            ref={buttonRef}>
                                        <span className="me-3">+</span>Add Recipients
                                    </button>
                                </div>
                            )}
                            {!isEditRecipient && (
                                <span className="edit_box" onClick={(e) => setIsEditRecipient(true)}>
                                    <i className="fa fa-pencil me-1" aria-hidden="true"/> Edit
                                </span>
                            )}
                        </div>
                        <div className="card mb-5 p-3">
                            {props.formObj.recipient_List.map((item, index) => (
                                <div className="mb-3 recipients_data" key={index}>
                                    <span className="recipients_name">
                                        {item.first_name + " " + item.last_name}
                                    </span>
                                    <span className="recipients_mail">{item.email}</span>
                                    <span
                                        className="recipients_num">{Utils.mobileFormat(item)}</span>
                                    {isEditRecipient && (
                                        <span className="edit" onClick={(event) => {
                                            onEditRecipient(event, item)
                                        }}>
                                            <i className="fa fa-pencil" aria-hidden="true" data-toggle="tooltip"
                                               title="click to edit" data-bs-original-title="click to edit"/>
                                        </span>
                                    )}
                                    {isEditRecipient && (
                                        <span className="close_btn" onClick={(e) => onRemoveRecipient(e, index)}>
                                            <i className="fa fa-times-circle" aria-hidden="true" data-toggle="tooltip"
                                               title="click to delete" data-bs-original-title="click to delete"/>
                                        </span>
                                    )}
                                </div>
                            ))}
                            {errors.recipient && (<div className="text-danger">{errors.recipient}</div>)}
                        </div>

                        <h2 className="main_title text_blue ps-0">Email Details</h2>
                        <div className="card mb-5">
                            <div className="mb-4">
                                <label htmlFor="email_subject" className="form-label mb-2">
                                    Subject
                                    <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                       data-toggle="tooltip" data-placement="right" title={Lang.env_subject}/>
                                </label>
                                <input type="text" className="form-control" id="email_subject"
                                       aria-describedby="emailHelp" value={subject}
                                       onChange={(e) => handleEnvInput(e, 'subject')}
                                       placeholder="Enter Email Subject"/>
                                {errors.subject && (<div className="text-danger">{errors.subject}</div>)}
                            </div>
                            <div className="mb-0">
                                <label htmlFor="email_text" className="form-label mb-2">
                                    Email Text
                                    <i className="fa fa-question-circle ms-1" aria-hidden="true"
                                       data-toggle="tooltip" data-placement="right" title={Lang.env_email_text}/>
                                </label>
                                <textarea className="form-control" id="email_text" rows={13} value={emailText}
                                          onChange={(e) => handleEnvInput(e, 'email_text')}
                                          placeholder="Enter Email text box"/>
                                {errors.email_text && (<div className="text-danger">{errors.email_text}</div>)}
                            </div>
                        </div>

                        <EnvelopeRecipients formObj={props.formObj} setFormObj={props.setFormObj}
                                            setLoading={props.setLoading} recipData={recipientData}
                                            setDocData={setRecipientData}/>

                        <SearchRecipient formObj={props.formObj} setFormObj={props.setFormObj}/>
                        
                        {props.formObj.documents.length > 0 && (
                            <>
                                <div className=" mb-4 d-flex justify-content-between flex_wrap">
                                    <h2 className="main_title ps-0 text_blue">Document Request</h2>
                                    {isEditDocument && (
                                        <div className="d-flex flex_wrap">
                                            {props?.isTemplate === true && (
                                                <button type="button" className="btn shadow load_template_btn me-2"
                                                        data-bs-toggle="offcanvas" data-bs-target="#AddDocFormTemplate"
                                                        onClick={(e) => handleUseDocFormTemplate(e, 1)}
                                                        data-toggle="tooltip" title={Lang.env_add_doc_template}>
                                                    Add From Templates
                                                </button>
                                            )}
                                            <button type="button" className="btn shadow add_recipients_btn"
                                                    data-bs-toggle="offcanvas" data-bs-target="#Add-document"
                                                    ref={btnDocument} aria-controls="Add-document" data-toggle="tooltip"
                                                    title={Lang.env_add_document}>
                                                <span className="me-3">+</span>Add Request
                                            </button>
                                        </div>
                                    )}
                                    {!isEditDocument && (
                                        <span className="edit_box" onClick={(e) => setIsEditDocument(true)}>
                                            <i className="fa fa-pencil me-1" aria-hidden="true"/> Edit
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4 mb-5 card p-3">
                                    {props.formObj.documents.map((item, index) => (
                                        <h2 key={index} className="request_document_tab  mb-2">
                                            <div className="d-flex justify-content-between flex_wrap">
                                                <div className="accordion_text" style={{cursor: "grab"}}
                                                    onDragStart={(e) => docDragStart(e, index)}
                                                    onDragEnter={(e) => docDragEnter(e, index)} onDragEnd={docDrop}
                                                    draggable>
                                                    <img src="/images/dots_rectangle.png" alt="rectangle" className="me-3"/>
                                                    {item.name}
                                                </div>
                                                <div className="functional_icons">
                                                    {parseInt(item.request_id) === 0 ? (
                                                        <span className="functional_icon_round">
                                                            <i className="fa fa-users" data-toggle="tooltip"
                                                            data-placement="right" title="" data-bs-original-title="Everyone"
                                                            aria-hidden="true"/>
                                                        </span>
                                                    ) : (
                                                        <>
                                                            {item.request_display.map((recipient, i) =>
                                                                <span key={i} className="functional_icon_round"
                                                                    data-toggle="tooltip" data-placement="right" title=""
                                                                    data-bs-original-title={recipient.full_name}>{recipient.display}</span>
                                                            )}
                                                        </>
                                                    )}
                                                    {isEditDocument && (
                                                        <span>
                                                            <i onClick={(e) => onDocumentEdit(e, item)}
                                                            className="fa fa-pencil me-3 cur-pointer" aria-hidden="true"
                                                            data-toggle="tooltip" title="click me to edit"
                                                            data-bs-original-title="click me to add edit"/>
                                                        </span>
                                                    )}
                                                    {isEditDocument && (
                                                        <span>
                                                            <i onClick={(e) => onDocumentClone(e, item)}
                                                            className="fa fa-clone me-3 cur-pointer" aria-hidden="true"
                                                            data-toggle="tooltip" title="click me to copy"
                                                            data-bs-original-title="click me to copy"/>
                                                        </span>
                                                    )}
                                                    {isEditDocument && (
                                                        <span>
                                                            <i onClick={(e) => onDocumentDelete(e, item)}
                                                            className="fa fa-trash-o cur-pointer" aria-hidden="true"
                                                            data-toggle="tooltip" title="click me to delete"
                                                            data-bs-original-title="click me to delete"/>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </h2>
                                    ))}
                                    {errors.documents && (
                                        <div className="text-danger">{errors.documents}</div>
                                    )}
                                </div>
                            </>
                        )}

                        {props.formObj.fill_forms.length > 0 && (
                            <>
                                <div className=" mb-4 d-flex justify-content-between flex_wrap">
                                    <h2 className="main_title ps-0 text_blue">Information Request (Form Builder)</h2>
                                    {isEditRequestForm && (
                                        <div className="d-flex flex_wrap">
                                            {props?.isTemplate === true && (
                                                <button type="button" className="btn shadow load_template_btn me-2"
                                                        data-bs-toggle="offcanvas" data-bs-target="#AddDocFormTemplate"
                                                        onClick={(e) => handleUseDocFormTemplate(e, 3)}
                                                        data-toggle="tooltip" title={Lang.env_add_data_template}>
                                                    Add From Templates
                                                </button>
                                            )}
                                            <button type="button" className="btn shadow add_recipients_btn "
                                                    data-bs-toggle="offcanvas" data-bs-target="#MakeForm"
                                                    aria-controls="MakeForm" data-toggle="tooltip"
                                                    title={Lang.env_add_question} ref={btnRequestForm}>
                                                <span className="me-3">+</span>Create a Form
                                            </button>
                                        </div>
                                    )}
                                    {!isEditRequestForm && (
                                        <span className="edit_box" onClick={(e) => setIsEditRequestForm(true)}>
                                            <i className="fa fa-pencil" aria-hidden="true"/> Edit
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4 mb-5 card p-3">
                                    {props.formObj.fill_forms.map((item, index) => (
                                        <h2 key={index} className="request_document_tab yellow mb-2">
                                            <div className="d-flex justify-content-between flex_wrap">
                                                <div className="accordion_text" style={{cursor: "grab"}}
                                                     onDragStart={(e) => formDragStart(e, index)}
                                                     onDragEnter={(e) => formDragEnter(e, index)}
                                                     onDragEnd={formDrop}
                                                     draggable>
                                                    <img src="/images/dots_rectangle.png" alt="image4"
                                                         className="me-3"/>
                                                    {item.name}
                                                </div>
                                                <div className="functional_icons">
                                                    {parseInt(item.request_id) === 0 ? (
                                                        <span className="functional_icon_round">
                                                            <i className="fa fa-users" data-toggle="tooltip"
                                                               data-placement="right" title=""
                                                               data-bs-original-title="Everyone" aria-hidden="true"/>
                                                        </span>
                                                    ) : (
                                                        <>
                                                            {item.request_display.map((recipient, i) =>
                                                                <span key={i} className="functional_icon_round"
                                                                      data-toggle="tooltip" data-placement="right"
                                                                      title=""
                                                                      data-bs-original-title={recipient.full_name}>{recipient.display}</span>
                                                            )}
                                                        </>
                                                    )}
                                                    {isEditRequestForm && (
                                                        <span>
                                                            <i onClick={(e) => onRequestFormEdit(e, item)}
                                                               className="fa fa-pencil me-3 cur-pointer"
                                                               aria-hidden="true" data-toggle="tooltip"
                                                               title="click me to edit"
                                                               data-bs-original-title="click me to edit"/>
                                                        </span>
                                                    )}
                                                    {isEditRequestForm && (
                                                        <span>
                                                            <i onClick={(e) => onRequestClone(e, item)}
                                                               className="fa fa-clone me-3 cur-pointer"
                                                               aria-hidden="true" data-toggle="tooltip"
                                                               title="click me to copy"
                                                               data-bs-original-title="click me to copy"/>
                                                        </span>
                                                    )}
                                                    {isEditRequestForm && (
                                                        <span>
                                                            <i onClick={(e) => onRequestFormDelete(e, item)}
                                                               className="fa fa-trash-o cur-pointer" aria-hidden="true"
                                                               data-toggle="tooltip" title="click me to delete"
                                                               data-bs-original-title="click me to delete"/>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </h2>
                                    ))}
                                    {errors.fill_forms && (
                                        <div className="text-danger">{errors.fill_forms}</div>
                                    )}
                                </div>
                            </>
                        )}

                        
                        {props.formObj.sign_documents.length > 0 && (
                            <>
                                <div className=" mb-4 d-flex justify-content-between flex_wrap">
                                    <h2 className="main_title ps-0 text_blue">Signature Request</h2>
                                    {isEditSignDocumentForm && (
                                        <div className="d-flex flex_wrap">
                                            
                                            {/* {props?.isTemplate === true && (
                                                <button type="button" className="btn shadow load_template_btn me-2"
                                                        data-bs-toggle="offcanvas" data-bs-target="#AddDocFormTemplate"
                                                        onClick={(e) => handleUseDocFormTemplate(e, 2)}
                                                        data-toggle="tooltip" title={Lang.env_add_data_template}>
                                                    Add From Templates
                                                </button>
                                            )} */}
                                            
                                            <button type="button" className="btn shadow add_recipients_btn" data-bs-toggle="offcanvas"
                                                    data-bs-target="#pdfUploadForm" data-toggle="tooltip">
                                                <span className="me-3">+</span>Create a Form
                                            </button>
                                        </div>
                                    )}
                                    {!isEditSignDocumentForm && (
                                        <span className="edit_box" onClick={(e) => setIsEditSignDocumentForm(true)}>
                                            <i className="fa fa-pencil" aria-hidden="true"/> Edit
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4 mb-5 card p-3">
                                    {props.formObj.sign_documents.map((item, index) => (
                                      <h2 key={index} className={(index + 1 === props.formObj.sign_documents.length) ? "request_document_tab dt-alert-info mb-0" : "request_document_tab dt-alert-info mb-2" }>
                                            <div className="d-flex justify-content-between flex_wrap align-items-center">
                                                <div className="accordion_text" style={{cursor: "grab"}}
                                                    onDragStart={(e) => signDragStart(e, index)}
                                                    onDragEnter={(e) => signDragEnter(e, index)} onDragEnd={signDrop} draggable>
                                                    <img src="/images/dots_rectangle.png" alt="image4" className="me-3"/>
                                                    {item.name}
                                                </div>
                                                
                                                <div className="functional_icons d-flex align-items-center">
                                                    {parseInt(item.request_id) === 0 ? (
                                                        <span className="functional_icon_round">
                                                            <i className="fa fa-users" data-toggle="tooltip" data-placement="right"
                                                            title="" data-bs-original-title="Everyone" aria-hidden="true"/>
                                                        </span>
                                                    ) : (
                                                        <>
                                                            {item.request_display.map((recipient, i) =>
                                                                <span key={i} className="functional_icon_round"
                                                                    data-toggle="tooltip" data-placement="right" title=""
                                                                    data-bs-original-title={recipient.full_name}>{recipient.display}</span>
                                                            )}
                                                        </>
                                                    )}
                                                    {isEditSignDocumentForm && (
                                                    <span className="d-none" ref={btnSignDocumentPopup} data-bs-toggle="offcanvas"
                                                    data-bs-target="#makeFillableForm" ></span>    
                                                    )}

                                                    {/* {
                                                        (isEditSignDocumentForm && item.request_id === "") &&
                                                        <span onClick={(e) => onRequestSignDocumentRender(e, item)} className="make_fillable_btn me-3 cur-pointer">
                                                             <i className="fa fa-pencil-square-o" data-toggle="tooltip" data-placement="right"
                                                                title="" data-bs-original-title="Make fillable" aria-hidden="true"> Make fillable</i>
                                                        </span>
                                                    }
                                                    {
                                                        (isEditSignDocumentForm && item.request_id !== "") &&
                                                        <span onClick={(e) => onRequestSignDocumentRender(e, item)} className="make_fillable_btn edit_live_form_btn me-3 cur-pointer">
                                                             <i className="fa fa-pencil-square-o" data-toggle="tooltip" data-placement="right"
                                                                title="" data-bs-original-title="Edit Live Form" aria-hidden="true"> Edit Live Form</i>
                                                        </span>
                                                    } */}


                                                    {isEditSignDocumentForm && item.request_id === "" && (
                                                        <span onClick={(e) => onRequestSignDocumentRender(e, item)} className="make_fillable_btn me-3 cur-pointer" >
                                                            <i className="fa fa-pencil-square-o" data-toggle="tooltip" data-placement="right"
                                                                title="" data-bs-original-title="Make fillable" aria-hidden="true"/> Make fillable
                                                        </span>
                                                    )}
                                                    
                                                    {isEditSignDocumentForm && item.request_id !== "" && (
                                                        <span onClick={(e) => onRequestSignDocumentRender(e, item)} className="make_fillable_btn edit_live_form_btn me-3 cur-pointer" >
                                                            <i className="fa fa-pencil-square-o" data-toggle="tooltip" data-placement="right"
                                                                title="" data-bs-original-title="Edit Live Form" aria-hidden="true"/> Edit Live Form
                                                        </span>
                                                    )}
                                                    
                                                    {isEditSignDocumentForm && (
                                                        <span className="functional_icon_round">
                                                            <i className="fa fa-download cur-pointer" onClick={(e) => handleDownload(e, item)}  data-toggle="tooltip" data-placement="right"
                                                                title="" data-bs-original-title="Download" aria-hidden="true"/>
                                                        </span>
                                                    )}
                                                    
                                                    {isEditSignDocumentForm && (
                                                        <span>
                                                            <i onClick={(e) => onRequestSignDocumentDelete(e, item)}
                                                            className="fa fa-trash-o cur-pointer" aria-hidden="true"
                                                            data-toggle="tooltip" title="click me to delete"
                                                            data-bs-original-title="click me to delete"/>
                                                        </span>
                                                    )}

                                                </div>
                                            </div>
                                        </h2>
                                    ))}
                                    {errors.sign_documents && (
                                        <div className="text-danger">{errors.sign_documents}</div>
                                    )}
                                </div>
                            </>
                        )}


                        <EnvelopeDocument formObj={props.formObj} setFormObj={props.setFormObj}
                                          setLoading={props.setLoading} docData={docData} setDocData={setDocData}/>

                        <EnvelopeRequestForm formObj={props.formObj} setFormObj={props.setFormObj}
                                             setLoading={props.setLoading} requestFormData={requestFormData}
                                             setRequestFormData={setRequestFormData}/>
                        
                        
                       
                        <PdfUploadPopup formObj={props.formObj} setFormObj={props.setFormObj} setLoading={props.setLoading} setDirectMakeFillableOpen={setDirectMakeFillableOpen} setSignatureDocumentData={setSignatureDocumentData}></PdfUploadPopup>
                        
                        <MakeFillablePopup formObj={props.formObj} signatureDocumentData={signatureDocumentData} setFormObj={props.setFormObj} setLoading={props.setLoading}  makeFillable={makeFillable} handleMakeFillable={handleMakeFillable}></MakeFillablePopup>

                        {!isAdditionalSetting &&
                        <>
                            <h2 className="main_title p-0 mb-2 d-flex align-items-center justify-content-between text_blue">
                                Additional Settings
                                <span className="edit_box" data-toggle="tooltip" title="click me to edit"
                                      onClick={(e) => setIsAdditionalSetting(true)} data-bs-original-title="click Me">
                                <i className="fa fa-pencil" aria-hidden="true"/> Edit
                            </span>
                            </h2>
                            <div className="card mb-5 p-3">
                                <div className="mb-1 d-flex align-items-center">
                                    <div className="font_bold">Naming Convention :</div>
                                    <div className="font-light ms-1">{nameConventionText}</div>
                                </div>
                                <div className="mb-1 d-flex align-items-center">
                                    <div className="font_bold">Cloud Storage Sync :</div>
                                    <div className="font-light ms-1">{cloudSyncText.join(" , ")}</div>
                                </div>
                                <div className="mb-1 d-flex align-items-center">
                                    <div className="font_bold">Send Reminder (Email):</div>
                                    <div className="font-light ms-1">{sendReminderText}</div>
                                </div>
                                <div className="mb-1 d-flex align-items-center">
                                    <div className="font_bold">Overdue Reminder (Email):</div>
                                    <div className="font-light ms-1">{overdueReminderText}</div>
                                </div>
                                <div className="mb-1 d-flex align-items-center d-none">
                                    <div className="font_bold">Password Protected :</div>
                                    <div className="font-light ms-1">{passwordText}</div>
                                </div>
                                <div className="mb-1 d-flex align-items-center">
                                    <div className="font_bold">Reference ID :</div>
                                    <div className="font-light ms-1">{referenceText}</div>
                                </div>
                            </div>
                        </>
                        }

                        {isAdditionalSetting &&
                        <>
                            <h2 className="main_title p-0 mb-2 d-flex align-items-center justify-content-between text_blue">Additional
                                Settings</h2>
                            <div className="card p-3">
                                <div className="row mb-4">
                                    <div className="col-lg-3">
                                        <label className="form-label mt-2">Naming Convention:</label>
                                    </div>
                                    <div className="col-lg-9 d-flex align-items-center">
                                        <select className="form-select" value={nameConvention}
                                                onChange={(e) => setNameConvention(e.target.value)}
                                                aria-label="Default select example">
                                            {NAME_CONVENTION.map((item, index) =>
                                                <option key={index} value={item.id}>{item.value}</option>
                                            )}
                                        </select>
                                        <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                                           data-toggle="tooltip" data-placement="right"
                                           title={Lang.env_naming_convention}/>
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-lg-3">
                                        <label className="form-label mt-2">Cloud Storage Sync:</label>
                                    </div>
                                    <div className="col-lg-9 d-flex align-items-center">
                                        <ReactSelect
                                            className="form-check w-100 ps-0"
                                            value={cloudSync}
                                            styles={customStyles}
                                            isMulti
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={false}
                                            onChange={cloudeStoragehandleChange}
                                            options={syncStatusList}
                                            getOptionLabel={options => options['value']}
                                            components={{
                                                Option
                                            }}
                                        />
                                        <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                                           data-toggle="tooltip" data-placement="right" title={Lang.env_cloud_sync}/>
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-lg-3">
                                        <label className="form-label mt-2">Send Reminder (Email):</label>
                                    </div>
                                    <div className="col-lg-9 d-flex align-items-center">
                                        <select className="form-select" value={sendReminder}
                                                onChange={(e) => setSendReminder(e.target.value)}
                                                aria-label="Default select example">
                                            {SEND_REMINDER.map((item, index) =>
                                                <option key={index} value={item.id}>{item.value}</option>
                                            )}
                                        </select>
                                        <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                                           data-toggle="tooltip" data-placement="right" title={Lang.env_send_reminder}/>
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-lg-3">
                                        <label className="form-label mt-2">Overdue Reminder (Email):</label>
                                    </div>
                                    <div className="col-lg-9 d-flex align-items-center">
                                        <select className="form-select" value={overdueReminder}
                                                onChange={(e) => setOverdueReminder(e.target.value)}
                                                aria-label="Default select example">
                                            {OVERDUE_REMINDER.map((item, index) =>
                                                <option key={index} value={item.id}>{item.value}</option>
                                            )}
                                        </select>
                                        <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                                           data-toggle="tooltip" data-placement="right"
                                           title={Lang.env_overdue_reminder}/>
                                    </div>
                                </div>
                                <div className="row mb-4 d-none">
                                    <div className="col-lg-3">
                                        <label className="form-label mt-2">Password Protected: </label>
                                    </div>
                                    <div className="col-lg-9 d-flex align-items-center">
                                        <select className="form-select" value={isPassword} onChange={handlePassword}
                                                aria-label="Default select example">
                                            {PASSWORD_LIST.map((item, index) =>
                                                <option key={index} value={item.id}>{item.value}</option>
                                            )}
                                        </select>
                                        <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                                           data-toggle="tooltip" data-placement="right" title={Lang.env_password}/>
                                    </div>
                                </div>
                                {isPassword > 0 &&
                                <div className="row mb-4">
                                    <div className="col-lg-3">
                                        <label className="form-label mb-2">&nbsp;</label>
                                    </div>
                                    <div className="col-lg-9 d-flex align-items-center">
                                        <input type="password" value={password}
                                               onChange={(e) => setPassword(e.target.value)}
                                               className="form-control" placeholder="Enter password"/>
                                        <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                                           data-toggle="tooltip" data-placement="right" title={Lang.env_password}/>
                                    </div>
                                    {errors.password &&
                                    <div className="col-lg-9 offset-lg-3">
                                        <div className="text-danger mt-1">{errors.password}</div>
                                    </div>
                                    }
                                </div>
                                }
                                <div className="row">
                                    <div className="col-lg-3">
                                        <label className="form-label mt-2">Reference ID:</label>
                                    </div>
                                    <div className="col-lg-9 d-flex align-items-center">
                                        <input type="text" value={referenceId}
                                               onChange={(e) => setReferenceId(e.target.value)}
                                               className="form-control"/>
                                        <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                                           data-toggle="tooltip" data-placement="right" title={Lang.env_reference}/>
                                    </div>
                                </div>
                            </div>
                        </>
                        }

                    </div>
                </div>
                <div className="step_wizard_button shadow">
                    <button type="button" onClick={onBack} className="btn btn_outline">Back</button>
                    <button type="button" data-toggle="tooltip" title={Lang.env_save_exit}
                            onClick={(e) => onSubmitForm(e, 1)} className="btn btn_outline">Save & Exit
                    </button>
                    <button type="button" data-toggle="tooltip" title={Lang.env_send}
                            onClick={(e) => onSubmitForm(e, 2)} className="btn btn-primary">Send Envelope
                    </button>
                </div>
            </>
            }

            <button type="button" ref={addTemplateRef} data-bs-toggle="modal" className="d-none"
                    data-bs-target="#addToTemplateModal"/>
            <div className="modal fade" id="addToTemplateModal" tabIndex="-1" aria-labelledby="addToTemplateModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addToTemplateModalLabel">Added in Templates.</h5>
                            <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                    ref={clsAddTemplateRef} data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa fa-times-circle" aria-hidden="true"/>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="py-2 mb-0">You have Successfully added this Envelope in Templates.</p>
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" onClick={goToHome} className="btn btn-primary">Go to Home</button>
                        </div>
                    </div>
                </div>
            </div>

            <DocFormTemplate fromTemplate={fromTemplate} setFromTemplate={setFromTemplate}
                             formObj={props.formObj} setFormObj={props.setFormObj}
                             isUseFromTemplate={isUseFromTemplate} setIsUseFromTemplate={setIsUseFromTemplate}/>

            <AddEnvelopeTemplate deleteEnvelope={deleteEnvelope} setDeleteEnvelope={setDeleteEnvelope}
                                 setLoading={props.setLoading} setAddTemplate={setAddTemplate}/>

            <span data-bs-toggle="modal" data-bs-target="#openCheckSMSCredit" ref={openCheckSMSCreditRef}/>
            <div className="modal fade" id="openCheckSMSCredit" tabIndex={-1}
                 aria-labelledby="openCheckSMSCreditLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <p className="py-2">You don't have enough SMS credit, click on Billing to purchase extra SMS
                                Credits.</p>
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <span data-bs-toggle="modal" data-bs-target="#openCloudStorage" ref={openCloudStorageRef}/>
            <div className="modal fade" id="openCloudStorage" tabIndex={-1}
                 aria-labelledby="openCloudStorageLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <p className="py-2">Now, cloud storage not connected. Please connect the cloud storage.</p>
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EnvelopeStep4;
