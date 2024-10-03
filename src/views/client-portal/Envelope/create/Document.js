import React, {useEffect, useRef, useState} from "react";
import {getEnvelopeDocumentCheckStorage, modifyEnvelopeDocument} from "../../../../services/CommonService";
import {toast} from "react-toastify";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Utils from "../../../../utils";
import {DATE_FORMAT_LIST, EVERY_ONE_OBJECT} from "../../../../configs/AppConfig";

function EnvelopeDocument(props) {
    const [docId, setDocId] = useState(0);
    const [requestFrom, setRequestForm] = useState([]);
    const [docRecipients, setDocRecipients] = useState([]);
    const [docName, setDocName] = useState('');
    const [docDetail, setDocDetail] = useState('');
    const [documentsList, setDocumentsList] = useState([]);
    const [removeDocIds, setRemoveDocIds] = useState([]);
    const [fileKey, setFileKey] = useState(Date.now);
    const [isDateFormat, setIsDateFormat] = useState(false);
    const [dateFormat, setDateFormat] = useState(0);

    const animatedComponents = makeAnimated();

    useEffect(() => {
        setDocId(props?.docData?.id);
        setDocName(props?.docData?.doc_name);
        setDocDetail(props?.docData?.doc_detail);
        setDocumentsList(props?.docData?.documents);

        if (props?.docData?.date_format > 0) {
            setIsDateFormat(true);
            setDateFormat(props?.docData?.date_format);
        }

        let recipientObj = EVERY_ONE_OBJECT;
        if (props?.docData?.request_id) {
            let selectedRecipient = [];
            let recipientIds = props?.docData?.request_id.split(',');
            let index = recipientIds.findIndex(x => parseInt(x) === 0);
            if (index > -1) {
                selectedRecipient = [recipientObj];
            } else {
                for (let i = 0; i < recipientIds.length; i++) {
                    let index = props.formObj.recipient_List.findIndex(x => parseInt(x.id) === parseInt(recipientIds[i]));
                    if (index > -1) {
                        selectedRecipient.push({
                            value: props.formObj.recipient_List[index]['id'],
                            label: props.formObj.recipient_List[index]['first_name'] + ' ' + props.formObj.recipient_List[index]['last_name']
                        })
                    }
                }
            }
            setRequestForm(selectedRecipient);
        } else {
            setRequestForm([recipientObj]);
        }

        let recipients = [recipientObj];
        for (let i = 0; i < props.formObj.recipient_List.length; i++) {
            recipients.push({
                value: props.formObj.recipient_List[i]['id'],
                label: props.formObj.recipient_List[i]['first_name'] + ' ' + props.formObj.recipient_List[i]['last_name']
            });
        }
        setDocRecipients(recipients);
    }, [props?.docData, props.formObj]);

    let errorsObj = {
        recipients: '',
        doc_name: '',
        doc_detail: '',
        doc_file: '',
        date_format: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsButtonRef = useRef(null);

    const onDocFile = (e) => {
        if (e.target.files.length > 0) {
            let files = [...documentsList];
            for (let i = 0; i < e.target.files.length; i++) {
                let kb = e.target.files[i].size / 1000;
                files.push({
                    id: 0,
                    name: e.target.files[i].name,
                    kb: parseFloat(kb).toFixed(2),
                    file: e.target.files[i]
                });
            }
            setDocumentsList(files);
            setFileKey(Date.now);
        }
    };

    const onRemoveDoc = (e, obj) => {
        e.preventDefault();

        setDocumentsList(current =>
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

    function onCloseDocument(e) {
        e.preventDefault();
        clsButtonRef.current?.click();
        clearDocumentForm();
    }

    function clearDocumentForm() {
        setDocId(0);
        setRequestForm([EVERY_ONE_OBJECT]);
        setDocName('');
        setDocDetail('');
        setDocumentsList([]);
        setIsDateFormat(false);
        setDateFormat(0);

        let errorObj = {
            recipients: '',
            doc_name: '',
            doc_detail: '',
            doc_file: '',
            date_format: ''
        };
        setErrors(errorObj);
    }

    function onSaveAddDoc(e) {
        e.preventDefault();
        onStoreDoc(e, 2);
    }

    function onSaveDoc(e) {
        e.preventDefault();
        onStoreDoc(e, 1);
    }

    async function onStoreDoc(e, type) {
        e.preventDefault();
        let error = false;
        const errorObj = {...errors};
        const envelopeFormData = {...props.formObj};
        let totalKb = 0;
        if (requestFrom.length === 0) {
            errorObj.recipients = 'Please select request from';
            error = true;
        }
        if (!docName) {
            errorObj.doc_name = 'Document name must be required';
            error = true;
        }

        if (documentsList.length > 10) {
            toast.error('Maximum 10 file upload');
            error = true;
        } else if (documentsList.length > 0) {
            for (let i = 0; i < documentsList.length; i++) {
                totalKb += parseFloat(documentsList[i]['kb']);
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

        props.setLoading(true);
        let recipientIds = '';
        for (let i = 0; i < requestFrom.length; i++) {
            if (parseInt(requestFrom[i]['value']) === 0) {
                recipientIds = 0;
                break;
            } else {
                recipientIds += requestFrom[i]['value'];
                if (requestFrom.length !== (i + 1)) {
                    recipientIds += ',';
                }
            }
        }

        const formData = new FormData();
        formData.append('envelope_id', envelopeFormData.envelope_id);
        formData.append('doc_id', docId);
        formData.append('request_form', recipientIds);
        formData.append('name', docName);
        formData.append('detail', docDetail);
        formData.append('date_format', dateFormat);
        for (let i = 0; i < documentsList.length; i++) {
            formData.append('doc_file', documentsList[i]['file']);
        }
        if (removeDocIds.length > 0) {
            formData.append('remove_doc_id', JSON.stringify(removeDocIds));
        }

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
            modifyEnvelopeDocument(formData)
                .then(response => {
                    if (type === 1) {
                        clsButtonRef.current?.click();
                        clearDocumentForm();
                    } else {
                        clearDocumentForm();
                    }
                    let requestDisplay = [];
                    if (recipientIds !== 0) {
                        let recipients = recipientIds.split(',');
                        for (let i = 0; i < recipients.length; i++) {
                            let index = envelopeFormData.recipient_List.findIndex(x => parseInt(x.id) === parseInt(recipients[i]));
                            if (index > -1) {
                                let firstName = envelopeFormData.recipient_List[index]['first_name'];
                                let lastName = envelopeFormData.recipient_List[index]['last_name'];
                                let firstLetter = firstName.charAt(0);
                                let lastLetter = lastName.charAt(0);
                                requestDisplay.push({
                                    full_name: firstName + ' ' + lastName,
                                    display: firstLetter + lastLetter
                                });
                            }
                        }
                    }

                    if (docId > 0) {
                        let index = envelopeFormData.documents.findIndex(x => parseInt(x.id) === parseInt(docId));
                        if (index > -1) {
                            envelopeFormData.documents[index]['name'] = docName;
                            envelopeFormData.documents[index]['request_id'] = recipientIds;
                            envelopeFormData.documents[index]['request_display'] = requestDisplay;
                            envelopeFormData.documents[index]['doc_detail'] = docDetail;
                            envelopeFormData.documents[index]['documents'] = documentsList;
                            envelopeFormData.documents[index]['date_format'] = dateFormat;
                        }
                    } else {
                        envelopeFormData.documents.push({
                            id: response.data.id,
                            name: docName,
                            request_id: recipientIds,
                            request_display: requestDisplay,
                            doc_detail: docDetail,
                            documents: documentsList,
                            date_format: dateFormat
                        });
                    }
                    props.setFormObj(envelopeFormData);
                    props.setLoading(false);
                    toast.success(response.data.message);
                })
                .catch(err => {
                    props.setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        }
    }

    const handleDownload = async (e, obj) => {
        e.preventDefault();
        props.setLoading(true);
        await Utils.downloadAnyFile(obj.path, obj.name);
        props.setLoading(false);
    };

    const handleRequestRecipient = (options) => {
        let checkEveryone = options.findIndex(x => parseFloat(x.value) === 0);
        if (checkEveryone > -1) {
            setRequestForm([EVERY_ONE_OBJECT]);
        } else {
            if (props.formObj.recipient_List.length === options.length) {
                setRequestForm([EVERY_ONE_OBJECT]);
            } else {
                setRequestForm(options);
            }
        }
    };

    const handleDateFormat = (e) => {
        setIsDateFormat(e.target.checked);
        setDateFormat(0);
    };

    return (
        <div className="offcanvas offcanvas-end AddDocument" data-bs-scroll="true" data-bs-backdrop="static"
             data-bs-keyboard="false" tabIndex="-1" id="Add-document" aria-labelledby="Add-documentLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="Add-documentLabel">{docId > 0 ? `Edit` : `Add`} Document</h5>
                <button type="button" ref={clsButtonRef} onClick={clearDocumentForm}
                        className="btn close_btn text-reset" data-bs-dismiss="offcanvas" aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                <div className="card mb-4 rounded mx-3">
                    <label htmlFor="request_from" className="form-label mb-3">Document Request from <i
                        className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                        data-placement="right" title="How Can i help you?"/>
                    </label>
                    <Select closeMenuOnSelect={true} value={requestFrom} components={animatedComponents} isMulti
                            onChange={handleRequestRecipient} options={docRecipients}/>
                    {errors.recipients && <div className="text-danger">{errors.recipients}</div>}
                </div>
                <div className="card mb-4 rounded mx-3">
                    <div className="mb-3">
                        <label htmlFor="document_name" className="form-label mb-0">Documents Details</label>
                    </div>
                    <div className="mb-3">
                        <div className="d-flex">
                            <input type="text" className="form-control" id="document_name"
                                   value={docName} onChange={(e) => setDocName(e.target.value)}
                                   aria-describedby="emailHelp" placeholder="Enter Document Name"/>
                            <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                               data-placement="right" title="How Can i help you?"/>
                        </div>
                        {errors.doc_name && <div className="text-danger">{errors.doc_name}</div>}
                    </div>
                    <div className="d-flex">
                                <textarea className="form-control" id="document_detail" rows="2"
                                          value={docDetail} onChange={(e) => setDocDetail(e.target.value)}
                                          placeholder="Enter Document Description"/>
                        <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                           data-placement="right" title="How Can i help you?"/>
                    </div>
                    {errors.doc_detail && <div className="text-danger">{errors.doc_detail}</div>}
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
                                {documentsList && documentsList.map((item, index) =>
                                    <span key={index} className="download_box">{item.name} ({item.kb} KB)
                                        {item.path &&
                                        <img className="ms-2" onClick={(e) => handleDownload(e, item)} alt="download"
                                             src="/images/download.png"/>}
                                        <span onClick={(event) => onRemoveDoc(event, item)} className="close_btn">
                                                <i className="fa fa-times-circle" aria-hidden="true"/>
                                            </span>
                                        </span>
                                )}
                            </div>
                            <div className="drag-area">
                                <label htmlFor="document_file">
                                    <div className="icon">
                                        <i className="fa fa-cloud-upload" aria-hidden="true"/>
                                    </div>
                                    <h5>Drag & Drop to Upload File here or click to upload</h5>
                                </label>
                                <input type="file" key={fileKey} id="document_file" onChange={onDocFile} multiple/>
                            </div>
                            {errors.doc_file && <div className="text-danger">{errors.doc_file}</div>}
                        </div>
                    </div>
                </div>
                
                {/*                 
                <div className="card mb-4 rounded add_document mx-3 d-none" id="additional_field">
                    <div className="mb-3">
                        <label for="email_subject" className="form-label mb-0">Add Additional Fields<i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip" data-placement="right" aria-label="How Can i help you?" data-bs-original-title="How Can i help you?"></i></label>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="form-check bg-blue">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label" for="flexCheckDefault">
                            Name on the document
                            </label>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label" for="flexCheckDefault">
                            Date of Birth on the document
                            </label>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label" for="flexCheckDefault">
                            Expiry Date on the document
                            </label>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label" for="flexCheckDefault">
                            Date on the document
                            </label>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label" for="flexCheckDefault">
                            Number on the document
                            </label>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="modal-footer mt-3 mb-0 ">
                    <button type="button" onClick={onCloseDocument} className="btn grey_btn_outline">Cancel
                    </button>
                    {docId === 0 &&
                    <button type="button" onClick={onSaveAddDoc} className="btn modal_btn_outline">Save & Add
                        Another
                    </button>}
                    <button type="button" onClick={onSaveDoc} className="btn modal_btn">Save</button>
                </div>
            </div>
        </div>
    );
}

export default EnvelopeDocument;