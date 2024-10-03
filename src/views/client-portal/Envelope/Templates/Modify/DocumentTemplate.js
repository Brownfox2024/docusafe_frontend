import React, {useEffect, useState, useRef} from "react";
import {toast} from "react-toastify";
import {DATE_FORMAT_LIST} from "../../../../../configs/AppConfig";
import Utils from "../../../../../utils";

function DocumentTemplate(props) {
    const [id, setId] = useState(0);
    const [docName, setDocName] = useState('');
    const [docDetail, setDocDetail] = useState('');
    const [docFileList, setDocFileList] = useState([]);
    const [removeDocIds, setRemoveDocIds] = useState([]);
    const [inputFile, setInputFile] = useState(Date.now);
    const [isDateFormat, setIsDateFormat] = useState(false);
    const [dateFormat, setDateFormat] = useState(0);

    const hideDocumentModel = useRef(null);

    let errorsObj = {
        doc_name: '',
        doc_detail: '',
        date_format: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    useEffect(() => {
        setId(props.docData.id);
        setDocName(props.docData.name);
        setDocDetail(props.docData.detail);
        setDocFileList(props.docData.files);
        setRemoveDocIds(props.docData.remove_doc_id);
        if (props?.docData?.date_format > 0) {
            setIsDateFormat(true);
            setDateFormat(props?.docData?.date_format);
        } else {
            setIsDateFormat(false);
            setDateFormat(0);
        }
    }, [props.docData]);

    const handleDownload = async (e, obj) => {
        e.preventDefault();
        props.setLoading(true);
        await Utils.downloadAnyFile(obj.path, obj.name);
        props.setLoading(false);
    };

    const onRemoveDoc = (e, obj) => {
        e.preventDefault();

        setDocFileList(current =>
            current.filter(doc => {
                return doc.name !== obj.name;
            }),
        );

        if (obj.id > 0) {
            let data = [...removeDocIds];
            data.push(obj.id);
            setRemoveDocIds(data);
        }
    };

    const onDocFile = (e) => {
        if (e.target.files.length > 0) {
            let files = [...docFileList];
            for (let i = 0; i < e.target.files.length; i++) {
                let kb = e.target.files[i].size / 1000;
                files.push({
                    id: 0,
                    name: e.target.files[i].name,
                    kb: parseFloat(kb).toFixed(2),
                    file: e.target.files[i]
                });
            }
            setDocFileList(files);
            setInputFile(Date.now());
        }
    };

    const handleDocModify = (e, type) => {
        e.preventDefault();
        let error = false;
        let errorObj = {...errorsObj};

        let docList = [...props.documentList];

        if (!docName) {
            errorObj.doc_name = 'Please enter name';
            error = true;
        } else if (props.docData.type === 'create') {
            let index = docList.findIndex(x => x.name === docName.trim());
            if (index > -1) {
                errorObj.doc_name = 'Document Already exist.';
                error = true;
            }
        }

        if (docFileList.length > 10) {
            toast.error('Maximum 10 file upload');
            error = true;
        } else if (docFileList.length > 0) {
            let totalKb = 0;
            for (let i = 0; i < docFileList.length; i++) {
                totalKb += parseFloat(docFileList[i]['kb']);
            }
            if (totalKb > 0) {
                let totalMb = totalKb / 1000;
                if (totalMb > 20) {
                    toast.error('Maximum 20 MB file allowed');
                    error = true;
                }
            }
        }

        if (isDateFormat) {
            if (parseInt(dateFormat) === 0) {
                errorObj.date_format = 'Please select option';
                error = true;
            }
        }

        setErrors(errorObj);

        if (error) return;

        let obj = {
            id: id,
            name: docName,
            detail: docDetail,
            files: docFileList,
            date_format: dateFormat,
            remove_doc_id: removeDocIds
        };

        if (props.docData.type === 'create') {
            docList.push(obj);
        } else {
            let index = docList.findIndex(x => x.name === props.docData.name);
            if (index > -1) {
                docList[index] = obj;
            }
        }
        props.setDocumentList(docList);

        closeDocumentModel(e);
        if (type === 2) {
            hideDocumentModel?.current.click();
        }
    };

    const closeDocumentModel = (e) => {
        e.preventDefault();

        props.setDocData({
            type: 'create',
            id: 0,
            name: '',
            detail: '',
            files: [],
            date_format: 0,
            remove_doc_id: []
        });
        setInputFile(Date.now());
        setErrors(errorsObj);
    };

    const handleDateFormat = (e) => {
        setIsDateFormat(e.target.checked);
        setDateFormat(0);
    };

    return (
        <div className="offcanvas offcanvas-end AddDocument" data-bs-scroll="true" tabIndex="-1" id="Add-document"
             data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="Add-documentLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="Add-documentLabel">Add Documents</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        ref={hideDocumentModel} onClick={closeDocumentModel} aria-label="Close">
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
                                   onChange={(e) => setDocName(e.target.value)} placeholder="Enter Document Name"/>
                            <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                               data-placement="right" title="How Can i help you?"/>
                        </div>
                        {errors.doc_name && <div className="text-danger mt-2">{errors.doc_name}</div>}
                    </div>
                    <div className="d-flex">
                        <textarea className="form-control" rows="3" value={docDetail}
                                  onChange={(e) => setDocDetail(e.target.value)}
                                  placeholder="Enter Document Description"/>
                        <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                           data-placement="right" title="How Can i help you?"/>
                    </div>
                    {errors.doc_detail && <div className="text-danger mt-2">{errors.doc_detail}</div>}
                </div>
                <div className="card mb-4 rounded add_document mx-3" id="additional_field">
                    <div className="row">
                        <div className="mb-2">
                            <input className="form-check-input" checked={isDateFormat} onChange={handleDateFormat}
                                   type="checkbox" id="expiry_date"/>
                            <label className="form-label ms-2" htmlFor="expiry_date">Add Expiry Date</label>
                        </div>
                        {isDateFormat === true && (
                            <div className="mb-3">
                                <select className="form-select" value={dateFormat}
                                        onChange={(e) => setDateFormat(e.target.value)}>
                                    <option value={0}>Select date format</option>
                                    {DATE_FORMAT_LIST.map((item, index) =>
                                        <option value={item.id} key={index}>{item.text}</option>
                                    )}
                                </select>
                                {errors.date_format && <div className="text-danger">{errors.date_format}</div>}
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
                                    <span key={index} className="download_box">{item.name} ({item.kb} KB)
                                        {item.path &&
                                        <img className="ms-2" onClick={(e) => handleDownload(e, item)} alt="download"
                                             src="/images/download.png"/>}
                                        <span onClick={(e) => onRemoveDoc(e, item)} className="close_btn">
                                            <i className="fa fa-times-circle" aria-hidden="true"/>
                                        </span>
                                    </span>
                                )}
                            </div>
                            <div className="drag-area">
                                <div className="icon">
                                    <i className="fa fa-cloud-upload"
                                       aria-hidden="true"/>
                                </div>
                                <h5>Drag & Drop to Upload File here or click to
                                    upload</h5>
                                <input type="file" key={inputFile} onChange={onDocFile} multiple/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer mt-3 mb-0 ">
                    <button type="button" onClick={closeDocumentModel} className="btn grey_btn_outline"
                            data-bs-dismiss="offcanvas">Cancel
                    </button>
                    {props.docData.type === 'create' &&
                    <button type="button" onClick={(e) => handleDocModify(e, 1)} className="btn modal_btn_outline">Save
                        & Add Another
                    </button>
                    }
                    <button type="button" onClick={(e) => handleDocModify(e, 2)} className="btn modal_btn">Save</button>
                </div>
            </div>
        </div>
    );
}

export default DocumentTemplate;