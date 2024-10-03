import React, {useState, useRef} from "react";
import {manageEnvelopeDocFormStatusUpdate} from "../../../../../services/CommonService";
// import {
//     docAdditionalFieldsUpdate,
//     docUploadClient, getEnvelopeDocumentCheckStorage,
//     manageEnvelopeDocFormStatusUpdate, manageEnvelopeDocumentDetail,
//     removeDocUploadClient
// } from "../../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
//import DatePicker from "react-datepicker";

function ApproveRejectSignDoc(props) {
    const [chooseButton, setChooseButton] = useState(0);
    const [reason, setReason] = useState('');
    let errorsObj = {reason: ''};
    const [errors, setErrors] = useState(errorsObj);

    //const [fileKey, setFileKey] = useState(Date.now);

    const clsApproveRejectSignDocRef = useRef(null);
    //const dueDateRef = useRef(null);

    const hideApproveRejectSignDoc = (e) => {
        e.preventDefault();

        props.setSignDocDetail({
            id: 0,
            envelope_id: 0,
            recipient_id: 0,
            is_call: false,
            sign_doc_detail: {}
        });
        setReason('');
        setChooseButton(0);
        //setFileKey(Date.now);
    };

    const handleDownload = async (e, obj) => {
        e.preventDefault();

        props.setLoading(true);
        await Utils.downloadAnyFile(obj.file_path, obj.file_name);
        props.setLoading(false);
    };

    const handleAcceptRejectSignDoc = async (e, type) => {
        
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
            id: props.signDocDetail?.id,
            envelope_id: props.signDocDetail?.envelope_id,
            recipient_id: props.signDocDetail?.recipient_id,
            entity_type: 3,
            reason: (type === 2) ? reason : '',
            status: (type === 1) ? 3 : 4,
            ip_address: ipAddress
        };


        manageEnvelopeDocFormStatusUpdate(obj)
            .then(response => {
                
                let dataList = {...props.docFormList};
                let sList = [...props.statusList];
                let signDocumentList = dataList.sign_doc_list;
            
                let index = signDocumentList.findIndex(x => parseInt(x.id) === parseInt(props.signDocDetail.id));
                if (index > -1) {
                    signDocumentList[index]['status_id'] = (type === 1) ? 3 : 4;
                    let awaiting = 0;
                    let needReview = 0;
                    let approve = 0;
                    let rejected = 0;
                    for (let i = 0; i < signDocumentList.length; i++) {
                        if (parseInt(signDocumentList[i]['status_id']) === 1) {
                            awaiting++;
                        } else if (parseInt(signDocumentList[i]['status_id']) === 2) {
                            needReview++;
                        } else if (parseInt(signDocumentList[i]['status_id']) === 3) {
                            approve++;
                        } else if (parseInt(signDocumentList[i]['status_id']) === 4) {
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
                            props.setSignDocList(signDocumentList);
                        } else {
                            let sdList = [];
                            for (let i = 0; i < signDocumentList.length; i++) {
                                if (parseInt(signDocumentList[i]['status_id']) === parseInt(sList[statusActiveIndex]['id'])) {
                                    sdList.push(signDocumentList[i]);
                                }
                            }
                            props.setSignDocList(sdList);
                        }
                    }

                    props.setStatusList(sList);
                    dataList.sign_doc_list = signDocumentList;
                    props.setDocFormList(dataList);
                }

                clsApproveRejectSignDocRef?.current.click();
                props.setLoading(false);
                toast.success(response.data.message);

            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    /*
    const handleSignDocFile = async (e) => {
        e.preventDefault();
        
        
        if (e.target.files.length > 0) {

            props.setLoading(true);
            const formData = new FormData();
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
                await getEnvelopeDocumentCheckStorage({kb: totalKb})
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
                docUploadClient(formData)
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
    */
    /*
    const updateSignDocDetail = () => {
        let obj = {
            id: props.docDetail?.id,
            envelope_id: props.docDetail?.envelope_id,
            recipient_id: props.docDetail?.recipient_id
        };
        props.setLoading(true);
        
        manageEnvelopeDocumentDetail(obj)
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
    */


    const removeUploadSignDoc = (e, data) => {
        e.preventDefault();
        /*
        props.setLoading(true);
        let obj = {
            id: data.id,
            envelope_id: props.docDetail?.envelope_id,
            recipient_id: props.docDetail?.recipient_id,
        };
        removeDocUploadClient(obj)
            .then(response => {
                props.setLoading(false);
                updateDocDetail();
                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
        */
    };

   
    //console.log(props);
    
   

    return (
        <div className="offcanvas offcanvas-end ManageDocument" data-bs-scroll="true" tabIndex="-1"
             data-bs-keyboard="false" data-bs-backdrop="static" id="ApproveRejectSignDoc"
             aria-labelledby="ApproveRejectSignDocLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="ApproveRejectSignDocLabel">Document - Manage</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        ref={clsApproveRejectSignDocRef} onClick={hideApproveRejectSignDoc} aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                <h5 className="offcanvas-title text_blue mx-3 mb-3 fw-bold">Document Received</h5>
                <div className="card mb-3 mx-3">
                    <div className="d-flex flexWrap position_unset align-items-center justify-content-between mb-3">
                        <h5 className="offcanvas-title mx-3 text_black">File Received</h5>
                        <span
                            className={`${props?.signDocDetail?.sign_doc_detail?.status_id === 1 ? `bg_light_blue` : props?.signDocDetail?.sign_doc_detail?.status_id === 2 ? `bg_light_yellow` : props?.signDocDetail?.sign_doc_detail?.status_id === 3 ? `bg_light_green` : `bg_light_ping`} d-block`}>{props?.signDocDetail?.sign_doc_detail?.status_id === 1 ? `Awating to Sign` : props?.signDocDetail?.sign_doc_detail?.status_id === 2 ? `Needs Review` : props?.signDocDetail?.sign_doc_detail?.status_id === 3 ? `Approved` : `Rejected`}</span>
                    </div>

                    {props?.signDocDetail?.sign_doc_detail?.upload_file_list && props?.signDocDetail?.sign_doc_detail?.upload_file_list.map((item, index) =>
                        <h2 key={index} className="request_document_tab  mb-3 position-relative">
                            <div className="d-flex justify-content-between flex_wrap align-items-center">
                                <div className="accordion_text text_blue">
                                    {item.file_name}
                                    {item.is_upload_client === 1 && (
                                        <i className="fa fa-times-circle ms-2 text-black cur-pointer"
                                           onClick={(e) => removeUploadSignDoc(e, item)} aria-hidden="true"/>
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

                    {props?.signDocDetail?.sign_doc_detail?.notes &&
                    <div className="rejected_note bg_offwhite mb-3">
                        <p>{props?.signDocDetail?.sign_doc_detail?.notes}</p>
                        <span className="side_image">
                            <img src="/images/note.png" alt="..."/>
                        </span>
                    </div>
                    }

                    {/* <label htmlFor="upload_client_file" className="btn upload_client_btn mb-3 d-flex align-items-center">
                        <span className="mr-10px"><i className="fa fa-download round_blue" aria-hidden="true"/></span>
                        <span>Download</span>
                    </label> */}

                    {/* <label htmlFor="upload_client_file" className="btn upload_client_btn mb-3">Upload client
                        files</label>
                    <input type="file" key={fileKey} onChange={handleSignDocFile} id="upload_client_file"
                           className="d-none" accept="image/*,application/pdf,application/msword"/> */}

                    
                </div>

                <h5 className="offcanvas-title text_blue mx-3 mb-3 fw-bold">Document Requested</h5>
                <div className="accordion mx-3 mb-3" id="Sign_Document_medicard">
                    <div className="accordion-item">
                        <h2 className="accordion-header " id="SignMedicareRejected">
                            <button className="accordion-button " type="button" data-bs-toggle="collapse"
                                    data-bs-target="#Sign-Medicare-Rejected" aria-expanded="true"
                                    aria-controls="Sign-Medicare-Rejected">
                                {props?.signDocDetail?.sign_doc_detail?.doc_name}
                            </button>
                        </h2>
                        <div id="Sign-Medicare-Rejected" className="accordion-collapse collapse show"
                             aria-labelledby="SignMedicareRejected" data-bs-parent="#Sign_Document_medicard">
                            <div className="accordion-body">
                                <p className="mb-3 p_tag">{props?.signDocDetail?.sign_doc_detail?.doc_detail}</p>
                                <div className="download_document">
                                    {props?.signDocDetail?.sign_doc_detail?.file_list && props?.signDocDetail?.sign_doc_detail?.file_list.map((item, index) =>
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
                


                {props?.signDocDetail?.sign_doc_detail?.status_id && props?.signDocDetail?.sign_doc_detail?.status_id > 1 &&
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
                        <button type="button" onClick={(e) => handleAcceptRejectSignDoc(e, 2)}
                                className="btn btn-danger RejectButton ms-3">
                            <i className="fa fa-check-square me-2"/> Reject
                        </button>
                    </div>
                    }

                    {chooseButton === 0 &&
                    <div className="modal-footer justify-content-center approve_reject">
                        {props?.signDocDetail?.sign_doc_detail?.status_id === 2 && (
                            <>
                                <button type="button" className="btn btn-primary approve_btn"
                                        onClick={(e) => handleAcceptRejectSignDoc(e, 1)}>
                                    <i className="fa fa-check-circle" aria-hidden="true"/> Approve
                                </button>
                                <button type="button" className="btn btn-secondary reject_btn"
                                        onClick={(e) => setChooseButton(2)}>
                                    <i className="fa fa-times-circle" aria-hidden="true"/>
                                    <i className="fa fa-square-check"/> Reject
                                </button>
                            </>
                        )}
                        {props?.signDocDetail?.sign_doc_detail?.status_id === 4 && (
                            <>
                                <button type="button" className="btn btn-primary approve_btn"
                                        onClick={(e) => handleAcceptRejectSignDoc(e, 1)}>
                                    <i className="fa fa-check-circle" aria-hidden="true"/> Approve
                                </button>
                                <button type="button" className="btn btn-danger cur-no-drop reject_btn">
                                    <i className="fa fa-times-circle" aria-hidden="true"/>
                                    <i className="fa fa-square-check"/> Rejected
                                </button>
                            </>
                        )}
                        {props?.signDocDetail?.sign_doc_detail?.status_id === 3 && (
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

export default ApproveRejectSignDoc;