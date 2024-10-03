import React, {useEffect, useRef, useState} from "react";
import {manageEnvelopeSetting} from "../../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../../utils";
import {
    DATE_FORMAT_LIST,
    NAME_CONVENTION,
    OVERDUE_REMINDER,
    PASSWORD_LIST,
    SEND_REMINDER
} from "../../../../../configs/AppConfig";
import {Lang} from "../../../../../lang";
import DatePicker from "react-datepicker";
import {default as ReactSelect} from "react-select";
import {components} from "react-select";

function EnvSetting(props) {
    const [envelopeName, setEnvelopeName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [pastDate, setPastDate] = useState(new Date());
    const [nameConvention, setNameConvention] = useState(1);
    const [cloudSync, setCloudSync] = useState([]);
    const [sendReminder, setSendReminder] = useState(0);
    const [overdueReminder, setOverdueReminder] = useState(0);
    const [isPassword, setIsPassword] = useState(0);
    const [password, setPassword] = useState('');
    const [referenceId, setReferenceId] = useState('');

    const dueDateRef = useRef(null);
    const openCloudStorageRef = useRef(null);

    let errorsObj = {
        name: '',
        due_date: '',
        name_convention: '',
        password: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    useEffect(function () {
        setPastDate(Utils.pastDate());

        if (props?.envelopeData) {
            setEnvelopeName((props?.envelopeData.envelope_name) ? props?.envelopeData.envelope_name : '');
            setDueDate((props?.envelopeData.due_date) ? props?.envelopeData.due_date : '');
            setNameConvention((props?.envelopeData.name_convention) ? props?.envelopeData.name_convention : 1);
            setSendReminder((props?.envelopeData.send_reminder) ? props?.envelopeData.send_reminder : 0);
            setOverdueReminder((props?.envelopeData.over_due_reminder) ? props?.envelopeData.over_due_reminder : 0);
            setIsPassword((props?.envelopeData.password) ? 1 : 0);
            setPassword((props?.envelopeData.password) ? props?.envelopeData.password : '');
            setReferenceId((props?.envelopeData.reference_id) ? props?.envelopeData.reference_id : '');

            let csId = (props?.envelopeData.cloud_sync) ? props?.envelopeData.cloud_sync : 0;
            const array = String(csId).split(",").map(Number);

            if (props?.syncStatusList && props?.syncStatusList.length > 0) {
                const csIndex = array.map((value) =>
                    props?.syncStatusList.find(x => parseInt(x.id) === value)
                );
                setCloudSync(csIndex.map((value) => value));
            }
        }
    }, [props]);

    const handleEnvSettingForm = (e) => {
        e.preventDefault();
        let errorObj = {...errorsObj};
        let error = false;

        if (!envelopeName) {
            errorObj.name = 'Please enter name';
            error = true;
        }
        if (!dueDate) {
            errorObj.due_date = 'Please select date';
            error = true;
        }
        if (!nameConvention) {
            errorObj.name_convention = 'Please select option';
            error = true;
        }
        if (parseInt(isPassword) === 1 && !password) {
            errorObj.password = 'Please enter password';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        const cloudOption = (cloudSync.map((i) => i.id).join(','));

        let obj = {
            id: props.envelopeData.id,
            name: envelopeName,
            due_date: dueDate,
            name_convention: nameConvention,
            cloud_sync: cloudOption,
            send_reminder: sendReminder,
            over_due_reminder: overdueReminder,
            reference_id: referenceId
        };

        if (parseInt(isPassword) === 1) {
            obj.password = password;
        } else {
            obj.password = '';
        }

        props.setLoading(true);

        manageEnvelopeSetting(obj)
            .then(response => {
                let envData = {...props.envelopeData};
                envData.envelope_name = envelopeName;
                envData.due_date = dueDate;
                envData.name_convention = nameConvention;
                envData.cloud_sync = cloudOption;
                envData.send_reminder = sendReminder;
                envData.over_due_reminder = overdueReminder;
                envData.password = password;
                envData.reference_id = referenceId;
                props.setEnvelopeData(envData);

                props.setLoading(false);

                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                if (err.response.status === 415) {
                    openCloudStorageRef?.current.click();
                } else {
                    toast.error(Utils.getErrorMessage(err));
                }
            });
    };

    const handlePassword = (e) => {
        setIsPassword(e.target.value);
        setPassword('');
    };

    const showDate = (date) => {
        let dateFormat = '';
        if (date) {
            dateFormat = new Date(date);
        }
        return dateFormat;
    };

    const showDateFormat = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['format'];
        }
        return value;
    };

    const showDatePlaceholder = (id) => {
        let value = '';
        let index = DATE_FORMAT_LIST.findIndex(x => parseInt(x.id) === parseInt(id));
        if (index > -1) {
            value = DATE_FORMAT_LIST[index]['text'];
        }
        return value;
    };

    const cloudeStoragehandleChange = (selectedValues) => {
        if (selectedValues.length > 0) {
            let index = selectedValues.length - 1;
            if (selectedValues[index].id === 0) {
                setCloudSync([{id: 0, value: "Disabled"}]);
            } else {
                let idx = selectedValues.findIndex(x => x.id === 0);
                if (idx > -1) {
                    selectedValues.splice(idx, 1);
                }
                setCloudSync(selectedValues);
            }
        } else {
            setCloudSync([{id: 0, value: "Disabled"}]);
        }

    };

    const customStyles = {
        option: (defaultStyles, state) => ({
            ...defaultStyles,
            color: state.isSelected ? "white" : "#fff",
            backgroundColor: "white",
            height: "40px",
        }),
    };


    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                        style={{marginTop: "-10px"}}
                    />
                    <label style={{marginTop: "3px", marginLeft: 8, position: "absolute"}}>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    return (
        <div className="tab-pane fade p-4 envelope_seting_tab" id="EnvSetting" role="tabpanel"
             aria-labelledby="EnvSetting-tab">
            <h2 className="main_title mb-4">Envelope Settings</h2>
            <div className="mb-4 row align-items-center flexWrap">
                <div className="col-lg-2">
                    <label className="form-label mb-2">Envelope Name:</label>
                </div>
                <div className="col-lg-6 d-flex align-items-center">
                    <input type="text" className="form-control" value={envelopeName}
                           onChange={(e) => setEnvelopeName(e.target.value)} placeholder="Enter envelope name"/>
                    <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                       data-toggle="tooltip" data-placement="right" title={Lang.env_envelope_name}/>
                </div>
                {errors.name &&
                <div className="col-lg-6 offset-lg-2">
                    <div className="text-danger mt-1">{errors.name}</div>
                </div>
                }
            </div>
            <div className="mb-4 row align-items-center flexWrap">
                <div className="col-lg-2">
                    <label className="form-label mb-2">Due Date:</label>
                </div>
                <div className="col-lg-4 d-flex align-items-center position-relative">
                    <DatePicker
                        selected={showDate(dueDate)}
                        dateFormat={showDateFormat(1)}
                        minDate={pastDate} ref={dueDateRef}
                        className="form-control"
                        placeholderText={showDatePlaceholder(1)}
                        onChange={(date) => setDueDate(date)}/>
                    <i className="fa fa-calendar calendar2" onClick={(e) => dueDateRef?.current.setFocus(true)}/>
                    <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                       data-toggle="tooltip" data-placement="right" title={Lang.env_due_date}/>
                </div>
                {errors.due_date &&
                <div className="col-lg-6 offset-lg-2">
                    <div className="text-danger mt-1">{errors.due_date}</div>
                </div>
                }
            </div>
            <div className="mb-4 row align-items-center flexWrap">
                <div className="col-lg-2">
                    <label className="form-label mb-2">Naming Convention:</label>
                </div>
                <div className="col-lg-6 d-flex align-items-center">
                    <select className="form-select" value={nameConvention}
                            onChange={(e) => setNameConvention(e.target.value)} aria-label="Default select example">
                        {NAME_CONVENTION.map((item, index) =>
                            <option key={index} value={item.id}>{item.value}</option>
                        )}
                    </select>
                    <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                       data-toggle="tooltip" data-placement="right" title={Lang.env_naming_convention}/>
                </div>
                {errors.name_convention &&
                <div className="col-lg-6 offset-lg-2">
                    <div className="text-danger mt-1">{errors.name_convention}</div>
                </div>
                }
            </div>
            <div className="mb-4 row align-items-center flexWrap">
                <div className="col-lg-2">
                    <label className="form-label mb-2">Cloud Storage Sync:</label>
                </div>
                <div className="col-lg-6 d-flex align-items-center">
                    <ReactSelect
                        className="w-100"
                        value={cloudSync}
                        isMulti
                        styles={customStyles}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        onChange={cloudeStoragehandleChange}
                        options={props?.syncStatusList}
                        getOptionLabel={options => options['value']}
                        components={{
                            Option
                        }}
                    />
                    <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                       data-toggle="tooltip" data-placement="right" title={Lang.env_cloud_sync}/>
                </div>
            </div>
            <div className="mb-4 row align-items-center flexWrap">
                <div className="col-lg-2">
                    <label className="form-label mb-2">Send Reminder (Email):</label>
                </div>
                <div className="col-lg-6 d-flex align-items-center">
                    <select className="form-select" value={sendReminder}
                            onChange={(e) => setSendReminder(e.target.value)} aria-label="Default select example">
                        {SEND_REMINDER.map((item, index) =>
                            <option key={index} value={item.id}>{item.value}</option>
                        )}
                    </select>
                    <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                       data-toggle="tooltip" data-placement="right" title={Lang.env_send_reminder}/>
                </div>
            </div>
            <div className="mb-4 row align-items-center flexWrap">
                <div className="col-lg-2">
                    <label className="form-label mb-2">Overdue Reminder (Email):</label>
                </div>
                <div className="col-lg-6 d-flex align-items-center">
                    <select className="form-select" value={overdueReminder}
                            onChange={(e) => setOverdueReminder(e.target.value)}
                            aria-label="Default select example">
                        {OVERDUE_REMINDER.map((item, index) =>
                            <option key={index} value={item.id}>{item.value}</option>
                        )}
                    </select>
                    <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                       data-toggle="tooltip" data-placement="right" title={Lang.env_overdue_reminder}/>
                </div>
            </div>
            <div className="mb-4 row align-items-center flexWrap d-none">
                <div className="col-lg-2">
                    <label className="form-label mb-2">Password Protected: </label>
                </div>
                <div className="col-lg-6 d-flex align-items-center">
                    <select className="form-select" value={isPassword}
                            onChange={handlePassword} aria-label="Default select example">
                        {PASSWORD_LIST.map((item, index) =>
                            <option key={index} value={item.id}>{item.value}</option>
                        )}
                    </select>
                    <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                       data-toggle="tooltip" data-placement="right" title={Lang.env_password}/>
                </div>
            </div>

            {isPassword > 0 &&
            <div className="mb-4 row align-items-center flexWrap">
                <div className="col-lg-2">
                    <label className="form-label mb-2">&nbsp;</label>
                </div>
                <div className="col-lg-6 d-flex align-items-center">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                           className="form-control" placeholder="Enter password"/>
                    <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                       data-toggle="tooltip" data-placement="right" title={Lang.env_password}/>
                </div>
                {errors.password &&
                <div className="col-lg-6 offset-lg-2">
                    <div className="text-danger mt-1">{errors.password}</div>
                </div>
                }
            </div>
            }

            <div className="mb-4 row align-items-center flexWrap">
                <div className="col-lg-2">
                    <label className="form-label mb-2">Reference ID:</label>
                </div>
                <div className="col-lg-6 d-flex align-items-center">
                    <input type="text" value={referenceId} onChange={(e) => setReferenceId(e.target.value)}
                           className="form-control"/>
                    <i className="fa fa-question-circle ms-2 fontSize" aria-hidden="true"
                       data-toggle="tooltip" data-placement="right" title={Lang.env_reference}/>
                </div>
            </div>
            <div className="mb-4 row align-items-center flexWrap">
                <div className="col-lg-2"/>
                <div className="col-lg-6 d-flex align-items-center">
                    <button type="button" onClick={handleEnvSettingForm} className="btn btn-primary">Save Settings
                    </button>
                </div>
            </div>

            <span data-bs-toggle="modal" data-bs-target="#openCloudStorage" ref={openCloudStorageRef}/>
            <div className="modal fade" id="openCloudStorage" tabIndex={-1}
                 aria-labelledby="openCloudStorageLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <p className="py-2">Now, cloud storage not connected. Please connect the cloud storage.</p>
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EnvSetting;