import React, {useEffect, useState} from "react";
import {updatePreferenceData} from "../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../utils";

function EnvelopeProtected(props) {

    const [isProtected, setIsProtected] = useState(1);

    useEffect(function () {

        setIsProtected((props?.preferenceData.envelope_protected) ? parseInt(props?.preferenceData.envelope_protected) : 1);

    }, [props?.preferenceData]);

    const handleUpdateProtected = (e) => {
        setIsProtected(e.target.checked);

        props.setLoading(true);

        let updateList = [
            {slug: 'envelope_protected', value: (e.target.checked) ? 1 : 0}
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
        <div className="tab-pane p-4" id="EnvelopeProtection" role="tabpanel" aria-labelledby="EnvelopeProtection-tab">
            <div className="table-responsive mb-3">
                <table className="table mb-0 in_progress_table shadow-sm mb-4">
                    <thead className="">
                    <tr className="bg_blue">
                        <th colSpan="2">Detail</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <p className="font_bold mb-2">Envelope Password Protected</p>
                            Protect Envelope with password, Recipient will create a password.

                        </td>
                        <td style={{width: '14%'}}>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" checked={isProtected}
                                       onChange={(e) => handleUpdateProtected(e)} role="switch"/>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EnvelopeProtected;