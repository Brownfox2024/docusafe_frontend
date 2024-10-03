import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import {adminUpdatePreferenceData} from "../../../../../services/AdminService";

function AdminClientTheme(props) {
    let {client} = useParams();
    const [themeColor, setThemeColor] = useState('');

    useEffect(function () {
        if (props.themeList) {
            let index = props.themeList.findIndex(x => x.selected === true);
            if (index > -1) {
                setThemeColor(props.themeList[index]['class']);
            }
        }
    }, [props?.themeList]);

    const handleClick = (e) => {
        e.preventDefault();

        props.setLoading(true);

        let updateList = [
            {slug: 'default_color', value: themeColor},
        ];

        adminUpdatePreferenceData({client_id: client, list: updateList})
            .then(response => {
                props.setLoading(false);

                let list = [...props.themeList];
                for (let i = 0; i < list.length; i++) {
                    let selected = false;
                    if (list[i]['class'] === themeColor) {
                        selected = true;
                    }
                    list[i]['selected'] = selected;
                }
                props.setThemeList(list);

                Utils.clientUpdateTheme(client, themeColor);

                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <div className="tab-pane  p-4" id="nav-theme" role="tabpanel" aria-labelledby="nav-theme-tab">
            <h2 className="main_title mb-4">Change Client Portal Theme.</h2>
            <div className="row ">
                <div className="col-lg-12">
                    <label className="mb-2">Choose colour / Enter colour code</label>
                </div>
                <div className="col-lg-2">
                    <select className="form-select" value={themeColor}
                            onChange={(e) => setThemeColor(e.target.value)}>
                        {props?.themeList && props.themeList.map((item, index) =>
                            <option key={index} value={item.class}>{item.name}</option>
                        )}
                    </select>
                </div>
                <div className="tab_footer_button">
                    <button type="submit" onClick={handleClick} className="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    );
}

export default AdminClientTheme;