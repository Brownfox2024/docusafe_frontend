import React, {useEffect, useState, useRef} from 'react';
import {NavLink} from "react-router-dom";
import {getUserList} from "../../../../services/UserService";
import Utils from "../../../../utils";
import Pagination from "react-js-pagination";
import ModifyUser from "./ModifyUser";
import DeleteUser from "./DeleteUser";
import ViewUser from "./ViewUser";

const lengths = Utils.tableShowLengths();

function SettingUsers() {

    const [loading, setLoading] = useState(false);

    const [roleList, setRoleList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [totalUser, setTotalUser] = useState(0);
    const [userList, setUserList] = useState([]);

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [groupId, setGroupId] = useState(0);
    const [isCall, setIsCall] = useState(false);
    const [listProcess, setListProcess] = useState('loading...');

    const [isGroupTab, setIsGroupTab] = useState(true);

    const userModalRef = useRef(null);
    const userRoleAccessRef = useRef(null);

    const [users, setUsers] = useState({
        id: 0,
        first_name: '',
        last_name: '',
        email: '',
        role_id: '',
        role_name: '',
        group_name: '',
        group_ids: []
    });

    useEffect(function () {
        setUserList([]);
        setListProcess('loading...');
        let obj = {
            limit: limit,
            search: search,
            page: page,
            group_id: groupId
        };

        getUserList(obj)
            .then(response => {
                setRoleList(response.data.roles);
                setGroupList(response.data.groups);
                setTotalUser(parseInt(response.data.count));
                setUserList(response.data.data);
                if (response.data.data.length === 0) {
                    setListProcess('No data available.');
                }
            })
            .catch(err => {
                setListProcess('No data available.');
            });
    }, [limit, page, search, groupId, isCall]);

    useEffect(function () {
        let loginData = Utils.loginUserData();
        if (Object.keys(loginData).length > 0) {
            if (loginData.role_id > 3) {
                setIsGroupTab(false);
            }
        }
    }, []);

    const handleEditUser = (e, data) => {
        setUsers(data);
        userModalRef?.current.click();
    };

    const handleDeleteUser = (e, data) => {
        setUsers(data);
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
                    <NavLink to={"/settings/users"} className="nav-link active" id="users" type="button"
                             role="tab">Users</NavLink>
                    {isGroupTab === true && (
                        <NavLink to={"/settings/users/group"} className="nav-link" id="group-tab" type="button"
                                 role="tab">Group</NavLink>
                    )}
                </div>
                <div className="tab-content account_accordiom" id="navContent"
                     style={{minHeight: "calc(100vh - 259px)", marginBottom: 30}}>

                    <div className="tab-pane  p-4 active" id="users-detail" role="tabpanel" aria-labelledby="users">
                        <div className="table_header_wrap py-3">
                            <div className="search_input mb-2">
                                <div className="input-group position-relative me-2">
                                    <input className="form-control border-end-0 border rounded-pill" type="text"
                                           value={search} onChange={(e) => setSearch(e.target.value)}
                                           placeholder="Search"/>
                                    <span className="input-group-append position-absolute">
                                        <i className="fa fa-search"/>
                                    </span>
                                </div>
                            </div>
                            <div className="wrap_right flexWrap step_wizard_content">
                                <button className="btn btn-primary create_user mb-2" data-bs-toggle="offcanvas"
                                        ref={userModalRef} data-bs-target="#modifyUser" aria-controls="modifyUser">
                                    Create User
                                </button>
                                <select className="form-select" value={groupId}
                                        onChange={(e) => setGroupId(e.target.value)}
                                        aria-label="Default select example">
                                    <option value={0}>All Group</option>
                                    {groupList.map((item, index) =>
                                        <option key={index} value={item.id}>{item.name}</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="table-responsive mb-3">
                            <table className="table mb-0 in_progress_table shadow-sm mb-4">
                                <thead className="">
                                <tr className="bg_blue">
                                    <th>Date Created</th>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Group Name</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {userList.map((item, index) =>
                                    <tr key={index}>
                                        <td>{item.created_at}</td>
                                        <td>{item.first_name + ' ' + item.last_name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.role_name}</td>
                                        <td>{item.group_name}</td>
                                        <td style={{width: "20%"}}>
                                            <i className="fa fa-eye me-3" data-bs-toggle="offcanvas"
                                               data-bs-target="#viewUser" aria-controls="viewUser"
                                               onClick={(e) => handleDeleteUser(e, item)} aria-hidden="true"/>
                                            <i className="fa fa-trash  mx-3"
                                               onClick={(e) => handleDeleteUser(e, item)}
                                               data-bs-toggle="modal" data-bs-target="#deleteUserModal"
                                               aria-hidden="true"/>
                                            <i className="fa fa-pencil  mx-3"
                                               onClick={(e) => handleEditUser(e, item)}
                                               aria-hidden="true"/>
                                        </td>
                                    </tr>
                                )}

                                {userList.length === 0 &&
                                <tr>
                                    <td className="text-center" colSpan={6}>{listProcess}</td>
                                </tr>
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="table_footer_wrap">
                            <div className="d-flex align-items-center">
                                <span className="me-2">Show</span>
                                <select className="form-select" value={limit} onChange={(e) => setLimit(e.target.value)}
                                        aria-label="Default select example">
                                    {lengths && lengths.map((item, i) => <option value={item} key={i}>{item}</option>)}
                                </select>
                            </div>
                            <div className="pagination">
                                <Pagination
                                    activePage={page}
                                    itemsCountPerPage={limit}
                                    totalItemsCount={totalUser}
                                    pageRangeDisplayed={5}
                                    onChange={(e) => setPage(e)}
                                />
                            </div>
                        </div>

                        <ModifyUser users={users} setUsers={setUsers} roleList={roleList} setLoading={setLoading}
                                    groupList={groupList} userRoleAccessRef={userRoleAccessRef} setIsCall={setIsCall}
                                    isCall={isCall}/>

                        <DeleteUser users={users} setUsers={setUsers} setLoading={setLoading} setIsCall={setIsCall}
                                    isCall={isCall}/>

                        <ViewUser users={users} setUsers={setUsers}/>
                    </div>
                </div>
            </div>

            <span data-bs-toggle="modal" ref={userRoleAccessRef} data-bs-target="#userRoleAccess"/>
            <div className="modal fade" id="userRoleAccess" tabIndex="-1" aria-labelledby="userRoleAccessLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-body p-0">
                            <img src="/images/DocuTik-users-role-access.png" alt="..." className="w-100"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SettingUsers;