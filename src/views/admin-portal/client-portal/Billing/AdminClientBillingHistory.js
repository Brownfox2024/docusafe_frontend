import React, {useEffect, useState, useCallback, useRef} from "react";
import {useParams} from "react-router-dom";
import Utils from "../../../../utils";
import Pagination from "react-js-pagination";
import {postBillingInvoiceDownload} from "../../../../services/BilingService";
import {toast} from "react-toastify";
import Axios from "axios";
import FileDownload from "js-file-download";
import ReactToPrint from "react-to-print";
import {adminPostBillingHistory, adminPostBillingInvoice} from "../../../../services/AdminService";

const lengths = Utils.tableShowLengths();

function AdminClientBillingHistory() {
    let {client} = useParams();
    const [loading, setLoading] = useState(false);

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [list, setList] = useState([]);
    const [totalHistory, setTotalHistory] = useState(0);
    const [listProcess, setListProcess] = useState('loading...');

    const [invoiceData, setInvoiceData] = useState({});
    const [invoiceId, setInvoiceId] = useState(0);

    const [isHistory, setIsHistory] = useState(1);

    const [isPrint, setIsPrint] = useState(false);
    const componentRef = useRef(null);
    const onBeforeGetContentResolve = useRef(null);

    const handleTableLength = (e) => {
        setPage(1);
        setLimit(parseInt(e.target.value));
    };

    useEffect(function () {

        setListProcess('loading...');
        adminPostBillingHistory({client_id: client, limit: limit, page: page})
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

    }, [client, limit, page]);

    const handleInvoice = (e, data) => {
        e.preventDefault();

        setLoading(true);

        adminPostBillingInvoice({client_id: client, id: data.id})
            .then(response => {
                setIsHistory(0);
                setLoading(false);
                setInvoiceId(data.id);
                setInvoiceData(response.data.data);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    const handleBack = (e) => {
        e.preventDefault();

        setInvoiceId(0);
        setIsHistory(1);
    };

    const handleDownload = (e) => {
        e.preventDefault();

        setLoading(true);

        postBillingInvoiceDownload(invoiceId)
            .then(response => {
                Axios.get(response.data.fileUrl, {
                    responseType: 'blob',
                }).then((res) => {
                    setLoading(false);
                    FileDownload(res.data, response.data.fileName);
                }).catch(err => {
                    toast.error('Oops...something went wrong. File not found.');
                    setLoading(false);
                });
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    useEffect(() => {
        if (isPrint === false && typeof onBeforeGetContentResolve.current === "function") {
            onBeforeGetContentResolve.current();
        }
    }, [isPrint]);

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, []);

    const handleAfterPrint = useCallback(() => {

    }, []);

    const handleOnBeforeGetContent = React.useCallback(() => {
        setLoading(true);
        setIsPrint(true);

        return new Promise((resolve) => {
            onBeforeGetContentResolve.current = resolve;

            setTimeout(() => {
                setLoading(false);
                setIsPrint(false);
                resolve();
            }, 1000);
        });
    }, []);

    const handleBeforePrint = React.useCallback(() => {

    }, []);

    const reactToPrintTrigger = useCallback(() => {
        return (
            <button type="button" className="btn rounded-pill me-2"
                    style={{backgroundColor: '#ecebeb'}}>
                <img src="/images/bill_print.png" alt="..."/>
            </button>
        );
    }, []);

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}

            {isHistory === 1 && (
                <div className="tab-pane bg_transparent active show" id="user" role="tabpanel"
                     aria-labelledby="user-tab" style={{minHeight: 'calc(100vh - 149px)'}}>
                    <h2 className="main_title ps-0 py-4">Billing History</h2>
                    <div className="table-responsive mb-3">
                        <table className="table mb-0 in_progress_table shadow-sm mb-4 billing-table">
                            <thead>
                            <tr className="bg_blue">
                                <th style={{width: '12%'}}>Invoice</th>
                                <th style={{width: '15%'}}>Billing Date</th>
                                <th>Plan description</th>
                                <th style={{width: '12%', textAlign: 'center'}}>Amount</th>
                                <th style={{width: '14%', textAlign: 'center'}}>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {list && list.map((item, index) =>
                                <tr key={index}>
                                    <td className="invoice-number">
                                <span className="cur-pointer"
                                      onClick={(e) => handleInvoice(e, item)}>{item.invoice_no}</span>
                                    </td>
                                    <td className="invoice-date">{item.created_at}</td>
                                    <td className="plan-description">
                                        <p>{item.plan}</p>
                                        {item.total_envelope > 0 && (
                                            <p>
                                                <i className="fa fa-check-circle me-2" aria-hidden="true"/>
                                                Envelope {item.total_envelope}/{item.plan_type}
                                            </p>
                                        )}
                                        {item.total_sms > 0 && (
                                            <p>
                                                <i className="fa fa-check-circle me-2" aria-hidden="true"/>
                                                SMS {item.total_sms} {item.plan_type ? `/` + item.plan_type : ``}
                                            </p>
                                        )}
                                        {item.total_user > 0 && (
                                            <p>
                                                <i className="fa fa-check-circle me-2" aria-hidden="true"/>
                                                {item.total_user} Users
                                            </p>
                                        )}
                                    </td>
                                    <td className="invoice-amount">{item.paid_amount}</td>
                                    <td className="invoice-Status">{item.status}</td>
                                </tr>
                            )}

                            {list.length === 0 &&
                            <tr>
                                <td className="text-center" colSpan={5}>{listProcess}</td>
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
            )}


            {isHistory === 0 && (
                <div className="tab-pane bg_transparent active show" id="user" role="tabpanel"
                     aria-labelledby="user-tab"
                     style={{minHeight: 'calc(100vh - 149px)'}}>
                    <h2 className="main_title ps-0 py-4">Tax Invoice</h2>
                    {isPrint === false && (
                        <div className="overview_Card card mb-40px">
                            <div className="card-title border-bottom p-3 bill-section-heading ">
                                <div className="row">
                                    <div className="col-sm-4 py-2 py-sm-0">
                                        <img src="/images/logo.png" style={{width: '100%', maxWidth: '102px'}}
                                             alt="..."/>
                                    </div>
                                    <div
                                        className="col-sm-4 py-2 py-sm-0 d-flex align-items-center justify-content-sm-center text-black">
                                        <div style={{fontSize: '18px'}}>TAX INVOICE</div>
                                    </div>
                                    <div
                                        className="col-sm-4 py-2 py-sm-0 d-flex align-items-center justify-content-sm-end text-black">
                                        <div style={{fontSize: '18px'}}>invoice No # {invoiceData.invoice_no}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body py-0">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="py-3">
                                            <p className="text-black"><b>Billed To:</b></p>
                                            <p style={{maxWidth: '160px', width: '100%'}}>
                                                {invoiceData.first_name + ` ` + invoiceData.last_name + ` `}
                                                {invoiceData.address}</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="py-3">
                                            <p className="text-black"><b>Payment Method</b></p>
                                            <p style={{maxWidth: '200px', width: '100%'}}>
                                                {invoiceData.brand} ending ****{invoiceData.last4 + ` `}
                                                {invoiceData.email}</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="py-3">
                                            <p className="text-black text-sm-end"><b>Order Date</b></p>
                                            <p className="text-sm-end">{invoiceData.created_at}</p>
                                        </div>
                                    </div>
                                    <div className="col-12 py-3">
                                        <p className="text-black"><b>Order Summary</b></p>
                                    </div>
                                    <div className="col-12 px-0">
                                        <div className="pt-3">
                                            <div className="table-responsive ">
                                                <table
                                                    className="table mb-0 in_progress_table mb-2 billing-table rounded-0">
                                                    <thead className="">
                                                    <tr className="bg-transparent">
                                                        <th style={{width: '12%'}}>No.</th>
                                                        <th>Item</th>
                                                        <th style={{width: '14%', textAlign: 'right'}}>Price</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="border-0">
                                                    <tr>
                                                        <td>{invoiceData.invoice_no}</td>
                                                        <td className="plan-description">
                                                            <p>{invoiceData.plan}</p>
                                                            {invoiceData.total_envelope > 0 && (
                                                                <p><i className="fa fa-check-circle me-2"
                                                                      aria-hidden="true"/>Envelope {invoiceData.total_envelope}/{invoiceData.plan_type}
                                                                </p>
                                                            )}
                                                            {invoiceData.total_sms > 0 && (
                                                                <p><i className="fa fa-check-circle me-2"
                                                                      aria-hidden="true"/>{invoiceData.total_sms} SMS
                                                                </p>
                                                            )}
                                                            {invoiceData.total_user > 0 && (
                                                                <p><i className="fa fa-check-circle me-2"
                                                                      aria-hidden="true"/>{invoiceData.total_user} User
                                                                </p>
                                                            )}
                                                        </td>
                                                        <td className="invoice-amount text-end">{invoiceData.paid_amount}</td>
                                                    </tr>
                                                    </tbody>
                                                    <tfoot>
                                                    <tr className="border-0">
                                                        <td colSpan="2" className="plan-description">
                                                            <p className="text-black text-end">Total</p>
                                                        </td>
                                                        <td className="invoice-amount text-end">{invoiceData.paid_amount}</td>
                                                    </tr>
                                                    <tr className="border-0 text-end">
                                                        <td colSpan="3" className="plan-description">
                                                            <ReactToPrint
                                                                content={reactToPrintContent}
                                                                documentTitle={invoiceData.invoice_no}
                                                                onAfterPrint={handleAfterPrint}
                                                                onBeforeGetContent={handleOnBeforeGetContent}
                                                                onBeforePrint={handleBeforePrint}
                                                                removeAfterPrint
                                                                trigger={reactToPrintTrigger}
                                                            />

                                                            <button type="button" className="btn rounded-pill me-2"
                                                                    onClick={handleDownload}
                                                                    style={{backgroundColor: '#ecebeb'}}>
                                                                <img src="/images/bill_download_icon.png" alt="..."/>
                                                            </button>
                                                            <button type="button" onClick={handleBack}
                                                                    className="btn btn-primary rounded-pill">Back
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer py-3">
                                DocuTick Pty Ltd (ABN:26 661 291 130)
                            </div>
                        </div>
                    )}

                    {isPrint === true && (
                        <div ref={componentRef} className="overview_Card card mb-40px">
                            <div className="card-title border-bottom p-3 bill-section-heading ">
                                <div className="row">
                                    <div className="col-sm-4 py-2 py-sm-0">
                                        <img src="/images/logo.png" style={{width: '100%', maxWidth: '102px'}}
                                             alt="..."/>
                                    </div>
                                    <div
                                        className="col-sm-4 py-2 py-sm-0 d-flex align-items-center justify-content-sm-center text-black">
                                        <div style={{fontSize: '18px'}}>TAX INVOICE</div>
                                    </div>
                                    <div
                                        className="col-sm-4 py-2 py-sm-0 d-flex align-items-center justify-content-sm-end text-black">
                                        <div style={{fontSize: '18px'}}>invoice No # {invoiceData.invoice_no}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body py-0">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="py-3">
                                            <p className="text-black"><b>Billed To:</b></p>
                                            <p style={{maxWidth: '160px', width: '100%'}}>
                                                {invoiceData.first_name + ` ` + invoiceData.last_name + ` `}
                                                {invoiceData.address}</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="py-3">
                                            <p className="text-black"><b>Payment Method</b></p>
                                            <p style={{maxWidth: '200px', width: '100%'}}>
                                                {invoiceData.brand} ending ****{invoiceData.last4 + ` `}
                                                {invoiceData.email}</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="py-3">
                                            <p className="text-black text-sm-end"><b>Order Date</b></p>
                                            <p className="text-sm-end">{invoiceData.created_at}</p>
                                        </div>
                                    </div>
                                    <div className="col-12 py-3">
                                        <p className="text-black"><b>Order Summary</b></p>
                                    </div>
                                    <div className="col-12 px-0">
                                        <div className="pt-3">
                                            <div className="table-responsive ">
                                                <table
                                                    className="table mb-0 in_progress_table mb-2 billing-table rounded-0">
                                                    <thead className="">
                                                    <tr className="bg-transparent">
                                                        <th style={{width: '12%'}}>No.</th>
                                                        <th>Item</th>
                                                        <th style={{width: '14%', textAlign: 'right'}}>Price</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="border-0">
                                                    <tr>
                                                        <td>{invoiceData.invoice_no}</td>
                                                        <td className="plan-description">
                                                            <p>{invoiceData.plan}</p>
                                                            {invoiceData.total_envelope > 0 && (
                                                                <p><i className="fa fa-check-circle me-2"
                                                                      aria-hidden="true"/>Envelope {invoiceData.total_envelope}/{invoiceData.plan_type}
                                                                </p>
                                                            )}
                                                            {invoiceData.total_sms > 0 && (
                                                                <p><i className="fa fa-check-circle me-2"
                                                                      aria-hidden="true"/>{invoiceData.total_sms} SMS
                                                                </p>
                                                            )}
                                                            {invoiceData.total_user > 0 && (
                                                                <p><i className="fa fa-check-circle me-2"
                                                                      aria-hidden="true"/>{invoiceData.total_user} User
                                                                </p>
                                                            )}
                                                        </td>
                                                        <td className="invoice-amount text-end">{invoiceData.paid_amount}</td>
                                                    </tr>
                                                    </tbody>
                                                    <tfoot>
                                                    <tr className="border-0">
                                                        <td colSpan="2" className="plan-description">
                                                            <p className="text-black text-end">Total</p>
                                                        </td>
                                                        <td className="invoice-amount text-end">{invoiceData.paid_amount}</td>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer py-3">
                                DocuTick Pty Ltd (ABN:26 661 291 130)
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default AdminClientBillingHistory;