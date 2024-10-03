import React, {useState} from "react";
import validator from "validator";
import {postContact} from "../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../utils";
import {Lang} from "../../../lang";

function Contact() {

    document.title = Lang.contact_title;
    document.getElementsByTagName("META")[4].content = Lang.contact_meta_desc;
    document.getElementsByTagName("META")[5].content = Lang.contact_meta_keyword;

    const [question, setQuestion] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [explainQuestion, setExplainQuestion] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    let errorsObj = {
        question: '',
        name: '',
        email: '',
        explain_question: ''
    };
    const [errors, setErrors] = useState(errorsObj);

    const onSubmitContact = (e) => {
        
        alert (e);
        e.preventDefault();
        let errorObj = {...errorsObj};
        const noSpecialChar = /^[^*|":<>[\]{}`\\()';@&$]+$/;
        let error = false;
        if (!question) {
            errorObj.question = 'Please select question';
            error = true;
        }
        if (!name) {
            errorObj.name = 'Please enter name';
            error = true;
        } else {
            if (!noSpecialChar.test(name)) {
                errorObj.name = 'Special characters not allowed';
                error = true;
            }
        }
        if (!email) {
            errorObj.email = 'Please enter email';
            error = true;
        } else if (!validator.isEmail(email)) {
            errorObj.email = 'Please enter valid email';
            error = true;
        }
        if (!explainQuestion) {
            errorObj.explain_question = 'Please enter detail';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        setDisabled(true);

        let obj = {
            question: question,
            name: name,
            email: email,
            explain_question: explainQuestion
        };

        postContact(obj)
            .then(response => {
                setQuestion('');
                setName('');
                setEmail('');
                setExplainQuestion('');
                setDisabled(false);
                setIsSuccess(true);
                setTimeout(function () {
                    setIsSuccess(false);
                }, 30000);
            })
            .catch(err => {
                setDisabled(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <div className="p-0" style={{minHeight: 'calc(100vh - 406px)'}}>
            <div className="title_container px-4 py-5">
                <h1 className="text-dark text-center mb-3">Contact</h1>
                <p className="text-dark text-center">We are here to help! please email or fill out the below form to
                    contact us & we will get back to you within 24 working Hours.</p>
            </div>
            <div className="custom_container_portal px-3 py-5">
                <div className="row mb-5">
                    <div className="col-lg-4 mb-3">
                        <div className="contact_box card">
                            <div className="card-body text-center p-4">
                                <div className="icon_box">
                                    <i className="fa fa-map-marker" aria-hidden="true"/>
                                </div>
                                <h5 className="text-dark mb-3">Our Address</h5>
                                <p>Suite 703, Level 7, 155 King Street
                                    <span className="d-block">Sydney NSW 2000, Australia</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-3">
                        <div className="contact_box card">
                            <div className="card-body text-center p-4">
                                <div className="icon_box">
                                    <i className="fa fa-phone" aria-hidden="true"/>
                                </div>
                                <h5 className="text-dark mb-3">Contact Info</h5>
                                <p className=" mb-2">Start a chat or send us Email on </p>
                                <a href="mailto:hello@docutik.com">hello@docutick.com</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-3">
                        <div className="contact_box card">
                            <div className="card-body text-center p-4">
                                <div className="icon_box">
                                    <i className="fa fa-comments-o"/>
                                </div>
                                <h5 className="text-dark mb-3">Live Support</h5>
                                <p className=" mb-2">Chat with our support</p>
                                <span>chat</span>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 className="text-dark text-center mb-5 pb-3">Have questions about our product, features, free trial
                    or pricing?
                    <span className="d-block">Contact us & Our teams will help you.</span>
                </h2>
                <div className="contact_form">
                    <div className="mb-4">
                        <label className="form-label">This question is about</label>
                        <select className="form-select" value={question} onChange={(e) => setQuestion(e.target.value)}>
                            <option value="">Choose Option</option>
                            <option value="Sales">Sales</option>
                            <option value="Technical Support">Technical Support</option>
                        </select>
                        {errors.question && <div className="text-danger">{errors.question}</div>}
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label className="form-label">Your Name</label>
                                <input type="text" className="form-control" value={name} maxLength="50"
                                       onChange={(e) => setName(e.target.value)}/>
                                {errors.name && <div className="text-danger">{errors.name}</div>}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mb-4">
                                <label className="form-label">Your Email</label>
                                <input type="text" className="form-control" value={email} maxLength="50"
                                       onChange={(e) => setEmail(e.target.value)}/>
                                {errors.email && <div className="text-danger">{errors.email}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Explain your question in details</label>
                        <textarea className="form-control" rows="3" value={explainQuestion}maxLength="300"
                                  onChange={(e) => setExplainQuestion(e.target.value)}/>
                        {errors.explain_question && <div className="text-danger">{errors.explain_question}</div>}
                    </div>
                    {disabled ?
                        <button type="button" className="btn btn-primary" disabled={true}>Send Message
                            <i className="fa fa-circle-o-notch fa-spin ms-1"/>
                        </button>
                        :
                        <button type="button" onClick={onSubmitContact} className="btn btn-primary">Send
                            Message</button>
                    }

                    {isSuccess &&
                    <div className="alert alert-success fade show mt-4" role="alert">
                        <h4 className="alert-heading mb-2">Thank you for getting in touch!</h4>
                        <p>We appreciate you contacting DocuTick. One of our Team members will get back in touch with you
                            soon! Have a great day!</p>
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Contact;