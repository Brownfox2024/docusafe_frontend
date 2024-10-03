import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import TagsInput from 'react-tagsinput'
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import 'react-tagsinput/react-tagsinput.css'
import {adminBlogDetail, adminModifyBlog} from "../../../services/AdminService";
import {toast} from "react-toastify";
import Utils from "../../../utils";
import {DOMAIN_NAME} from "../../../configs/AppConfig";

function AdminModifyBlog() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [blogId, setBlogId] = useState('');
    const [title, setTitle] = useState('');
    const [authorName, setAuthorName] = useState('Team DocuTick');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaKeyword, setMetaKeyword] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [blogUrl, setBlogUrl] = useState('');
    const [description, setDescription] = useState('');
    const [blogTags, setBlogTags] = useState([]);
    const [facebookUrl, setFacebookUrl] = useState('');
    const [twitterUrl, setTwitterUrl] = useState('');
    const [blogImage, setBlogImage] = useState([]);
    const [blogImageUrl, setBlogImageUrl] = useState('');

    const errorsObj = {
        title: '',
        author_name: '',
        meta_title: '',
        meta_description: '',
        meta_keyword: '',
        blog_url: '',
        description: '',
        tags: '',
        facebook_url: '',
        twitter_url: '',
        image: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    useEffect(function () {
        if (id) {
            setLoading(true);
            adminBlogDetail({id: id})
                .then(response => {
                    setBlogId(id);
                    setTitle(response.data.data.title);
                    setMetaTitle(response.data.data.meta_title);
                    setBlogImageUrl(response.data.data.image);
                    setMetaDescription(response.data.data.meta_description);
                    setMetaKeyword(response.data.data.meta_keywords);
                    setBlogUrl(response.data.data.blog_url);
                    setAuthorName(response.data.data.author_name);
                    setDescription(response.data.data.description);
                    setBlogTags(response.data.data.tags);
                    setFacebookUrl(response.data.data.facebook_url);
                    setTwitterUrl(response.data.data.twitter_url);
                    setLoading(false);
                })
                .catch(err => {
                    setLoading(false);
                    navigate('/back-admin/blogs');
                    toast.error(Utils.getErrorMessage(err));
                });
        }
    }, [id, navigate]);

    const handleBlogImage = (e) => {
        if (e.target.files.length > 0) {
            setBlogImage([{file: e.target.files[0]}]);
        }
    };

    const handleBlogSubmit = (e) => {
        e.preventDefault();
        let error = false;
        let errorObj = {...errorsObj};
        if (!title) {
            errorObj.title = 'Title is required';
            error = true;
        }
        if (!authorName) {
            errorObj.author_name = 'Author name is required';
            error = true;
        }
        if (!metaTitle) {
            errorObj.meta_title = 'Meta title is required';
            error = true;
        }
        if (!metaKeyword) {
            errorObj.meta_keyword = 'Meta keyword is required';
            error = true;
        }
        if (!metaDescription) {
            errorObj.meta_description = 'Meta description is required';
            error = true;
        }
        if (!blogUrl) {
            errorObj.blog_url = 'Blog url is required';
            error = true;
        }
        if (!description) {
            errorObj.description = 'Description is required';
            error = true;
        }
        if (!id && blogImage.length === 0) {
            errorObj.image = 'Blog image is required';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('id', blogId);
        formData.append('title', title);
        formData.append('author_name', authorName);
        formData.append('meta_title', metaTitle);
        formData.append('meta_keyword', metaKeyword);
        formData.append('meta_description', metaDescription);
        formData.append('blog_url', blogUrl);
        formData.append('blog_tag', JSON.stringify(blogTags));
        formData.append('description', description);
        formData.append('facebook_url', facebookUrl);
        formData.append('twitter_url', twitterUrl);
        if (blogImage.length > 0) {
            formData.append('image', blogImage[0]['file']);
        }

        adminModifyBlog(formData)
            .then(response => {
                setLoading(false);
                toast.success(response.data.message);
                navigate('/back-admin/blogs');
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <div className="custom_container">
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}

            <h2 className="main_title mb-3">{id ? `Edit` : `Create`} Blog</h2>
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group mb-3">
                            <label htmlFor="title" className="mb-1">Title</label>
                            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                                   className="form-control" placeholder={`Enter blog title`}/>
                            {errors.title && (<div className="text-danger mt-1">{errors.title}</div>)}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group mb-3">
                            <label htmlFor="author_name" className="mb-1">Author Name</label>
                            <input type="text" id="author_name" value={authorName}
                                   onChange={(e) => setAuthorName(e.target.value)} className="form-control"
                                   placeholder={`Enter author name`}/>
                            {errors.author_name && (<div className="text-danger mt-1">{errors.author_name}</div>)}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group mb-3">
                            <label htmlFor="meta_title" className="mb-1">Meta Title</label>
                            <input type="text" id="meta_title" value={metaTitle}
                                   onChange={(e) => setMetaTitle(e.target.value)} className="form-control"
                                   placeholder={`Enter blog meta title`}/>
                            {errors.meta_title && (<div className="text-danger mt-1">{errors.meta_title}</div>)}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group mb-3">
                            <label htmlFor="meta_keyword" className="mb-1">Meta Keyword</label>
                            <input type="text" id="meta_keyword" value={metaKeyword}
                                   onChange={(e) => setMetaKeyword(e.target.value)} className="form-control"
                                   placeholder={`Enter blog meta keyword`}/>
                            {errors.meta_keyword && (<div className="text-danger mt-1">{errors.meta_keyword}</div>)}
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group mb-3">
                            <label htmlFor="meta_description" className="mb-1">Meta Description</label>
                            <textarea rows={5} id="meta_description" value={metaDescription}
                                      onChange={(e) => setMetaDescription(e.target.value)} className="form-control"
                                      placeholder={`Enter blog meta description`}/>
                            {errors.meta_description && (
                                <div className="text-danger mt-1">{errors.meta_description}</div>)}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                            <label htmlFor="blog_url" className="mb-1">Blog URL</label>
                            <input type="text" id="blog_url" value={blogUrl}
                                   onChange={(e) => setBlogUrl(e.target.value)} className="form-control"
                                   placeholder={`Enter blog url`}/>
                            {errors.blog_url && (<div className="text-danger mt-1">{errors.blog_url}</div>)}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                            <label className="mb-1">Blog URL Preview</label>
                            <div className="form-control">{DOMAIN_NAME + `/blog/` + blogUrl}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group mb-3">
                            <label className="mb-1">Tags</label>
                            <TagsInput value={blogTags} onChange={tags => setBlogTags(tags)}/>
                            {errors.tags && (<div className="text-danger mt-1">{errors.tags}</div>)}
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group mb-3">
                            <label className="mb-1">Description</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={description}
                                onReady={editor => {
                                    editor.editing.view.change((writer) => {
                                        writer.setStyle(
                                            "height",
                                            "200px",
                                            editor.editing.view.document.getRoot()
                                        );
                                    });
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setDescription(data);
                                }}
                                onBlur={(event, editor) => {
                                }}
                                onFocus={(event, editor) => {
                                }}
                            />
                            {errors.description && (<div className="text-danger mt-1">{errors.description}</div>)}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                            <label htmlFor="facebook_url" className="mb-1">Facebook URL</label>
                            <input type="text" id="facebook_url" value={facebookUrl}
                                   onChange={(e) => setFacebookUrl(e.target.value)} className="form-control"
                                   placeholder={`Enter facebook URL`}/>
                            {errors.facebook_url && (<div className="text-danger mt-1">{errors.facebook_url}</div>)}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-3">
                            <label htmlFor="twitter_url" className="mb-1">Twitter URL</label>
                            <input type="text" id="twitter_url" value={twitterUrl}
                                   onChange={(e) => setTwitterUrl(e.target.value)} className="form-control"
                                   placeholder={`Enter twitter URL`}/>
                            {errors.twitter_url && (<div className="text-danger mt-1">{errors.twitter_url}</div>)}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group mb-3">
                            <label htmlFor="blog_image" className="mb-1">Blog Image</label>
                            <input type="file" id="blog_image" onChange={handleBlogImage} className="form-control"/>
                            {errors.image && (<div className="text-danger mt-1">{errors.image}</div>)}
                        </div>
                    </div>
                    <div className="col-md-4">
                        {blogImageUrl && (<img src={blogImageUrl} alt="img" style={{width: '50px', height: '50px'}}/>)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <button type="button" onClick={handleBlogSubmit} className="btn btn-primary rounded-pill">
                            {id ? `Update` : `Create`} Blog
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminModifyBlog;