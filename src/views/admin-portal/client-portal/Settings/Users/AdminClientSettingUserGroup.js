import React, {useEffect, useRef, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import Utils from "../../../../../utils";
import Pagination from "react-js-pagination";
import AdminClientModifyGroup from "./AdminClientModifyGroup";
import AdminClientDeleteGroup from "./AdminClientDeleteGroup";
import {adminGetGroupList} from "../../../../../services/AdminService";

const lengths = Utils.tableShowLengths();

function AdminClientSettingUserGroup() {
    let {client} = useParams();
    const [loading, setLoading] = useState(false);
    const [groupList, setGroupList] = useState([]);
    const [totalGroup, setTotalGroup] = useState(0);
    const [userList, setUserList] = useState([]);

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [isCall, setIsCall] = useState(false);
    const [listProcess, setListProcess] = useState('loading...');

    const [isGroupTab, setIsGroupTab] = useState(true);

    const groupModalRef = useRef(null);

    const [groupData, setGroupData] = useState({
        id: 0,
        name: '',
        users: []
    });

    useEffect(function () {

        setGroupList([]);
        setListProcess('loading...');
        let obj = {
            client_id: client,
            limit: limit,
            search: search,
            page: page
        };

        adminGetGroupList(obj)
            .then(response => {
                setUserList(response.data.userList);
                setTotalGroup(parseInt(response.data.count));
                setGroupList(response.data.data);
                if (response.data.data.length === 0) {
                    setListProcess('No data available.');
                }
            })
            .catch(err => {
                setListProcess('No data available.');
            });

    }, [limit, page, search, isCall, client]);

    useEffect(function () {
        let loginData = Utils.loginClientUserData(client);
        if (Object.keys(loginData).length > 0) {
            if (loginData.role_id > 3) {
                setIsGroupTab(false);
            }
        }
    }, [client]);

    const handleEditGroup = (e, data) => {
        e.preventDefault();

        setGroupData({
            id: data.id,
            name: data.name,
            users: data.users
        });

        groupModalRef?.current.click();
    };

    const handleDeleteGroup = (e, data) => {
        e.preventDefault();

        setGroupData({
            id: data.id,
            name: data.name,
            users: data.users
        });
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}

            <div className="tab-pane active show bg_transparent" id="user" role="tabpanel" aria-labelledby="user-tab">
                <div className="breadcrumbs pt-4">
                    <ul>
                        <li>Settings /</li>
                        <li>Users</li>
                    </ul>
                </div>
                <div className="nav nav-tabs pt-4" id="navtab" role="tablist">
                    <NavLink to={"/back-admin/client-portal/" + client + "/settings/users"} className="nav-link"
                             id="users" type="button" role="tab" end>Users</NavLink>
                    {isGroupTab === true && (
                        <NavLink to={"/back-admin/client-portal/" + client + "/settings/users/group"}
                                 className="nav-link active" id="group-tab" type="button"
                                 role="tab">Group</NavLink>
                    )}
                </div>
                <div className="tab-content account_accordiom" id="navContent"
                     style={{minHeight: "calc(100vh - 259px)", marginBottom: 30}}>

                    <div className="tab-pane  p-4 create_grp active" id="group" role="tabpanel"
                         aria-labelledby="group-tab">
                        <div className="table_header_wrap py-3">
                            <div className="search_input">
                                <div className="input-group position-relative me-2">
                                    <input className="form-control border-end-0 border rounded-pill mb-2" type="text"
                                           value={search} onChange={(e) => setSearch(e.target.value)}
                                           placeholder="Search"/>
                                    <span className="input-group-append position-absolute mb-2">
                                        <i className="fa fa-search"/>
                                    </span>
                                </div>
                            </div>
                            <div className="wrap_right flexWrap ">
                                <button className="btn btn-primary create_user" data-bs-toggle="offcanvas"
                                        ref={groupModalRef} data-bs-target="#modifyGroup"
                                        aria-controls="modifyGroup">Create Group
                                </button>
                            </div>
                        </div>
                        <div className="table-responsive mb-3">
                            <table className="table mb-0 in_progress_table shadow-sm mb-4">
                                <thead className="">
                                <tr className="bg_blue">
                                    <th>Date Created</th>
                                    <th>Group Name</th>
                                    <th>Users</th>
                                    <th/>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {groupList.map((item, index) =>
                                    <tr key={index}>
                                        <td>{item.created_at}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            <span className="bg_light_blue">{item.total_user}</span>
                                        </td>
                                        <td style={{width: "15%"}}/>
                                        <td style={{width: "10%"}}>
                                            <i onClick={(e) => handleEditGroup(e, item)} className="fa fa-pencil  me-3"
                                               aria-hidden="true"/>
                                            <i onClick={(e) => handleDeleteGroup(e, item)} className="fa fa-trash mx3"
                                               data-bs-toggle="modal" data-bs-target="#deleteGroupModal"
                                               aria-hidden="true"/>
                                        </td>
                                    </tr>
                                )}

                                {groupList.length === 0 &&
                                <tr>
                                    <td className="text-center" colSpan={5}>{listProcess}</td>
                                </tr>
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="table_footer_wrap">
                            <div className="d-flex align-items-center">
                                <span className="me-2">Show</span>
                                <select value={limit} onChange={(e) => setLimit(e.target.value)} className="form-select"
                                        aria-label="Default select example">
                                    {lengths && lengths.map((item, i) => <option value={item} key={i}>{item}</option>)}
                                </select>
                            </div>
                            <div className="pagination">
                                <Pagination
                                    activePage={page}
                                    itemsCountPerPage={limit}
                                    totalItemsCount={totalGroup}
                                    pageRangeDisplayed={5}
                                    onChange={(e) => setPage(e)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AdminClientModifyGroup userList={userList} groupData={groupData} setGroupData={setGroupData}
                                    isCall={isCall} setIsCall={setIsCall} setLoading={setLoading}/>

            <AdminClientDeleteGroup groupData={groupData} setGroupData={setGroupData} isCall={isCall}
                                    setIsCall={setIsCall} setLoading={setLoading}/>
        </>
    );
}

export default AdminClientSettingUserGroup;