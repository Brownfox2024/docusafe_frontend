import React, {useEffect, useState} from "react";
import {
    getEnvelopeSenderList,
    getManageEnvelopeList
} from "../../../../services/CommonService";
import {useNavigate} from "react-router-dom";
import Utils from "../../../../utils";
import Pagination from "react-js-pagination";
import DeleteEnvelope from "./DeleteEnvelope";
import TransferEnvelope from "./TransferEnvelope";
import CopyEnvelope from "./CopyEnvelope";

const lengths = Utils.tableShowLengths();

function DraftManageEnvelope() {
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
        status_id: 0,
        search: "",
        sender_id: "",
        order_column: 'created_at',
        order_by: false,
        is_effect: false
    });
    const [deleteEnvelope, setDeleteEnvelope] = useState({id: 0, name: ''});
    const [copyEnvelope, setCopyEnvelope] = useState(0);

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

    const onEditEnvelope = (e, data) => {
        e.preventDefault();
        navigate('/client-portal/envelope/edit/' + data.uuid + '/' + data.current_step);
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
                            <button className="nav-link mb-3" onClick={(e) => navigate('/manage')} type="button"
                                    role="tab" aria-selected="true">
                                In Progress <span>({totalInProgress})</span>
                            </button>
                            <button className="nav-link active mb-3" type="button" role="tab" aria-selected="true">
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
                                    className="table table-row-border align-middle mb-0 bg-white in_progress_table shadow-sm mb-2">
                                    <thead className="">
                                    <tr className="bg_blue">
                                        <th style={{width: '140px'}}>
                                            <span className="cur-pointer"
                                                  onClick={(e) => handleCreateSort(e, 'created_at')}>Created</span>
                                        </th>
                                        <th className="cur-pointer"
                                            onClick={(e) => handleCreateSort(e, 'envelope_name')}>Envelope Name
                                        </th>
                                        <th className="cur-pointer"
                                            onClick={(e) => handleCreateSort(e, 'recipient_names')}>Recipients
                                        </th>
                                        <th style={{width: '140px'}} className="cur-pointer"
                                            onClick={(e) => handleCreateSort(e, 'due_date')}>Due Date
                                        </th>
                                        <th className="cur-pointer"
                                            onClick={(e) => handleCreateSort(e, 'sender_name')}>User
                                        </th>
                                        <th>
                                            <i className="fa fa-ellipsis-v"/>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {envelopeList.map((item, index) =>
                                        <tr key={index}>
                                            <td>{item.created_at}</td>
                                            <td>{item.envelope_name}</td>
                                            <td>
                                                <div className="Recipients_name">
                                                    {item.recipient_names.map((recipient, r) =>
                                                        <span key={r} className="mb-1">{recipient}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{item.due_date}</td>
                                            <td>{item.sender_name}</td>
                                            <td className="functional_icons">
                                                <div className="dropdown">
                                                <span className="functional_icon_ellipsis" id="dropdownMenuButton1"
                                                      data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i className="fa fa-ellipsis-v"/>
                                                </span>
                                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                        <li>
                                                            <span onClick={(e) => onEditEnvelope(e, item)}
                                                                  className="dropdown-item cur-pointer">Edit Envelope</span>
                                                        </li>
                                                        <li>
                                                        <span className="dropdown-item cur-pointer"
                                                              onClick={(e) => onCopyEnvelope(e, item)}
                                                              data-bs-toggle="modal"
                                                              data-bs-target="#CopyEnvelope">Duplicate Envelope</span>
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
                                    )}
                                    {envelopeList.length === 0 && (
                                        <tr>
                                            <td className="text-center" colSpan={6}>{envelopeProcess}</td>
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

                <TransferEnvelope deleteEnvelope={deleteEnvelope} setDeleteEnvelope={setDeleteEnvelope}
                                  senderList={senderList} setLoading={setLoading} dataParams={dataParams}
                                  setDataParams={setDataParams}/>

                <CopyEnvelope copyEnvelope={copyEnvelope} setCopyEnvelope={setCopyEnvelope}
                              setLoading={setLoading}/>
            </section>
        </>
    );
}

export default DraftManageEnvelope;
