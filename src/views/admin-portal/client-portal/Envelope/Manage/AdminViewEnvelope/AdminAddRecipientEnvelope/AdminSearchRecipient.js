import React, {useEffect, useState, useRef} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../../../utils";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {adminSearchEnvelopeRecipient} from "../../../../../../../services/AdminService";

function AdminSearchRecipient(props) {
    const {client} = useParams();
    const [searchText, setSearchText] = useState('');
    const [docId, setDocId] = useState([]);
    const [documentOptions, setDocumentOptions] = useState([]);
    const [formId, setFormId] = useState([]);
    const [formOptions, setFormOptions] = useState([]);
    const [searchRecipientList, setSearchRecipientList] = useState([]);
    const [selectedRecipientList, setSelectedRecipientList] = useState([]);

    const animatedComponents = makeAnimated();

    let errorsObj = {
        search: '',
        documents: '',
        request_data: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const clsSearchRecipient = useRef(null);

    useEffect(function () {
        if (props?.docList && props?.docList.length > 0) {
            let options = [];
            for (let i = 0; i < props.docList.length; i++) {
                options.push({
                    value: props.docList[i]['id'],
                    label: props.docList[i]['doc_name'],
                });
            }
            setDocumentOptions(options);
            setDocId(options);
        }

        if (props?.formList && props?.formList.length > 0) {
            let options = [];
            for (let i = 0; i < props.formList.length; i++) {
                options.push({
                    value: props.formList[i]['id'],
                    label: props.formList[i]['form_name'],
                });
            }
            setFormOptions(options);
            setFormId(options);
        }
    }, [props?.docList, props?.formList]);

    const handleSearchRecipient = (e, obj) => {
        e.preventDefault();
        let index = props.recipientList.findIndex((x) => x.email === obj.email);
        if (index === -1) {
            let index = selectedRecipientList.findIndex((x) => x.email === obj.email);
            if (index === -1) {
                let selectedList = [];
                selectedList.push(obj);
                setSelectedRecipientList(selectedList);
            } else {
                toast.error("Recipient already exist.");
            }
        } else {
            toast.error("Recipient already exist.");
        }
        setErrors({search: '', documents: '', request_data: ''});
        setSearchText("");
        setSearchRecipientList([]);
    };

    const onRemoveSearchRecipient = (e, index) => {
        e.preventDefault();
        let selectedSearch = [...selectedRecipientList];
        selectedSearch.splice(index, 1);
        setSelectedRecipientList(selectedSearch);
    };

    function onRecipientSearch(e) {
        e.preventDefault();
        if (searchText.trim()) {
            adminSearchEnvelopeRecipient({client_id: client, search: searchText.trim()})
                .then((response) => {
                    setSearchRecipientList(response.data.data);
                })
                .catch((err) => {
                    toast.error(Utils.getErrorMessage(err));
                    setSearchRecipientList([]);
                    setSearchText("");
                });
        }
    }

    function clearSearch(e) {
        e.preventDefault();
        setSearchText('');
        setSearchRecipientList([]);
        setSelectedRecipientList([]);

        if (props?.docList && props?.docList.length > 0) {
            let options = [];
            for (let i = 0; i < props.docList.length; i++) {
                options.push({
                    value: props.docList[i]['id'],
                    label: props.docList[i]['doc_name'],
                });
            }
            setDocId(options);
        }

        if (props?.formList && props?.formList.length > 0) {
            let options = [];
            for (let i = 0; i < props.formList.length; i++) {
                options.push({
                    value: props.formList[i]['id'],
                    label: props.formList[i]['form_name'],
                });
            }
            setFormId(options);
        }

        setErrors({search: '', documents: '', request_data: ''});
    }

    function handleSaveRecipient(e, type) {
        e.preventDefault();
        let errorObj = {...errorsObj};
        let error = false;
        if (selectedRecipientList.length === 0) {
            errorObj.search = 'Please search recipient';
            error = true;
        }
        if (docId.length === 0) {
            errorObj.documents = 'Please select document';
            error = true;
        }
        if (props.formList.length > 0 && formId.length === 0) {
            errorObj.request_data = 'Please select data';
            error = true;
        }

        setErrors(errorObj);
        if (error) return;

        for (let i = 0; i < selectedRecipientList.length; i++) {
            selectedRecipientList[i].doc_id = docId;
            selectedRecipientList[i].form_id = formId;
        }

        props.setRecipientList([...props.recipientList, ...selectedRecipientList]);

        clearSearch(e);

        if (type === 2) {
            clsSearchRecipient?.current.click();
        }
    }

    return (
        <div className="offcanvas offcanvas-end Add-Recipients" data-bs-scroll="true"
             data-bs-backdrop="static" data-bs-keyboard="false"
             tabIndex="-1" id="SearchRecipients" aria-labelledby="SearchRecipientsLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="notification_boxLabel">Search
                    Recipients</h5>
                <button type="button" className="btn close_btn text-reset" onClick={clearSearch}
                        ref={clsSearchRecipient} data-bs-dismiss="offcanvas" aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                <div className="mx-3">
                    <div className="mb-4">
                        <label className="form-label mb-2">Type Recipients
                            <i className="fa fa-question-circle ms-2" aria-hidden="true"
                               data-toggle="tooltip" data-placement="right"
                               title="How Can i help you?"/>
                        </label>
                        <div className="search_icon">
                            <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
                                   onKeyUp={onRecipientSearch} className="form-control"/>
                            <i className="fa fa-search me-3"/>
                            {errors.search && <div className="text-danger">{errors.search}</div>}
                            <ul className="list-group w-100" style={{position: "absolute", top: "45px", zIndex: "99"}}>
                                {searchRecipientList && searchRecipientList.map((item, index) =>
                                    <li className="list-group-item cur-pointer"
                                        onClick={(e) => handleSearchRecipient(e, item)}
                                        key={index}>{item.first_name + " " + item.last_name + " (" + item.email + ")"}</li>)}
                            </ul>
                        </div>
                    </div>

                    {selectedRecipientList && selectedRecipientList.length > 0 &&
                    <div className="mb-4">
                        <ul className="list-group w-100">
                            {selectedRecipientList.map((item, index) =>
                                <li key={index} className="list-group-item">
                                    <span>{item.first_name + " " + item.last_name + " (" + item.email + ")"}</span>
                                    <i onClick={(e) => onRemoveSearchRecipient(e, index)}
                                       className="fa fa-times-circle cur-pointer pull-right" aria-hidden="true"/>
                                </li>)}
                        </ul>
                    </div>
                    }

                    {props.docList && props.docList.length > 0 &&
                    <div className="mb-4">
                        <label className="form-label mb-2">Add Request Documents
                            <i className="fa fa-question-circle ms-2" aria-hidden="true"
                               data-toggle="tooltip" data-placement="right"
                               title="How Can i help you?"/>
                        </label>
                        <Select closeMenuOnSelect={true} value={docId} components={animatedComponents} isMulti
                                onChange={(e) => setDocId(e)} options={documentOptions}/>
                        {errors.documents && <div className="text-danger">{errors.documents}</div>}
                    </div>
                    }

                    {props.formList && props.formList.length > 0 &&
                    <div className="mb-0">
                        <label className="form-label mb-2">Add Request Data
                            <i className="fa fa-question-circle ms-2" aria-hidden="true"
                               data-toggle="tooltip" data-placement="right"
                               title="How Can i help you?"/>
                        </label>
                        <Select closeMenuOnSelect={true} value={formId} components={animatedComponents} isMulti
                                onChange={(e) => setFormId(e)} options={formOptions}/>
                        {errors.request_data && <div className="text-danger">{errors.request_data}</div>}
                    </div>
                    }
                </div>
                <div className="modal-footer mt-3">
                    <button type="button" className="btn grey_btn_outline" onClick={clearSearch}
                            data-bs-dismiss="offcanvas">Cancel
                    </button>
                    <button type="button" onClick={(e) => handleSaveRecipient(e, 1)}
                            className="btn modal_btn_outline">Save & Create Another
                    </button>
                    <button type="button" onClick={(e) => handleSaveRecipient(e, 2)} className="btn modal_btn">Save &
                        close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminSearchRecipient;