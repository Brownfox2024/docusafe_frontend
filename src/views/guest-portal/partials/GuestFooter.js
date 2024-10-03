import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import validator from 'validator';
import {postNewsLetter} from "../../../services/CommonService";
import {toast} from "react-toastify";
import Utils from "../../../utils";
import {CURRENT_YEAR, DOMAIN_NAME, FACEBOOK_URL, INSTAGRAM_URL, TWITTER_URL} from "../../../configs/AppConfig";

function GuestFooter() {
    const [email, setEmail] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [isScrollShow, setIsScrollShow] = useState(false);

    let errorsObj = {email: ''};
    const [errors, setErrors] = useState(errorsObj);

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 400) {
            setIsScrollShow(true);
        } else {
            setIsScrollShow(false);
        }
    };
    window.addEventListener('scroll', toggleVisible);

    const handleScroll = (e) => {
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const onSubmitNewsLetter = (e) => {
        e.preventDefault();
        let errorObj = {...errorsObj};
        let error = false;
        if (!email) {
            errorObj.email = 'Please enter email';
            error = true;
        } else if (!validator.isEmail(email)) {
            errorObj.email = 'Please enter valid email';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;

        setIsDisabled(true);

        let obj = {
            email: email
        };
        postNewsLetter(obj)
            .then(response => {
                setIsDisabled(false);
                setEmail('');
                toast.success(response.data.message);
            })
            .catch(err => {
                setIsDisabled(false);
                toast.error(Utils.getErrorMessage(err));
            });
    };

    return (
        <footer className="bg-dark text-center text-lg-start text-white">
            <div className="container px-4 py-2">
                <div className="row my-4">
                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0 border-end ps-4">
                        <div className=" shadow-1-strong d-flex align-items-center  mb-4 mx-auto footer_logo">
                            <img src="/images/logo.png" alt=""/>
                        </div>
                        <p className="mb-4 text-muted">A platform built for collecting large volume of Document
                            Requests.</p>
                        <ul className="list-unstyled d-flex flex-row footer_logo d-none">
                            <li>
                                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer"
                                   className="text-white px-2">
                                    <i className="fa fa-facebook"/>
                                </a>
                            </li>
                            <li>
                                <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer"
                                   className="text-white px-2">
                                    <i className="fa fa-twitter" aria-hidden="true"/>
                                </a>
                            </li>
                            <li>
                                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                                   className="text-white px-2">
                                    <i className="fa fa-instagram"/>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0 border-end ps-4">
                        <h5 className="text-uppercase mb-4">Explore</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <NavLink to={"/product"} className="text-muted">Product</NavLink>
                            </li>
                            <li className="mb-2">
                                <NavLink to={"/pricing"} className="text-muted">Pricing</NavLink>
                            </li>
                            <li className="mb-2">
                                <NavLink to={"/sign-up"} className="text-muted">Try For Free</NavLink>
                            </li>
                            <li className="mb-2">
                                <NavLink to={"/faq"} className="text-muted">FAQ</NavLink>
                            </li>
                            {/*<li className="mb-2">
                                <NavLink to={"/about-us"} className="text-muted">About Us</NavLink>
                            </li>*/}
                            <li className="mb-2">
                                <NavLink to={"contact"} className="text-muted">Contact US</NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0 border-end ps-4">
                        <h5 className="text-uppercase mb-4">RESOURCES</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <NavLink to={"/careers"} className="text-muted">Careers</NavLink>
                            </li>
                            <li className="mb-2">
                                <NavLink to={"/integration"} className="text-muted">Integration</NavLink>
                            </li>
                            <li className="mb-2">
                                <NavLink to={"/use-cases"} className="text-muted">Use Cases</NavLink>
                            </li>
                            <li className="mb-2">
                                <a href={DOMAIN_NAME + '/blog'} rel="noopener noreferrer"
                                   className="text-muted">Blog</a>
                            </li>
                            {/*<li className="mb-2">
                                <NavLink to={"documentation"} className="text-muted">Documentation</NavLink>
                            </li>
                            <li className="mb-2">
                                <NavLink to={"/security"} className="text-muted">Security</NavLink>
                            </li>
                            <li className="mb-2">
                                <NavLink to={"/faq"} className="text-muted">Support</NavLink>
                            </li>
                            <li className="mb-2">
                                <NavLink to={"/privacy-policy"} className="text-muted">Privacy</NavLink>
                            </li>
                            <li className="mb-2">
                                <NavLink to={"/product"} className="text-muted">Sales</NavLink>
                            </li>*/}
                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0 ps-4 newsletter">
                        <h5 className="text-uppercase mb-4">Newsletter</h5>
                        <p className="small text-muted mb-3">Subscribe to our newsletter to get our news & deals
                            delivered to you.</p>
                        <form className="newsletter_form" onSubmit={onSubmitNewsLetter}>
                            <div className={`input-group ${errors.email ? `` : `mb-3`}`}>
                                <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}
                                       disabled={isDisabled} type="text" placeholder="Email Address"/>
                                {isDisabled ?
                                    <button className="btn btn-primary" id="button-addon2" type="button"
                                            disabled={true}>
                                        <i className="fa fa-circle-o-notch fa-spin"/>
                                    </button>
                                    :
                                    <button className="btn btn-primary" id="button-addon2" type="submit">Join</button>
                                }
                            </div>
                            {errors.email && <div className="text-danger mb-3 ms-2 mt-1">{errors.email}</div>}
                        </form>
                    </div>
                </div>
            </div>
            <div className="py-2" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
                <div
                    className="container d-flex flex-wrap justify-content-between align-items-center  my-2 copy_right_text">
                    <p className="text-muted">
                        © {CURRENT_YEAR} <NavLink to={"/"} className="text-muted">Docutick Pty Ltd.</NavLink> All rights
                        reserved
                    </p>
                    <ul className="nav  justify-content-end list-unstyled d-flex">
                        <li className="ms-2">
                            <NavLink className="text-muted" to={"/terms-condition"}>Terms and Condition</NavLink>
                        </li>
                        <li className="ms-2 text-muted">|</li>
                        <li className="ms-2">
                            <NavLink className="text-muted" to={"/privacy-policy"}>Privacy Policy</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
            <span id="button" onClick={handleScroll} className={`shadow ${isScrollShow ? `show` : ``}`}/>
        </footer>
    );
}

export default GuestFooter;