import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import Utils from "../../../utils";
import Pagination from "react-js-pagination";
import {adminGetBlogs} from "../../../services/AdminService";
import DeleteBlog from "./Delete";

const lengths = Utils.tableShowLengths();

function AdminBlog() {
    const [loading, setLoading] = useState(false);
    const [blogId, setBlogId] = useState('');
    const [blogList, setBlogList] = useState([]);
    const [totalBlog, setTotalBlog] = useState(0);

    const [dataParams, setDataParams] = useState({
        limit: lengths[0],
        page: 1,
        search_title: '',
        search_author_name: '',
        is_reload: true,
    });

    useEffect(function () {
        if (dataParams.is_reload === true) {
            setLoading(true);
            adminGetBlogs(dataParams)
                .then(response => {
                    setBlogList(response.data.data);
                    setTotalBlog(response.data.count);
                    setLoading(false);
                    let params = {...dataParams};
                    params.is_reload = false;
                    setDataParams(params);
                })
                .catch(err => {
                    setLoading(false);
                });
        }
    }, [dataParams]);

    const handleData = (e, type) => {
        let params = {...dataParams};
        if (type === 'pagination') {
            params.page = e;
            params.is_reload = true;
        } else if (type === 'limit') {
            params.limit = parseInt(e.target.value);
            params.is_reload = true;
        } else if (type === 'search_title') {
            params.search_title = e.target.value;
        } else if (type === 'search_author_name') {
            params.search_author_name = e.target.value;
        }
        setDataParams(params);
    };

    const handleSearchFilter = (e) => {
        e.preventDefault();
        let params = {...dataParams};
        params.page = 1;
        params.is_reload = true;
        setDataParams(params);
    };

    const handleClearFilter = (e) => {
        e.preventDefault();
        let params = {
            limit: lengths[0],
            page: 1,
            search_title: '',
            search_start_date: '',
            search_end_date: '',
            search_author_name: '',
            is_reload: true
        };
        setDataParams(params);
    };

    const handleDeleteBlog = (e, data) => {
        e.preventDefault();
        setBlogId(data.uuid);
    };

    return (
        <div className="custom_container">
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}

            <h2 className="main_title mb-3">Blogs</h2>

            <div className="tab-content pb-4" id="nav-tabContent">
                <div className="tab-pane fade active show" id="Inprogress-detail" role="tabpanel"
                     aria-labelledby="Inprogress">
                    <div className="search_box_admin_page step_wizard_content">
                        <div className="d-flex justify-content-end flexWrap">
                            <div className="d-flex align-items-center flexWrap">
                                <input type="text" placeholder="Search by Title" value={dataParams.search_title}
                                       onChange={(e) => handleData(e, 'search_title')} className="form-control mb-3"/>
                                <input type="text" placeholder="Author Name" value={dataParams.search_author_name}
                                       onChange={(e) => handleData(e, 'search_author_name')}
                                       className="form-control mb-3"/>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button type="button" onClick={handleSearchFilter} className="btn btn-primary">Search
                                </button>
                                <button type="button" onClick={handleClearFilter} className="btn btn-secondary">Clear
                                </button>
                                <NavLink to={"/back-admin/blogs/create"} className="btn btn-warning rounded-pill">Add
                                    Blog</NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive mb-3">
                        <table className="table align-middle mb-0 bg-white in_progress_table shadow-sm mb-2">
                            <thead>
                            <tr className="bg_blue">
                                <th>Id</th>
                                <th>Title</th>
                                <th>Author Name</th>
                                <th>Created At</th>
                                <th className="text-center" style={{width: '15px'}}>
                                    <i className="fa fa-ellipsis-v"/>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {blogList.length > 0 && blogList.map((item, index) =>
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.author_name}</td>
                                    <td>{item.created_at}</td>
                                    <td className="functional_icons text-center">
                                        <div className="dropdown pt_10">
                                            <span className="functional_icon_ellipsis" id={`dropdownMenuButton_1`}
                                                  data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fa fa-ellipsis-v"/>
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton_1`}>
                                                <li>
                                                    <NavLink to={"/back-admin/blogs/" + item.uuid + "/edit"}
                                                             className="dropdown-item cur-pointer">Edit</NavLink>
                                                </li>
                                                <li>
                                                    <span className="dropdown-item cur-pointer" data-bs-toggle="modal"
                                                          data-bs-target="#deleteBlog"
                                                          onClick={(e) => handleDeleteBlog(e, item)}>Delete</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {blogList.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center">No data available.</td>
                                </tr>
                            )}

                            </tbody>
                        </table>
                    </div>

                    <div className="table_footer_wrap mb-3">
                        <div className="d-flex align-items-center mb-4">
                            <span className="me-2">Show</span>
                            <select className="form-select" value={dataParams.limit}
                                    onChange={(e) => handleData(e, 'limit')} aria-label="Default select example">
                                {lengths && lengths.map((item, i) => <option value={item} key={i}>{item}</option>)}
                            </select>
                        </div>
                        <div className="pagination mb-4">
                            <Pagination
                                activePage={dataParams.page}
                                itemsCountPerPage={dataParams.limit}
                                totalItemsCount={parseInt(totalBlog)}
                                pageRangeDisplayed={5}
                                onChange={(e) => handleData(e, 'pagination')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <DeleteBlog dataParams={dataParams} setDataParams={setDataParams} blogId={blogId} setBlogId={setBlogId}
                        setLoading={setLoading}/>
        </div>
    );
}

export default AdminBlog;