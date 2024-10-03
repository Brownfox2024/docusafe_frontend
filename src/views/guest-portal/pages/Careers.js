import React from "react";
import {NavLink} from "react-router-dom";
import {Lang} from "../../../lang";

function Careers() {

    document.title = Lang.careers_title;
    document.getElementsByTagName("META")[4].content = Lang.careers_meta_desc;
    document.getElementsByTagName("META")[5].content = Lang.careers_meta_keyword;

    return (
        <div className="p-0" style={{minHeight: 'calc(100vh - 406px)'}}>
            <div className="title_container px-4 py-5">
                <h1 className="text-dark text-center mb-3">Careers</h1>
                <p className="text-dark text-center">DocuTick is looking for brilliant, passionate people who are a joy
                    to work, in location Sydney, Australia. If you think you might be one of them, let’s work
                    together.</p>
            </div>
            <div className="custom_container_portal px-3 py-5 career_page">
                <div className="mb-2 d-flex justify-content-center">JOB POSITIONS</div>
                <h3 className="text-dark mb-5">We're alway searching for amazing people to join our team.Take a look at
                    our current openings.</h3>
                <div className="row mb-5">
                    <div className="col-lg-4 col-md-6 mb-3">
                        <div className="card shadow position_card">
                            <div className="card-body d-flex">
                                <div className="position_img me-3">SD</div>
                                <div>
                                    <span className="badge mb-2">Full Time</span>
                                    <h6 className="text-dark mb-2">Senior Product Manager</h6>
                                    <span className="mb-2">Sydney, Australia</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-3">
                        <div className="card shadow position_card">
                            <div className="card-body d-flex ">
                                <div className="position_img me-3 bg_green">SD</div>
                                <div>
                                    <span className="badge mb-2">Full Time</span>
                                    <h6 className="text-dark mb-2">Business Analyst</h6>
                                    <span className="mb-2">Sydney, Australia</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-3">
                        <div className="card shadow position_card">
                            <div className="card-body d-flex">
                                <div className="position_img me-3 bg_yellow">SD</div>
                                <div>
                                    <span className="badge mb-2">Full Time</span>
                                    <h6 className="text-dark mb-2">Payroll Officer</h6>
                                    <span className="mb-2">Sydney, Australia</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-3">
                        <div className="card shadow position_card">
                            <div className="card-body d-flex position_card">
                                <div className="position_img me-3">SD</div>
                                <div>
                                    <span className="badge mb-2">Full Time</span>
                                    <h6 className="text-dark mb-2">QA (Software Tester)</h6>
                                    <span className="mb-2">Sydney, Australia</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-3">
                        <div className="card shadow position_card">
                            <div className="card-body d-flex ">
                                <div className="position_img me-3 bg_yellow">SD</div>
                                <div>
                                    <span className="badge mb-2">Full Time</span>
                                    <h6 className="text-dark mb-2">Senior Graphic Designer</h6>
                                    <span className="mb-2">Sydney, Australia</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-3">
                        <div className="card shadow position_card">
                            <div className="card-body d-flex ">
                                <div className="position_img me-3 bg_green">SD</div>
                                <div>
                                    <span className="badge mb-2">Full Time</span>
                                    <h6 className="text-dark mb-2">Sales Manager</h6>
                                    <span className="mb-2">Sydney, Australia</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <NavLink type="button" to={"/careers/form"}
                             className="btn btn-primary join_our_team">Join our Team</NavLink>
                </div>
            </div>
        </div>
    );
}

export default Careers;