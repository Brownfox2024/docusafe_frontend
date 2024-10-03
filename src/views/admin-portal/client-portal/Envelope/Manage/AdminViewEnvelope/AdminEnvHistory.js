import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Utils from "../../../../../../utils";
import Pagination from "react-js-pagination";
import {adminEnvelopeHistory} from "../../../../../../services/AdminService";

const lengths = Utils.tableShowLengths();

function AdminEnvHistory(props) {
    const {client} = useParams();
    const [historyList, setHistoryList] = useState([]);
    const [totalHistory, setTotalHistory] = useState(0);
    const [dataParams, setDataParams] = useState({
        limit: lengths[0],
        page: 1,
    });

    useEffect(function () {
        if (props.envelopeData.id) {
            let obj = {
                client_id: client,
                id: props.envelopeData.id,
                timezone: props.envelopeData.time_zone,
                limit: dataParams.limit,
                page: dataParams.page
            };
            setHistoryList([]);
            setTotalHistory(0);

            adminEnvelopeHistory(obj)
                .then(response => {
                    setHistoryList(response.data.data);
                    setTotalHistory(parseInt(response.data.totalRecord));
                })
                .catch(err => {

                });
        }
    }, [props.envelopeData, dataParams, client]);

    const handleData = (e, type) => {
        let params = {...dataParams};
        if (type === 'pagination') {
            params.page = e;
        } else if (type === 'limit') {
            params.limit = parseInt(e.target.value);
        }
        setDataParams(params);
    };

    return (
        <div className="tab-pane fade p-4" id="History" role="tabpanel" aria-labelledby="History-tab">
            <div className="row mb-3">
                <div className="col-lg-6">
                    <div className="my-2 d-flex align-items-center flexWrap">
                        <div className="font_bold"> Envelope Name :</div>
                        <div className="font-light ms-1">{props.envelopeData.envelope_name}</div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="my-2 d-flex align-items-center flexWrap">
                        <div className="font_bold"> Time Zone :</div>
                        <div className="font-light ms-1">{props.envelopeData.time_zone}</div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="my-2 d-flex align-items-center flexWrap">
                        <div className="font_bold"> Envelope ID :</div>
                        <div className="font-light ms-1">{props.envelopeData.envelope_id}</div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="my-2 d-flex align-items-center flexWrap">
                        <div className="font_bold"> Envelope Recipient :</div>
                        <div className="font-light ms-1">{props.envelopeData.recipient_names}</div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="my-2 d-flex align-items-center flexWrap">
                        <div className="font_bold"> Date Send :</div>
                        <div className="font-light ms-1">{props.envelopeData.send_date}</div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="my-2 d-flex align-items-center flexWrap">
                        <div className="font_bold"> User :</div>
                        <div className="font-light ms-1">{props.envelopeData.sender_name}</div>
                    </div>
                </div>
            </div>
            <div className="table-responsive mb-3">
                <table className="table mb-0 in_progress_table shadow-sm mb-4">
                    <thead className="">
                    <tr className="bg_blue">
                        <th>Time</th>
                        <th>User/IP</th>
                        <th>Action</th>
                        <th>Activity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {historyList.length > 0 && historyList.map((item, index) =>
                        <tr key={index}>
                            <td>{item.created_at}</td>
                            <td>
                                <div className="Recipients_name">
                                    <span className="mb-1">{item.sender_name}</span>
                                    <span>IP: {item.ip_address}</span>
                                </div>
                            </td>
                            <td>{item.action}</td>
                            <td>{item.detail}</td>
                        </tr>
                    )}
                    {historyList.length === 0 && <tr>
                        <td className="text-center" colSpan={4}>loading...</td>
                    </tr>}
                    </tbody>
                </table>
            </div>
            <div className="table_footer_wrap">
                <div className="d-flex align-items-center mb-4">
                    <span className="me-2">Show</span>
                    <select className="form-select" value={dataParams.limit} onChange={(e) => handleData(e, 'limit')}
                            aria-label="Default select example">
                        {lengths && lengths.map((item, i) => <option value={item} key={i}>{item}</option>)}
                    </select>
                </div>
                <div className="pagination mb-4">
                    <Pagination
                        activePage={dataParams.page}
                        itemsCountPerPage={dataParams.limit}
                        totalItemsCount={totalHistory}
                        pageRangeDisplayed={5}
                        onChange={(e) => handleData(e, 'pagination')}
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminEnvHistory;