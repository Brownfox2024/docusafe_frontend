import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../../utils";
import {
    NAME_CONVENTION,
    OVERDUE_REMINDER,
    PASSWORD_LIST,
    SEND_REMINDER,
    SYNC_STATUS
} from "../../../../../../configs/AppConfig";
import {Lang} from "../../../../../../lang";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import RequestForm from "./RequestForm";
import DocumentViewTemplate from "./DocumentViewTemplate";
import {adminGetEnvelopeSenderList, adminGetTemplateEnvelope} from "../../../../../../services/AdminService";

function AdminViewTemplateShare(props) {
    const navigate = useNavigate();
    let {id, client} = useParams();
    const [loading, setLoading] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [allSenders, setAllSenders] = useState([]);
    const [selectedSenders, setSelectedSenders] = useState([]);
    const [envelopeName, setEnvelopeName] = useState('');
    const [clientMessage, setClientMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [emailText, setEmailText] = useState('');
    const [documentList, setDocumentList] = useState([]);
    const [requestFormList, setRequestFormList] = useState([]);

    const animatedComponents = makeAnimated();

    const [nameConvention, setNameConvention] = useState(1);
    const [cloudSync, setCloudSync] = useState(0);
    const [sendReminder, setSendReminder] = useState(0);
    const [overdueReminder, setOverdueReminder] = useState(0);
    const [isPassword, setIsPassword] = useState(0);
    const [password, setPassword] = useState('');
    const [referenceId, setReferenceId] = useState('');

    let docObj = {
        id: 0,
        name: '',
        detail: '',
        files: [],
        date_format: 0,
        remove_doc_id: []
    };
    const [docData, setDocData] = useState(docObj);

    let formObj = {
        id: 0,
        name: '',
        questions: []
    };
    const [formData, setFormData] = useState(formObj);

    useEffect(function () {
        setLoading(true);
        adminGetEnvelopeSenderList({client_id: client})
            .then(responseData => {
                let sList = responseData.data.data;
                let selectedSenderList = [];
                for (let i = 0; i < sList.length; i++) {
                    selectedSenderList.push({
                        value: parseInt(sList[i]['id']),
                        label: sList[i]['first_name'] + ' ' + sList[i]['last_name']
                    });
                }
                setAllSenders(selectedSenderList);

                adminGetTemplateEnvelope({uuid: id, client_id: client})
                    .then(response => {
                        setBreadcrumbs(response.data.breadcrumbs);
                        setEnvelopeName(response.data.data.envelope_name);
                        setClientMessage(response.data.data.message);
                        setSubject(response.data.data.email_subject);
                        setEmailText(response.data.data.email_text);
                        setDocumentList(response.data.data.document_list);
                        setRequestFormList(response.data.data.request_form_list);
                        setNameConvention((response.data.data.name_convention) ? parseInt(response.data.data.name_convention) : 1);
                        setCloudSync((response.data.data.cloud_sync) ? parseInt(response.data.data.cloud_sync) : 0);
                        setSendReminder((response.data.data.send_reminder) ? parseInt(response.data.data.send_reminder) : 0);
                        setOverdueReminder((response.data.data.over_due_reminder) ? parseInt(response.data.data.over_due_reminder) : 0);
                        if (response.data.data.password) {
                            setIsPassword(1);
                            setPassword(response.data.data.password);
                        } else {
                            setIsPassword(0);
                        }
                        setReferenceId((response.data.data.reference_id) ? response.data.data.reference_id : '');

                        let selectedSList = [];
                        if (response.data.data.share_user_ids) {
                            for (let i = 0; i < sList.length; i++) {
                                let index = response.data.data.share_user_ids.findIndex(x => parseInt(x) === parseInt(sList[i]['id']));
                                if (index > -1) {
                                    selectedSList.push({
                                        value: parseInt(sList[i]['id']),
                                        label: sList[i]['first_name'] + ' ' + sList[i]['last_name']
                                    });
                                }
                            }
                        }
                        setSelectedSenders(selectedSList);
                        setLoading(false);
                    })
                    .catch(err => {
                        navigate('/back-admin/client-portal/' + client + '/templates');
                        toast.error(Utils.getErrorMessage(err));
                        setLoading(false);
                    });
            })
            .catch(err => {
                setLoading(false);
                navigate('/back-admin/client-portal/' + client + '/templates');
                toast.error(Utils.getErrorMessage(err));
            });
    }, [id, navigate, props, client]);

    const onBackTemplate = (e) => {
        e.preventDefault();
        navigate('/back-admin/client-portal/' + client + '/templates');
    };

    const handleViewDoc = (e, data) => {
        e.preventDefault();
        let obj = {
            id: data.id,
            name: data.name,
            detail: data.detail,
            files: data.files,
            date_format: data.date_format,
            remove_doc_id: data.remove_doc_id
        };
        setDocData(obj);
    };

    const handleViewRequestForm = (e, data) => {
        e.preventDefault();
        let obj = {
            id: data.id,
            name: data.name,
            questions: data.questions
        };
        setFormData(obj);
    };

    const handlePassword = (e) => {
        setIsPassword(e.target.value);
        setPassword('');
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <div className="templates_page">
                <section className="main_wrapper background_grey_400" style={{minHeight: 'calc(100vh - 119px)'}}>
                    <div className="custom_container">
                        <h2 className="main_title template_main_title">View Template</h2>
                        <div className=" row shadow-lg  mx-0">
                            <div className="col-lg-12 pt-3 px-0">
                                <h2 className="main_title mb-3 d-flex align-items-center justify-content-between bread_crumb flexWrap px-3">
                                    <span>
                                        {breadcrumbs.length === 0 ?
                                            <span>
                                            <i className="fa fa-folder" aria-hidden="true"/> Shared with me
                                        </span>
                                            :
                                            <>
                                                <span className="text_blue">
                                                    <i className="fa fa-folder" aria-hidden="true"/> Shared with me
                                                </span>
                                                {breadcrumbs.map((item, index) =>
                                                    <React.Fragment key={index}>
                                                        <i className="fa fa-angle-double-right mx-3"/>
                                                        <span className={`${item.is_last === true ? `` : `text_blue`}`}>
                                                            <i className="fa fa-folder"
                                                               aria-hidden="true"/> {item.folder_name}
                                                        </span>
                                                    </React.Fragment>
                                                )}
                                            </>
                                        }
                                    </span>
                                    <div className="d-flex">
                                        <button type="button" className="btn shadow load_template_btn me-3 back_btn"
                                                data-toggle="tooltip" data-placement="right" title=""
                                                onClick={onBackTemplate} data-bs-original-title="click Me">
                                            <i className="fa fa-arrow-left me-2" aria-hidden="true"/>Back
                                        </button>
                                    </div>
                                </h2>
                            </div>
                        </div>
                        <div className="bg_white py-4 step_wizard_content mb-3">
                            <div className="row">
                                <div className="col-lg-1"/>
                                <div className="col-lg-10">
                                    <h2 className="main_title ps-0 d-flex align-items-center">
                                        <span className="round_blue me-2">1</span>Template Directory
                                    </h2>
                                    <div className="card mb-5 shadow-sm">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-0">
                                                    <label className="form-label mb-2">Share with
                                                        <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                           data-toggle="tooltip" data-placement="right"
                                                           title="How Can i help you?"/>
                                                    </label>
                                                    <Select closeMenuOnSelect={true} value={selectedSenders}
                                                            components={animatedComponents} isMulti
                                                            onChange={(e) => setSelectedSenders(e)}
                                                            options={allSenders} isDisabled={true}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="main_title d-flex align-items-center ps-0">
                                        <span className="round_blue me-2">2</span>Envelope Details
                                    </h2>
                                    <div className="card mb-5 background_grey_400">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="mb-4">
                                                    <label className="form-label mb-2">Envelope Name
                                                        <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                           data-toggle="tooltip" data-placement="right"
                                                           title={Lang.env_envelope_name}/>
                                                    </label>
                                                    <input type="text" className="form-control" value={envelopeName}
                                                           onChange={(e) => setEnvelopeName(e.target.value)}
                                                           aria-describedby="emailHelp" readOnly
                                                           placeholder="Enter Envelope Name"/>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-0">
                                                    <label className="form-label mb-2">Client Portal Message
                                                        <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                           data-toggle="tooltip" data-placement="right"
                                                           title={Lang.env_client_message}/>
                                                    </label>
                                                    <textarea className="form-control" rows={9} value={clientMessage}
                                                              onChange={(e) => setClientMessage(e.target.value)}
                                                              readOnly placeholder="Enter Message to Client"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="main_title ps-0 d-flex align-items-center">
                                        <span className="round_blue me-2">3</span>Email Details
                                    </h2>
                                    <div className="card p-3 background_grey_400 mb-5">
                                        <div className="mb-4">
                                            <label htmlFor="email_subject" className="form-label mb-2">Subject
                                                <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                   data-toggle="tooltip" data-placement="right"
                                                   title={Lang.env_subject}/>
                                            </label>
                                            <input type="text" className="form-control" id="email_subject" readOnly
                                                   value={subject} onChange={(e) => setSubject(e.target.value)}
                                                   aria-describedby="emailHelp" placeholder="Enter Email Subject"/>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="email_text" className="form-label mb-2">Email Text
                                                <i className="fa fa-question-circle ms-2" aria-hidden="true"
                                                   data-toggle="tooltip" data-placement="right"
                                                   title={Lang.env_email_text}/>
                                            </label>
                                            <textarea className="form-control" rows={12} value={emailText}
                                                      onChange={(e) => setEmailText(e.target.value)} readOnly
                                                      placeholder="Enter Email text box"/>
                                        </div>
                                    </div>

                                    <div className=" mb-4 d-flex justify-content-between flex_wrap">
                                        <h2 className="main_title ps-0 d-flex align-items-center">
                                            <span className="round_blue me-2">4</span>Request Documents
                                        </h2>
                                    </div>
                                    <div className="mt-4 mb-5 card p-3 background_grey_400">
                                        {documentList.map((item, index) =>
                                            <h2 key={index} className="request_document_tab  mb-2">
                                                <div className="d-flex justify-content-between">
                                                    <div className="accordion_text">
                                                        <img src="/images/dots_rectangle.png" alt="..."
                                                             className="me-3"/>
                                                        {item.name}
                                                    </div>
                                                    <div className="functional_icons d-flex align-items-center">
                                                    <span className="functional_icon_round"
                                                          data-toggle="tooltip" data-placement="right" title=""
                                                          data-bs-original-title="click Me">
                                                        <i className="fa fa-users" aria-hidden="true"/>
                                                    </span>
                                                        <div className="dropdown">
                                                        <span className="functional_icon_ellipsis"
                                                              id="dropdownMenuButton1" data-bs-toggle="dropdown"
                                                              aria-expanded="false">
                                                            <i className="fa fa-ellipsis-v"/>
                                                        </span>
                                                            <ul className="dropdown-menu"
                                                                aria-labelledby="dropdownMenuButton1">
                                                                <li data-bs-toggle="offcanvas"
                                                                    data-bs-target="#Add-document"
                                                                    aria-controls="Add-document"
                                                                    onClick={(e) => handleViewDoc(e, item)}>
                                                                <span className="dropdown-item">
                                                                    <i className="fa fa-eye me-2"
                                                                       aria-hidden="true"/> View
                                                                </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </h2>
                                        )}
                                    </div>

                                    <div className=" mb-4 d-flex justify-content-between flex_wrap">
                                        <h2 className="main_title ps-0 d-flex align-items-center">
                                            <span className="round_blue me-2">5</span>Request Information
                                        </h2>
                                    </div>
                                    <div className="mt-4 mb-5 card p-3 background_grey_400">
                                        {requestFormList.map((item, index) =>
                                            <h2 key={index} className="request_document_tab yellow mb-2">
                                                <div className="d-flex justify-content-between">
                                                    <div className="accordion_text">
                                                        <img src="/images/dots_rectangle.png" alt="..."
                                                             className="me-3"/>{item.name}
                                                    </div>
                                                    <div className="functional_icons d-flex align-items-center">
                                                    <span className="functional_icon_round"
                                                          data-toggle="tooltip" data-placement="right" title=""
                                                          data-bs-original-title="click Me">
                                                        <i className="fa fa-users" aria-hidden="true"/>
                                                    </span>
                                                        <div className="dropdown">
                                                        <span className="functional_icon_ellipsis"
                                                              id="dropdownMenuButton1" data-bs-toggle="dropdown"
                                                              aria-expanded="false">
                                                            <i className="fa fa-ellipsis-v"/>
                                                        </span>
                                                            <ul className="dropdown-menu"
                                                                aria-labelledby="dropdownMenuButton1">
                                                                <li data-bs-toggle="offcanvas"
                                                                    data-bs-target="#MakeForm"
                                                                    aria-controls="MakeForm"
                                                                    onClick={(e) => handleViewRequestForm(e, item)}>
                                                                <span className="dropdown-item">
                                                                    <i className="fa fa-eye me-2"
                                                                       aria-hidden="true"/> View
                                                                </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </h2>
                                        )}
                                    </div>

                                    <div className="accordion tab-pane form_card accordion_style"
                                         id="accordionMedicare">
                                        <div className="accordion-item  border-0 ">
                                            <h2 className="accordion-header" id="MedicareRejected">
                                                <button className="accordion-button bg_blue py-2 " type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#Medicare-Rejected"
                                                        aria-expanded="true" aria-controls="Medicare-Rejected">
                                                    More Settings
                                                </button>
                                            </h2>
                                            <div id="Medicare-Rejected"
                                                 className="accordion-collapse collapse show bg_blue"
                                                 aria-labelledby="MedicareRejected" data-bs-parent="#accordionMedicare">
                                                <div className="accordion-body pt-0">
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="mb-0">
                                                                <label className="form-label mb-2">Naming
                                                                    Convention</label>
                                                                <div className="d-flex align-items-center">
                                                                    <select className="form-select" disabled
                                                                            value={nameConvention}
                                                                            onChange={(e) => setNameConvention(e.target.value)}>
                                                                        {NAME_CONVENTION.map((item, index) =>
                                                                            <option key={index}
                                                                                    value={item.id}>{item.value}</option>
                                                                        )}
                                                                    </select>
                                                                    <i className="fa fa-question-circle ms-2"
                                                                       aria-hidden="true" data-toggle="tooltip"
                                                                       data-placement="right"
                                                                       title={Lang.env_naming_convention}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="mb-4 ">
                                                                <label className="form-label mb-2">Cloud Storage
                                                                    Sync</label>
                                                                <div className="d-flex align-items-center">
                                                                    <select className="form-select" value={cloudSync}
                                                                            onChange={(e) => setCloudSync(e.target.value)}
                                                                            disabled>
                                                                        {SYNC_STATUS.map((item, index) =>
                                                                            <option key={index}
                                                                                    value={item.id}>{item.value}</option>
                                                                        )}
                                                                    </select>
                                                                    <i className="fa fa-question-circle ms-2"
                                                                       aria-hidden="true" data-toggle="tooltip"
                                                                       data-placement="right"
                                                                       title={Lang.env_cloud_sync}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="mb-4 ">
                                                                <label className="form-label mb-2">Send Reminder
                                                                    (Email)</label>
                                                                <div className="d-flex align-items-center">
                                                                    <select className="form-select" value={sendReminder}
                                                                            onChange={(e) => setSendReminder(e.target.value)}
                                                                            disabled>
                                                                        {SEND_REMINDER.map((item, index) =>
                                                                            <option key={index}
                                                                                    value={item.id}>{item.value}</option>
                                                                        )}
                                                                    </select>
                                                                    <i className="fa fa-question-circle ms-2"
                                                                       aria-hidden="true" data-toggle="tooltip"
                                                                       data-placement="right"
                                                                       title={Lang.env_send_reminder}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="mb-4 ">
                                                                <label className="form-label mb-2">Overdue
                                                                    Reminder (Email)</label>
                                                                <div className="d-flex align-items-center">
                                                                    <select className="form-select"
                                                                            value={overdueReminder}
                                                                            onChange={(e) => setOverdueReminder(e.target.value)}
                                                                            disabled>
                                                                        {OVERDUE_REMINDER.map((item, index) =>
                                                                            <option key={index}
                                                                                    value={item.id}>{item.value}</option>
                                                                        )}
                                                                    </select>
                                                                    <i className="fa fa-question-circle ms-2"
                                                                       aria-hidden="true" data-toggle="tooltip"
                                                                       data-placement="right"
                                                                       title={Lang.env_overdue_reminder}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="mb-4 ">
                                                                <label className="form-label mb-2">Password
                                                                    Protected</label>
                                                                <div className="d-flex align-items-center">
                                                                    <select className="form-select" value={isPassword}
                                                                            onChange={handlePassword} disabled
                                                                            aria-label="Default select example">
                                                                        {PASSWORD_LIST.map((item, index) =>
                                                                            <option key={index}
                                                                                    value={item.id}>{item.value}</option>
                                                                        )}
                                                                    </select>
                                                                    <i className="fa fa-question-circle ms-2"
                                                                       aria-hidden="true" data-toggle="tooltip"
                                                                       data-placement="right"
                                                                       title={Lang.env_password}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {isPassword > 0 && (
                                                            <div className="col-lg-6">
                                                                <div className="mb-0">
                                                                    <label className="form-label mb-2">Password</label>
                                                                    <div className="d-flex align-items-center">
                                                                        <input type="password" value={password}
                                                                               onChange={(e) => setPassword(e.target.value)}
                                                                               className="form-control"
                                                                               placeholder="Enter password"/>
                                                                        <i className="fa fa-question-circle ms-2"
                                                                           aria-hidden="true" data-toggle="tooltip"
                                                                           data-placement="right"
                                                                           title={Lang.env_password}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="col-lg-6">
                                                            <div className="mb-0 ">
                                                                <label className="form-label mb-2">Reference
                                                                    ID</label>
                                                                <div className="d-flex align-items-center">
                                                                    <input type="text" value={referenceId}
                                                                           onChange={(e) => setReferenceId(e.target.value)}
                                                                           className="form-control" readOnly
                                                                           placeholder="Enter Reference ID"/>
                                                                    <i className="fa fa-question-circle ms-2"
                                                                       aria-hidden="true" data-toggle="tooltip"
                                                                       data-placement="right"
                                                                       title={Lang.env_reference}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-1"/>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <DocumentViewTemplate docData={docData} setDocData={setDocData} documentList={documentList}
                                  setDocumentList={setDocumentList}/>

            <RequestForm formData={formData} setFormData={setFormData} requestFormList={requestFormList}
                         setRequestFormList={setRequestFormList}/>
        </>
    );
}

export default AdminViewTemplateShare;