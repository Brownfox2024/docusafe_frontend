import React, {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import AdminModifyRecipient from "./AdminModifyRecipient";
import Utils from "../../../../utils";
import {toast} from "react-toastify";
import Pagination from "react-js-pagination";
import AdminDeleteRecipient from "./AdminDeleteRecipient";
import {adminGetRecipientList, adminRecipientDetail} from "../../../../services/AdminService";

const lengths = Utils.tableShowLengths();

function AdminRecipients() {
    let {client} = useParams();
    const addButtonRef = useRef(null);
    const delButtonRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [isLoad, setIsLoad] = useState(true);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [isEffect, setIsEffect] = useState(false);
    const [list, setList] = useState([]);
    const [listProcess, setListProcess] = useState('loading...');
    const [totalRecipient, setTotalRecipient] = useState(0);
    const [delId, setDelId] = useState(0);
    const [data, setData] = useState({
        id: 0,
        first_name: '',
        last_name: '',
        email: '',
        country_id: 13,
        mobile: '',
        company_name: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        address_country_id: '',
        zipcode: '',
        readonly: false
    });

    useEffect(() => {
        if (isLoad) {
            setLoading(true);
        }
        setListProcess('loading...');
        setList([]);
        let obj = {
            client_id: client,
            limit: limit,
            search: search,
            page: page
        };
        adminGetRecipientList(obj)
            .then(response => {
                if (response.data) {
                    setTotalRecipient(parseInt(response.data.count));
                    setList(response.data.data);

                    if (response.data.data.length === 0) {
                        setListProcess('No data available.');
                    }
                }
                setLoading(false);
                setIsLoad(false);
            })
            .catch(err => {
                setLoading(false);
                setIsLoad(false);
                toast.error(Utils.getErrorMessage(err));
            });
    }, [client, limit, search, page, isEffect, isLoad]);

    const handleTableLength = (e) => {
        setPage(1);
        setLimit(parseInt(e.target.value));
    };

    const handleSearch = (e) => {
        setPage(1);
        setSearch(e.target.value);
    };

    const onEditRecipient = (e, data) => {
        e.preventDefault();
        setLoading(true);
        adminRecipientDetail({client_id: client, id: data.id})
            .then(response => {
                let detail = response.data.data;
                let obj = {
                    id: detail.id,
                    first_name: detail.first_name,
                    last_name: detail.last_name,
                    email: detail.email,
                    country_id: detail.country_id,
                    mobile: detail.mobile,
                    company_name: (detail.company_name) ? detail.company_name : '',
                    address_1: (detail.address_1) ? detail.address_1 : '',
                    address_2: (detail.address_2) ? detail.address_2 : '',
                    city: (detail.city) ? detail.city : '',
                    state: (detail.state) ? detail.state : '',
                    address_country_id: (detail.address_country_id) ? detail.address_country_id : '',
                    zipcode: (detail.zip_code) ? detail.zip_code : '',
                    readonly: false
                };
                setData(obj);
                addButtonRef.current?.click();
                setLoading(false);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(true);
            });
    };

    const onViewRecipient = (e, data) => {
        e.preventDefault();
        setLoading(true);
        adminRecipientDetail({client_id: client, id: data.id})
            .then(response => {
                let detail = response.data.data;
                let obj = {
                    id: detail.id,
                    first_name: detail.first_name,
                    last_name: detail.last_name,
                    email: detail.email,
                    country_id: detail.country_id,
                    mobile: detail.mobile,
                    company_name: (detail.company_name) ? detail.company_name : '',
                    address_1: (detail.address_1) ? detail.address_1 : '',
                    address_2: (detail.address_2) ? detail.address_2 : '',
                    city: (detail.city) ? detail.city : '',
                    state: (detail.state) ? detail.state : '',
                    address_country_id: (detail.address_country_id) ? detail.address_country_id : '',
                    zipcode: (detail.zip_code) ? detail.zip_code : '',
                    readonly: true
                };
                setData(obj);
                addButtonRef.current?.click();
                setLoading(false);
            })
            .catch(err => {
                toast.error(Utils.getErrorMessage(err));
                setLoading(true);
            });
    };

    const onDeleteRecipient = (e, data) => {
        e.preventDefault();
        delButtonRef.current?.click();
        setDelId(data.id);
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <section className="main_wrapper background_grey_400 recipient_page"
                     style={{minHeight: 'calc(100vh - 119px)'}}>
                <div className="custom_container">
                    <div className="table_header_wrap mb-4">
                        <h2 className="main_title mb-3 text_color">Recipients</h2>
                        <div className="wrap_right flexWrap tab-content clearfix step_wizard_content">
                            <button type="button" className="btn  add_recipients_btn mb-3 me-2" ref={addButtonRef}
                                    data-bs-toggle="offcanvas" data-bs-target="#addRecipients"
                                    aria-controls="addRecipients" data-toggle="tooltip" data-placement="right"
                                    title="click me to create recipients"
                                    data-bs-original-title="click Me">
                                <span className="me-3">+</span>Add Recipient
                            </button>
                            <div className="search_input mb-3">
                                <div className="input-group position-relative me-2">
                                    <input className="form-control border-end-0 border rounded-pill " type="text"
                                           value={search} onChange={handleSearch}
                                           placeholder="Search Recipients"/>
                                    <span className="input-group-append position-absolute">
                                        <i className="fa fa-search"/>
                                    </span>
                                </div>
                            </div>
                            <div className="functional_icons mb-3 ms-2">
                                <div className="dropdown">
                                    <span className="functional_icon_ellipsis" id="dropdownMenuIE"
                                          data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="fa fa-ellipsis-v fontSize" data-toggle="tooltip"
                                           data-placement="right" title="click me" data-bs-original-title="click Me"/>
                                    </span>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuIE">
                                        <li><span className="dropdown-item">Import Contacts</span></li>
                                        <li><span className="dropdown-item">Export Contacts</span></li>
                                    </ul>
                                </div>
                            </div>

                            <AdminModifyRecipient data={data} isEffect={isEffect} setIsEffect={setIsEffect}
                                                  setData={setData} setLoading={setLoading}/>
                        </div>
                    </div>

                    <div className="table-responsive mb-3">
                        <table className="table align-middle mb-0 bg-white in_progress_table shadow-sm mb-2">
                            <thead>
                            <tr className="bg_blue">
                                <th>Created</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Company</th>
                                <th>User</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {list && list.map((item, i) =>
                                <tr key={i}>
                                    <td>{item.created_at}</td>
                                    <td>{item.first_name + ' ' + item.last_name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.mobile ? item.country_code + ' ' + item.mobile : ``}</td>
                                    <td>{item.company_name}</td>
                                    <td>{item.user_by}</td>
                                    <td>
                                        <span className="text-primary cur-pointer me-3" data-toggle="tooltip"
                                              data-placement="right" title="click me to view"
                                              onClick={(e) => onViewRecipient(e, item)}
                                              data-bs-original-title="click Me">View</span>
                                        <span className="text-primary cur-pointer me-3" data-toggle="tooltip"
                                              data-placement="right" title="click me"
                                              onClick={(e) => onEditRecipient(e, item)}
                                              data-bs-original-title="click Me to edit">Edit</span>
                                        <span className="text-danger cur-pointer" data-toggle="tooltip"
                                              data-placement="right" title="click me to delete"
                                              onClick={(e) => onDeleteRecipient(e, item)}
                                              data-bs-original-title="click Me">Delete</span>
                                    </td>
                                </tr>
                            )}

                            {list.length === 0 &&
                            <tr>
                                <td className="text-center" colSpan={7}>{listProcess}</td>
                            </tr>
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className="table_footer_wrap">
                        <div className="d-flex align-items-center mb-4">
                            <span className="me-2">Show</span>
                            <select className="form-select" value={limit} onChange={handleTableLength}
                                    aria-label="Default select example">
                                {lengths && lengths.map((item, i) => <option value={item} key={i}>{item}</option>)}
                            </select>
                        </div>
                        <div className="pagination mb-4">
                            <Pagination
                                activePage={page}
                                itemsCountPerPage={limit}
                                totalItemsCount={totalRecipient}
                                pageRangeDisplayed={5}
                                onChange={(e) => setPage(e)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <button type="button" ref={delButtonRef} className="btn btn-primary d-none" data-bs-toggle="modal"
                    data-bs-target="#deleteModal"/>
            <AdminDeleteRecipient delId={delId} setDelId={setDelId} isEffect={isEffect} setIsEffect={setIsEffect}/>
        </>
    )
}

export default AdminRecipients;