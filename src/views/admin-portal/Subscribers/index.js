import React, {useEffect, useState} from "react";
import Utils from "../../../utils";
import Pagination from "react-js-pagination";
import {getSubscriberList} from "../../../services/AdminService";
import DeleteSubscriber from "./DeleteSubscriber";

const lengths = Utils.tableShowLengths();

function AdminPortalSubscribers() {
    const [loading, setLoading] = useState(false);
    const [subscriberList, setSubscriberList] = useState([]);
    const [subscriberTotal, setSubscriberTotal] = useState(0);
    const [isEffect, setIsEffect] = useState(false);
    const [dataParams, setDataParams] = useState({
        limit: lengths[0],
        page: 1,
    });
    const [subscriberId, setSubscriberId] = useState(0);

    useEffect(function () {
        setLoading(true);
        getSubscriberList(dataParams)
            .then(response => {
                setSubscriberList(response.data.data);
                setSubscriberTotal(response.data.count);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });
    }, [dataParams, isEffect]);

    const handleData = (e, type) => {
        let params = {...dataParams};
        if (type === 'pagination') {
            params.page = e;
        } else if (type === 'limit') {
            params.limit = parseInt(e.target.value);
        }
        setDataParams(params);
    };

    const handleSubscriberDeleteModal = (e, data) => {
        setSubscriberId(data.id);
    };

    return (
        <div className="custom_container">
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}

            <h2 className="main_title mb-3">Subscribers</h2>
            <div className="tab-content pb-4" id="nav-tabContent">
                <div className="tab-pane fade active show" id="draft" role="tabpanel" aria-labelledby="draft-tab">
                    <div className="table-responsive mb-5">
                        <table className="table align-middle mb-0 bg-white in_progress_table shadow-sm mb-2">
                            <thead>
                            <tr className="bg_blue">
                                <th>No</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {subscriberList.map((item, index) =>
                                <tr key={index}>
                                    <td>{item.index}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        <span className="text-danger cur-pointer" data-bs-toggle="modal"
                                              data-bs-target="#deleteSubscriberModal"
                                              onClick={(e) => handleSubscriberDeleteModal(e, item)}>Delete</span>
                                    </td>
                                </tr>
                            )}

                            {subscriberList.length === 0 &&
                            <tr>
                                <td colSpan={3} className="text-center">No data available.</td>
                            </tr>
                            }
                            </tbody>
                        </table>
                    </div>

                    <div className="table_footer_wrap mb-3">
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
                                totalItemsCount={parseInt(subscriberTotal)}
                                pageRangeDisplayed={5}
                                onChange={(e) => handleData(e, 'pagination')}
                            />
                        </div>
                    </div>
                </div>

                <DeleteSubscriber subscriberId={subscriberId} setSubscriberId={setSubscriberId} isEffect={isEffect}
                                  setIsEffect={setIsEffect} setLoading={setLoading}/>
            </div>
        </div>
    );
}

export default AdminPortalSubscribers;