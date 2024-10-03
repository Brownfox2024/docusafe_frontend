import React, {useEffect, useState} from "react";
import {NAME_CONVENTION} from "../../../../configs/AppConfig";
import {updatePreferenceData} from "../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../utils";
import {Lang} from "../../../../lang";

function FileOption(props) {

    const [isSyncAttachments, setIsSyncAttachments] = useState(0);
    const [syncCloud, setSyncCloud] = useState(0);
    const [referenceId, setReferenceId] = useState('');
    const [namingConvention, setNamingConvention] = useState(1);
    const [storageList, setStorageList] = useState([]);

    useEffect(function () {
        setIsSyncAttachments((props?.preferenceData.sync_cloud) ? parseInt(props?.preferenceData.sync_cloud) : 0);
        setSyncCloud((props?.preferenceData.default_cloud_storage) ? parseInt(props?.preferenceData.default_cloud_storage) : 0);
        setReferenceId((props?.preferenceData.default_reference_id) ? props?.preferenceData.default_reference_id : '');
        setNamingConvention((props?.preferenceData.default_naming_convention) ? parseInt(props?.preferenceData.default_naming_convention) : 1);

        setStorageList((props?.cloudStorage) ? props.cloudStorage : []);

    }, [props?.preferenceData, props?.cloudStorage]);

    const handleUpdateMessage = (e) => {
        e.preventDefault();

        props.setLoading(true);

        let updateList = [
            {slug: 'sync_cloud', value: (isSyncAttachments) ? 1 : 0},
            {slug: 'default_cloud_storage', value: syncCloud},
            {slug: 'default_reference_id', value: referenceId},
            {slug: 'default_naming_convention', value: namingConvention}
        ];

        updatePreferenceData({list: updateList})
            .then(response => {
                props.setLoading(false);
                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });

    };

    return (
        <div className="tab-pane  p-4" id="FileOption" role="tabpanel" aria-labelledby="FileOption-tab">
            <div className="table-responsive mb-3">
                <table className="table mb-0 in_progress_table shadow-sm mb-4">
                    <thead className="">
                    <tr className="bg_blue">
                        <th colSpan="2">Detail</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr style={{backgroundColor: '#f4f4f4'}}>
                        <td colSpan="2" className="text-primary font_bold py-3"
                            ref={(el) => el && el.style.setProperty('padding', '10px 25px', "important")}>Cloud Storage
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p className="font_bold mb-2">{Lang.preference_sync_cloud}</p>
                            {Lang.preference_sync_cloud_text}
                        </td>
                        <td style={{width: '14%'}}>
                            <div className="form-check form-switch">
                                <input className="form-check-input" checked={isSyncAttachments}
                                       onChange={(e) => setIsSyncAttachments(e.target.checked)} type="checkbox"
                                       role="switch"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <p className="font_bold mb-2">{Lang.preference_default_storage}</p>
                            {Lang.preference_default_storage_text}
                            <select className="form-select w-100 mt-3" value={syncCloud}
                                    onChange={(e) => setSyncCloud(e.target.value)} style={{maxWidth: '370px'}}>
                                {storageList.map((item, index) =>
                                    <option key={index} value={item.id} disabled={item.is_disabled}>{item.name}</option>
                                )}
                            </select>
                        </td>
                    </tr>
                    <tr style={{backgroundColor: '#f4f4f4'}}>
                        <td colSpan="2" className="text-primary font_bold"
                            ref={(el) => el && el.style.setProperty('padding', '10px 25px', "important")}>Naming
                            Convention
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <p className="font_bold mb-2">Default Reference ID</p>
                            Prepend /append your invite's reference with the document name.
                            <input type="text" className="form-control sw_input_form w-100 mt-3"
                                   value={referenceId} onChange={(e) => setReferenceId(e.target.value)}
                                   style={{maxWidth: '370px'}} id="last_name" placeholder=""/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <p className="font_bold mb-2">Default Naming Convention </p>
                            Please choose a format for your default file naming convention
                            <select className="form-select w-100 mt-3" style={{maxWidth: '700px'}}
                                    value={namingConvention} onChange={(e) => setNamingConvention(e.target.value)}>
                                {NAME_CONVENTION.map((item, index) =>
                                    <option key={index} value={item.id}>{item.value}</option>
                                )}
                            </select>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <button type="button" onClick={handleUpdateMessage}
                                className="btn btn-primary rounded-5">Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FileOption;