import React, {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";

import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Utils from "../../../utils";

function Layout() {

    const [themeClass, setThemeClass] = useState('');

    useEffect(function () {
        const interval = setInterval(() => {
            let userData = Utils.loginUserData();
            if (Object.keys(userData).length > 0) {
                if (userData.theme_color) {
                    setThemeClass(userData.theme_color);
                } else {
                    setThemeClass('');
                }
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`wrapper ${themeClass}`}>
            <Header/>

            <Outlet/>

            <Footer/>
        </div>
    );
}

export default Layout;