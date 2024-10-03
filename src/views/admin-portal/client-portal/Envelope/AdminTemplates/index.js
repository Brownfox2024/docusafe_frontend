import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import AdminCreateFolder from "./AdminCreateFolder";
import AdminEditFolder from "./AdminEditFolder";
import AdminDeleteFolder from "./AdminDeleteFolder";
import AdminMoveFolder from "./AdminMoveFolder";
import AdminRenameEnvelope from "./AdminRenameEnvelope";
import AdminDeleteTemplateEnvelope from "./AdminDeleteTemplateEnvelope";
import AdminMoveEnvelope from "./AdminMoveEnvelope";
import AdminCopyTemplateEnvelope from "./AdminCopyTemplateEnvelope";
import {adminGetTemplateList, adminGetTemplateUser} from "../../../../../services/AdminService";
import AdminShareFolder from "./AdminShareFolder";
import AdminRemoveShareFolder from "./AdminRemoveShareFolder";
import AdminDuplicateTemplate from "./AdminDuplicateTemplate";

function AdminTemplates() {
    let {client} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    let buttonList = [
        {id: 1, name: 'My Templates', active: true},
        {id: 2, name: 'Shared with me', active: false},
        {id: 3, name: 'Docutick Templates', active: false}
    ];
    const [buttons, setButtons] = useState(buttonList);
    const [isBack, setIsBack] = useState(-1);
    const [templateList, setTemplateList] = useState([]);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [uuid, setUuid] = useState("");
    const [shareUserList, setShareUserList] = useState([]);

    let currentTemplateObj = {
        tab_id: 1,
        current_tab: "My Templates",
        current_folder: 0,
        is_refresh: false
    };
    const [currentTemplate, setCurrentTemplate] = useState(currentTemplateObj);
    const [isRefresh, setIsRefresh] = useState(false);

    const [folderData, setFolderData] = useState({
        id: '',
        name: ''
    });

    const [removeShareData, setRemoveShareData] = useState({
        id: '',
        type: ''
    });

    useEffect(function () {
        adminGetTemplateUser({client_id: client})
            .then(response => {
                setShareUserList(response.data.data);
            })
            .catch(err => {

            });
    }, [client]);

    useEffect(function () {
        setLoading(true);
        let obj = {
            client_id: client,
            template: currentTemplate.tab_id,
            folder_id: currentTemplate.current_folder
        };
        adminGetTemplateList(obj)
            .then(response => {
                setTemplateList(response.data.data);
                setBreadcrumbs(response.data.breadcrumbs);
                if (response.data.breadcrumbs.length > 0) {
                }
                setIsBack(response.data.back_id);
                setUuid(response.data.uuid);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    }, [client, currentTemplate, isRefresh]);

    const handleTemplateButton = (e, data) => {
        e.preventDefault();
        let button = [...buttonList];
        let currentTem = {...currentTemplate};
        for (let i = 0; i < button.length; i++) {
            let active = false;
            if (button[i]['id'] === data.id) {
                active = true;
                currentTem.tab_id = data.id;
                currentTem.current_tab = button[i]['name'];
                currentTem.current_folder = 0;
            }
            button[i]['active'] = active;
        }
        setButtons(button);
        setCurrentTemplate(currentTem);
    };

    const handleBack = (e) => {
        e.preventDefault();
        let template = {...currentTemplate};
        template.current_folder = isBack;
        setCurrentTemplate(template);
    };

    const onCreateTemplate = (e) => {
        e.preventDefault();
        navigate('/back-admin/client-portal/' + client + '/templates/create/' + uuid);
    };

    const onClickFolder = (e, id) => {
        let currentTem = {...currentTemplate};
        currentTem.current_folder = parseInt(id);
        setCurrentTemplate(currentTem);
    };

    const onOpenMoveFolder = (e, data) => {
        e.preventDefault();
        let obj = {
            id: data.entity_id,
            name: data.template_name
        };
        setFolderData(obj);
    };

    const onOpenShareFolder = (e, data) => {
        e.preventDefault();
        let obj = {
            id: data.entity_id,
            type: data.entity_type
        };
        setRemoveShareData(obj);
    };

    const onOpenEditFolder = (e, data) => {
        e.preventDefault();
        let obj = {
            id: data.entity_id,
            name: data.template_name
        };
        setFolderData(obj);
    };

    const onOpenDeleteFolder = (e, data) => {
        e.preventDefault();
        let obj = {
            id: data.entity_id,
            name: data.template_name
        };
        setFolderData(obj);
    };

    const onEditTemplate = (e, data) => {
        e.preventDefault();

        navigate('/back-admin/client-portal/' + client + '/templates/' + data.template_uuid + '/edit');
    };

    const onCopyTemplate = (e, data) => {
        e.preventDefault();

        let obj = {
            id: data.entity_id,
            name: data.template_name
        };
        setFolderData(obj);
    };

    const onOpenMoveTemplate = (e, data) => {
        e.preventDefault();
        let obj = {
            id: data.entity_id,
            name: data.template_name
        };
        setFolderData(obj);
    };

    const onOpenRenameTemplate = (e, data) => {
        e.preventDefault();
        let obj = {
            id: data.entity_id,
            name: data.template_name
        };
        setFolderData(obj);
    };

    const onOpenDeleteTemplate = (e, data) => {
        e.preventDefault();
        let obj = {
            id: data.entity_id,
            name: data.template_name
        };
        setFolderData(obj);
    };

    const onOpenRemoveShareFolder = (e, data) => {
        setRemoveShareData({
            id: data.entity_id,
            type: data.entity_type
        });
    };

    const onViewTemplate = (e, data) => {
        e.preventDefault();

        navigate('/back-admin/client-portal/' + client + '/templates/' + data.template_uuid + '/view');
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <div className="templates_page">
                <section className="main_wrapper background_grey_400 " style={{minHeight: 'calc(100vh - 119px)'}}>
                    <div className="custom_container">
                        <h2 className="main_title template_main_title">Templates</h2>
                        <div className=" row shadow-lg border_radius mx-0">
                            <div className="col-lg-2 pt-3 border_right">
                                <div className="nav nav-tabs flex-column" id="nav-tab" role="tablist">
                                    {buttons.map((item, index) =>
                                        <button key={index} className={`nav-link ${item.active ? `active` : ``}`}
                                                onClick={(e) => handleTemplateButton(e, item)}
                                                type="button" role="tab" aria-selected={item.active}>
                                            <i className="fa fa-folder" aria-hidden="true"/> {item.name}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-10 pt-3 px-0">
                                <div className="tab-content" id="nav-tabContent"
                                     style={{minHeight: 'calc(100vh - 397px)'}}>
                                    <div className="tab-pane fade active show" id="MyTemplates-detail" role="tabpanel"
                                         aria-labelledby="MyTemplatesDetails">
                                        <h2 className="main_title mb-3 d-flex align-items-center justify-content-between bread_crumb flexWrap px-3">
                                            <span>
                                                {breadcrumbs.length > 0 ?
                                                    <>
                                                        <span className="text_blue cur-pointer"
                                                              onClick={(e) => onClickFolder(e, 0)}>
                                                            <i className="fa fa-folder"
                                                               aria-hidden="true"/> {currentTemplate.current_tab}
                                                            </span>
                                                        {breadcrumbs.map((breadcrumb, b) =>
                                                            <React.Fragment key={b}>
                                                                <i className="fa fa-angle-double-right mx-3"/>
                                                                {breadcrumb.is_last === true ?
                                                                    <span>
                                                                    <i className="fa fa-folder"
                                                                       aria-hidden="true"/> {breadcrumb.folder_name}
                                                                    </span>
                                                                    :
                                                                    <span className="text_blue cur-pointer"
                                                                          onClick={(e) => onClickFolder(e, breadcrumb.id)}>
                                                                    <i className="fa fa-folder"
                                                                       aria-hidden="true"/> {breadcrumb.folder_name}
                                                                    </span>
                                                                }
                                                            </React.Fragment>
                                                        )}
                                                    </>
                                                    :
                                                    <span>
                                                        <i className="fa fa-folder"
                                                           aria-hidden="true"/> {currentTemplate.current_tab}
                                                        </span>
                                                }
                                            </span>
                                            <div className="d-flex">
                                                {isBack > -1 &&
                                                <button type="button" onClick={handleBack}
                                                        className="btn shadow load_template_btn me-3 back_btn"
                                                        data-toggle="tooltip" data-placement="right" title=""
                                                        data-bs-original-title="click Me">
                                                    <i className="fa fa-arrow-left me-2" aria-hidden="true"/>Back
                                                </button>
                                                }

                                                {currentTemplate.tab_id === 1 &&
                                                <div className="functional_icons">
                                                    <div className="dropdown">
                                                        <button className="create_dropdown" id="createDropdown"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false">Create <i
                                                            className="fa fa-angle-down ms-2"/>
                                                        </button>
                                                        <ul className="dropdown-menu" aria-labelledby="createDropdown">
                                                            <li onClick={onCreateTemplate}>
                                                                <div className="dropdown-item">Create Template</div>
                                                            </li>
                                                            {breadcrumbs.length < 3 &&
                                                            <li>
                                                                <div className="dropdown-item" data-bs-toggle="modal"
                                                                     data-bs-target="#createTemplateFolder">Create
                                                                    Folder
                                                                </div>
                                                            </li>
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                                }
                                            </div>
                                        </h2>

                                        <div className="table-responsive envelope_name_table">
                                            <table className="table align-middle mb-0 bg-white  shadow-sm">
                                                <thead className="">
                                                <tr>
                                                    <th>Name</th>
                                                    {currentTemplate.tab_id === 1 &&
                                                    <>
                                                        <th>Sharing</th>
                                                        <th>Modified</th>
                                                    </>
                                                    }
                                                    {currentTemplate.tab_id === 2 &&
                                                    <>
                                                        <th>Shared By</th>
                                                        <th>Date Shared</th>
                                                    </>
                                                    }
                                                    {currentTemplate.tab_id === 3 &&
                                                    <>
                                                        <th>Created By</th>
                                                        <th>Modifies</th>
                                                    </>
                                                    }
                                                    <th style={{width: '15%'}}>More Options</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {templateList.map((item, index) =>
                                                    <tr key={index}>
                                                        <td>
                                                            <div
                                                                className={`template_envelope_name ${parseInt(item.entity_type) === 2 ? `open_icon` : ``}`}>
                                                                {item.entity_type === 1 ?
                                                                    <span
                                                                        onClick={(e) => onClickFolder(e, item.entity_id)}
                                                                        className="mb-2 cur-pointer">{item.template_name}</span>
                                                                    :
                                                                    <span className="mb-2">{item.template_name}</span>
                                                                }
                                                                <span>
                                                                    {currentTemplate.current_tab}
                                                                    {breadcrumbs.map((breadcrumb, b) =>
                                                                        <React.Fragment key={b}>
                                                                            &nbsp; > &nbsp;
                                                                            {breadcrumb.folder_name}
                                                                        </React.Fragment>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        {currentTemplate.tab_id === 1 && (
                                                            <>
                                                                <td>
                                                                    {item.is_share === 0 ?
                                                                        <span
                                                                            className="bg_light_blue">Not Shared</span>
                                                                        :
                                                                        <span className="bg_light_green">Shared</span>
                                                                    }
                                                                </td>
                                                                <td>{item.updated_at}</td>
                                                            </>
                                                        )}
                                                        {currentTemplate.tab_id === 2 && (
                                                            <>
                                                                <td>{item.sender_name}</td>
                                                                <td>{item.created_at}</td>
                                                            </>
                                                        )}
                                                        {currentTemplate.tab_id === 3 && (
                                                            <>
                                                                <td>&nbsp;</td>
                                                                <td>&nbsp;</td>
                                                            </>
                                                        )}
                                                        <td className="functional_icons">
                                                            {currentTemplate.tab_id === 1 && (
                                                                <div className="dropdown">
                                                                    <span className="functional_icon_ellipsis"
                                                                          id={`dropdownMenuButton-${index}`}
                                                                          data-bs-toggle="dropdown"
                                                                          aria-expanded="false">
                                                                        <i className="fa fa-ellipsis-v"/>
                                                                    </span>
                                                                    <ul className="dropdown-menu"
                                                                        aria-labelledby={`dropdownMenuButton-${index}`}>
                                                                        {item.entity_type === 1 ?
                                                                            <>
                                                                                <li data-bs-toggle="modal"
                                                                                    onClick={(e) => onOpenShareFolder(e, item)}
                                                                                    data-bs-target="#shareFolder">
                                                                                    <span className="dropdown-item">Share Folder</span>
                                                                                </li>
                                                                                <li data-bs-toggle="modal"
                                                                                    onClick={(e) => onOpenMoveFolder(e, item)}
                                                                                    data-bs-target="#moveTemplateFolder">
                                                                                    <span className="dropdown-item">Move Folder</span>
                                                                                </li>
                                                                                <li data-bs-toggle="modal"
                                                                                    onClick={(e) => onOpenEditFolder(e, item)}
                                                                                    data-bs-target="#editTemplateFolder">
                                                                                    <span className="dropdown-item">Rename Folder</span>
                                                                                </li>
                                                                                <li data-bs-toggle="modal"
                                                                                    onClick={(e) => onOpenDeleteFolder(e, item)}
                                                                                    data-bs-target="#deleteTemplateFolder">
                                                                                    <span className="dropdown-item">Delete Folder</span>
                                                                                </li>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <li onClick={(e) => onEditTemplate(e, item)}>
                                                                                    <span className="dropdown-item">Edit Template</span>
                                                                                </li>
                                                                                <li data-bs-toggle="modal"
                                                                                    onClick={(e) => onCopyTemplate(e, item)}
                                                                                    data-bs-target="#copyTemplateEnvelope">
                                                                                    <span className="dropdown-item">Copy Template</span>
                                                                                </li>
                                                                                <li data-bs-toggle="modal"
                                                                                    onClick={(e) => onOpenShareFolder(e, item)}
                                                                                    data-bs-target="#shareFolder">
                                                                                    <span className="dropdown-item">Share Template</span>
                                                                                </li>
                                                                                <li data-bs-toggle="modal"
                                                                                    onClick={(e) => onOpenMoveTemplate(e, item)}
                                                                                    data-bs-target="#moveTemplate">
                                                                                    <span className="dropdown-item">Move Template</span>
                                                                                </li>
                                                                                <li data-bs-toggle="modal"
                                                                                    onClick={(e) => onOpenRenameTemplate(e, item)}
                                                                                    data-bs-target="#renameTemplate">
                                                                                    <span className="dropdown-item">Rename Template</span>
                                                                                </li>
                                                                                <li data-bs-toggle="modal"
                                                                                    onClick={(e) => onOpenDeleteTemplate(e, item)}
                                                                                    data-bs-target="#deleteEnvelopeTemplate">
                                                                                    <span className="dropdown-item">Delete Template</span>
                                                                                </li>
                                                                            </>
                                                                        }
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            {currentTemplate.tab_id === 2 && (
                                                                <div className="dropdown">
                                                                    <span className="functional_icon_ellipsis"
                                                                          id={`dropdownMenuButton-${index}`}
                                                                          data-bs-toggle="dropdown"
                                                                          aria-expanded="false">
                                                                        <i className="fa fa-ellipsis-v"/>
                                                                    </span>
                                                                    <ul className="dropdown-menu"
                                                                        aria-labelledby={`dropdownMenuButton-${index}`}>
                                                                        {item.entity_type === 1 ?
                                                                            <li data-bs-toggle="modal"
                                                                                onClick={(e) => onOpenRemoveShareFolder(e, item)}
                                                                                data-bs-target="#removeShareFolder">
                                                                                <span className="dropdown-item">Remove from Shared with me</span>
                                                                            </li>
                                                                            :
                                                                            <>
                                                                                <li onClick={(e) => onViewTemplate(e, item)}>
                                                                                    <span className="dropdown-item">View Template</span>
                                                                                </li>
                                                                                <li data-bs-toggle="modal"
                                                                                    onClick={(e) => onCopyTemplate(e, item)}
                                                                                    data-bs-target="#duplicateTemplateModal">
                                                                                    <span className="dropdown-item">Duplicate template</span>
                                                                                </li>
                                                                                <li data-bs-toggle="modal"
                                                                                    onClick={(e) => onOpenRemoveShareFolder(e, item)}
                                                                                    data-bs-target="#removeShareFolder">
                                                                                    <span className="dropdown-item">Remove from Shared with me</span>
                                                                                </li>
                                                                            </>
                                                                        }
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            {currentTemplate.tab_id === 3 && (
                                                                <i className="fa fa-clone me-3 bg_grey text_blue"
                                                                   aria-hidden="true" data-toggle="tooltip"
                                                                   data-placement="right" title=""
                                                                   data-bs-original-title="click Me"/>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <AdminCreateFolder currentTemplate={currentTemplate} isRefresh={isRefresh} setIsRefresh={setIsRefresh}
                               setLoading={setLoading}/>

            <AdminEditFolder isRefresh={isRefresh} setIsRefresh={setIsRefresh} setLoading={setLoading}
                             folderData={folderData} setFolderData={setFolderData}/>

            <AdminDeleteFolder isRefresh={isRefresh} setIsRefresh={setIsRefresh} setLoading={setLoading}
                               folderData={folderData} setFolderData={setFolderData}/>

            <AdminShareFolder shareUserList={shareUserList} setLoading={setLoading} isRefresh={isRefresh}
                              setIsRefresh={setIsRefresh} removeShareData={removeShareData}
                              setRemoveShareData={setRemoveShareData}/>

            <AdminMoveFolder isRefresh={isRefresh} setIsRefresh={setIsRefresh} setLoading={setLoading}
                             folderData={folderData} setFolderData={setFolderData}/>

            <AdminRenameEnvelope isRefresh={isRefresh} setIsRefresh={setIsRefresh} setLoading={setLoading}
                                 folderData={folderData} setFolderData={setFolderData}/>

            <AdminDeleteTemplateEnvelope isRefresh={isRefresh} setIsRefresh={setIsRefresh} setLoading={setLoading}
                                         folderData={folderData} setFolderData={setFolderData}/>

            <AdminMoveEnvelope isRefresh={isRefresh} setIsRefresh={setIsRefresh} setLoading={setLoading}
                               folderData={folderData} setFolderData={setFolderData}/>

            <AdminCopyTemplateEnvelope isRefresh={isRefresh} setIsRefresh={setIsRefresh} setLoading={setLoading}
                                       folderData={folderData} setFolderData={setFolderData}/>

            <AdminDuplicateTemplate setLoading={setLoading} folderData={folderData} setFolderData={setFolderData}/>

            <AdminRemoveShareFolder isRefresh={isRefresh} setIsRefresh={setIsRefresh} setLoading={setLoading}
                                    removeShareData={removeShareData} setRemoveShareData={setRemoveShareData}/>
        </>
    );
}

export default AdminTemplates;