import React from "react";
import {NavLink} from "react-router-dom";

function PageNotFound() {
    return (
        <div className="wraper_404" style={{minHeight: 'calc(100vh - 374px)'}}>
            <h1>404</h1>
            <h3>Oops!</h3>
            <p>Page Not Found</p>
            <NavLink to={"/"} className="home_btn" type="button">Back to Home</NavLink>
        </div>
    );
}

export default PageNotFound;