import React, {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {useParams} from 'react-router-dom';
import FileDownload from "js-file-download";
import Axios from "axios";
import {
    adminEnvelopeDownloadAllFile,
    adminUserEnvelopeSpecificDownloadData
} from "../../../../../../services/AdminService";
import Utils from "../../../../../../utils";

function AdminDownloadDataDoc(props) {
    const [envelopeName, setEnvelopeName] = useState('');
    const [recipientList, setRecipientList] = useState([]);
    const [envId, setEnvId] = useState();
    const {client} = useParams();

    useEffect(() => {
        if (props?.downloadDataList) {
            setEnvelopeName(props?.downloadDataList.envelope_name);
            setRecipientList(props?.downloadDataList.recipient_list);
            setEnvId(props?.downloadDataList?.id)
        }
    }, [props?.downloadDataList]);


    const hideDownloadDataDoc = (e) => {
        e.preventDefault();
        props.setDownloadDataList({});
    };


    const handleCheckAllChange = (e, index) => {
        let list = [...recipientList];
        list[index]['checked'] = e.target.checked;
        list[index]['documents'] = list[index]['documents'].map((document) => (
            {
                ...document, checked: e.target.checked
            }));
        setRecipientList(list);
    };

    const downloadSpecificSingleFile = (e, index, idx) => {
        e.preventDefault();

        let list = [...recipientList];
        let recipientobj = list[index]['documents'][idx];
        let recipientID = list[index]['documents'][idx]["id"];

        const recipientListArray = [];

        for (let i = 0; i < recipientList?.length; i++) {
            const recipient = recipientList[i];
            let obj = {};
            const form_list = [];
            const doc_list = [];

            const {id, documents} = recipient;

            if (documents.includes(recipientobj)) {
                obj['id'] = parseInt(id);

                var item = documents.find(item => item.id === recipientID);

                if (item.entity_type === 1) {
                    doc_list.push(parseInt(item.id));

                } else if (item.entity_type === 2) {
                    form_list.push(parseInt(item.id));

                }
                obj['doc_ids'] = doc_list;
                obj['form_ids'] = form_list;
            }
            recipientListArray.push(obj);
        }

        const totalRecipient = recipientListArray.filter((obj) => Object.keys(obj).length > 0);

        let obj = {
            client_id: client,
            envelope_id: envId,
            recipients: totalRecipient
        };

        props.setLoading(true);

        adminUserEnvelopeSpecificDownloadData(obj)
            .then(result => {
                Axios.get(result.data.path, {
                    responseType: 'blob',
                }).then((res) => {
                    props.setLoading(false);
                    FileDownload(res.data, result.data.name);
                })
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                props.setLoading(false);
            });

    };

    const handleFileChange = (e, index, idx) => {
        let list = [...recipientList];
        list[index]['documents'][idx]['checked'] = e.target.checked;
        let count = 0;
        for (let i = 0; i < list[index]['documents'].length; i++) {
            let data = list[index]['documents'][i];
            if (data.checked) {
                count++;
            }
        }
        if (list[index]['documents'].length === count) {
            list[index]['checked'] = true;
        } else {
            list[index]['checked'] = false;
        }
        setRecipientList(list);
    };

    const downloadSpecificFile = (e) => {
        e.preventDefault();

        const recipientListArray = [];

        for (let i = 0; i < recipientList?.length; i++) {
            const recipient = recipientList[i];
            let obj = {};
            const form_list = [];
            const doc_list = [];

            const {id, checked, documents} = recipient;

            if (checked) {
                obj['id'] = parseInt(id);
                for (let k = 0; k < documents.length; k++) {
                    const document = documents[k];
                    const {id, entity_type, checked} = document;
                    if (entity_type === 1) {
                        if (checked) {
                            doc_list.push(parseInt(id));
                        }
                    } else if (entity_type === 2) {
                        if (checked) {
                            form_list.push(parseInt(id));
                        }
                    }
                }
                obj['doc_ids'] = doc_list;
                obj['form_ids'] = form_list;
            } else if (documents.some(obj => obj.checked === true)) {
                obj['id'] = parseInt(id);
                for (let k = 0; k < documents.length; k++) {
                    const document = documents[k];
                    const {id, entity_type, checked} = document;
                    if (entity_type === 1) {
                        if (checked) {
                            doc_list.push(parseInt(id));
                        }
                    } else if (entity_type === 2) {
                        if (checked) {
                            form_list.push(parseInt(id));
                        }
                    }
                }
                obj['doc_ids'] = doc_list;
                obj['form_ids'] = form_list;
            }

            recipientListArray.push(obj);
        }

        const totalRecipient = recipientListArray.filter((obj) => Object.keys(obj).length > 0);

        let obj = {
            client_id: client,
            envelope_id: envId,
            recipients: totalRecipient
        };

        props.setLoading(true);

        if (totalRecipient.length > 0) {
            adminUserEnvelopeSpecificDownloadData(obj)
                .then(result => {
                    Axios.get(result.data.path, {
                        responseType: 'blob',
                    }).then((res) => {
                        props.setLoading(false);
                        FileDownload(res.data, result.data.name);
                    })
                })
                .catch(err => {
                    toast.error(Utils.getErrorMessage(err));
                    props.setLoading(false);
                });
        } else {
            toast.error('Please select any one document');
            props.setLoading(false);
        }
    };

    const downloadAllFile = (e) => {
        e.preventDefault();

        let obj = {
            client_id: client,
            envelope_id: envId,
        };
        props.setLoading(true);

        adminEnvelopeDownloadAllFile(obj)
            .then(response => {
                Axios.get(response.data.path, {
                    responseType: 'blob',
                }).then((res) => {
                    props.setLoading(false);
                    FileDownload(res.data, response.data.name);
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
        <div className="offcanvas offcanvas-end ManageDocument" data-bs-scroll="true" tabIndex="-1"
             data-bs-keyboard="false" data-bs-backdrop="static" id="DownloadDataDoc"
             aria-labelledby="DownloadDataDocLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="DownloadDataDocLabel">Document - Download</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        onClick={hideDownloadDataDoc} aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>

            <div className="offcanvas-body">
                <div className="d-flex align-items-center justify-content-between">
                    <h5 className="offcanvas-title text_blue mx-3 fw-bold">{envelopeName}</h5>
                    <button className="btn btn-primary pull-right rounded-5 mx-3" type="button"
                            onClick={(e) => downloadAllFile(e)}>
                        Download All
                    </button>

                </div>

                <div className="">
                    <div className="card card-body m-3">
                        <div className="d-flex justify-content-between">
                            <div className="form-check my-auto"/>

                            <button className="btn btn-primary rounded-5" type="button"
                                    onClick={(e) => downloadSpecificFile(e)}>
                                Download Selected
                            </button>
                        </div>
                    </div>
                </div>
                <div className="accordion mx-3 mb-3 mt-4">

                    {recipientList && recipientList.map((item, parentIndex) =>
                        <div className="accordion-item" key={parentIndex}>
                            <h2 className="accordion-header">
                                <button className="accordion-button " type="button" data-bs-toggle="collapse"
                                        data-bs-target={"#key" + parentIndex} aria-expanded="true"
                                        aria-controls={"key" + parentIndex}>
                                    <input className="form-check-input me-3 mt-0" data-bs-toggle="collapse"
                                           value={item.name} checked={item.checked}
                                           onChange={(e) => handleCheckAllChange(e, parentIndex)}
                                           type="checkbox"/> {item.first_name + ' ' + item.last_name}
                                </button>
                            </h2>
                            <div className="accordion-collapse collapse show"
                                 aria-labelledby={"key" + parentIndex} data-bs-parent={"#key" + parentIndex}>
                                <div className="accordion-body">
                                    <div className="download_document">
                                        {item.documents && item.documents.map((item1, childIndex) =>
                                            <div key={childIndex}
                                                 className="download_box d-block rounded-pill background_grey_400 d-flex w-100 justify-content-between align-items-center px-3 my-3">
                                                <span
                                                    className="background_grey_400 mb-0 border-0 px-0">
                                                      <label className="mt-0">
                                                    <input className="form-check-input mx-2"
                                                           type="checkbox"
                                                           value={item1.name}
                                                           checked={item1.checked}
                                                           onChange={(e) => handleFileChange(e, parentIndex, childIndex)}/>
                                                          {item1.name}</label>
                                                 </span>
                                                <span
                                                    className="background_grey_400 mb-0 border-0 px-0">{item1.expiry_date}
                                                    <i className="fa fa-download ms-3 round_blue"
                                                       onClick={(e) => downloadSpecificSingleFile(e, parentIndex, childIndex)}
                                                       aria-hidden="true"/>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDownloadDataDoc;