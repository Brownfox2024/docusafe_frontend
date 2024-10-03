import React, {useState, useRef} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../../utils";
import {
    adminDocAdditionalFieldsUpdate,
    adminDocUploadClient, adminGetEnvelopeDocumentCheckStorage,
    adminManageEnvelopeDocFormStatusUpdate, adminManageEnvelopeDocumentDetail,
    adminRemoveDocUploadClient
} from "../../../../../../services/AdminService";
import {DATE_FORMAT_LIST} from "../../../../../../configs/AppConfig";
import DatePicker from "react-datepicker";

function AdminApproveRejectDoc(props) {
    const {client} = useParams();
    const [chooseButton, setChooseButton] = useState(0);
    const [reason, setReason] = useState('');
    let errorsObj = {reason: ''};
    const [errors, setErrors] = useState(errorsObj);

    const [fileKey, setFileKey] = useState(Date.now);

    const clsApproveRejectDocRef = useRef(null);
    const dueDateRef = useRef(null);

    const hideApproveRejectDoc = (e) => {
        e.preventDefault();

        props.setDocDetail({
            id: 0,
            envelope_id: 0,
            recipient_id: 0,
            is_call: false,
            doc_detail: {}
        });
        setReason('');
        setChooseButton(0);
        setFileKey(Date.now);
    };

    const handleDownload = async (e, obj) => {
        e.preventDefault();

        props.setLoading(true);
        await Utils.downloadAnyFile(obj.file_path, obj.file_name);
        props.setLoading(false);
    };

    const handleAcceptRejectDoc = async (e, type) => {
        e.preventDefault();
        let errorObj = {...errorsObj};
        let error = false;
        if (type === 2 && !reason) {
            errorObj.reason = 'Please enter reason';
            error = true;
        }

        setErrors(errorObj);
        if (error) return;

        props.setLoading(true);

        let ipAddress = '';
        await Utils.getIpAddress().then(response => {
            ipAddress = response;
        });

        let obj = {
            client_id: client,
            id: props.docDetail?.id,
            envelope_id: props.docDetail?.envelope_id,
            recipient_id: props.docDetail?.recipient_id,
            entity_type: 1,
            reason: (type === 2) ? reason : '',
            status: (type === 1) ? 3 : 4,
            ip_address: ipAddress
        };

        adminManageEnvelopeDocFormStatusUpdate(obj)
            .then(response => {
                let dataList = {...props.docFormList};
                let sList = [...props.statusList];
                let documentList = dataList.doc_list;

                let index = documentList.findIndex(x => parseInt(x.id) === parseInt(props.docDetail.id));
                if (index > -1) {
                    documentList[index]['status_id'] = (type === 1) ? 3 : 4;
                    let awaiting = 0;
                    let needReview = 0;
                    let approve = 0;
                    let rejected = 0;
                    for (let i = 0; i < documentList.length; i++) {
                        if (parseInt(documentList[i]['status_id']) === 1) {
                            awaiting++;
                        } else if (parseInt(documentList[i]['status_id']) === 2) {
                            needReview++;
                        } else if (parseInt(documentList[i]['status_id']) === 3) {
                            approve++;
                        } else if (parseInt(documentList[i]['status_id']) === 4) {
                            rejected++;
                        }
                    }

                    for (let i = 0; i < dataList.form_list.length; i++) {
                        if (parseInt(dataList.form_list[i]['status_id']) === 1) {
                            awaiting++;
                        } else if (parseInt(dataList.form_list[i]['status_id']) === 2) {
                            needReview++;
                        } else if (parseInt(dataList.form_list[i]['status_id']) === 3) {
                            approve++;
                        } else if (parseInt(dataList.form_list[i]['status_id']) === 4) {
                            rejected++;
                        }
                    }

                    for (let i = 1; i <= 4; i++) {
                        let idx = sList.findIndex(x => parseInt(x.id) === i);
                        if (idx === 1) {
                            sList[idx]['total'] = awaiting;
                        } else if (idx === 2) {
                            sList[idx]['total'] = needReview;
                        } else if (idx === 3) {
                            sList[idx]['total'] = approve;
                        } else if (idx === 4) {
                            sList[idx]['total'] = rejected;
                        }
                    }

                    let statusActiveIndex = sList.findIndex(x => x.active === true);
                    if (statusActiveIndex > -1) {
                        if (parseInt(sList[statusActiveIndex]['id']) === 0) {
                            props.setDocList(documentList);
                        } else {
                            let dList = [];
                            for (let i = 0; i < documentList.length; i++) {
                                if (parseInt(documentList[i]['status_id']) === parseInt(sList[statusActiveIndex]['id'])) {
                                    dList.push(documentList[i]);
                                }
                            }
                            props.setDocList(dList);
                        }
                    }

                    props.setStatusList(sList);
                    dataList.doc_list = documentList;
                    props.setDocFormList(dataList);
                }

                clsApproveRejectDocRef?.current.click();
                props.setLoading(false);

                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleDocFile = async (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {

            props.setLoading(true);
            const formData = new FormData();
            formData.append('client_id', client);
            formData.append('id', props.docDetail?.id);
            formData.append('envelope_id', props.docDetail?.envelope_id);
            formData.append('recipient_id', props.docDetail?.recipient_id);
            formData.append('files', e.target.files[0]);

            let totalKb = 0;
            let kb = e.target.files[0]["size"] / 1000;
            totalKb += parseFloat(kb);

            let isCall = true;

            if (totalKb > 0) {
                isCall = false;
                await adminGetEnvelopeDocumentCheckStorage({kb: totalKb, client_id: client})
                    .then((res) => {
                        if (res.data.is_storage_full === false) {
                            isCall = true;
                        } else {
                            toast.error(res.data.message);
                            props.setLoading(false);
                        }
                    }).catch(err => {
                        props.setLoading(false);
                        toast.error(Utils.getErrorMessage(err));
                    });
            }

            if (isCall === true) {
                adminDocUploadClient(client, formData)
                    .then(response => {
                        props.setLoading(false);
                        setFileKey(Date.now);
                        updateDocDetail();
                        toast.success(response.data.message);
                    })
                    .catch(err => {
                        props.setLoading(false);
                        setFileKey(Date.now);
                        toast.error(Utils.getErrorMessage(err));
                    });
            }
        }
    };

    const updateDocDetail = () => {
        let obj = {
            client_id: client,
            id: props.docDetail?.id,
            envelope_id: props.docDetail?.envelope_id,
            recipient_id: props.docDetail?.recipient_id
        };
        props.setLoading(true);
        adminManageEnvelopeDocumentDetail(obj)
            .then(response => {
                let docDetail = {...props.docDetail};
                docDetail.doc_detail = response.data.data;
                docDetail.is_call = false;
                props.setDocDetail(docDetail);
                props.setLoading(false);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                clsApproveRejectDocRef?.current.click();
                props.setLoading(false);
            });
    };

    const handleUpdateExpiryDate = (e) => {
        e.preventDefault();

        let data = {...props.docDetail};

        props.setLoading(true);
        let obj = {
            client_id: client,
            id: props.docDetail?.id,
            envelope_id: props.docDetail?.envelope_id,
            recipient_id: props.docDetail?.recipient_id,
            date_text: data.doc_detail.date_text
        };
        adminDocAdditionalFieldsUpdate(obj)
            .then(response => {
                props.setLoading(false);
                data.is_call = true;
                props.setDocDetail(data);
                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const removeUploadDoc = (e, data) => {
        e.preventDefault();

        props.setLoading(true);
        let obj = {
            client_id: client,
            id: data.id,
            envelope_id: props.docDetail?.envelope_id,
            recipient_id: props.docDetail?.recipient_id,
        };
        adminRemoveDocUploadClient(obj)
            .then(response => {
                props.setLoading(false);
                updateDocDetail();
                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const showDatePlaceholder = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['text'];
        }
        return value;
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

    const handleDateFormat = (date) => {
        let data = {...props.docDetail};
        data.doc_detail.date_format_text = date;
        data.doc_detail.date_text = Utils.expiryDateFormatText(date);
        props.setDocDetail(data);
    };

    return (
        <div className="offcanvas offcanvas-end ManageDocument" data-bs-scroll="true" tabIndex="-1"
             data-bs-keyboard="false" data-bs-backdrop="static" id="ApproveRejectDoc"
             aria-labelledby="ApproveRejectDocLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="ApproveRejectDocLabel">Document - Manage</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        ref={clsApproveRejectDocRef} onClick={hideApproveRejectDoc} aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                <h5 className="offcanvas-title text_blue mx-3 mb-3 fw-bold">Document Received</h5>
                <div className="card mb-3 mx-3">
                    <div className="d-flex flexWrap position_unset align-items-center justify-content-between mb-3">
                        <h5 className="offcanvas-title mx-3 text_black">File Received</h5>
                        <span
                            className={`${props?.docDetail?.doc_detail?.status_id === 1 ? `bg_light_blue` : props?.docDetail?.doc_detail?.status_id === 2 ? `bg_light_yellow` : props?.docDetail?.doc_detail?.status_id === 3 ? `bg_light_green` : `bg_light_ping`} d-block`}>{props?.docDetail?.doc_detail?.status_id === 1 ? `Awating to Upload` : props?.docDetail?.doc_detail?.status_id === 2 ? `Needs Review` : props?.docDetail?.doc_detail?.status_id === 3 ? `Approved` : `Rejected`}</span>
                    </div>

                    {props?.docDetail?.doc_detail?.upload_file_list && props?.docDetail?.doc_detail?.upload_file_list.map((item, index) =>
                        <h2 key={index} className="request_document_tab  mb-3 position-relative">
                            <div className="d-flex justify-content-between flex_wrap align-items-center">
                                <div className="accordion_text text_blue">
                                    {item.file_name}
                                    {item.is_upload_client === 1 && (
                                        <i className="fa fa-times-circle ms-2 text-black cur-pointer"
                                           onClick={(e) => removeUploadDoc(e, item)} aria-hidden="true"/>
                                    )}
                                </div>
                                <div className="d-flex">
                                    <span className="cur-pointer" onClick={(e) => handleDownload(e, item)}>
                                        <i className="fa fa-download round_blue" aria-hidden="true"/>
                                    </span>
                                </div>
                            </div>
                        </h2>
                    )}

                    {props?.docDetail?.doc_detail?.notes &&
                    <div className="rejected_note bg_offwhite mb-3">
                        <p>{props?.docDetail?.doc_detail?.notes}</p>
                        <span className="side_image">
                            <img src="/images/note.png" alt="..."/>
                        </span>
                    </div>
                    }

                    <label htmlFor="upload_client_file" className="btn upload_client_btn mb-3">Upload client
                        files</label>
                    <input type="file" key={fileKey} onChange={handleDocFile} id="upload_client_file"
                           className="d-none" accept="image/*,application/pdf,application/msword"/>

                    {props?.docDetail?.doc_detail?.date_format > 0 && (
                        <>
                            <div
                                className="d-flex flexWrap position_unset align-items-center justify-content-between mb-3">
                                <h5 className="offcanvas-title mx-3 text_black">Expiry Date</h5>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 position-relative">
                                    <DatePicker
                                        selected={showDate(props?.docDetail?.doc_detail?.date_format_text)}
                                        dateFormat={showDateFormat(props?.docDetail?.doc_detail?.date_format)}
                                        className="form-control" ref={dueDateRef}
                                        placeholderText={showDatePlaceholder(props?.docDetail?.doc_detail?.date_format)}
                                        onChange={(date) => handleDateFormat(date)}/>
                                    <i className="fa fa-calendar calendar-new"
                                       onClick={(e) => dueDateRef?.current.setFocus(true)}/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <button type="button" onClick={handleUpdateExpiryDate}
                                            className="btn btn-primary pull-right rounded-5 mt-3">Update
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <h5 className="offcanvas-title text_blue mx-3 mb-3 fw-bold">Document Requested</h5>
                <div className="accordion mx-3 mb-3" id="Document_medicard">
                    <div className="accordion-item">
                        <h2 className="accordion-header " id="MedicareRejected">
                            <button className="accordion-button " type="button" data-bs-toggle="collapse"
                                    data-bs-target="#Medicare-Rejected" aria-expanded="true"
                                    aria-controls="Medicare-Rejected">
                                {props?.docDetail?.doc_detail?.doc_name}
                            </button>
                        </h2>
                        <div id="Medicare-Rejected" className="accordion-collapse collapse show"
                             aria-labelledby="MedicareRejected" data-bs-parent="#Document_medicard">
                            <div className="accordion-body">
                                <p className="mb-3 p_tag">{props?.docDetail?.doc_detail?.doc_detail}</p>
                                <div className="download_document">
                                    {props?.docDetail?.doc_detail?.file_list && props?.docDetail?.doc_detail?.file_list.map((item, index) =>
                                        <span key={index} onClick={(e) => handleDownload(e, item)}
                                              className="download_box text_blue background_grey_400 w-100 border-0">
                                                {item.file_name}
                                            <i className="fa fa-download ms-3 round_blue" aria-hidden="true"/>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {props?.docDetail?.doc_detail?.status_id && props?.docDetail?.doc_detail?.status_id > 1 &&
                <>
                    {chooseButton === 2 &&
                    <div className="reject_btn_input mx-3 text-center d-block">
                        <textarea className={`form-control ${errors.reason ? `` : `mb-3`}`} id="email_text" rows="2"
                                  value={reason} onChange={(e) => setReason(e.target.value)}
                                  placeholder="Type Rejection Note"/>
                        {errors.reason && <div className="text-danger mb-3">{errors.reason}</div>}
                        <button type="button" className="btn btn btn-outline-secondary rounded-5"
                                onClick={(e) => setChooseButton(0)}>
                            <i className="fa fa-arrow-left me-2" aria-hidden="true"/> Back
                        </button>
                        <button type="button" onClick={(e) => handleAcceptRejectDoc(e, 2)}
                                className="btn btn-danger RejectButton ms-3">
                            <i className="fa fa-check-square me-2"/> Reject
                        </button>
                    </div>
                    }

                    {chooseButton === 0 &&
                    <div className="modal-footer justify-content-center approve_reject">
                        {props?.docDetail?.doc_detail?.status_id === 2 && (
                            <>
                                <button type="button" className="btn btn-primary approve_btn"
                                        onClick={(e) => handleAcceptRejectDoc(e, 1)}>
                                    <i className="fa fa-check-circle" aria-hidden="true"/> Approve
                                </button>
                                <button type="button" className="btn btn-secondary reject_btn"
                                        onClick={(e) => setChooseButton(2)}>
                                    <i className="fa fa-times-circle" aria-hidden="true"/>
                                    <i className="fa fa-square-check"/> Reject
                                </button>
                            </>
                        )}
                        {props?.docDetail?.doc_detail?.status_id === 4 && (
                            <>
                                <button type="button" className="btn btn-primary approve_btn"
                                        onClick={(e) => handleAcceptRejectDoc(e, 1)}>
                                    <i className="fa fa-check-circle" aria-hidden="true"/> Approve
                                </button>
                                <button type="button" className="btn btn-danger cur-no-drop reject_btn">
                                    <i className="fa fa-times-circle" aria-hidden="true"/>
                                    <i className="fa fa-square-check"/> Rejected
                                </button>
                            </>
                        )}
                        {props?.docDetail?.doc_detail?.status_id === 3 && (
                            <>
                                <button type="button" className="btn btn-success cur-no-drop approve_btn">
                                    <i className="fa fa-check-circle" aria-hidden="true"/> Approved
                                </button>
                                <button type="button" className="btn btn-danger reject_btn"
                                        onClick={(e) => setChooseButton(2)}>
                                    <i className="fa fa-times-circle" aria-hidden="true"/>
                                    <i className="fa fa-square-check"/> Reject
                                </button>
                            </>
                        )}
                    </div>
                    }
                </>
                }
            </div>
        </div>
    );
}

export default AdminApproveRejectDoc;