import React, {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import EnvelopeUpgrade from "./partials/EnvelopeUpgrade";
import UseTemplate from "./UseTemplate";
import {Lang} from "../../lang";

function Home() {

    document.title = Lang.homepage_title;
    document.getElementsByTagName("META")[4].content = Lang.homepage_meta_desc;
    document.getElementsByTagName("META")[5].content = Lang.homepage_meta_keyword;

    const [isUseTemplate, setIsUseTemplate] = useState(false);
    const navigate = useNavigate();

    function onEnvelopeStart(e) {
        e.preventDefault();
        navigate("/client-portal/envelope");
    }

    const handleUseTemplate = (e) => {
        e.preventDefault();
        setIsUseTemplate(true);
    };

    return (
        <>
            <EnvelopeUpgrade/>

            <section className="main_wrapper background_grey_400" style={{minHeight: "calc(100vh - 179px)"}}>
                <div className="container">
                    <h2 className="main_title">Create an Envelope</h2>
                    <p className="main_text">{Lang.home_text}</p>
                    <div className="row scratch_template">
                        <div className="col-lg-6">
                            <NavLink to={'/client-portal/envelope'}>
                                <div className="white_card card">
                                    <div className="card_content">
                                        <div className="template_count_circle">+</div>
                                        <h2>Start From Scratch</h2>
                                        <p>A blank Envelope for collecting list of Documents.</p>
                                        <div className=" start_now d-flex justify-content-end">
                                            <button onClick={onEnvelopeStart} type="button" data-toggle="tooltip"
                                                    data-placement="right"
                                                    data-bs-original-title={Lang.home_start_scratch} title="">
                                                Start Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                        <div className="col-lg-6">
                            <div className="cur-pointer" onClick={handleUseTemplate} data-bs-toggle="offcanvas"
                                 data-bs-target="#useTemplate">
                                <div className="light_blue_card card">
                                    <div className="card_content">
                                        <div className="multiple_circle">
                                            <span className="template_count_circle">+</span>
                                            <span className="light_grey_circle"/>
                                            <span className="grey_circle"/>
                                        </div>
                                        <h2>Use Template</h2>
                                        <p>Premade Template for collecting list of Documents. </p>
                                        <div className=" start_now d-flex justify-content-end">
                                            <button onClick={handleUseTemplate} type="button" data-toggle="tooltip"
                                                    data-placement="right" data-bs-original-title={Lang.home_use_template}
                                                    data-bs-toggle="offcanvas" data-bs-target="#useTemplate" title="">
                                                Start Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <UseTemplate isUseTemplate={isUseTemplate} setIsUseTemplate={setIsUseTemplate}/>
        </>
    );
}

export default Home;
