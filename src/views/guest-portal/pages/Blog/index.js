import React, {useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {postBlogList} from "../../../../services/CommonService";
import Pagination from "react-js-pagination";

function Blog() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [blogList, setBlogList] = useState([]);
    const [blogCount, setBlogCount] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(function () {
        setLoading(true);
        let obj = {
            limit: 9,
            page: page
        };
        postBlogList(obj)
            .then(response => {
                setBlogList(response.data.data);
                setBlogCount(parseInt(response.data.count));
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });
    }, [page]);

    return (
        <div className="p-0" style={{minHeight: 'calc(100vh - 374px)'}}>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <div className="title_container  px-4 py-5">
                <h1 className="text-dark text-center mb-3">Blog</h1>
                <p className="text-dark text-center">Check this page for regular Blog posts by the DocuTick Team.</p>
            </div>
            <div className=" custom_container py-5 px-3 ">
                <div className="row mb-3">
                    {blogList.map((item, index) =>
                        <div key={index} className="col-lg-4">
                            <NavLink to={"/blog/" + item.blog_url}>
                                <div className="card blog_card">
                                    <div className="blog_img">
                                        <img src={item.image} alt="..." className="w-100"/>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="mb-2">{item.author_name + ` - ` + item.created_at}</h5>
                                        <p className="mb-3">{item.title}</p>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                    )}

                    {blogList.length === 0 && (
                        <div className="col-lg-12">
                            <div className="mt-4 py-3 bg-primary text-white text-center">
                                <h6>No Blog Available.</h6>
                            </div>
                        </div>
                    )}
                </div>

                {blogList.length > 0 && (
                    <ul className="pagination blog-pagination ps-0 align-items-center justify-content-center flexWrap mb-5">
                        <Pagination
                            activePage={page}
                            itemsCountPerPage={9}
                            totalItemsCount={parseInt(blogCount)}
                            pageRangeDisplayed={5}
                            onChange={(e) => setPage(e)}
                        />
                    </ul>
                )}
                <div
                    className="appointment-div d-flex align-items-center justify-content-center px-4 py-5  border_radius flexWrap">
                    <h2 className="text-dark me-4 text-center">Having any Query ? Contact us.</h2>
                    <button type="button" onClick={(e) => navigate('/contact')}
                            className="btn book-now bg-primary">Contact us
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Blog;