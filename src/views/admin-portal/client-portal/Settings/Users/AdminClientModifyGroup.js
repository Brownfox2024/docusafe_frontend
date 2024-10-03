import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import {adminModifyGroupPost} from "../../../../../services/AdminService";

function AdminClientModifyGroup(props) {
    let {client} = useParams();
    const [groupId, setGroupId] = useState(0);
    const [groupUserList, setGroupUserList] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState('');

    const clsModifyGroup = useRef(null);

    useEffect(function () {
        setGroupId(parseInt(props.groupData.id));
        setGroupName(props.groupData.name ? props.groupData.name : '');
        setGroupUserList(props.userList.length > 0 ? props.userList : []);

        let userList = [];
        for (let i = 0; i < props.userList.length; i++) {
            let index = props.groupData.users.findIndex(x => parseInt(x) === parseInt(props.userList[i]['id']));
            if (index > -1) {
                userList.push(props.userList[i]);
            }
            setSelectedUsers(userList);
        }

    }, [props?.groupData, props.userList]);

    const handleSearchUser = (e) => {
        let value = e.target.value;
        setSearchUser(value);

        if (value.trim()) {
            let users = [...props.userList];
            let newUserList = [];
            for (let i = 0; i < users.length; i++) {
                let userName = users[i]['first_name'] + ' ' + users[i]['last_name'];
                if (userName.search(value) > -1 || users[i]['email'].search(value) > -1) {
                    newUserList.push(users[i]);
                }
            }
            setGroupUserList(newUserList);
        } else {
            setGroupUserList(props.userList);
        }
    };

    const handleSelectUser = (e, data) => {
        e.preventDefault();

        let selectUsers = [...selectedUsers];
        let index = selectUsers.findIndex(x => parseInt(x.id) === parseInt(data.id));
        if (index === -1) {
            selectUsers.push(data);
            setSelectedUsers(selectUsers);
        } else {
            toast.error('User Already added');
        }
    };

    const handleRemoveSelectUser = (e, data) => {
        e.preventDefault();

        let selectUsers = [...selectedUsers];
        let index = selectUsers.findIndex(x => parseInt(x.id) === parseInt(data.id));
        selectUsers.splice(index, 1);
        setSelectedUsers(selectUsers);
    };

    const handleClearModifyUser = (e) => {
        e.preventDefault();

        props.setGroupData({
            id: 0,
            name: '',
            users: []
        });
        setGroupUserList([]);
        setSearchUser('');
    };

    const handleSubmitGroup = (e) => {
        e.preventDefault();
        let error = false;

        if (!groupName) {
            toast.error('Group name is required');
            error = true;
        } else if (selectedUsers.length === 0) {
            toast.error('Please select user');
            error = true;
        }

        if (error) return;

        props.setLoading(true);

        let users = [];
        for (let i = 0; i < selectedUsers.length; i++) {
            users.push(selectedUsers[i]['id']);
        }

        let obj = {
            client_id: client,
            id: groupId,
            name: groupName,
            users: users
        };

        adminModifyGroupPost(obj)
            .then(response => {
                props.setLoading(false);
                clsModifyGroup?.current.click();
                toast.success(response.data.message);
                props.setIsCall(!props.isCall);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <div className="offcanvas offcanvas-end AddDocument AddTemplate templates_page" id="modifyGroup">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title"
                    id="modifyGroupLabel">{groupId > 0 ? `Update Group` : `Create Group`}</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        onClick={handleClearModifyUser} ref={clsModifyGroup} aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body p-0 " style={{overflowX: "hidden"}}>
                <div className=" row shadow-lg border_radius mx-0">
                    <div className="col-lg-7 px-0 mb-4">
                        <div
                            className="d-flex justify-content-between p-4 align-items-center step_wizard_content flexWrap">
                            <h2 className="text_blue w-100 main_title pb-0 ps-0 mb-2">Add Users to the group</h2>
                            <input value={searchUser} onChange={handleSearchUser} className="form-control mb-2"
                                   placeholder="Search User"/>
                        </div>
                        <div className="table-responsive envelope_name_table px-3">
                            <table className="table align-middle mb-0 bg-white  shadow-sm ">
                                <thead style={{backgroundColor: "#e4e4e4"}}>
                                <tr>
                                    <th>User Details</th>
                                    <th>Role</th>
                                    <th style={{width: "10%"}}>Add</th>
                                </tr>
                                </thead>
                                <tbody>
                                {groupUserList.map((item, index) =>
                                    <tr key={index}>
                                        <td>
                                            <div className="template_envelope_name remove_folder">
                                                <span className="mb-2">{item.first_name + ' ' + item.last_name}</span>
                                                <span>{item.email}</span>
                                            </div>
                                        </td>
                                        <td>{item.role_name}</td>
                                        <td>
                                            <i onClick={(e) => handleSelectUser(e, item)}
                                               className="fa fa-plus round_blue bg-success text-white"/>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-lg-5 px-0 mb-4">
                        <div
                            className="bg-blue d-flex justify-content-between p-4 align-items-center step_wizard_content border-bottom flexWrap">
                            <h2 className=" w-100 main_title pb-0 ps-0 mb-2">Group Name</h2>
                            <input value={groupName} onChange={(e) => setGroupName(e.target.value)}
                                   className="form-control mb-2" placeholder="Enter Group Name"/>
                        </div>
                        <div className="p-3"
                             style={{minHeight: "calc(100% - 72px)", backgroundColor: "rgba(227, 235, 245,0.9)"}}>
                            <h2 className="main_title text_blue ps-0 mb-3">Added Users</h2>
                            {selectedUsers.map((item, index) =>
                                <div key={index} className="request_document_tab  mb-3 bg_white position-relative py-3">
                                    <div className="template_envelope_name remove_folder">
                                        <span className="mb-1">{item.first_name + ' ' + item.last_name}</span>
                                        <span>{item.email}</span>
                                    </div>
                                    <span className="close_btn">
                                        <i onClick={(e) => handleRemoveSelectUser(e, item)}
                                           className="fa fa-times-circle" aria-hidden="true"/>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="modal-footer  mb-0">
                    <button type="button" onClick={handleClearModifyUser} data-bs-dismiss="offcanvas"
                            className="btn grey_btn_outline">Cancel
                    </button>
                    <button onClick={handleSubmitGroup} type="button" className="btn modal_btn">Save</button>
                </div>
            </div>
        </div>
    );
}

export default AdminClientModifyGroup;