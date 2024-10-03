import React, {useEffect, useState, useRef} from "react";
import {
    checkEnvelopeCredit, checkEnvelopeStorage,
    getEnvelopeSenderList,
    getManageEnvelopeList
} from "../../../../services/CommonService";
import {useNavigate} from "react-router-dom";
import Utils from "../../../../utils";
import Pagination from "react-js-pagination";
import DeleteEnvelope from "./DeleteEnvelope";
import TransferEnvelope from "./TransferEnvelope";
import CopyEnvelope from "./CopyEnvelope";
import AddEnvelopeTemplate from "./AddEnvelopeTemplate";
import {toast} from "react-toastify";
import CheckEnvelopeCredit from "./CheckEnvelopeCredit";
import CheckEnvelopeStorage from "./CheckEnvelopeStorage";

const lengths = Utils.tableShowLengths();

function ManageEnvelope() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [totalInProgress, setTotalInProgress] = useState(0);
    const [totalDraft, setTotalDraft] = useState(0);
    const [totalCompleted, setTotalCompleted] = useState(0);
    const [senderList, setSenderList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [envelopeList, setEnvelopeList] = useState([]);
    const [envelopeProcess, setEnvelopeProcess] = useState('loading...');

    const [dataParams, setDataParams] = useState({
        limit: lengths[0],
        page: 1,
        status_id: 1,
        search: "",
        sender_id: "",
        order_column: 'created_at',
        order_by: false,
        is_effect: false
    });
    const [deleteEnvelope, setDeleteEnvelope] = useState({id: 0, name: ''});
    const [copyEnvelope, setCopyEnvelope] = useState(0);

    const openCheckEnvelopeRef = useRef(null);
    const openCheckEnvelopeStorageRef = useRef(null);

    useEffect(function () {
        getEnvelopeSenderList()
            .then(response => {
                setSenderList(response.data.data);
            })
            .catch(err => {

            });
    }, []);

    useEffect(function () {

        setEnvelopeList([]);
        setEnvelopeProcess('loading...');
        getManageEnvelopeList(dataParams)
            .then(response => {
                setTotalData(parseInt(response.data.count));
                setEnvelopeList(response.data.data);
                if (response.data.data.length === 0) {
                    setEnvelopeProcess('No data available.');
                }
                if (response.data.status_count.length > 0) {
                    if (response.data.status_count[0]) {
                        setTotalInProgress(parseInt(response.data.status_count[0]));
                    }
                    if (response.data.status_count[1]) {
                        setTotalDraft(parseInt(response.data.status_count[1]));
                    }
                    if (response.data.status_count[2]) {
                        setTotalCompleted(parseInt(response.data.status_count[2]));
                    }
                }
            })
            .catch(err => {
                setEnvelopeProcess('No data available.');
            });
    }, [dataParams]);

    const handleData = (e, type) => {
        let params = {...dataParams};
        if (type === 'pagination') {
            params.page = e;
        } else if (type === 'sender') {
            params.sender_id = e.target.value;
        } else if (type === 'search') {
            params.search = e.target.value;
        } else if (type === 'limit') {
            params.limit = parseInt(e.target.value);
        }
        setDataParams(params);
    };

    const onAddEnvelopeTemplate = (e, data) => {
        e.preventDefault();
        setDeleteEnvelope({id: data.id, name: data.envelope_name});
    };

    const onCopyEnvelope = (e, data) => {
        e.preventDefault();
        setCopyEnvelope(data.id);
    };

    const onDeleteEnvelope = (e, data) => {
        e.preventDefault();
        setDeleteEnvelope({id: data.id, name: data.envelope_name});
    };

    const onTransferEnvelope = (e, data) => {
        e.preventDefault();
        setDeleteEnvelope({id: data.id, name: data.envelope_name});
    };

    const handleManageView = (e, data, recipient) => {
        if (parseInt(data.is_credit) === 0) {
            setLoading(true);
            checkEnvelopeCredit({})
                .then(response => {
                    setLoading(false);
                    if (response.data.is_credit === true) {
                        navigate('/manage/' + data.uuid, {
                            state: {
                                recipient_id: recipient.id,
                                recipient_name: recipient.first_name + ' ' + recipient.last_name
                            }
                        });
                    } else {
                        openCheckEnvelopeRef?.current.click();
                    }
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        } else if (parseInt(data.is_storage_full) === 1) {
            setLoading(true);
            checkEnvelopeStorage({envelope_id: data.id})
                .then(response => {
                    setLoading(false);
                    if (response.data.is_storage_full === false) {
                        navigate('/manage/' + data.uuid, {
                            state: {
                                recipient_id: recipient.id,
                                recipient_name: recipient.first_name + ' ' + recipient.last_name
                            }
                        });
                    } else {
                        openCheckEnvelopeStorageRef?.current.click();
                    }
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        } else {
            navigate('/manage/' + data.uuid, {
                state: {
                    recipient_id: recipient.id,
                    recipient_name: recipient.first_name + ' ' + recipient.last_name
                }
            });
        }
    };

    const handleManageMessageView = (e, data, recipient, type) => {
        if (parseInt(data.is_credit) === 0) {
            setLoading(true);
            checkEnvelopeCredit({})
                .then(response => {
                    setLoading(false);
                    if (response.data.is_credit === true) {
                        navigate('/manage/' + data.uuid + '/' + type, {
                            state: {
                                recipient_id: recipient.id,
                                recipient_name: recipient.first_name + ' ' + recipient.last_name
                            }
                        });
                    } else {
                        openCheckEnvelopeRef?.current.click();
                    }
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        } else if (parseInt(data.is_storage_full) === 1) {
            setLoading(true);
            checkEnvelopeStorage({envelope_id: data.id})
                .then(response => {
                    setLoading(false);
                    if (response.data.is_storage_full === false) {
                        navigate('/manage/' + data.uuid + '/' + type, {
                            state: {
                                recipient_id: recipient.id,
                                recipient_name: recipient.first_name + ' ' + recipient.last_name
                            }
                        });
                    } else {
                        openCheckEnvelopeStorageRef?.current.click();
                    }
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        } else {
            navigate('/manage/' + data.uuid + '/' + type, {
                state: {
                    recipient_id: recipient.id,
                    recipient_name: recipient.first_name + ' ' + recipient.last_name
                }
            });
        }
    };

    const handleCreateSort = (e, column) => {
        e.preventDefault();

        let params = {...dataParams};
        params.order_column = column;
        params.order_by = !params.order_by;
        params.page = 1;
        setDataParams(params);
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <section className="main_wrapper background_grey_400" style={{minHeight: "calc(100vh - 119px)"}}>
                <div className="custom_container">
                    <h2 className="main_title mb-3">Envelopes</h2>
                    <div className="table_header_wrap">
                        <div className="nav nav-tabs wrap_left flexWrap" id="nav-tab" role="tablist">
                            <button className="nav-link active mb-3" type="button" role="tab" aria-selected="true">
                                In Progress <span>({totalInProgress})</span>
                            </button>
                            <button className="nav-link mb-3" onClick={(e) => navigate('/manage/draft')} type="button"
                                    role="tab" aria-selected="true">
                                Draft <span>({totalDraft})</span>
                            </button>
                            <button className="nav-link mb-3" onClick={(e) => navigate('/manage/completed')}
                                    type="button" role="tab" aria-selected="true">
                                Completed <span>({totalCompleted})</span>
                            </button>
                        </div>
                        <div className="wrap_right flexWrap tab-content clearfix">
                            <div className="search_input mb-3">
                                <div className="input-group position-relative me-2">
                                    <input className="form-control border-end-0 border rounded-pill " type="text"
                                           value={dataParams.search} onChange={(e) => handleData(e, 'search')}
                                           placeholder="Search Envelope"/>
                                    <span className="input-group-append position-absolute">
                                    <i className="fa fa-search"/>
                                </span>
                                </div>
                            </div>
                            <select className="form-select mb-3" aria-label="Default select example"
                                    data-toggle="tooltip"
                                    value={dataParams.sender_id} onChange={(e) => handleData(e, 'sender')}
                                    data-placement="right" title="" data-bs-original-title="click Me">
                                <option value="">Select User</option>
                                {senderList.map((item, index) =>
                                    <option key={index}
                                            value={item.id}>{item.first_name + " " + item.last_name}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="tab-content pb-4" id="nav-tabContent">
                        <div className="tab-pane fade active show" id="Inprogress-detail" role="tabpanel"
                             aria-labelledby="Inprogress">
                            <div className="table-responsive">
                                <table
                                    className="table align-middle mb-0 bg-white in_progress_table manage_new_table shadow-sm mb-2 w-100">
                                    <thead>
                                    <tr className="bg_blue">
                                        <th className="cur-pointer"
                                            onClick={(e) => handleCreateSort(e, 'envelope_name')}>Envelope Name
                                        </th>
                                        <th className="cur-pointer"
                                            onClick={(e) => handleCreateSort(e, 'due_date')}>Due Date
                                        </th>
                                        <th className="p-0">
                                            <div className="table-responsive">
                                                <table className="w-100 inner_table_head">
                                                    <thead>
                                                    <tr>
                                                        <th style={{width: '200px'}}>Recipients</th>
                                                        <th style={{width: '180px'}} className="text-center">
                                                            Awaiting
                                                        </th>
                                                        <th style={{width: '200px'}} className="text-center">
                                                            Needs Review
                                                        </th>
                                                        <th style={{width: '175px'}} className="text-center">
                                                            Approved
                                                        </th>
                                                        <th style={{width: '140px'}} className="text-center">
                                                            Messages
                                                        </th>
                                                        <th style={{width: '100px'}}>Action</th>
                                                    </tr>
                                                    </thead>
                                                </table>
                                            </div>
                                        </th>
                                        <th style={{width: '80px'}} className="text-center">
                                            <i className="fa fa-ellipsis-v"/>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {envelopeList.map((item, index) => (
                                        <tr key={index} className="border_bottom_thick">
                                            <td>
                                                <div className="Recipients_name" bis_skin_checked="1">
                                                    <span
                                                        className="mb-2 text_blue fw_bold pt_10">{item.envelope_name}</span>
                                                    <div className="d-flex">
                                                        <span className="me-2">{item.sender_name}</span>
                                                        <span>({item.created_at})</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="pt_10 d-block">{item.due_date}</span>
                                            </td>
                                            <td className="p-0">
                                                <table className="w-100 inner_table_body">
                                                    <tbody>
                                                    {item.recipient_list.map((recipient, r) => (
                                                        <tr key={r}>
                                                            <td style={{width: '200px'}}>{recipient.first_name + ` ` + recipient.last_name}</td>
                                                            <td style={{width: '180px'}} className="text-center">
                                                                <span
                                                                    onClick={(e) => handleManageMessageView(e, item, recipient, 'awaiting')}
                                                                    className="needs_review cur-pointer">{recipient.awaiting}</span>
                                                            </td>
                                                            <td style={{width: '200px'}} className="text-center">
                                                                <span
                                                                    onClick={(e) => handleManageMessageView(e, item, recipient, 'needs-review')}
                                                                    className="needs_review bg_light_blue cur-pointer">{recipient.need_review}</span>
                                                            </td>
                                                            <td style={{width: '175px'}}>
                                                                <div
                                                                    onClick={(e) => handleManageMessageView(e, item, recipient, 'approved')}
                                                                    className={`progress-circle cur-pointer ${recipient.percentage > 50 ? `over50` : ``} p${recipient.percentage}`}>
                                                                    <span>{recipient.approved}/{recipient.total_envelope}</span>
                                                                    <div className="left-half-clipper">
                                                                        <div className="first50-bar"/>
                                                                        <div className="value-bar"/>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td style={{width: '140px'}}
                                                                className="text-center">
                                                                <div className="mesage_notification"
                                                                     onClick={(e) => handleManageMessageView(e, item, recipient, 'message')}>
                                                                    <i className="fa fa-comments-o"
                                                                       aria-hidden="true">
                                                                        {recipient.is_message === true && (
                                                                            <span className="red_dot"/>
                                                                        )}
                                                                    </i>
                                                                </div>
                                                            </td>
                                                            <td style={{width: '100px'}}>
                                                            <span className="Action_perform" data-toggle="tooltip"
                                                                  data-placement="right" title=""
                                                                  onClick={(e) => handleManageView(e, item, recipient)}
                                                                  data-bs-original-title="click Me">Manage</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                            <td className="functional_icons text-center" style={{width: '80px'}}>
                                                <div className="dropdown pt_10">
                                                    <span className="functional_icon_ellipsis"
                                                          id={`dropdownMenuButton_${index}`} data-bs-toggle="dropdown"
                                                          aria-expanded="false">
                                                        <i className="fa fa-ellipsis-v"/>
                                                    </span>
                                                    <ul className="dropdown-menu"
                                                        aria-labelledby={`dropdownMenuButton_${index}`}>
                                                        <li>
                                                            <span onClick={(e) => onAddEnvelopeTemplate(e, item)}
                                                                  data-bs-toggle="modal"
                                                                  data-bs-target="#AddEnvelopeTemplate"
                                                                  className="dropdown-item cur-pointer">Add Envelope in Templates</span>
                                                        </li>
                                                        <li>
                                                            <span className="dropdown-item cur-pointer"
                                                                  onClick={(e) => onCopyEnvelope(e, item)}
                                                                  data-bs-toggle="modal" data-bs-target="#CopyEnvelope">Duplicate Envelope</span>
                                                        </li>
                                                        <li>
                                                            <span onClick={(e) => onDeleteEnvelope(e, item)}
                                                                  className="dropdown-item cur-pointer"
                                                                  data-bs-toggle="modal"
                                                                  data-bs-target="#DeleteEnvelope">Delete Envelope</span>
                                                        </li>
                                                        <li>
                                                            <span onClick={(e) => onTransferEnvelope(e, item)}
                                                                  className="dropdown-item cur-pointer"
                                                                  data-bs-toggle="modal"
                                                                  data-bs-target="#transferEnvelope">Transfer Envelope</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {envelopeList.length === 0 && (
                                        <tr>
                                            <td className="text-center" colSpan={9}>{envelopeProcess}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="table_footer_wrap">
                        <div className="d-flex align-items-center mb-4">
                            <span className="me-2">Show</span>
                            <select className="form-select" value={dataParams.limit}
                                    onChange={(e) => handleData(e, 'limit')} aria-label="Default select example">
                                {lengths && lengths.map((item, i) => <option value={item} key={i}>{item}</option>)}
                            </select>
                        </div>
                        <div className="pagination mb-4">
                            <Pagination
                                activePage={dataParams.page}
                                itemsCountPerPage={dataParams.limit}
                                totalItemsCount={totalData}
                                pageRangeDisplayed={5}
                                onChange={(e) => handleData(e, 'pagination')}
                            />
                        </div>
                    </div>
                </div>

                <DeleteEnvelope deleteEnvelope={deleteEnvelope} setDeleteEnvelope={setDeleteEnvelope}
                                setLoading={setLoading} dataParams={dataParams} setDataParams={setDataParams}/>

                <AddEnvelopeTemplate deleteEnvelope={deleteEnvelope} setDeleteEnvelope={setDeleteEnvelope}
                                     setLoading={setLoading}/>

                <TransferEnvelope deleteEnvelope={deleteEnvelope} setDeleteEnvelope={setDeleteEnvelope}
                                  senderList={senderList} setLoading={setLoading} dataParams={dataParams}
                                  setDataParams={setDataParams}/>

                <CopyEnvelope copyEnvelope={copyEnvelope} setCopyEnvelope={setCopyEnvelope}
                              setLoading={setLoading}/>
            </section>

            <span data-bs-toggle="modal" data-bs-target="#checkEnvelopeCredit" ref={openCheckEnvelopeRef}/>
            <span data-bs-toggle="modal" data-bs-target="#checkEnvelopeStorage" ref={openCheckEnvelopeStorageRef}/>
            <CheckEnvelopeCredit/>
            <CheckEnvelopeStorage/>
        </>
    );
}

export default ManageEnvelope;
