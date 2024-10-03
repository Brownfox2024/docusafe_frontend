import React from "react";
import Utils from "../../../../../utils";
import {envelopeDownloadData} from "../../../../../services/CommonService";
import Axios from "axios";
import FileDownload from "js-file-download";
import {toast} from "react-toastify";

function ViewDataForm(props) {

    const hideApproveRejectDoc = (e) => {
        e.preventDefault();

        props.setFormDetail({
            id: 0,
            envelope_id: 0,
            recipient_id: 0,
            is_call: false,
            form_detail: {}
        });
    };

    const handleDownload = async (e, obj) => {
        props.setLoading(true);
        await Utils.downloadAnyFile(obj.path, obj.name);
        props.setLoading(false);
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

    const dateCovert = (date) => {
        var value = new Date(date);
        var formattedDate = [value.getMonth() + 1, value.getDate(), value.getFullYear()].join('/');
        return formattedDate;
    };

    return (
        <div className="offcanvas offcanvas-end AddDocument" data-bs-scroll="true" id="viewDataForm"
             data-bs-kebyoard="false" data-bs-backdrop="static" aria-labelledby="viewDataFormLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="viewDataFormLabel">Information - View</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        onClick={hideApproveRejectDoc} aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                <div className="card mx-3 p-0 mb-3">
                    <div className="card-header bg-white ">
                        <div className="mt-2 float-start">{props?.formDetail?.form_detail?.form_name}</div>
                        {props?.formDetail?.form_detail?.status_id && props?.formDetail?.form_detail?.status_id > 1 && (
                            <>
                                <button type="button" onClick={(e) => onDataDownload(e, 2)}
                                        className="btn btn-outline-success float-end rounded-pill">
                                    <i className="fa fa-download me-2"
                                       aria-hidden="true"/> Excel
                                </button>
                                <button type="button" onClick={(e) => onDataDownload(e,1)}
                                        className="btn btn-outline-danger float-end rounded-pill me-2">
                                    <i className="fa fa-download me-2"
                                       aria-hidden="true"/>PDF
                                </button>
                            </>
                        )}
                    </div>
                    {props?.formDetail?.form_detail?.questions && props?.formDetail?.form_detail?.questions.length > 0 ?
                        <div className="card-body">
                            {props?.formDetail?.form_detail?.questions && props?.formDetail?.form_detail?.questions.map((item, index) =>
                                <div key={index} className="mb-4">
                                    <label className="mb-2 formQuestion">{item?.name}</label>
                                    {item.type === 7 && (
                                        <div className="mb-2" dangerouslySetInnerHTML={{__html: item.que_comment}}/>
                                    )}
                                    {parseInt(item.type) === 6 ?
                                        <div className="download_document">
                                        <span className="download_box text_blue w-100 border-0"
                                              style={{backgroundColor: '#e3ebf5'}}>
                                            {item?.answer?.name}
                                            {item?.answer && (
                                                <i className="fa fa-download ms-3 round_blue"
                                                   onClick={(e) => handleDownload(e, item?.answer)} aria-hidden="true"/>
                                            )}
                                        </span>
                                        </div>
                                        : (item.type === 8) ? (
                                            <span className="formAnswer">{dateCovert(item?.answer)}</span>
                                        ) : <span className="formAnswer" style={{ display: item?.type === 7 ? 'none' : 'block' }}>{item?.answer}</span>
                                    }

                                    {item?.sub_label && (
                                        <label className="mt-1 formQuestion">{item?.sub_label}</label>
                                    )}
                                </div>
                            )}
                        </div>
                        :
                        <div className="card-body"
                             dangerouslySetInnerHTML={{__html: props?.formDetail?.form_detail?.answer}}/>
                    }
                </div>
            </div>
        </div>
    );
}

export default ViewDataForm;