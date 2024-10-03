import React, {useState, useEffect, useRef} from "react";
import {NavLink, useNavigate, useLocation, useParams} from 'react-router-dom';
import EnvSetting from "./EnvSetting";
import EnvHistory from "./EnvHistory";
import EnvMessages from "./EnvMessages";
import {
    checkTemplatePost,
    envelopeDownloadData,
    getEnvelopeSenderList,
    manageEnvelopeDocFormList,
    manageEnvelopeDocumentDetail,
    manageEnvelopeSignDocumentDetail,
    manageEnvelopeFillFormDetail,
    postCloudList,
    userEnvelopeDownloadData,
    viewMangeEnvelope
} from "../../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import BulkMessage from "./BulkMessage";
import ApproveRejectDoc from "./ApproveRejectDoc";
import ApproveRejectForm from "./ApproveRejectForm";
import ApproveRejectSignDoc from "./ApproveRejectSignDoc";
import TransferEnvelope from "./TransferEnvelope";
import CloseEnvelope from "./CloseEnvelope";
import ResendEnvelope from "./ResendEnvelope";
import FileDownload from "js-file-download";
import Axios from "axios";
import EditRequest from "./EditRequest";
import ViewDataForm from "./ViewDataForm";
import ViewDocument from "./ViewDocument";
import ViewSignDocument from "./ViewSignDocument";
import {SYNC_STATUS} from "../../../../../configs/AppConfig";
import DownloadDataDoc from "./DownloadDataDoc";

function ViewEnvelope(props) {
    const location = useLocation();
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [envelopeData, setEnvelopeData] = useState({});
    const [recipientList, setRecipientList] = useState([]);
    const [currentRecipient, setCurrentRecipient] = useState('');
    const [currentRecipientId, setCurrentRecipientId] = useState(0);
    const [statusList, setStatusList] = useState([]);
    const [docFormList, setDocFormList] = useState({});
    const [downloadDataList, setDownloadDataList] = useState({});
    const [docList, setDocList] = useState([]);
    const [formList, setFormList] = useState([]);
    const [signDocList, setSignDocList] = useState([]);
    const [isDataDownload, setIsDataDownload] = useState(false);
    const [isDownloadFile, setIsDownloadFile] = useState(false);
    const [isEditRequest, setIsEditRequest] = useState(false);
    const [isRefresh, setIsRefresh] = useState(true);
    const [senderList, setSenderList] = useState([]);
    const [isTemplate, setIsTemplate] = useState(false);
    const [syncStatusList, setSyncStatusList] = useState(SYNC_STATUS);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight - 200);

    const [docDetail, setDocDetail] = useState({
        id: 0,
        envelope_id: 0,
        recipient_id: 0,
        is_call: false,
        doc_detail: {}
    });
    const [formDetail, setFormDetail] = useState({
        id: 0,
        envelope_id: 0,
        recipient_id: 0,
        is_call: false,
        form_detail: {}
    });
    const [signDocDetail, setSignDocDetail] = useState({
        id: 0,
        envelope_id: 0,
        recipient_id: 0,
        is_call: false,
        sign_doc_detail: {}
    });
    const [resendEnvelope, setResendEnvelope] = useState({
        envelope_id: 0,
        emails: []
    });
    const [closeEnvelope, setCloseEnvelope] = useState({
        envelope_id: 0,
        recipient_email: '',
        recipient_id: 0
    });

    const approveRejectDocumentModelRef = useRef(null);
    const viewDocumentModelRef = useRef(null);
    const approveRejectDataModelRef = useRef(null);
    const viewDataModelRef = useRef(null);
    const DownloadDataModelRef = useRef(null);

    const viewSignDocumentModelRef = useRef(null);
    const approveRejectSignDocumentModelRef = useRef(null);

    useEffect(function () {
        getEnvelopeSenderList()
            .then(response => {
                setSenderList(response.data.data);
            })
            .catch(err => {

            });
    }, []);

    useEffect(function () {
        postCloudList({})
            .then(response => {
                setSyncStatusList(response.data.data);
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
        if (id && isRefresh === true) {
            setLoading(true);
            viewMangeEnvelope({uuid: id})
                .then(response => {
                    setEnvelopeData(response.data.data);
                    let rList = response.data.recipients;
                    if (location?.state?.recipient_id) {
                        for (let i = 0; i < rList.length; i++) {
                            let active = false;
                            if (parseInt(location?.state?.recipient_id) === parseInt(rList[i]['id'])) {
                                active = true;
                            }
                            rList[i]['active'] = active;
                        }
                    }
                    setRecipientList(rList);
                    if (response.data.recipients.length > 0) {
                        if (location?.state?.recipient_id) {
                            setCurrentRecipientId(parseInt(location?.state?.recipient_id));
                            setCurrentRecipient(location?.state?.recipient_name);
                        } else {
                            let recipientData = response.data.recipients[0];
                            setCurrentRecipient(recipientData.first_name + ' ' + recipientData.last_name);
                            setCurrentRecipientId(parseInt(recipientData.id));
                        }
                    }
                    setIsDownloadFile(response.data.data.is_download_files);
                    setIsRefresh(false);
                    setLoading(false);
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                    navigate('/manage');
                });
        }
    }, [id, navigate, isRefresh, location?.state]);

    useEffect(function () {
        if (currentRecipientId > 0) {
            setLoading(true);
            setStatusList([]);
            manageEnvelopeDocFormList({id: envelopeData.id, recipient_id: currentRecipientId})
                .then(response => {
                    let sList = response.data.status_list;
                    let sId = 0;
                    if (props?.tabType) {
                        if (props?.tabType !== 'message') {
                            for (let s = 0; s < sList.length; s++) {
                                let isActive = false;
                                if (parseInt(sList[s]['id']) === parseInt(props.tabType)) {
                                    sId = parseInt(sList[s]['id']);
                                    isActive = true;
                                }
                                sList[s]['active'] = isActive;
                            }
                        }
                    }
                   
                    setStatusList(sList);
                    setDocFormList({
                        doc_list: response.data.docList,
                        form_list: response.data.formList,
                        sign_doc_list: response.data.signDocList
                    });
                    setDocList(response.data.docList);
                    setFormList(response.data.formList);
                    setSignDocList(response.data.signDocList)
                    setIsDataDownload(response.data.is_data_download);

                    let dataObj = {
                        doc_list: response.data.docList,
                        form_list: response.data.formList,
                        sign_doc_list: response.data.signDocList
                    };
                    handleDocFormByDirectStatus(sId, dataObj);
                    setLoading(false);
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        }
    }, [currentRecipientId, envelopeData, props?.tabType]);

    const handleRecipient = (e, data) => {
        e.preventDefault();
        let list = [...recipientList];
        for (let i = 0; i < list.length; i++) {
            let active = false;
            if (data.id === list[i]['id']) {
                active = true;
                setCurrentRecipient(data.first_name + ' ' + data.last_name);
                setCurrentRecipientId(parseInt(data.id));
            }
            list[i]['active'] = active;
        }
        setRecipientList(list);
    };

    const handleStatus = (e, data) => {
        e.preventDefault();
        let list = [...statusList];
        for (let i = 0; i < list.length; i++) {
            let active = false;
            if (parseInt(list[i]['id']) === parseInt(data.id)) {
                active = true;
            }
            list[i]['active'] = active;
        }
        setStatusList(list);
       
        handleDocFormByStatus(data.id);
    };

    const handleDocFormByStatus = (statusId) => {
        let dataList = {...docFormList};
        let documentList = dataList.doc_list;
        let requestFormList = dataList.form_list;
        let signDocumentList = dataList.sign_doc_list;
        if (parseInt(statusId) === 0) {
            setDocList(documentList);
            setFormList(requestFormList);
            setSignDocList(signDocumentList);
        } else {
            let dList = [];
            let fList = [];
            let sdList = [];
            if (documentList.length > 0) {
                for (let d = 0; d < documentList.length; d++) {
                    if (parseInt(documentList[d]['status_id']) === parseInt(statusId)) {
                        dList.push(documentList[d]);
                    }
                }
            }

            if (requestFormList.length > 0) {
                for (let f = 0; f < requestFormList.length; f++) {
                    if (parseInt(requestFormList[f]['status_id']) === parseInt(statusId)) {
                        fList.push(requestFormList[f]);
                    }
                }
            }

            if (signDocumentList.length > 0) {
                for (let k = 0; k < signDocumentList.length; k++) {
                    if (parseInt(signDocumentList[k]['status_id']) === parseInt(statusId)) {
                        sdList.push(signDocumentList[k]);
                    }
                }
            }

            setDocList(dList);
            setFormList(fList);
            setSignDocList(sdList);
        }
    };

    const handleDocFormByDirectStatus = (statusId, dataList) => {
        let documentList = dataList.doc_list;
        let requestFormList = dataList.form_list;
        if (parseInt(statusId) === 0) {
            setDocList(documentList);
            setFormList(requestFormList);
        } else {
            let dList = [];
            let fList = [];
            if (documentList.length > 0) {
                for (let d = 0; d < documentList.length; d++) {
                    if (parseInt(documentList[d]['status_id']) === parseInt(statusId)) {
                        dList.push(documentList[d]);
                    }
                }
            }

            if (requestFormList.length > 0) {
                for (let f = 0; f < requestFormList.length; f++) {
                    if (parseInt(requestFormList[f]['status_id']) === parseInt(statusId)) {
                        fList.push(requestFormList[f]);
                    }
                }
            }

            setDocList(dList);
            setFormList(fList);
        }
    };

    const onViewApproveRejectDoc = (e, data) => {
        e.preventDefault();
        setLoading(true);
        let obj = {
            id: data.id,
            envelope_id: envelopeData.id,
            recipient_id: currentRecipientId,
        };
        manageEnvelopeDocumentDetail(obj)
            .then(response => {
                setDocDetail({
                    id: data.id,
                    envelope_id: envelopeData.id,
                    recipient_id: currentRecipientId,
                    is_call: true,
                    doc_detail: response.data.data
                });
                setLoading(false);
                viewDocumentModelRef?.current.click();
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    };

    const handleApproveRejectDoc = (e, data) => {
        e.preventDefault();
        setLoading(true);
        let obj = {
            id: data.id,
            envelope_id: envelopeData.id,
            recipient_id: currentRecipientId
        };
        manageEnvelopeDocumentDetail(obj)
            .then(response => {
                setDocDetail({
                    id: data.id,
                    envelope_id: envelopeData.id,
                    recipient_id: currentRecipientId,
                    is_call: true,
                    doc_detail: response.data.data
                });
                setLoading(false);
                approveRejectDocumentModelRef?.current.click();
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    };

    const handleViewDataForm = (e, data) => {
        e.preventDefault();
        setLoading(true);
        let obj = {
            id: data.id,
            envelope_id: envelopeData.id,
            recipient_id: currentRecipientId
        };
        manageEnvelopeFillFormDetail(obj)
            .then(response => {
                setFormDetail({
                    id: data.id,
                    envelope_id: envelopeData.id,
                    recipient_id: currentRecipientId,
                    is_call: true,
                    form_detail: response.data.data
                });
                viewDataModelRef?.current.click();
                setLoading(false);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    };

    const handleApproveRejectForm = (e, data) => {
        e.preventDefault();
        setLoading(true);
        let obj = {
            id: data.id,
            envelope_id: envelopeData.id,
            recipient_id: currentRecipientId
        };
        manageEnvelopeFillFormDetail(obj)
            .then(response => {
                setFormDetail({
                    id: data.id,
                    envelope_id: envelopeData.id,
                    recipient_id: currentRecipientId,
                    is_call: true,
                    form_detail: response.data.data
                });
                approveRejectDataModelRef?.current.click();
                setLoading(false);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    };

    const onEnvelopeClose = (e) => {
        e.preventDefault();

        setCloseEnvelope({
            envelope_id: envelopeData.id,
            recipient_id: 0
        });
    };

    const onEnvelopeTransfer = (e) => {
        e.preventDefault();

        setCloseEnvelope({
            envelope_id: envelopeData.id,
            recipient_id: 0
        });
    };

    const onEnvelopeResend = (e, type) => {
        e.preventDefault();

        if (type === 1) {
            let emails = [];

            for (let i = 0; i < recipientList.length; i++) {
                emails.push({
                    id: recipientList[i]['id'],
                    email: recipientList[i]['email'],
                    name: recipientList[i]['first_name'] + ' ' + recipientList[i]['last_name']
                });
            }

            setResendEnvelope({
                envelope_id: envelopeData.id,
                emails: emails
            });
        } else {
            let index = recipientList.findIndex(x => parseInt(x.id) === parseInt(currentRecipientId));
            if (index > -1) {
                setResendEnvelope({
                    envelope_id: envelopeData.id,
                    emails: [{
                        id: currentRecipientId,
                        email: recipientList[index]['email'],
                        name: recipientList[index]['first_name'] + ' ' + recipientList[index]['last_name']
                    }]
                });
            }
        }
    };

    const onRecipientCloseEnvelope = (e) => {
        e.preventDefault();

        let email = '';
        let index = recipientList.findIndex(x => parseInt(x.id) === parseInt(currentRecipientId));
        if (index > -1) {
            email = recipientList[index]['email'];
        }

        setCloseEnvelope({
            envelope_id: envelopeData.id,
            email: email,
            recipient_id: currentRecipientId
        });
    };


    const downloadAllFileForm = (e) => {
        e.preventDefault();
        setLoading(true);
        let obj = {
            envelope_id: parseInt(envelopeData.id),
        };

        userEnvelopeDownloadData(obj)
            .then(res => {
                setDownloadDataList(res.data.data);
                DownloadDataModelRef?.current.click();
                setLoading(false);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    };

    const onEditRequest = (e) => {
        e.preventDefault();
        setIsEditRequest(true);
    };

    const onDataDownload = (e, type) => {
        e.preventDefault();
        let obj = {
            envelope_id: envelopeData.id,
            recipient_id: currentRecipientId,
            type: type
        };
        setLoading(true);

        envelopeDownloadData(obj)
            .then(response => {
                Axios.get(response.data.fileUrl, {
                    responseType: 'blob',
                }).then((res) => {
                    setLoading(false);
                    FileDownload(res.data, response.data.fileName);
                }).catch(err => {
                    toast.error('Oops...something went wrong. File not found.');
                    setLoading(false);
                });
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    };

    const handleCustomerPortal = (e) => {
        e.preventDefault();

        let index = recipientList.findIndex(x => parseInt(x.id) === parseInt(currentRecipientId));
        if (index > -1) {
            window.open('/client-portal/envelope/view/' + envelopeData.uuid + '-.' + recipientList[index]['generated_id'], "_blank");
        } else {
            toast.error('Oops...something went wrong. Please try again.');
        }
    };

    const handleExpireDoc = (e) => {
        e.preventDefault();
        navigate('/manage/' + id + '/expired-document');
    };



    const onViewApproveRejectSignDoc = (e, data) => {
        e.preventDefault();
        setLoading(true);
        let obj = {
            id: data.id,
            envelope_id: envelopeData.id,
            recipient_id: currentRecipientId,
        };
        manageEnvelopeSignDocumentDetail(obj)
            .then(response => {
                setSignDocDetail({
                    id: data.id,
                    envelope_id: envelopeData.id,
                    recipient_id: currentRecipientId,
                    is_call: true,
                    sign_doc_detail: response.data.data
                });
                
                setLoading(false);
                viewSignDocumentModelRef?.current.click();
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    };

    const handleApproveRejectSignDoc = (e, data) => {
        e.preventDefault();
        setLoading(true);
        let obj = {
            id: data.id,
            envelope_id: envelopeData.id,
            recipient_id: currentRecipientId
        };
        manageEnvelopeSignDocumentDetail(obj)
            .then(response => {
                setSignDocDetail({
                    id: data.id,
                    envelope_id: envelopeData.id,
                    recipient_id: currentRecipientId,
                    is_call: true,
                    sign_doc_detail: response.data.data
                });
                setLoading(false);
                approveRejectSignDocumentModelRef?.current.click();
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    };


    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <section className="main_wrapper background_grey_400 setting_tab client_portal"
                     style={{minHeight: 'calc(100vh - 119px)'}}>
                <div className="custom_container">
                    <h2 className="main_title mb-3 d-flex align-items-center justify-content-between bread_crumb flexWrap">
                        <span>
                            <NavLink to={"/manage"} className="text_blue">Envelopes</NavLink>
                            <i className="fa fa-angle-double-right mx-3"/>{envelopeData.envelope_name}
                        </span>
                        <div className="d-flex">
                            {parseInt(envelopeData.status_id) === 2 && parseInt(envelopeData.expired_day) > 0 && (
                                <button type="button" onClick={handleExpireDoc}
                                        className="btn shadow load_template_btn me-3 text-primary">
                                    Request Expired Docs
                                </button>
                            )}
                            {isDownloadFile === true && (
                                <button type="button" className="btn shadow load_template_btn me-3"
                                        data-toggle="tooltip"
                                        onClick={(e) => downloadAllFileForm(e)}
                                        data-placement="right" title="" data-bs-original-title="click to Download">
                                    <i className="fa fa-download me-2" aria-hidden="true"/> Download All Files
                                </button>
                            )}
                            <div className="functional_icons">
                                <div className="dropdown">
                                    <span className="functional_icon_ellipsis" id="dropdownMenuButton1"
                                          data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="fa fa-ellipsis-v"/>
                                    </span>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        <li onClick={(e) => onEnvelopeResend(e, 1)} data-bs-toggle="modal"
                                            data-bs-target="#resendEnvelope">
                                            <div className="dropdown-item">Resend Envelope</div>
                                        </li>
                                        <li onClick={onEnvelopeClose} data-bs-toggle="modal"
                                            data-bs-target="#closeEnvelope">
                                            <div className="dropdown-item">Complete Envelope</div>
                                        </li>
                                        <li onClick={onEnvelopeTransfer} data-bs-toggle="modal"
                                            data-bs-target="#transferEnvelope">
                                            <div className="dropdown-item">Transfer Envelope</div>
                                        </li>
                                        {!isEditRequest &&
                                        <li onClick={onEditRequest}>
                                            <div className="dropdown-item">Edit Request</div>
                                        </li>
                                        }
                                        <li>
                                            <NavLink to={"/manage/" + id + "/recipient"}
                                                     className="dropdown-item text-black">Add Another
                                                Recipient</NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </h2>

                    {!isEditRequest &&
                    <>
                        <div className="nav nav-tabs " id="nav-tab" role="tablist">
                            <button className={`nav-link ${props.tabType === 'message' ? `` : `active`}`}
                                    id="document-form" data-bs-toggle="tab"
                                    data-bs-target="#document-form-detail" type="button" role="tab"
                                    aria-controls="document-form-detail" aria-selected="true">Documents & Information
                            </button>
                            <button className={`nav-link ${props.tabType === 'message' ? `active` : ``}`}
                                    id="messages-tab" data-bs-toggle="tab" data-bs-target="#messages"
                                    type="button" role="tab" aria-controls="messages" aria-selected="false">Messages
                                {envelopeData.is_message === true && (<span className="red_dot"/>)}
                            </button>
                            <button className="nav-link" id="History-tab" data-bs-toggle="tab" data-bs-target="#History"
                                    type="button" role="tab" aria-controls="History" aria-selected="false">History
                            </button>
                            <button className="nav-link" id="EnvSetting-tab" data-bs-toggle="tab"
                                    data-bs-target="#EnvSetting" type="button" role="tab" aria-controls="EnvSetting"
                                    aria-selected="false">Envelope Settings
                            </button>
                        </div>

                        <div className="tab-content  px-3" id="nav-tabContent"
                             style={{minHeight: 'calc(100vh - 303px)'}}>

                            <div className={`tab-pane fade ${props.tabType === 'message' ? `` : `active show`}`}
                                 id="document-form-detail" role="tabpanel" aria-labelledby="document-form">
                                <div className="row " style={{minHeight: 'calc(100vh - 300px)'}}>
                                    <div className="col-xxl-2  col-lg-3 col-md-12  border-right ps-0">
                                        <div className="user_sidebar px-2">
                                            <div className="nav nav-tabs " id="nav-tab" role="tablist">
                                                {recipientList.map((item, index) => (
                                                    <button key={index} type="button"
                                                            onClick={(e) => handleRecipient(e, item)}
                                                            className={`nav-link ${item.active ? `active` : ``} d-flex align-items-center justify-content-between mb-1`}>
                                                        <span className="d-flex align-items-center ">
                                                            <i className='fa fa-user-circle me-2'
                                                               style={{fontSize: '26px'}}/>{item.first_name + ` ` + item.last_name}</span>
                                                        <span className="user_number_badge">{item.total}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-10  col-lg-9 col-md-12">
                                        <div className="tab-content pb-4" id="nav-tabContent">
                                            <div className="tab-pane fade active show" id="Name-one-detail"
                                                 role="tabpanel">
                                                <div className="row">
                                                    <div className="col-lg-12 col-md-12 py-4">
                                                        <div className="document_form_wrap">
                                                            <div
                                                                className="d-flex align-items-center justify-content-between">
                                                                <div className="nav nav-tabs btn_wrap" id="nav-tab"
                                                                     role="tablist">
                                                                    {statusList.map((item, index) =>
                                                                        <button key={index}
                                                                                onClick={(e) => handleStatus(e, item)}
                                                                                className={`nav-link mb-3 ${item.active ? `active` : ``}  ${item.id === 0 ? `bg_light_gray_outline` : item.id === 1 ? `bg_light_blue_outline` : item.id === 2 ? `bg_light_yellow_outline` : item.id === 5 ? 'bg_light_auro_outline' :  item.id === 3 ? `bg_light_green_outline` : `bg_light_pink_outline`}`}
                                                                                type="button" role="tab"
                                                                                aria-selected="true">{item.name}
                                                                            <span className="ms-1">({item.total})</span>
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                {statusList.length > 0 &&
                                                                <div className="functional_icons mb-3">
                                                                    <div className="dropdown">
                                                                    <span className="functional_icon_ellipsis"
                                                                          id="dropdownMenuButton1"
                                                                          data-bs-toggle="dropdown"
                                                                          aria-expanded="false">
                                                                        <i className="fa fa-ellipsis-v"/>
                                                                    </span>
                                                                        <ul className="dropdown-menu"
                                                                            aria-labelledby="dropdownMenuButton1">
                                                                            <li>
                                                                                <div className="dropdown-item"
                                                                                     onClick={handleCustomerPortal}>View
                                                                                    Client Portal for {currentRecipient}
                                                                                </div>
                                                                            </li>
                                                                            <li data-bs-toggle="modal"
                                                                                onClick={(e) => onEnvelopeResend(e, 2)}
                                                                                data-bs-target="#resendEnvelope">
                                                                                <div className="dropdown-item">Resend
                                                                                    Envelope to {currentRecipient}
                                                                                </div>
                                                                            </li>
                                                                            <li data-bs-toggle="modal"
                                                                                onClick={onRecipientCloseEnvelope}
                                                                                data-bs-target="#closeEnvelope">
                                                                                <div className="dropdown-item">Complete
                                                                                    Envelope for {currentRecipient}
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                }
                                                            </div>

                                                            <div className="tab-content pb-4" id="nav-tabContent">
                                                                <div className="tab-pane fade active show"
                                                                     id="TotalRequested-detail" role="tabpanel"
                                                                     aria-labelledby="TotalRequested">
                                                                    {docList.length > 0 &&
                                                                    <>
                                                                        <h2 className="main_title mb-3 text_blue">Documents</h2>
                                                                        <div className="table-responsive">
                                                                            <table
                                                                                className="table mb-0 in_progress_table shadow-sm mb-4">
                                                                                <thead>
                                                                                <tr className="bg_blue">
                                                                                    <th>Document Name</th>
                                                                                    <th style={{
                                                                                        textAlign: 'center',
                                                                                        width: '15%'
                                                                                    }}>View
                                                                                    </th>
                                                                                    <th style={{width: '15%'}}>Status</th>
                                                                                    {parseInt(envelopeData.status_id) === 2 && (
                                                                                        <th style={{width: '15%'}}>Expired/Expiring</th>
                                                                                    )}
                                                                                    <th style={{
                                                                                        textAlign: 'center',
                                                                                        width: '15%'
                                                                                    }}>Action
                                                                                    </th>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                {docList && docList.map((item, index) =>
                                                                                    <tr key={index}>
                                                                                        <td>{item.doc_name}</td>
                                                                                        <td style={{textAlign: 'center'}}>
                                                                                            {item.status_id > 1 && (
                                                                                                <i className="fa fa-eye"
                                                                                                   onClick={(e) => onViewApproveRejectDoc(e, item)}
                                                                                                   aria-hidden="true"/>
                                                                                            )}
                                                                                        </td>
                                                                                        <td>
                                                                                        <span
                                                                                            className={item.status_id === 1 ? `bg_light_blue` : item.status_id === 2 ? `bg_light_yellow` : item.status_id === 3 ? `bg_light_green` : `bg_light_ping`}>
                                                                                            {item.status_id === 1 ? `Awating to Upload` : item.status_id === 2 ? `Received` : item.status_id === 3 ? `Approved` : `Rejected`}
                                                                                        </span>
                                                                                        </td>
                                                                                        {parseInt(envelopeData.status_id) === 2 && (
                                                                                            <td>
                                                                                                <span
                                                                                                    className={item.is_expired_date ? `text-danger` : `text-primary`}>{item.expired_date}</span>
                                                                                            </td>
                                                                                        )}
                                                                                        <td style={{textAlign: 'center'}}>
                                                                                            <span
                                                                                                onClick={(e) => handleApproveRejectDoc(e, item)}
                                                                                                data-toggle="tooltip"
                                                                                                data-placement="right"
                                                                                                title=""
                                                                                                data-bs-original-title="click Me"
                                                                                                className="Action_perform">Approve/Reject</span>
                                                                                        </td>
                                                                                    </tr>
                                                                                )}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </>
                                                                    }

                                                                    {formList.length > 0 &&
                                                                    <>
                                                                        <h2 className="main_title mb-3 text_blue">Information
                                                                            {isDataDownload && (
                                                                                <>
                                                                                    <button type="button"
                                                                                            onClick={(e) => onDataDownload(e, 2)}
                                                                                            className="btn btn-outline-success float-end rounded-pill">
                                                                                        <i className="fa fa-download me-2"
                                                                                           aria-hidden="true"/> Excel
                                                                                    </button>
                                                                                    <button type="button"
                                                                                            onClick={(e) => onDataDownload(e, 1)}
                                                                                            className="btn btn-outline-danger float-end rounded-pill me-2">
                                                                                        <i className="fa fa-download me-2"
                                                                                           aria-hidden="true"/>PDF
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </h2>
                                                                        <div className="table-responsive">
                                                                            <table
                                                                                className="table align-middle mb-0 bg-white in_progress_table shadow-sm mb-4">
                                                                                <thead className="">
                                                                                <tr className="bg_blue">
                                                                                    <th>Data Name</th>
                                                                                    <th style={{
                                                                                        textAlign: 'center',
                                                                                        width: '15%'
                                                                                    }}>View
                                                                                    </th>
                                                                                    <th style={{width: '15%'}}>Status</th>
                                                                                    <th style={{
                                                                                        textAlign: 'center',
                                                                                        width: '15%'
                                                                                    }}>Action
                                                                                    </th>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                {formList && formList.map((item, index) =>
                                                                                    <tr key={index}>
                                                                                        <td>{item.form_name}</td>
                                                                                        <td style={{textAlign: 'center'}}>
                                                                                            {item.status_id > 1 && (
                                                                                                <i className="fa fa-eye"
                                                                                                   onClick={(e) => handleViewDataForm(e, item)}
                                                                                                   aria-hidden="true"/>
                                                                                            )}
                                                                                        </td>
                                                                                        <td>
                                                                                        <span
                                                                                            className={item.status_id === 1 ? `bg_light_blue` : item.status_id === 2 ? `bg_light_yellow` : item.status_id === 3 ? `bg_light_green` : `bg_light_ping`}>
                                                                                            {item.status_id === 1 ? `Awating to Upload` : item.status_id === 2 ? `Received` : item.status_id === 3 ? `Approved` : `Rejected`}
                                                                                        </span>
                                                                                        </td>
                                                                                        <td style={{textAlign: 'center'}}>
                                                                                            <span
                                                                                                onClick={(e) => handleApproveRejectForm(e, item)}
                                                                                                data-toggle="tooltip"
                                                                                                data-placement="right"
                                                                                                title=""
                                                                                                data-bs-original-title="click Me"
                                                                                                className="Action_perform">Approve/Reject</span>
                                                                                        </td>
                                                                                    </tr>
                                                                                )}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </>
                                                                    }

                                                                    {signDocList.length > 0 &&
                                                                    <>
                                                                        <h2 className="main_title mb-3 text_blue">Sign Documents</h2>
                                                                        <div className="table-responsive">
                                                                            <table
                                                                                className="table mb-0 in_progress_table shadow-sm mb-4">
                                                                                <thead>
                                                                                <tr className="bg_blue">
                                                                                    <th>Sign Document Name</th>
                                                                                    <th style={{
                                                                                        textAlign: 'center',
                                                                                        width: '15%'
                                                                                    }}>View
                                                                                    </th>
                                                                                    <th style={{width: '15%'}}>Status</th>
                                                                                    <th style={{
                                                                                        textAlign: 'center',
                                                                                        width: '15%'
                                                                                    }}>Action
                                                                                    </th>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                {signDocList && signDocList.map((item, index) =>
                                                                                    <tr key={index}>
                                                                                        <td>
                                                                                            <span>{item.doc_name}</span>
                                                                                            {(item.notes !== "") && (
                                                                                                <div className="mt-1 fz_13">
                                                                                                    <small><b>Decline Reason:</b> {item.notes}</small>
                                                                                                </div>
                                                                                            )}
                                                                                        </td>
                                                                                        <td style={{textAlign: 'center'}}>
                                                                                            { ( (item.status_id > 1) && (item.status_id !== 5) ) && (
                                                                                                <i className="fa fa-eye"
                                                                                                   onClick={(e) => onViewApproveRejectSignDoc(e, item)}
                                                                                                   aria-hidden="true"/>
                                                                                            )}
                                                                                        </td>
                                                                                        <td>
                                                                                        <span
                                                                                            className={item.status_id === 1 ? `bg_light_blue` : item.status_id === 2 ? `bg_light_yellow` :  item.status_id === 5 ? 'bg_light_auro' : item.status_id === 3 ? `bg_light_green` : `bg_light_ping`}>
                                                                                            {item.status_id === 1 ? `Awating to Sign` : item.status_id === 2 ? `Received` : item.status_id === 5 ? `Declined` : item.status_id === 3 ? `Approved` : `Rejected`}
                                                                                        </span>
                                                                                        </td>
                                                                                       
                                                                                        <td style={{textAlign: 'center'}}>
                                                                                            {(item.status_id !== 5) && (
                                                                                                <span
                                                                                                    onClick={(e) => handleApproveRejectSignDoc(e, item)}
                                                                                                    data-toggle="tooltip"
                                                                                                    data-placement="right"
                                                                                                    title=""
                                                                                                    data-bs-original-title="click Me"
                                                                                                    className="Action_perform">Approve/Reject</span>
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                )}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </>
                                                                    }
                                                                    
                                                                    
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`tab-pane fade pt-4 message_accordion ${props.tabType === 'message' ? `active show` : ``}`}
                                id="messages" role="tabpanel" aria-labelledby="messages-tab">
                                <EnvMessages envelopeData={envelopeData} recipientList={recipientList}
                                             setLoading={setLoading}/>
                            </div>

                            <EnvHistory envelopeData={envelopeData}/>

                            <EnvSetting envelopeData={envelopeData} setEnvelopeData={setEnvelopeData}
                                        setLoading={setLoading} syncStatusList={syncStatusList}/>
                        </div>
                    </>
                    }

                    {isEditRequest &&
                    <EditRequest setIsEditRequest={setIsEditRequest} envelopeData={envelopeData} isTemplate={isTemplate}
                                 setEnvelopeData={setEnvelopeData} setIsRefresh={setIsRefresh} setLoading={setLoading}/>
                    }
                </div>
            </section>

            <BulkMessage recipientList={recipientList} setRecipientList={setRecipientList} envelopeData={envelopeData}
                         setLoading={setLoading}/>

            <div ref={approveRejectDocumentModelRef} data-bs-toggle="offcanvas" data-bs-target="#ApproveRejectDoc"
                 aria-controls="ApproveRejectDoc"/>
            <ApproveRejectDoc docDetail={docDetail} setDocDetail={setDocDetail} setLoading={setLoading}
                              statusList={statusList} setStatusList={setStatusList} docFormList={docFormList}
                              setDocFormList={setDocFormList} setDocList={setDocList}/>

            <div ref={DownloadDataModelRef} data-bs-toggle="offcanvas" data-bs-target="#DownloadDataDoc"
                 aria-controls="DownloadDataDoc"/>
            <DownloadDataDoc setLoading={setLoading} downloadDataList={downloadDataList}
                             setDownloadDataList={setDownloadDataList}/>

            <div ref={viewDocumentModelRef} data-bs-toggle="offcanvas" data-bs-target="#viewDocument"
                 aria-controls="viewDocument"/>
            <ViewDocument docDetail={docDetail} setDocDetail={setDocDetail} setLoading={setLoading}/>

            <div ref={approveRejectDataModelRef} data-bs-toggle="offcanvas" data-bs-target="#ApproveRejectForm"
                 aria-controls="ApproveRejectForm"/>
            <ApproveRejectForm formDetail={formDetail} setFormDetail={setFormDetail} setLoading={setLoading}
                               statusList={statusList} setStatusList={setStatusList} docFormList={docFormList}
                               setDocFormList={setDocFormList} setFormList={setFormList}/>

            <div ref={viewDataModelRef} data-bs-target="#viewDataForm" data-bs-toggle="offcanvas"
                 aria-controls="viewDataForm"/>
            <ViewDataForm formDetail={formDetail} setFormDetail={setFormDetail} setLoading={setLoading}/>


            <div ref={viewSignDocumentModelRef} data-bs-toggle="offcanvas" data-bs-target="#viewSignDocument"
                 aria-controls="viewSignDocument"/>
            <ViewSignDocument windowHeight={windowHeight} setWindowHeight={setWindowHeight} signDocDetail={signDocDetail} setSignDocDetail={setSignDocDetail} setLoading={setLoading}/>
            
            <div ref={approveRejectSignDocumentModelRef} data-bs-toggle="offcanvas" data-bs-target="#ApproveRejectSignDoc"
                 aria-controls="ApproveRejectSignDoc"/>
            <ApproveRejectSignDoc signDocDetail={signDocDetail} setSignDocDetail={setSignDocDetail} setLoading={setLoading}
                              statusList={statusList} setStatusList={setStatusList} docFormList={docFormList}
                              setDocFormList={setDocFormList} setDocList={setDocList} signDocList={signDocList} setSignDocList={setSignDocList}/>


            <TransferEnvelope closeEnvelope={closeEnvelope} setCloseEnvelope={setCloseEnvelope}
                              senderList={senderList} setLoading={setLoading} setIsRefresh={setIsRefresh}/>

            <CloseEnvelope closeEnvelope={closeEnvelope} setCloseEnvelope={setCloseEnvelope}
                           setLoading={setLoading}/>

            <ResendEnvelope resendEnvelope={resendEnvelope} setResendEnvelope={setResendEnvelope}
                            setLoading={setLoading}/>
        </>
    );
}

export default ViewEnvelope;