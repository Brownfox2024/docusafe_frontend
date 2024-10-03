import React, {useRef, useEffect, useState} from "react";
import {
    dataEnterUpdate, envelopeDownloadData, getEnvelopeDocumentCheckStorage, informationQuestionUpdate,
    manageEnvelopeDocFormStatusUpdate
} from "../../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import Axios from "axios";
import FileDownload from "js-file-download";
import DatePicker from "react-datepicker";
import {DATE_FORMAT_LIST} from "../../../../../configs/AppConfig";

function ApproveRejectForm(props) {
    const [chooseButton, setChooseButton] = useState(0);
    const [reason, setReason] = useState('');
    let errorsObj = {reason: ''};
    const [errors, setErrors] = useState(errorsObj);
    const [questionList, setQuestionList] = useState([]);
    const [fileKey, setFileKey] = useState(Date.now);

    const clsApproveRejectFormRef = useRef(null);
    const dateRef = useRef(null);

    useEffect(function () {
        if (props?.formDetail?.form_detail?.questions) {
            setQuestionList(props?.formDetail?.form_detail?.questions);
        }
    }, [props?.formDetail?.form_detail]);

    const hideApproveRejectDoc = (e) => {
        e.preventDefault();

        props.setFormDetail({
            id: 0,
            envelope_id: 0,
            recipient_id: 0,
            is_call: false,
            form_detail: {}
        });
        setReason('');
        setChooseButton(0);
    };

    const handleAcceptRejectForm = async (e, type) => {
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
            id: props.formDetail?.id,
            envelope_id: props.formDetail?.envelope_id,
            recipient_id: props.formDetail?.recipient_id,
            entity_type: 2,
            reason: (type === 2) ? reason : '',
            status: (type === 1) ? 3 : 4,
            ip_address: ipAddress
        };

        manageEnvelopeDocFormStatusUpdate(obj)
            .then(response => {
                let dataList = {...props.docFormList};
                let sList = [...props.statusList];
                let formList = dataList.form_list;

                let index = formList.findIndex(x => parseInt(x.id) === parseInt(props.formDetail.id));
                if (index > -1) {
                    formList[index]['status_id'] = (type === 1) ? 3 : 4;
                    let awaiting = 0;
                    let needReview = 0;
                    let approve = 0;
                    let rejected = 0;
                    for (let i = 0; i < formList.length; i++) {
                        if (parseInt(formList[i]['status_id']) === 1) {
                            awaiting++;
                        } else if (parseInt(formList[i]['status_id']) === 2) {
                            needReview++;
                        } else if (parseInt(formList[i]['status_id']) === 3) {
                            approve++;
                        } else if (parseInt(formList[i]['status_id']) === 4) {
                            rejected++;
                        }
                    }

                    for (let i = 0; i < dataList.doc_list.length; i++) {
                        if (parseInt(dataList.doc_list[i]['status_id']) === 1) {
                            awaiting++;
                        } else if (parseInt(dataList.doc_list[i]['status_id']) === 2) {
                            needReview++;
                        } else if (parseInt(dataList.doc_list[i]['status_id']) === 3) {
                            approve++;
                        } else if (parseInt(dataList.doc_list[i]['status_id']) === 4) {
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
                            props.setFormList(formList);
                        } else {
                            let dList = [];
                            for (let i = 0; i < formList.length; i++) {
                                if (parseInt(formList[i]['status_id']) === parseInt(sList[statusActiveIndex]['id'])) {
                                    dList.push(formList[i]);
                                }
                            }
                            props.setFormList(dList);
                        }
                    }

                    props.setStatusList(sList);
                    dataList.form_list = formList;
                    props.setDocFormList(dataList);
                }

                clsApproveRejectFormRef?.current.click();
                props.setLoading(false);

                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleDataAnswer = (e) => {
        let data = {...props?.formDetail};
        data.form_detail.answer = e.target.value;
        props.setFormDetail(data);
    };

    const handleDataAnswerSubmit = (e) => {
        e.preventDefault();
        let data = {...props?.formDetail};

        props.setLoading(true);

        let obj = {
            id: props.formDetail?.id,
            envelope_id: props.formDetail?.envelope_id,
            recipient_id: props.formDetail?.recipient_id,
            answer: data.form_detail.answer
        };
        dataEnterUpdate(obj)
            .then(response => {
                data.is_call = true;
                props.setFormDetail(data);
                props.setLoading(false);
                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleDownload = async (e, obj) => {
        props.setLoading(true);
        await Utils.downloadAnyFile(obj.path, obj.name);
        props.setLoading(false);
    };

    const handleQuestionAnswer = (e, index) => {
        let formList = [...questionList];
        if (formList[index]['type'] === 5) {
            let selectedAnswer = formList[index]['answer'].split(',');
            let i = selectedAnswer.findIndex(x => parseInt(x) === parseInt(e.target.value));
            if (i > -1) {
                selectedAnswer.splice(i, 1);
            } else {
                selectedAnswer.push(e.target.value);
            }
            for (let o = 0; o < formList[index]['answers'].length; o++) {
                let checked = false;
                let check = selectedAnswer.findIndex(x => parseInt(x) === parseInt(formList[index]['answers'][o]['id']));
                if (check > -1) {
                    checked = true;
                }
                formList[index]['answers'][o]['checked'] = checked;
            }
            let answer = '';
            if (selectedAnswer.length > 0) {
                for (let s = 0; s < selectedAnswer.length; s++) {
                    if (selectedAnswer[s]) {
                        answer += selectedAnswer[s];
                        if (selectedAnswer.length !== (s + 1)) {
                            answer += ',';
                        }
                    }
                }
            }
            formList[index]['answer'] = answer;
        } else if (formList[index]['type'] === 6) {
            if (e.target.files.length > 0) {
                let kb = e.target.files[0].size / 1000;
                formList[index]['answer'] = {
                    name: e.target.files[0].name,
                    kb: parseFloat(kb).toFixed(2),
                    file: e.target.files[0],
                };
                setFileKey(Date.now());
            }
        } else if (formList[index]['type'] === 8) {
            let date = Utils.expiryDateFormatText(e);
            formList[index]['answer'] = date;
        } else {
            formList[index]['answer'] = e.target.value;
        }
        setQuestionList(formList);
    };

    const showDateFormat = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['format'];
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

    const showDatePlaceholder = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['text'];
        }
        return value;
    };

    const removeQuestionFile = (e, index) => {
        e.preventDefault();
        let formList = [...questionList];
        formList[index]['answer'] = '';
        setQuestionList(formList);
    };

    const handleInformationAnswerSubmit = async (e) => {
        e.preventDefault();
        let formList = [...questionList];
        let error = false;

        for (let i = 0; i < formList.length; i++) {
            if ( (formList[i]['answer']) || (formList[i]['type'] === 7) ) {
                formList[i]['error'] = '';
            } else {
                error = true;
                formList[i]['error'] = 'This question is required';
            }
        }
        setQuestionList(formList);

        if (error) return;

        props.setLoading(true);

        const formData = new FormData();
        formData.append('envelope_id', props.formDetail?.envelope_id);
        formData.append('recipient_id', props.formDetail?.recipient_id);
        formData.append('id', props.formDetail?.id);

        let questionData = [];
        let totalKb = 0;
        for (let i = 0; i < formList.length; i++) {
            let obj = {
                question_id: formList[i]['id'],
                type: formList[i]['type'],
                answer: formList[i]['answer']
            };
            if (formList[i]['type'] === 6) {
                if (formList[i]['answer']) {
                    if (formList[i]['answer'].file) {
                        formData.append('file', formList[i]['answer'].file);
                        totalKb += parseFloat(formList[i]['answer'].kb);
                        obj.answer = '';
                    }
                }
            }
            questionData.push(obj);
        }
        formData.append('form_field', JSON.stringify(questionData));

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
            informationQuestionUpdate(formData)
                .then(response => {
                    let data = {...props?.formDetail};
                    data.is_call = true;
                    data.form_detail.questions = formList;
                    props.setFormDetail(data);
                    props.setLoading(false);
                    toast.success(response.data.message);
                })
                .catch(err => {
                    props.setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        }
    };

    const onDataDownload = (e, type) => {
        e.preventDefault();
        let obj = {
            id: props.formDetail?.id,
            envelope_id: props.formDetail?.envelope_id,
            recipient_id: props.formDetail?.recipient_id,
            type: type
        };
        props.setLoading(true);

        envelopeDownloadData(obj)
            .then(response => {
                Axios.get(response.data.fileUrl, {
                    responseType: 'blob',
                }).then((res) => {
                    props.setLoading(false);
                    FileDownload(res.data, response.data.fileName);
                }).catch(err => {
                    toast.error('Oops...something went wrong. File not found.');
                    props.setLoading(false);
                });
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });
    };

    return (
        <div className="offcanvas offcanvas-end AddDocument" data-bs-scroll="true" id="ApproveRejectForm"
             data-bs-kebyoard="false" data-bs-backdrop="static" aria-labelledby="ApproveRejectFormLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="ApproveRejectFormLabel">Information - Manage</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        ref={clsApproveRejectFormRef} onClick={hideApproveRejectDoc} aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                <div className="card mx-3 p-0 mb-3">
                    <div className="card-header bg-white">
                        <div className="mt-2 float-start">{props?.formDetail?.form_detail?.form_name}</div>
                        {props?.formDetail?.form_detail?.status_id && props?.formDetail?.form_detail?.status_id > 1 && (
                            <>
                                <button type="button" onClick={(e) => onDataDownload(e, 2)}
                                        className="btn btn-outline-success float-end rounded-pill">
                                    <i className="fa fa-download me-2"
                                       aria-hidden="true"/> Excel
                                </button>
                                <button type="button" onClick={(e) => onDataDownload(e, 1)}
                                        className="btn btn-outline-danger float-end rounded-pill me-2">
                                    <i className="fa fa-download me-2"
                                       aria-hidden="true"/>PDF
                                </button>
                            </>
                        )}
                    </div>
                    <div className="card-body">
                        {props?.formDetail?.form_detail?.questions && props?.formDetail?.form_detail?.questions.length > 0 ?
                            <>
                                {props?.formDetail?.form_detail?.questions && props?.formDetail?.form_detail?.questions.map((item, index) =>
                                    <div key={index} className="mb-4">
                                        <label className="mb-2 formQuestion">{item?.name}</label>

                                        {item.type === 1 &&
                                        <input type="text" value={item.answer}
                                               onChange={(e) => handleQuestionAnswer(e, index)}
                                               className="form-control"/>
                                        }
                                        {item.type === 2 &&
                                        <textarea className="form-control" value={item.answer}
                                                  onChange={(e) => handleQuestionAnswer(e, index)} rows="3"/>
                                        }
                                        {item.type === 3 &&
                                        <select className="form-select" value={item.answer}
                                                onChange={(e) => handleQuestionAnswer(e, index)}>
                                            <option value="">Please select</option>
                                            {item.answers.map((option, o) => (
                                                <option key={o} value={option.id}>
                                                    {option.name}
                                                </option>
                                            ))}
                                        </select>
                                        }
                                        {item.type === 4 && (
                                            <>
                                                {item.answers.map((option, o) => (
                                                    <div key={o} className="form-check">
                                                        <input type="radio"
                                                               name={`radio_option_${index}`}
                                                               checked={parseInt(item.answer) === parseInt(option.id)}
                                                               value={option.id}
                                                               onChange={(e) => handleQuestionAnswer(e, index)}
                                                               id={`radio_option_${index}_${o}`}
                                                               className="form-check-input"/>
                                                        <label
                                                            htmlFor={`radio_option_${index}_${o}`}
                                                            className="form-check-label">{option.name}</label>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                        {item.type === 5 && (
                                            <>
                                                {item.answers.map((option, o) => (
                                                    <div key={o} className="form-check">
                                                        <input type="checkbox"
                                                               value={option.id}
                                                               checked={option.checked}
                                                               onChange={(e) => handleQuestionAnswer(e, index)}
                                                               id={`checkbox_option_${index}_${o}`}
                                                               className="form-check-input"/>
                                                        <label
                                                            htmlFor={`checkbox_option_${index}_${o}`}
                                                            className="form-check-label">{option.name}</label>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                        {item.type === 6 && (
                                            <>
                                                {item.answer &&
                                                <div className="mb-3 download_document">
                                                    <span className="download_box text_blue me-2">
                                                        {item.answer.name} ({item.answer.kb} KB)
                                                        {item?.answer && item?.answer?.path && (
                                                            <i className="fa fa-download ms-3 round_blue"
                                                               onClick={(e) => handleDownload(e, item?.answer)}
                                                               aria-hidden="true"/>
                                                        )}

                                                        {item?.answer && item?.answer?.file && (
                                                            <span className="close_btn"
                                                                  onClick={(e) => removeQuestionFile(e, index)}>
                                                                <i className="fa fa-times-circle" aria-hidden="true"/>
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                                }
                                                <div className="card p-2 w-100">
                                                    <div className="drag-area">
                                                        <div className="icon">
                                                            <i className="fa fa-cloud-upload"
                                                               aria-hidden="true"/>
                                                        </div>
                                                        <h5>Drag &amp; Drop to Upload File here or click to upload</h5>
                                                        <input type="file" key={fileKey}
                                                               onChange={(e) => handleQuestionAnswer(e, index)}/>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {item.type === 7 && (
                                            <>
                                                <div className="mb-2" dangerouslySetInnerHTML={{__html: item.que_comment}}/>
                                                {/* <input type="text" value={item.answer}
                                                       onChange={(e) => handleQuestionAnswer(e, index)}
                                                       className="form-control"/> */}
                                            </>
                                        )}
                                        {item.type === 8 &&
                                        <div
                                            className="position-relative">
                                            <DatePicker
                                                className="form-control"
                                                selected={showDate(item.answer)}
                                                dateFormat={showDateFormat(2)}
                                                onChange={(date) => handleQuestionAnswer(date, index)}
                                                placeholderText={showDatePlaceholder(2)}
                                                ref={dateRef}
                                            />

                                            <i className="fa fa-calendar" style={{top: "15px"}}
                                               onClick={(e) => dateRef?.current.setFocus(true)}/>
                                        </div>
                                        }
                                        {item?.sub_label && (
                                            <label className="mt-1 formQuestion">{item?.sub_label}</label>
                                        )}
                                        {item?.error && (
                                            <div className="text-danger">{item?.error}</div>
                                        )}
                                    </div>
                                )}

                                <button type="button" onClick={handleInformationAnswerSubmit}
                                        className="btn btn-primary rounded-5 pull-right mt-4">Update
                                </button>
                            </>
                            :
                            <>
                                <textarea className="form-control"
                                          value={props?.formDetail?.form_detail?.answer ? props?.formDetail?.form_detail?.answer : ''}
                                          onChange={(e) => handleDataAnswer(e)} rows={5} placeholder="Enter answer"/>

                                <button type="button" onClick={handleDataAnswerSubmit}
                                        className="btn btn-primary rounded-5 pull-right mt-4">Update
                                </button>
                            </>
                        }
                    </div>
                </div>

                {props?.formDetail?.form_detail?.reason_notes && (
                    <div className="rejected_note mx-3 mb-3">
                        <p>{props?.formDetail?.form_detail?.reason_notes}</p>
                        <span className="side_image">
                            <img src="/images/note.png" alt="..."/>
                        </span>
                    </div>
                )}

                {props?.formDetail?.form_detail?.status_id && props?.formDetail?.form_detail?.status_id > 1 && (
                    <>

                        {chooseButton === 2 && (
                            <div className="reject_btn_input mx-3 text-center d-block">
                                <textarea className={`form-control ${errors.reason ? `` : `mb-3`}`} rows="2"
                                          value={reason} onChange={(e) => setReason(e.target.value)}
                                          placeholder="Type Rejection Note"/>
                                {errors.reason && <div className="text-danger mb-3">{errors.reason}</div>}
                                <button type="button" className="btn btn btn-outline-secondary rounded-5"
                                        onClick={(e) => setChooseButton(0)}>
                                    <i className="fa fa-arrow-left me-2" aria-hidden="true"/> Back
                                </button>
                                <button type="button" onClick={(e) => handleAcceptRejectForm(e, 2)}
                                        className="btn btn-danger RejectButton ms-3">
                                    <i className="fa fa-check-square me-2"/> Reject
                                </button>
                            </div>
                        )}

                        {chooseButton === 0 && (
                            <div className="modal-footer justify-content-center approve_reject">
                                {props?.formDetail?.form_detail?.status_id === 2 && (
                                    <>
                                        <button type="button" className="btn btn-primary approve_btn"
                                                onClick={(e) => handleAcceptRejectForm(e, 1)}>
                                            <i className="fa fa-check-circle" aria-hidden="true"/> Approve
                                        </button>
                                        <button type="button" className="btn btn-secondary reject_btn"
                                                onClick={(e) => setChooseButton(2)}>
                                            <i className="fa fa-times-circle" aria-hidden="true"/>
                                            <i className="fa fa-square-check"/> Reject
                                        </button>
                                    </>
                                )}

                                {props?.formDetail?.form_detail?.status_id === 3 && (
                                    <>
                                        <button type="button" className="btn btn-success cur-no-drop approve_btn">
                                            <i className="fa fa-check-circle" aria-hidden="true"/> Approved
                                        </button>
                                        <button type="button" className="btn btn-secondary reject_btn"
                                                onClick={(e) => setChooseButton(2)}>
                                            <i className="fa fa-times-circle" aria-hidden="true"/>
                                            <i className="fa fa-square-check"/> Reject
                                        </button>
                                    </>
                                )}

                                {props?.formDetail?.form_detail?.status_id === 4 && (
                                    <>
                                        <button type="button" className="btn btn-primary approve_btn"
                                                onClick={(e) => handleAcceptRejectForm(e, 1)}>
                                            <i className="fa fa-check-circle" aria-hidden="true"/> Approve
                                        </button>
                                        <button type="button" className="btn btn-danger cur-no-drop reject_btn">
                                            <i className="fa fa-times-circle" aria-hidden="true"/>
                                            <i className="fa fa-square-check"/> Rejected
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ApproveRejectForm;