import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {postBlogDetail} from "../../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../../utils";

function BlogDetail() {
    const {url} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [blogData, setBlogData] = useState({});

    useEffect(function () {
        if (url) {
            setLoading(true);
            postBlogDetail({id: url})
                .then(response => {
                    setBlogData(response.data.data);

                    document.title = response.data.data.meta_title;
                    document.getElementsByTagName("META")[4].content = response.data.data.meta_description;
                    document.getElementsByTagName("META")[5].content = response.data.data.meta_keywords;

                    setLoading(false);
                })
                .catch(err => {
                    setLoading(false);
                    toast.error(Utils.getErrorMessage(err));
                    navigate('/blog');
                });
        } else {
            navigate('/blog');
        }
    }, [url, navigate]);

    return (
        <div className="p-0 blog-detail" style={{minHeight: 'calc(100vh - 374px)'}}>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <div className="title_container bg-primary px-4 py-5">
                <h1 className="text-dark text-center mb-3">Blog</h1>
                <p className="text-dark text-center">Check this page for regular Blog posts by the DocuTick Team.</p>
            </div>
            <div className="container py-5 blog-detail">
                <h1 className="text-dark display-5" style={{maxWidth: '1100px', width: '100%'}}>{blogData?.title}</h1>
                <div className="d-flex my-5">
                    <div>
                        <div
                            className="rounded-circle background_grey_400 d-flex align-items-center justify-content-center"
                            style={{width: '50px', height: '50px'}}>
                            <p className="text-dark text-center"><b>{blogData?.display_name}</b></p>
                        </div>
                    </div>
                    <div className=" mx-3 d-flex align-items-start justify-content-center flex-column">
                        <p className="text-dark  mb-1"><b>{blogData?.author_name}</b></p>
                        <p>Posted on {blogData?.created_at}</p>
                    </div>
                </div>
                <div dangerouslySetInnerHTML={{__html: blogData.description}}/>

                <div className="row py-3 my-5 gx-0">
                    <div className="col-sm-9 mb-2 mb-sm-0">
                        {blogData?.tags && blogData?.tags.map((item, index) => (
                            <button key={index} type="button"
                                    className="btn border-secondary border border-2 mb-2 me-1">{item}</button>
                        ))}
                    </div>
                    <div className="col-sm-3 d-flex justify-content-end display-6">
                        {blogData?.twitter_url && (
                            <a href={blogData?.twitter_url} target="_blank" rel="noopener noreferrer"
                               className="text-secondary">
                                <i className="fa fa-twitter px-2" aria-hidden="true"/>
                            </a>
                        )}
                        {blogData?.facebook_url && (
                            <a href={blogData?.facebook_url} target="_blank" rel="noopener noreferrer"
                               className="text-secondary">
                                <i className="fa fa-facebook-square px-2" aria-hidden="true"/>
                            </a>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BlogDetail;