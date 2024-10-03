import React, {useEffect, useState} from "react";
import Pagination from "react-js-pagination";
import Utils from "../../../utils";
import {getFrontUserList} from "../../../services/AdminService";
import DeleteFrontEndUser from "./DeleteFrontEndUser";
import CheckPasswordModal from "./CheckPasswordModal";

const lengths = Utils.tableShowLengths();

function AdminPortalUsers() {
    const [loading, setLoading] = useState(false);
    const [frontUserList, setFrontUserList] = useState([]);
    const [totalFrontUser, setTotalFrontUser] = useState(0);
    const [userId, setUserId] = useState(0);
    const [modalId, setModalId] = useState();
    const [dataParams, setDataParams] = useState({
        limit: lengths[0],
        page: 1,
        search_id: '',
        search_name: '',
        search_email: '',
        search_start_date: '',
        search_end_date: '',
        search_company_name: '',
        is_reload: true,
    });

    useEffect(function () {
        if (dataParams.is_reload === true) {
            setLoading(true);
            getFrontUserList(dataParams)
                .then(response => {
                    setFrontUserList(response.data.data);
                    setTotalFrontUser(response.data.count);
                    setLoading(false);
                    let params = {...dataParams};
                    params.is_reload = false;
                    setDataParams(params);
                })
                .catch(err => {
                    setLoading(false);
                });
        }
    }, [dataParams]);

    const handleData = (e, type) => {
        let params = {...dataParams};
        if (type === 'pagination') {
            params.page = e;
            params.is_reload = true;
        } else if (type === 'limit') {
            params.limit = parseInt(e.target.value);
            params.is_reload = true;
        } else if (type === 'search_id') {
            params.search_id = e.target.value;
        } else if (type === 'search_name') {
            params.search_name = e.target.value;
        } else if (type === 'search_email') {
            params.search_email = e.target.value;
        } else if (type === 'search_start_date') {
            params.search_start_date = e.target.value;
        } else if (type === 'search_end_date') {
            params.search_end_date = e.target.value;
        } else if (type === 'search_company_name') {
            params.search_company_name = e.target.value;
        }
        setDataParams(params);
    };

    const handleSearchFilter = (e) => {
        e.preventDefault();
        let params = {...dataParams};
        params.page = 1;
        params.is_reload = true;
        setDataParams(params);
    };

    const handleClearFilter = (e) => {
        e.preventDefault();
        let params = {
            limit: lengths[0],
            page: 1,
            search_id: '',
            search_name: '',
            search_email: '',
            search_start_date: '',
            search_end_date: '',
            search_company_name: '',
            is_reload: true
        };
        setDataParams(params);
    };

    const handleUserDeleteModal = (e, data) => {
        e.preventDefault();
        setUserId(data.id);
    };

    const onVerifyPassword = (e, data) => {
        e.preventDefault();
        setUserId(data.id);
        setModalId(data.generated_id);
    };

    return (
        <div className="custom_container">
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}

            <h2 className="main_title mb-3">Users</h2>

            <div className="tab-content pb-4" id="nav-tabContent">
                <div className="tab-pane fade active show" id="Inprogress-detail" role="tabpanel"
                     aria-labelledby="Inprogress">
                    <div className="search_box_admin_page step_wizard_content">
                        <div className="d-flex justify-content-end flexWrap">
                            <div className="d-flex align-items-center flexWrap">
                                <input type="number" placeholder="Search by Id" value={dataParams.search_id}
                                       onChange={(e) => handleData(e, 'search_id')} className="form-control mb-3"/>
                                <input type="text" placeholder="Search by Name" value={dataParams.search_name}
                                       onChange={(e) => handleData(e, 'search_name')} className="form-control mb-3"/>
                                <input type="text" placeholder="Search by Email" value={dataParams.search_email}
                                       onChange={(e) => handleData(e, 'search_email')} className="form-control  mb-3"/>
                                <input type="Date" placeholder="Search by Start Date"
                                       value={dataParams.search_start_date}
                                       onChange={(e) => handleData(e, 'search_start_date')}
                                       className="form-control  mb-3"/>
                                <input type="Date" placeholder="Search by End Date" value={dataParams.search_end_date}
                                       onChange={(e) => handleData(e, 'search_end_date')}
                                       className="form-control  mb-3"/>
                                <input type="text" placeholder="Company Name" value={dataParams.search_company_name}
                                       onChange={(e) => handleData(e, 'search_company_name')}
                                       className="form-control mb-3"/>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button type="button" onClick={handleSearchFilter} className="btn btn-primary">Search
                                </button>
                                <button type="button" onClick={handleClearFilter} className="btn btn-secondary">Clear
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive mb-3">
                        <table className="table align-middle mb-0 bg-white in_progress_table shadow-sm mb-2">
                            <thead>
                            <tr className="bg_blue">
                                <th>Id</th>
                                <th>Date</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Company Name</th>
                                <th>User Type</th>
                                <th>Account Id</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Country</th>
                                <th>Plan</th>
                                <th>Last Login</th>
                                <th>Status</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {frontUserList.length > 0 && frontUserList.map((item, index) =>
                                <tr key={index}>
                                    <td>
                                        <button type="button" className="btn btn-link text-decoration-none"
                                                data-bs-toggle="modal" onClick={(e) => onVerifyPassword(e, item)}
                                                data-bs-target="#verifyPasswordModal">
                                            {item.id}
                                        </button>
                                    </td>
                                    <td>{item.created_at}</td>
                                    <td>{item.first_name}</td>
                                    <td>{item.last_name}</td>
                                    <td>{item.company_name}</td>
                                    <td>{item.user_type}</td>
                                    <td>{item.account_id}</td>
                                    <td>{item.email}</td>
                                    <td>{item.mobile ? `+` + item.country_code + ` ` + item.mobile : ``}</td>
                                    <td>{item.country_name}</td>
                                    <td>{item.plan}</td>
                                    <td>{item.last_login}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <span className="text-danger cur-pointer" data-bs-toggle="modal"
                                              data-bs-target="#deleteUserModal"
                                              onClick={(e) => handleUserDeleteModal(e, item)}>Delete</span>
                                    </td>
                                </tr>
                            )}

                            {frontUserList.length === 0 &&
                            <tr>
                                <td colSpan={13} className="text-center">No data available.</td>
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
                                totalItemsCount={parseInt(totalFrontUser)}
                                pageRangeDisplayed={5}
                                onChange={(e) => handleData(e, 'pagination')}
                            />
                        </div>
                    </div>
                </div>

                <DeleteFrontEndUser dataParams={dataParams} setDataParams={setDataParams} userId={userId}
                                    setUserId={setUserId} setLoading={setLoading}/>

                <CheckPasswordModal userId={userId} modalId={modalId} setLoading={setLoading}/>


            </div>
        </div>
    );
}

export default AdminPortalUsers;