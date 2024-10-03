import React, {useState} from "react";
import validator from 'validator';
import {postCareers} from "../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../utils";

function CareersForm() {
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [file, setFile] = useState([]);
    const [fileKey, setFileKey] = useState(Date.now);
    const [detail, setDetail] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    let errorsObj = {
        position: '',
        name: '',
        email: '',
        detail: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const handleCareerSubmit = (e) => {
        e.preventDefault();
        let errorObj = {...errorsObj};
        const noSpecialChar = /^[^*|":<>[\]{}`\\()';@&$]+$/;
        let error = false;

        if (!position) {
            errorObj.position = "Position is required";
            error = true;
        } else {
            if (!noSpecialChar.test(position)) {
                errorObj.position = 'Special characterss not allowed';
                error = true;
            }
        }
        if (!name) {
            errorObj.name = "Name is required";
            error = true;
        } else {
            if (!noSpecialChar.test(name)) {
                errorObj.name = 'Special characters not allowed';
                error = true;
            }
        }
        if (!email) {
            errorObj.email = "Email is required";
            error = true;
        } else if (!validator.isEmail(email)) {
            errorObj.email = 'Please enter valid email address';
            error = true;
        }
        if (!detail) {
            errorObj.detail = "Detail is required";
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('position', position);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('detail', detail);
        if (file.length > 0) {
            formData.append('file', file[0]);
        }

        postCareers(formData)
            .then(response => {
                setLoading(false);
                setPosition('');
                setName('');
                setEmail('');
                setFileKey(Date.now);
                setFile([]);
                setDetail('');
                setIsSuccess(true);
                setTimeout(function () {
                    setIsSuccess(false);
                }, 30000);
            })
            .catch(err => {
                setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <>
            {loading && <div className="page-loading">
                <img src="/images/loader.gif" alt="loader"/>
            </div>}
            <div className="p-0" style={{minHeight: 'calc(100vh - 406px)'}}>
                <div className="title_container px-4 py-5">
                    <h1 className="text-dark text-center mb-3">Careers</h1>
                    <p className="text-dark text-center">DocuTick is looking for brilliant, passionate people who are a
                        joy
                        to work, in location Sydney, Australia. If you think you might be one of them, let’s work
                        together.</p>
                </div>
                <div className="custom_container_portal px-3 py-5">

                    <h3 className="text-dark text-center mb-3">We’re always searching for amazing people to join our
                        team.</h3>
                    <p className="text-dark mb-5 text-center font_18"> Please fill up the form</p>
                    <div className="contact_form">
                        <div className="mb-5">
                            <label className="form-label">Position you are looking for</label>
                            <input type="text" className="form-control" value={position} maxLength="50"
                                   onChange={(e) => setPosition(e.target.value)} placeholder="Enter position"/>
                            {errors.position && (<div className="text-danger">{errors.position}</div>)}
                        </div>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="mb-5">
                                    <label className="form-label">Your Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                           maxLength="50"
                                           className="form-control" placeholder="Enter Your Name*"/>
                                    {errors.name && (<div className="text-danger">{errors.name}</div>)}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="mb-5">
                                    <label className="form-label">Your Email</label>
                                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                                           maxLength="50"
                                           className="form-control" placeholder="Enter Your Email*"/>
                                    {errors.email && (<div className="text-danger">{errors.email}</div>)}
                                </div>
                            </div>
                        </div>
                        <div className="mb-5">
                            <div className="drag-area">
                                <div className="icon">
                                    <i className="fa fa-cloud-upload" aria-hidden="true"/>
                                </div>
                                <h5 className="my-2">Drag &amp; Drop to Upload File here or click to upload</h5>
                                <input type="file" key={fileKey} onChange={(e) => setFile(e.target.files)}
                                       className="cur-pointer"/>
                                <h5>Or</h5>
                                <button className="btn mx-0 my-2" type="button">Browse File</button>
                            </div>
                        </div>
                        <div className="mb-5">
                            <label className="form-label">Short description about you</label>
                            <textarea className="form-control" value={detail} maxLength="300"
                                      onChange={(e) => setDetail(e.target.value)}
                                      rows="4" placeholder="Enter Details"/>
                            {errors.detail && (<div className="text-danger">{errors.detail}</div>)}
                        </div>
                        <button type="button" onClick={handleCareerSubmit} className="btn btn-primary">Submit</button>

                        {isSuccess &&
                        <div className="alert alert-success fade show mt-4" role="alert">
                            <h4 className="alert-heading mb-2">Thank you for getting in touch!</h4>
                            <p>We appreciate you contacting DocuTick. One of our Team members will get back in touch with
                                you soon! Have a great day!</p>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default CareersForm;