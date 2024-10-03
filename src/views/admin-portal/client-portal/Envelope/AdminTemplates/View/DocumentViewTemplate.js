import React, {useEffect, useState} from "react";
import {DATE_FORMAT_LIST} from "../../../../../../configs/AppConfig";

function DocumentViewTemplate(props) {
    const [docName, setDocName] = useState('');
    const [docDetail, setDocDetail] = useState('');
    const [docFileList, setDocFileList] = useState([]);
    const [isDateFormat, setIsDateFormat] = useState(false);
    const [dateFormat, setDateFormat] = useState(0);

    useEffect(() => {
        setDocName(props.docData.name);
        setDocDetail(props.docData.detail);
        setDocFileList(props.docData.files);
        if (props?.docData?.date_format > 0) {
            setIsDateFormat(true);
            setDateFormat(props?.docData?.date_format);
        } else {
            setIsDateFormat(false);
            setDateFormat(0);
        }
    }, [props.docData]);

    const closeDocumentModel = (e) => {
        e.preventDefault();

        props.setDocData({
            id: 0,
            name: '',
            detail: '',
            files: [],
            date_format: 0,
            remove_doc_id: []
        });
    };

    const handleDateFormat = (e) => {
        setIsDateFormat(e.target.checked);
        setDateFormat(0);
    };

    return (
        <div className="offcanvas offcanvas-end AddDocument" data-bs-scroll="true" tabIndex="-1" id="Add-document"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="Add-documentLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="Add-documentLabel">View Documents</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        onClick={closeDocumentModel} aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                <div className="card mb-4 rounded mx-3">
                    <div className="mb-3">
                        <label className="form-label mb-0">Documents Details</label>
                    </div>
                    <div className="mb-3">
                        <div className="d-flex">
                            <input type="text" className="form-control" aria-describedby="emailHelp" value={docName}
                                   readOnly onChange={(e) => setDocName(e.target.value)}
                                   placeholder="Enter Document Name"/>
                            <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                               data-placement="right" title="How Can i help you?"/>
                        </div>
                    </div>
                    <div className="d-flex">
                        <textarea className="form-control" rows="3" value={docDetail} readOnly
                                  onChange={(e) => setDocDetail(e.target.value)}
                                  placeholder="Enter Document Description"/>
                        <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                           data-placement="right" title="How Can i help you?"/>
                    </div>
                </div>
                <div className="card mb-4 rounded add_document mx-3" id="additional_field">
                    <div className="row">
                        <div className="mb-2">
                            <input className="form-check-input" checked={isDateFormat} onChange={handleDateFormat}
                                   type="checkbox" id="expiry_date" disabled/>
                            <label className="form-label ms-2" htmlFor="expiry_date">Add Expiry Date</label>
                        </div>
                        {isDateFormat === true && (
                            <div className="mb-3">
                                <select className="form-select" value={dateFormat} disabled
                                        onChange={(e) => setDateFormat(e.target.value)}>
                                    <option value={0}>Select date format</option>
                                    {DATE_FORMAT_LIST.map((item, index) =>
                                        <option value={item.id} key={index}>{item.text}</option>
                                    )}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
                <div className="card mb-4 rounded add_document mx-3">
                    <div className="mb-3">
                        <label className="form-label mb-0">Send additional documents to your clients.</label>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="mb-3 download_document">
                                {docFileList.map((item, index) =>
                                    <span key={index} className="download_box">{item.name} ({item.kb} KB)</span>
                                )}
                            </div>
                            <div className="drag-area">
                                <div className="icon">
                                    <i className="fa fa-cloud-upload"
                                       aria-hidden="true"/>
                                </div>
                                <h5>Drag & Drop to Upload File here or click to
                                    upload</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer mt-3 mb-0 ">
                    <button type="button" onClick={closeDocumentModel} className="btn grey_btn_outline"
                            data-bs-dismiss="offcanvas">Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DocumentViewTemplate;