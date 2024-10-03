import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import {GOOGLE_DRIVE_TYPE, ONE_DRIVE_CONNECT_URL_BACKEND} from "../../../../../configs/AppConfig";
import {
    adminCheckCloudIntegration,
    adminPostBoxConnect,
    adminPostBoxDisConnect,
    adminPostDropBoxConnect,
    adminPostDropBoxDisConnect,
    adminPostGoogleDriveConnect,
    adminPostGoogleDriveDisConnect,
    adminPostOneDriveDisconnect
} from "../../../../../services/AdminService";

function AdminClientSettingIntegration() {
    let {client} = useParams();
    const [loading, setLoading] = useState(true);
    const [checkOneDrive, setCheckOneDrive] = useState(false);
    const [checkGoogleDrive, setCheckGoogleDrive] = useState(false);
    const [checkDropBox, setCheckDropBox] = useState(false);
    const [checkBox, setCheckBox] = useState(false);
    const [isCall, setIsCall] = useState(true);

    useEffect(function () {
        if (isCall === true) {
            setLoading(true);
            adminCheckCloudIntegration({client_id: client})
                .then(response => {
                    setLoading(false);
                    setIsCall(false);
                    setCheckOneDrive(response.data.data.one_drive);
                    setCheckGoogleDrive(response.data.data.google_drive);
                    setCheckDropBox(response.data.data.drop_box);
                    setCheckBox(response.data.data.box);
                })
                .catch(err => {
                    setLoading(false);
                    setIsCall(false);
                });
        }
    }, [isCall, client]);

    const handleDisconnectOneDrive = (e) => {
        e.preventDefault();
        setLoading(true);
        adminPostOneDriveDisconnect({client_id: client})
            .then(response => {
                setLoading(false);
                setIsCall(true);
                toast.success(response.data.message);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleConnectGoogleDrive = (e) => {
        e.preventDefault();
        setLoading(true);
        let obj = {
            client_id: client,
            type: GOOGLE_DRIVE_TYPE,
            from: 2,
        };
        adminPostGoogleDriveConnect(obj)
            .then(response => {
                window.location.href = response.data.url;
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleDisconnectGoogleDrive = (e) => {
        e.preventDefault();
        setLoading(true);
        adminPostGoogleDriveDisConnect({client_id: client})
            .then(response => {
                toast.success(response.data.message);
                setCheckGoogleDrive(false);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleConnectDropBox = (e) => {
        e.preventDefault();
        setLoading(true);
        let obj = {
            client_id: client,
            from: 2,
        };
        adminPostDropBoxConnect(obj)
            .then(response => {
                window.location.href = response.data.url;
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleDisconnectDropBox = (e) => {
        e.preventDefault();
        setLoading(true);
        adminPostDropBoxDisConnect({client_id: client})
            .then(response => {
                toast.success(response.data.message);
                setCheckDropBox(false);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleConnectBox = (e) => {
        e.preventDefault();
        setLoading(true);
        let obj = {
            from: 2,
            client_id: client
        };
        adminPostBoxConnect(obj)
            .then(response => {
                window.location.href = response.data.url;
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleDisconnectBox = (e) => {
        e.preventDefault();
        setLoading(true);
        adminPostBoxDisConnect({client_id: client})
            .then(response => {
                toast.success(response.data.message);
                setCheckBox(false);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <div className="tab-pane active show bg_transparent" id="integration" role="tabpanel"
                 aria-labelledby="integration-tab" style={{minHeight: "calc(100vh - 149px)"}}>
                <div className="breadcrumbs pt-4">
                    <ul>
                        <li>Settings /</li>
                        <li>Integration</li>
                    </ul>
                </div>
                <div className="intergation_section mt-4">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="card mb-3">
                                <div className="img_box mb-2">
                                    <img src="/images/google_drive.png" alt="..."/>
                                </div>
                                <h4 className="mb-2 font_bold">Google Drive</h4>
                                <h5 className="mb-3">Cloud Storage Integration</h5>
                                {checkGoogleDrive === false && (
                                    <button type="button" onClick={handleConnectGoogleDrive}
                                            className="btn btn-primary rounded-pill mb-2">
                                        Connect
                                    </button>
                                )}

                                {checkGoogleDrive === true && (
                                    <button type="button" onClick={handleDisconnectGoogleDrive}
                                            className="btn btn-danger rounded-pill mb-2">
                                        Disconnect
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="card mb-3">
                                <div className="img_box mb-2">
                                    <img src="/images/dropbox.png" alt="..."/>
                                </div>
                                <h4 className="mb-2 font_bold">Dropbox</h4>
                                <h5 className="mb-3">Cloud Storage Integration</h5>
                                {checkDropBox === false && (
                                    <button type="button" onClick={handleConnectDropBox}
                                            className="btn btn-primary rounded-pill mb-2">
                                        Connect
                                    </button>
                                )}

                                {checkDropBox === true && (
                                    <button type="button" onClick={handleDisconnectDropBox}
                                            className="btn btn-danger rounded-pill mb-2">
                                        Disconnect
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="card mb-3">
                                <div className="img_box mb-2">
                                    <img src="/images/box.png" alt="..."/>
                                </div>
                                <h4 className="mb-2 font_bold">Box</h4>
                                <h5 className="mb-3">Cloud Storage Integration</h5>
                                {checkBox === false && (
                                    <button type="button" onClick={handleConnectBox}
                                            className="btn btn-primary rounded-pill mb-2">
                                        Connect
                                    </button>
                                )}

                                {checkBox === true && (
                                    <button type="button" onClick={handleDisconnectBox}
                                            className="btn btn-danger rounded-pill mb-2">
                                        Disconnect
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="card mb-3">
                                <div className="img_box mb-2">
                                    <img src="/images/cloud_blue.png" alt="..."/>
                                </div>
                                <h4 className="mb-2 font_bold">One Drive</h4>
                                <h5 className="mb-3">Cloud Storage Integration</h5>
                                {checkOneDrive === false && (
                                    <a href={ONE_DRIVE_CONNECT_URL_BACKEND + '&state=' + client} target="_blank"
                                       rel="noopener noreferrer" className="btn btn-primary rounded-pill mb-2">
                                        Connect
                                    </a>
                                )}

                                {checkOneDrive === true && (
                                    <button type="button" onClick={handleDisconnectOneDrive}
                                            className="btn btn-danger rounded-pill mb-2">
                                        Disconnect
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminClientSettingIntegration;