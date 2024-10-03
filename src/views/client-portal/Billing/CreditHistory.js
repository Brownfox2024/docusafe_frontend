import React, {useEffect, useState} from "react";
import Utils from "../../../utils";
import {toast} from "react-toastify";
import {postCreditHistory} from "../../../services/BilingService";
import Pagination from "react-js-pagination";

const lengths = Utils.tableShowLengths();

function CreditHistory() {

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [list, setList] = useState([]);
    const [totalHistory, setTotalHistory] = useState(0);
    const [listProcess, setListProcess] = useState('loading...');

    const handleTableLength = (e) => {
        setPage(1);
        setLimit(parseInt(e.target.value));
    };

    useEffect(function () {

        setListProcess('loading...');
        postCreditHistory({limit: limit, page: page})
            .then(response => {
                setList(response.data.list);

                if (response.data.list.length === 0) {
                    setListProcess('No data available.');
                }

                setTotalHistory(parseInt(response.data.count));
            })
            .catch(err => {
                setListProcess('No data available.');
                toast.error(Utils.getErrorMessage(err));
            });

    }, [limit, page]);

    return (
        <div className="tab-pane  bg_transparent active show" id="preferences" role="tabpanel"
             aria-labelledby="preferences-tab" style={{minHeight: 'calc(100vh - 149px)'}}>
            <h2 className="main_title ps-0 py-4">Credit History</h2>
            <div className="table-responsive mb-3">
                <table
                    className="table mb-0 in_progress_table shadow-sm mb-4 credit-history-table">
                    <thead>
                    <tr className="bg_blue">
                        <th className="p-3">Envelope Name</th>
                        <th style={{width: '16.70%'}}>Created By</th>
                        <th style={{width: '16.70%'}}>Plan Name</th>
                        <th style={{width: '13.22%'}}>Date</th>
                        <th style={{width: '12.5%', textAlign: 'center'}}>Envelope Credits Left</th>
                        <th style={{width: '12.5%', textAlign: 'center'}}>Envelope Credits Used</th>
                        <th style={{width: '12.5%', textAlign: 'center'}}>SMS <br/> Credits Left (Plan)</th>
                        <th style={{width: '12.5%', textAlign: 'center'}}>SMS <br/> Credits Left (Add-ons)</th>
                        <th style={{width: '12.5%', textAlign: 'center'}}>SMS <br/>Credits Used</th>
                    </tr>
                    </thead>
                    <tbody>
                    {list && list.map((item, index) =>
                        <tr key={index}>
                            <td>{item.envelope_name}</td>
                            <td>{item.sender_name}</td>
                            <td>{item.plan_name}</td>
                            <td>{item.created_at}</td>
                            <td className="text-center">
                                <span className="Credits-Left">{item.envelope_left}</span>
                            </td>
                            <td className="text-center">
                                <span className="Credits-Used">{item.envelope_used}</span>
                            </td>
                            <td className="text-center">
                                <span className="Credits-Left">{item.sms_left}</span>
                            </td>
                            <td className="text-center">
                                <span className="Credits-Left">{item.sms_add_on_left}</span>
                            </td>
                            <td className="text-center">
                                <span className="Credits-Used">{item.sms_used}</span>
                            </td>
                        </tr>
                    )}

                    {list.length === 0 &&
                    <tr>
                        <td className="text-center" colSpan={9}>{listProcess}</td>
                    </tr>
                    }
                    </tbody>
                </table>
            </div>
            <div className="table_footer_wrap">
                <div className="d-flex align-items-center">
                    <span className="me-2">Show</span>
                    <select className="form-select" aria-label="Default select example" value={limit}
                            onChange={handleTableLength}>
                        {lengths && lengths.map((item, i) => <option value={item} key={i}>{item}</option>)}
                    </select>
                </div>
                <div className="pagination">
                    <Pagination
                        activePage={page}
                        itemsCountPerPage={limit}
                        totalItemsCount={totalHistory}
                        pageRangeDisplayed={5}
                        onChange={(e) => setPage(e)}
                    />
                </div>
            </div>
        </div>
    );
}

export default CreditHistory;