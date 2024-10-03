import React, {useEffect, useState} from "react";

function ViewUser(props) {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [roleName, setRoleName] = useState('');
    const [groupName, setGroupName] = useState('');

    useEffect(function () {
        setFirstName(props.users.first_name ? props.users.first_name : '');
        setLastName(props.users.last_name ? props.users.last_name : '');
        setEmail(props.users.email ? props.users.email : '');
        setRoleName(props.users.role_name ? props.users.role_name : '');
        setGroupName(props.users.group_name ? props.users.group_name : '');
    }, [props?.users]);

    const handleCloseViewUser = (e) => {
        e.preventDefault();

        props.setUsers({
            id: 0,
            first_name: '',
            last_name: '',
            email: '',
            role_id: '',
            role_name: '',
            group_name: ''
        });
    };

    return (
        <div className="offcanvas offcanvas-end Add-Recipients" data-bs-scroll="true" tabIndex={-1}
             data-bs-keyboard="false" data-bs-backdrop="static" id="viewUser" aria-labelledby="viewUserLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="viewUserLabel">View User</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        onClick={handleCloseViewUser} aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                <div className="row mx-2 ">
                    <div className="col-lg-6">
                        <div className="mb-4">
                            <label className="form-label mb-2">First Name</label>
                            <input type="text" onChange={(e) => setFirstName(e.target.value)} value={firstName}
                                   className="form-control" disabled/>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-4">
                            <label className="form-label mb-2">Last Name</label>
                            <input type="text" onChange={(e) => setLastName(e.target.value)} value={lastName}
                                   className="form-control" disabled/>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-4">
                            <label className="form-label mb-2">Email</label>
                            <input type="text" onChange={(e) => setEmail(e.target.value)} value={email}
                                   className="form-control" disabled/>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="mb-4">
                            <label className="form-label mb-2">Role name</label>
                            <input type="text" onChange={(e) => setRoleName(e.target.value)} value={roleName}
                                   className="form-control" disabled/>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="mb-4">
                            <label className="form-label mb-2">Group name</label>
                            <input type="text" onChange={(e) => setGroupName(e.target.value)} value={groupName}
                                   className="form-control" disabled/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewUser;