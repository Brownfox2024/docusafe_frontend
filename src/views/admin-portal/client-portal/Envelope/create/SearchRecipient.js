import React, {useEffect, useState, useRef} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {adminSearchEnvelopeRecipient} from "../../../../../services/AdminService";

function AdminSearchRecipient(props) {
    let {client} = useParams();

    const [searchText, setSearchText] = useState('');
    const [documentId, setDocumentId] = useState([]);
    const [documentOptions, setDocumentOptions] = useState([]);
    const [formId, setFormId] = useState([]);
    const [formOptions, setFormOptions] = useState([]);
    const [searchRecipientList, setSearchRecipientList] = useState([]);
    const [selectedRecipientList, setSelectedRecipientList] = useState([]);

    const animatedComponents = makeAnimated();
    const searchCls = useRef(null);

    let errorsObj = {
        search: '',
        documents: '',
        request_data: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    useEffect(function () {
        if (props?.formObj?.documents && props?.formObj?.documents.length > 0) {
            let options = [];
            for (let i = 0; i < props.formObj.documents.length; i++) {
                options.push({
                    value: props.formObj.documents[i]['id'],
                    label: props.formObj.documents[i]['name'],
                });
            }
            setDocumentOptions(options);
            setDocumentId(options);
        }

        if (props?.formObj?.fill_forms && props?.formObj?.fill_forms.length > 0) {
            let options = [];
            for (let i = 0; i < props.formObj.fill_forms.length; i++) {
                options.push({
                    value: props.formObj.fill_forms[i]['id'],
                    label: props.formObj.fill_forms[i]['name'],
                });
            }
            setFormOptions(options);
            setFormId(options);
        }
    }, [props?.formObj]);

    function onRecipientSearch(e) {
        e.preventDefault();
        if (searchText.trim()) {
            adminSearchEnvelopeRecipient({client_id: client, search: searchText.trim()})
                .then((response) => {
                    setSearchRecipientList(response.data.data);
                })
                .catch((err) => {
                    toast.error(Utils.getErrorMessage(err));
                    setSearchText("");
                });
        }
    }

    const handleSearchRecipient = (e, obj) => {
        e.preventDefault();
        let index = props.formObj.recipient_List.findIndex((x) => x.email === obj.email);
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

    function onSaveAnotherSearch(e) {
        e.preventDefault();
        onSaveSearch(e, 1);
    }

    function onSaveCloseSearch(e) {
        e.preventDefault();
        onSaveSearch(e, 2);
    }

    function onSaveSearch(e, type) {
        e.preventDefault();
        let errorObj = {...errorsObj};
        let error = false;
        if (selectedRecipientList.length === 0) {
            errorObj.search = 'Please search recipient';
            error = true;
        }
        if (documentId.length === 0) {
            errorObj.documents = 'Please select document';
            error = true;
        }
        if (props.formObj.fill_forms.length > 0 && formId.length === 0) {
            errorObj.request_data = 'Please select data';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        let recipientIds = '';
        let recipientDisplayName = [];

        let formData = {...props.formObj};
        for (let i = 0; i < selectedRecipientList.length; i++) {
            formData.recipient_List.push(selectedRecipientList[i]);
            recipientIds += selectedRecipientList[i]['id'];
            if (selectedRecipientList.length !== (i + 1)) {
                recipientIds += ',';
            }
            let firstLetter = selectedRecipientList[i]['first_name'].charAt(0);
            let lastLetter = selectedRecipientList[i]['last_name'].charAt(0);
            recipientDisplayName.push(firstLetter + lastLetter);
        }

        if (recipientIds) {
            if (documentId.length > 0) {
                for (let i = 0; i < formData.documents.length; i++) {
                    let index = documentId.findIndex(x => parseInt(x.value) === parseInt(formData.documents[i]['id']));
                    if (index > -1) {
                        let requestIds = formData.documents[i]['request_id'].toString().split(',');
                        if ((requestIds.findIndex(x => parseInt(x) === 0) === -1)) {
                            formData.documents[i]['request_id'] = formData.documents[i]['request_id'] + ',' + recipientIds;
                            let displayNameList = formData.documents[i]['request_display'];
                            for (let j = 0; j < recipientDisplayName.length; j++) {
                                displayNameList.push(recipientDisplayName[j]);
                            }
                            formData.documents[i]['request_display'] = displayNameList;
                        }
                    }
                }
            }

            if (formId.length > 0) {
                for (let i = 0; i < formData.fill_forms.length; i++) {
                    let index = formId.findIndex(x => parseInt(x.value) === parseInt(formData.fill_forms[i]['id']));
                    if (index > -1) {
                        let requestIds = formData.fill_forms[i]['request_id'].toString().split(',');
                        if ((requestIds.findIndex(x => parseInt(x) === 0) === -1)) {
                            formData.fill_forms[i]['request_id'] = formData.fill_forms[i]['request_id'] + ',' + recipientIds;
                            let displayNameList = formData.fill_forms[i]['request_display'];
                            for (let j = 0; j < recipientDisplayName.length; j++) {
                                displayNameList.push(recipientDisplayName[j]);
                            }
                            formData.fill_forms[i]['request_display'] = displayNameList;
                        }
                    }
                }
            }
        }
        props.setFormObj(formData);

        clearSearch(e);

        if (type === 2) {
            searchCls.current?.click();
        }
    }

    function onCloseSearch(e) {
        e.preventDefault();
        clearSearch(e);
        searchCls.current?.click();
    }

    function clearSearch(e) {
        e.preventDefault();
        setSearchText('');
        setSearchRecipientList([]);
        setSelectedRecipientList([]);

        setErrors({search: '', documents: '', request_data: ''});

        if (props?.formObj?.documents && props?.formObj?.documents.length > 0) {
            let options = [];
            for (let i = 0; i < props.formObj.documents.length; i++) {
                options.push({
                    value: props.formObj.documents[i]['id'],
                    label: props.formObj.documents[i]['name'],
                });
            }
            setDocumentOptions(options);
            setDocumentId(options);
        }

        if (props?.formObj?.fill_forms && props?.formObj?.fill_forms.length > 0) {
            let options = [];
            for (let i = 0; i < props.formObj.fill_forms.length; i++) {
                options.push({
                    value: props.formObj.fill_forms[i]['id'],
                    label: props.formObj.fill_forms[i]['name'],
                });
            }
            setFormOptions(options);
            setFormId(options);
        }
    }

    return (
        <div className="offcanvas offcanvas-end Add-Recipients" data-bs-scroll="true" tabIndex="-1"
             data-bs-backdrop="static" data-bs-keyboard="false"
             id="SearchRecipients" aria-labelledby="SearchRecipientsLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="notification_boxLabel">Search Recipients</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        onClick={onCloseSearch}
                        ref={searchCls} aria-label="Close"><i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                <div className="mx-3">
                    <div className="mb-4">
                        <label className="form-label mb-2">Type Recipients
                            <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                               data-placement="right" title="How Can i help you?"/>
                        </label>
                        <div className="search_icon">
                            <input type="text" className="form-control" id="#" value={searchText}
                                   onChange={(e) => setSearchText(e.target.value)}
                                   onKeyUp={onRecipientSearch}/>
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
                    <div className="mb-4">
                        <ul className="list-group w-100">
                            {selectedRecipientList && selectedRecipientList.map((item, index) =>
                                <li key={index} className="list-group-item">
                                    <span>{item.first_name + " " + item.last_name + " (" + item.email + ")"}</span>
                                    <i onClick={(e) => onRemoveSearchRecipient(e, index)}
                                       className="fa fa-times-circle cur-pointer pull-right" aria-hidden="true"/>
                                </li>)}
                        </ul>
                    </div>
                    <div className="mb-4">
                        <label className="form-label mb-2">Add Request Documents
                            <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                               data-placement="right" title="How Can i help you?"/>
                        </label>
                        <Select closeMenuOnSelect={true} value={documentId} components={animatedComponents} isMulti
                                onChange={(e) => setDocumentId(e)} options={documentOptions}/>
                        {errors.documents && <div className="text-danger">{errors.documents}</div>}
                    </div>
                    {props.formObj.fill_forms.length > 0 &&
                    <div className="mb-0">
                        <label className="form-label mb-2">Add Request Data
                            <i className="fa fa-question-circle ms-2" aria-hidden="true" data-toggle="tooltip"
                               data-placement="right" title="How Can i help you?"/>
                        </label>
                        <Select closeMenuOnSelect={true} value={formId} components={animatedComponents} isMulti
                                onChange={(e) => setFormId(e)} options={formOptions}/>
                        {errors.request_data && <div className="text-danger">{errors.request_data}</div>}
                    </div>
                    }
                </div>
                <div className="modal-footer mt-3">
                    <button type="button" onClick={onCloseSearch} className="btn grey_btn_outline">Cancel</button>
                    <button type="button" onClick={onSaveAnotherSearch} className="btn modal_btn_outline">Save & Search
                        Another
                    </button>
                    <button type="button" onClick={onSaveCloseSearch} className="btn modal_btn">Save & close</button>
                </div>
            </div>
        </div>
    );
}

export default AdminSearchRecipient;