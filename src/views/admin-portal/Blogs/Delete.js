import React, {useRef} from "react";
import {adminDeleteBlog} from "../../../services/AdminService";
import {toast} from "react-toastify";
import Utils from "../../../utils";

function DeleteBlog(props) {

    const clsDeleteBlogModal = useRef(null);

    const handleCloseDeleteBlogModal = (e) => {
        e.preventDefault();
        props.setBlogId('');
    };

    const onBlogDestroy = (e) => {
        e.preventDefault();
        props.setLoading(true);

        adminDeleteBlog({id: props.blogId})
            .then(response => {
                let data = {...props.dataParams};
                data.is_reload = true;
                props.setDataParams(data);
                clsDeleteBlogModal?.current.click();
                props.setLoading(false);

                toast.success(response.data.message);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <div className="modal fade" id="deleteBlog" tabIndex="-1" aria-hidden="true"
             aria-labelledby="deleteBlogLabel" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="deleteBlogLabel">Delete Blog</h5>
                        <button type="button" className="btn btn-close close_btn text-reset mb-2"
                                data-bs-dismiss="modal" ref={clsDeleteBlogModal}
                                onClick={handleCloseDeleteBlogModal} aria-label="Close">
                            <i className="fa fa-times-circle" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure want to delete this blog?</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" onClick={handleCloseDeleteBlogModal} className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="button" onClick={onBlogDestroy} className="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteBlog;