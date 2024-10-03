import React from "react";
import {NavLink, useNavigate} from "react-router-dom";

function GuestHeader() {
    const navigate = useNavigate();

    const gotoSignUp = (e) => {
        e.preventDefault();

        navigate('/sign-up');
    };

    return (
        <nav className="navbar navbar-expand-lg px-3 px-sm-5  shadow-sm login_nav">
            <NavLink className="navbar-brand" to={"/"}>
                <img src="/images/logo.png" className="h-8" alt="..."/>
            </NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon">
                    <i className="fa fa-bars"/>
                </span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav mx-lg-auto">
                    <NavLink className="nav-item nav-link" to={"/"} end>Home</NavLink>
                    <NavLink className="nav-item nav-link" to={"/product"}>Product</NavLink>
                    <NavLink className="nav-item nav-link" to={"/use-cases"}>Use Cases</NavLink>
                    <NavLink className="nav-item nav-link" to={"/pricing"}>Pricing</NavLink>
                    <NavLink className="nav-item nav-link" to={"/faq"}>FAQ</NavLink>
                    <NavLink className="nav-item nav-link" to={"/contact"}>Contact</NavLink>
                </div>

                <div className="d-flex align-items-lg-center mt-3 mt-lg-0 justify-content-end">
                    <NavLink to={"/login"} className="upgrade me-3" data-toggle="tooltip" data-placement="right"
                             title=""
                             data-bs-original-title="Login" aria-label="Upgrade your envelope">Login
                    </NavLink>
                    <div className=" start_now">
                        <button type="button" onClick={gotoSignUp} data-toggle="tooltip" data-placement="right" title=""
                                data-bs-original-title="Start Now">Try For Free
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default GuestHeader;