import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {getTemplateList, templateUseForEnvelope} from "../../services/Templates";
import {toast} from "react-toastify";
import Utils from "../../utils";
import {getTemplateDocumentData} from "../../services/CommonService";

function UseTemplate(props) {
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
    const [useTemplateId, setUseTemplateId] = useState(0);
    const [selectedTemplateList, setSelectedTemplateList] = useState([]);

    const navigate = useNavigate();

    let currentTemplateObj = {
        tab_id: 1,
        current_tab: "My Templates",
        current_folder: 0,
        is_refresh: false
    };
    const [currentTemplate, setCurrentTemplate] = useState(currentTemplateObj);

    const clsUseTemplateRef = useRef(null);

    useEffect(function () {
        if (props.isUseTemplate) {
            setLoading(true);
            let obj = {
                template: currentTemplate.tab_id,
                folder_id: currentTemplate.current_folder
            };
            getTemplateList(obj)
                .then(response => {
                    // setUseTemplateId(0);
                    //Need to already selected templates
                    if(selectedTemplateList.length > 0){
                        for (let i = 0; i < response.data.data.length; i++) {
                            if(response.data.data[i].entity_type === 2){
                                let templateEntityId = response.data.data[i].entity_id;
                                let templateAlreadySelected = selectedTemplateList.findIndex(item => item.id === templateEntityId);
                                if(templateAlreadySelected !== -1){
                                    response.data.data[i]['active'] = true;
                                    response.data.data[i]['is_checked'] = true;
                                }else{
                                    response.data.data[i]['active'] = false;
                                    response.data.data[i]['is_checked'] = false;
                                }
                            }
                        }
                    }
                    setTemplateList(response.data.data);
                    
                    setBreadcrumbs(response.data.breadcrumbs);
                    setIsBack(response.data.back_id);
                    setLoading(false);
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                });
        }
    }, [props, currentTemplate, selectedTemplateList]);

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

    const onClickFolder = (e, id) => {
        let currentTem = {...currentTemplate};
        currentTem.current_folder = parseInt(id);
        setCurrentTemplate(currentTem);
    };

    const handleBack = (e) => {
        e.preventDefault();
        let template = {...currentTemplate};
        template.current_folder = isBack;
        setCurrentTemplate(template);
    };

    const handleCloseUseTemplate = (e) => {
        e.preventDefault();
        props.setIsUseTemplate(false);
        setIsBack(-1);
        setTemplateList([]);
        setBreadcrumbs([]);
        setButtons(buttonList);
        setCurrentTemplate(currentTemplateObj);
        setSelectedTemplateList([]);
    };

    const onSelectTemplate = (e, data, index) => {
        e.preventDefault();

        let templateEntityId = data.entity_id;
        let templateAlreadySelected = selectedTemplateList.findIndex(item => item.id === templateEntityId);
        if(templateAlreadySelected !== -1){
            toast.error("Template has been already selected.");
            return false;
        }

        setLoading(true);
        let tempList = [...selectedTemplateList];
        let obj = {
            template_id: data.entity_id
        };
        getTemplateDocumentData(obj)
            .then(response => {
                let idx = tempList.findIndex((x) => parseInt(x.id) === parseInt(data.entity_id));
                let newList = [];
                for (let i = 0; i < response.data.data.length; i++) {
                    response.data.data[i].active = true;
                    newList.push(response.data.data[i]);
                }
                if (idx > -1) {
                    tempList[idx]['list'] = newList;
                } else {
                    tempList.push({
                        id: data.entity_id,
                        name: data.template_name,
                        is_checked: true,
                        list: newList
                    })
                }
                setSelectedTemplateList(tempList);

                let list = [...templateList];
                list[index]['active'] = true;
                list[index]['is_checked'] = true;
                
                setTemplateList(list);
                setUseTemplateId(parseInt(templateEntityId));
                setLoading(false);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(false);
            });
    };

    const handleCreateEnvelope = (e) => {
        e.preventDefault();
        if (useTemplateId > 0) {
            if (selectedTemplateList.length > 0) {
                setLoading(true);

                let docIds = [];
                let dataIds = [];
                for (let i = 0; i < selectedTemplateList.length; i++) {
                    for (let j = 0; j < selectedTemplateList[i]['list'].length; j++) {
                        if (selectedTemplateList[i]['list'][j]['active']) {
                            if (parseInt(selectedTemplateList[i]['list'][j]['entity_type']) === 1) {
                                docIds.push(parseInt(selectedTemplateList[i]['list'][j]['id']));
                            } else if (parseInt(selectedTemplateList[i]['list'][j]['entity_type']) === 2) {
                                dataIds.push(parseInt(selectedTemplateList[i]['list'][j]['id']));
                            }
                        }
                    }
                }
                if (docIds.length > 0 || dataIds.length > 0) {
                    let obj = {
                        id: useTemplateId,
                        doc_ids: docIds,
                        data_ids: dataIds
                    };
                    templateUseForEnvelope(obj)
                        .then(response => {
                            clsUseTemplateRef?.current.click();
                            setLoading(false);
                            navigate("/client-portal/envelope/edit/" + response.data.uuid + "/4/direct");
                        })
                        .catch(err => {
                            setLoading(false);
                            toast.error(Utils.getErrorMessage(err));
                        });
                } else {
                    setLoading(false);
                    toast.error('Oops...something went wrong.');
                }
            } else {
                toast.error('Please select template');
            }
        } else {
            toast.error('Please select any template');
        }
    };

    const handleSelectTemplate = (e, index, idx) => {
        let tempList = [...selectedTemplateList];
        if (tempList[index]['list'][idx].active) {
            tempList[index]['list'][idx].active = false;
        } else {
            tempList[index]['list'][idx].active = true;
        }
        setSelectedTemplateList(tempList);
    };

    const handleChooseTemplate = (e, index) => {
        let tempList = [...selectedTemplateList];
        for (let i = 0; i < tempList.length; i++) {
            tempList[i]['is_checked'] = false;
            if (i === index) {
                setUseTemplateId(parseInt(tempList[i]['id']));
                tempList[i]['is_checked'] = true;
            }
        }
        setSelectedTemplateList(tempList);
    };

    const removeTemplate = (item, index) => {
        setSelectedTemplateList((prevList) =>
            prevList.filter((_, i) => i !== index)
        );
        
        let tempList = [...selectedTemplateList];
        tempList.splice(index, 1); // Remove the item at the given index
        if(tempList.length > 0){
            setUseTemplateId(parseInt(tempList[tempList.length - 1]['id']));
        }else{
            setUseTemplateId(0);
        }
    }

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}

            <div className="offcanvas offcanvas-end AddDocument AddTemplate templates_page" id="useTemplate"
                 data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="MakeFormLabel">Add From Templates</h5>
                    <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                            ref={clsUseTemplateRef} onClick={handleCloseUseTemplate} aria-label="Close">
                        <i className="fa fa-times-circle" aria-hidden="true"/>
                    </button>
                </div>
                <div className="offcanvas-body p-0 " style={{overflowX: 'hidden'}}>
                    <div className="row shadow-lg border_radius mx-0">
                        <div className="col-lg-2  border_right pt-3 background_grey_400 ">
                            <div className="nav nav-tabs flex-column" id="nav-tab" role="tablist">
                                {buttons.map((item, index) =>
                                    <button key={index} onClick={(e) => handleTemplateButton(e, item)}
                                            className={`nav-link ${item.active ? `active` : ``}`}>
                                        <i className="fa fa-folder" aria-hidden={item.active}/> {item.name}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className={`${selectedTemplateList.length > 0 ? `col-lg-7` : `col-lg-10`} px-0`}>
                            <div className="tab-content" id="nav-tabContent" style={{minHeight: 'calc(100vh - 397px)'}}>
                                <div className="tab-pane fade active show" id="MyTemplates-detail" role="tabpanel"
                                     aria-labelledby="MyTemplatesDetails">
                                    <h2 className="main_title mb-3 d-flex align-items-center justify-content-between bread_crumb flexWrap px-3 background_grey_400 p-3">
                                   <span>
                                       {breadcrumbs.length > 0 ?
                                           <>
                                               <span className="text_blue cur-pointer"
                                                     onClick={(e) => onClickFolder(e, 0)}><i className="fa fa-folder"
                                                                                             aria-hidden="true"/> {currentTemplate.current_tab}</span>
                                               {breadcrumbs.map((breadcrumb, b) =>
                                                   <React.Fragment key={b}>
                                                       <i className="fa fa-angle-double-right mx-3"/>
                                                       {breadcrumb.is_last === true ?
                                                           <span><i className="fa fa-folder"
                                                                    aria-hidden="true"/> {breadcrumb.folder_name}</span>
                                                           :
                                                           <span className="text_blue cur-pointer"
                                                                 onClick={(e) => onClickFolder(e, breadcrumb.id)}><i
                                                               className="fa fa-folder"
                                                               aria-hidden="true"/> {breadcrumb.folder_name}</span>
                                                       }
                                                   </React.Fragment>
                                               )}
                                           </>
                                           :
                                           <span><i className="fa fa-folder me-1"
                                                    aria-hidden="true"/>{currentTemplate.current_tab}</span>
                                       }
                                   </span>
                                        <div className="d-flex">
                                            {isBack > -1 &&
                                            <button type="button" onClick={handleBack}
                                                    className="btn load_template_btn me-3 back_btn">
                                                <i className="fa fa-arrow-left me-2" aria-hidden="true"/>Back
                                            </button>
                                            }
                                        </div>
                                    </h2>
                                    <div className="table-responsive ">
                                        <table className="table align-middle mb-0 bg-white  shadow-sm ">
                                            <thead>
                                            {templateList && templateList.map((item, index) =>
                                                <tr key={index}>
                                                    {item.entity_type === 1
                                                        ?
                                                        <th className="cur-pointer"
                                                            onClick={(e) => onClickFolder(e, item.entity_id)}>
                                                            <div className="template_envelope_name">
                                                                {item.template_name}
                                                            </div>
                                                        </th>
                                                        :
                                                        <td className="w-100 cur-pointer"
                                                            onClick={(e) => onSelectTemplate(e, item, index)}>
                                                            <div
                                                                className="d-flex align-items-center justify-content-between">
                                                                <div className="template_envelope_name open_icon">
                                                                    <span
                                                                        className="font_bold ">{item.template_name}</span>
                                                                    <div className="d-flex messages_timing">
                                                                        <span className="me-3">
                                                                            <i className="fa fa-user-circle-o"/> {item.sender_name}
                                                                        </span>
                                                                        <div>
                                                                            <i className="fa fa-calendar"
                                                                               aria-hidden="true"/> {item.created_at}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="plus_btn">
                                                                    <span
                                                                        className={`me-3 ${item.active ? `bg-success` : ``}`}>
                                                                        <i className={`fa ${item.active ? `fa-check` : `fa-plus`}`}
                                                                           aria-hidden="true"/>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    }
                                                </tr>
                                            )}
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedTemplateList.length > 0 &&
                        <div className="col-lg-3 px-0">
                            <h2 className="main_title d-flex align-items-center justify-content-center bread_crumb flexWrap p-3 bg_blue text_blue border-bottom">Selected
                                Templates</h2>
                            <div className="bg-blue p-3" style={{minHeight: 'calc(100% - 100px)'}}>
                                {selectedTemplateList.map((item, index) =>
                                    <div key={index} className="accordion cu-position-relative mb-4" id={`accordion_${index}`}>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id={`heading_${index}`}>
                                                <button className="accordion-button rubik-semi-bold" type="button"
                                                        data-bs-toggle="collapse" data-bs-target={`#collapse_${index}`}
                                                        aria-expanded="true" aria-controls={`collapse_${index}`}>
                                                    <input type="radio" className="me-2 d-none" data-bs-toggle="collapse"
                                                           checked={item.is_checked}
                                                           onChange={(e) => handleChooseTemplate(e, index)}/>
                                                    {item.name}
                                                </button>
                                            </h2>
                                            <div id={`collapse_${index}`} className="accordion-collapse collapse show"
                                                 aria-labelledby={`heading_${index}`}
                                                 data-bs-parent={`#accordion_${index}`}>
                                                <div className="accordion-body px-0">
                                                    {item.list.map((data, idx) =>
                                                        <h2 key={idx}
                                                            className="request_document_tab cur-pointer mb-3 bg_white position-relative"
                                                            onClick={(e) => handleSelectTemplate(e, index, idx)}>
                                                            <div
                                                                className="d-flex justify-content-between flex_wrap align-items-center">
                                                                <div className="accordion_text">
                                                                    <i className={`fa ${data.active ? `fa-check-square` : `fa-square`} me-2`}
                                                                       aria-hidden="true"/>
                                                                    {data.name}
                                                                </div>
                                                            </div>
                                                        </h2>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="remove-template" onClick={() => removeTemplate(item, index)}>
                                            <img style={{ width:"30px", height: "30px" }} src="data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E" alt="delete" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        }
                    </div>
                    <div className="modal-footer  mb-0 ">
                        <button type="button" onClick={handleCloseUseTemplate} className="btn grey_btn_outline"
                                data-bs-dismiss="offcanvas">Cancel
                        </button>
                        <button type="button" onClick={handleCreateEnvelope} className="btn modal_btn">Create Envelope
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UseTemplate;