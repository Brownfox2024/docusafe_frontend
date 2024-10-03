import React from "react";
import {Lang} from "../../../lang";

function Faq() {

    document.title = Lang.faq_title;
    document.getElementsByTagName("META")[4].content = Lang.faq_meta_desc;
    document.getElementsByTagName("META")[5].content = Lang.faq_meta_keyword;

    return (
        <div className="p-0" style={{minHeight: 'calc(100vh - 401px)'}}>
            <div className="title_container px-4 py-5">
                <h1 className="text-center text-dark mb-3">FAQ</h1>
                <p className="text-center text-dark">We have tried to answered the frequently Asked Questions.
                    <span className="d-block">if you have any specific Questions, please contact us.</span></p>
            </div>
            <section className="setting_tab">
                <div className="custom_container px-3 py-5 faq_nav">
                    <div className="row">
                        <div className="col-lg-2 col-md-4">
                            <h3 className="text-dark mb-4 ps-2">Topic</h3>
                            <div className="setting_sidebar mb-4">
                                <div className="nav nav-tabs " id="nav-tab" role="tablist">
                                    <button className="nav-link active" id="AccountDetails" data-bs-toggle="tab"
                                            data-bs-target="#Account-detail" type="button" role="tab"
                                            aria-controls="Account-detail" aria-selected="true">General
                                    </button>
                                    <button className="nav-link" id="user-tab" data-bs-toggle="tab"
                                            data-bs-target="#user" type="button" role="tab" aria-controls="user"
                                            aria-selected="false">Free Trail
                                    </button>
                                    <button className="nav-link " id="preferences-tab" data-bs-toggle="tab"
                                            data-bs-target="#preferences" type="button" role="tab"
                                            aria-controls="preferences" aria-selected="false">Product & Pricing
                                    </button>
                                    <button className="nav-link " id="integration-tab" data-bs-toggle="tab"
                                            data-bs-target="#integration" type="button" role="tab"
                                            aria-controls="integration" aria-selected="false">Security
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-10 col-md-8">
                            <h3 className="text-dark mb-4 ps-4">Question & Answer</h3>
                            <div className="tab-content  px-3" id="nav-tabContent">
                                <div className="tab-pane active show" id="Account-detail" role="tabpanel"
                                     aria-labelledby="AccountDetails">
                                    <div className="accordion" id="accordionExample">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingOne">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseOne"
                                                        aria-expanded="true" aria-controls="collapseOne">
                                                    What is Envelope
                                                </button>
                                            </h2>
                                            <div id="collapseOne" className="accordion-collapse collapse"
                                                 aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    Envelope is a set of Documents. Create an Envelope and add list of
                                                    Documents in Envelopes for requesting Documents.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingTwo">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseTwo"
                                                        aria-expanded="false" aria-controls="collapseTwo">
                                                    What are Recipients?
                                                </button>
                                            </h2>
                                            <div id="collapseTwo" className="accordion-collapse collapse"
                                                 aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    Recipients are your clients from whom you want to collect the
                                                    Documents.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingThree">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseThree"
                                                        aria-expanded="false" aria-controls="collapseThree">
                                                    What are Templates?
                                                </button>
                                            </h2>
                                            <div id="collapseThree" className="accordion-collapse collapse"
                                                 aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    Templates are your previous envelopes & you want to use is again.
                                                    Start with Template and edit them as needed.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingFour">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseFour"
                                                        aria-expanded="false" aria-controls="collapseFour">
                                                    What is Number of Fulfilled Envelopes & How DocuTick Charge?
                                                </button>
                                            </h2>
                                            <div id="collapseFour" className="accordion-collapse collapse"
                                                 aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    Number of Fulfilled Envelopes means when any recipients upload at
                                                    least 1 Document in Envelope. You can request Unlimited Documents,
                                                    But we only charge one credit if someone upload at least 1 Document
                                                    in your requested Envelope.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tab-pane  bg_transparent" id="user" role="tabpanel"
                                     aria-labelledby="user-tab">
                                    <div className="accordion" id="accordionExample2">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingOne1">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseOne1"
                                                        aria-expanded="true" aria-controls="collapseOne1">
                                                    How to Start with DocuTick?
                                                </button>
                                            </h2>
                                            <div id="collapseOne1" className="accordion-collapse collapse"
                                                 aria-labelledby="headingOne1" data-bs-parent="#accordionExample2">
                                                <div className="accordion-body">
                                                    Simply click on Try For Free and create your account with us. No
                                                    credit card required.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingTwo2">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseTwo2"
                                                        aria-expanded="false" aria-controls="collapseTwo2">
                                                    How many Envelopes I will get it in Free Trail?
                                                </button>
                                            </h2>
                                            <div id="collapseTwo2" className="accordion-collapse collapse"
                                                 aria-labelledby="headingTwo2" data-bs-parent="#accordionExample2">
                                                <div className="accordion-body">
                                                    3
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingThree3">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseThree3"
                                                        aria-expanded="false" aria-controls="collapseThree3">
                                                    What happens after finishing 3 free Trial envelopes?
                                                </button>
                                            </h2>
                                            <div id="collapseThree3" className="accordion-collapse collapse"
                                                 aria-labelledby="headingThree3" data-bs-parent="#accordionExample2">
                                                <div className="accordion-body">
                                                    After finishing your DocuTick trial, your data and setup remain
                                                    Active, but you cannot send more request. You can login and select a
                                                    plan to purchase.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingFour4">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseFour4"
                                                        aria-expanded="false" aria-controls="collapseFour4">
                                                    is that compulsory to verify my email ID for Trial?
                                                </button>
                                            </h2>
                                            <div id="collapseFour4" className="accordion-collapse collapse"
                                                 aria-labelledby="headingFour4" data-bs-parent="#accordionExample2">
                                                <div className="accordion-body">
                                                    Yes
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tab-pane  bg_transparent" id="preferences" role="tabpanel"
                                     aria-labelledby="preferences-tab">
                                    <div className="accordion" id="accordionExample3">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingOne11">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseOne11"
                                                        aria-expanded="true" aria-controls="collapseOne11">
                                                    Can I request Documents from more than one people at a same time?
                                                </button>
                                            </h2>
                                            <div id="collapseOne11" className="accordion-collapse collapse"
                                                 aria-labelledby="headingOne11" data-bs-parent="#accordionExample3">
                                                <div className="accordion-body">
                                                    Yes, Definitely you can do.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingTwo22">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseTwo22"
                                                        aria-expanded="false" aria-controls="collapseTwo22">
                                                    How many Documents & Recipients can I add in one Envelope?
                                                </button>
                                            </h2>
                                            <div id="collapseTwo22" className="accordion-collapse collapse"
                                                 aria-labelledby="headingTwo22" data-bs-parent="#accordionExample3">
                                                <div className="accordion-body">
                                                    Unlimited
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingThree33">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseThree33"
                                                        aria-expanded="false" aria-controls="collapseThree33">
                                                    Does DocuTick Integrated with any cloud Application?
                                                </button>
                                            </h2>
                                            <div id="collapseThree33" className="accordion-collapse collapse"
                                                 aria-labelledby="headingThree33" data-bs-parent="#accordionExample3">
                                                <div className="accordion-body">
                                                    Yes we are continue integrating with other Applications. Currently
                                                    we are integrated with OneDrive.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingFour44">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseFour44"
                                                        aria-expanded="false" aria-controls="collapseFour44">
                                                    After buying a plan, Can I get refund?
                                                </button>
                                            </h2>
                                            <div id="collapseFour44" className="accordion-collapse collapse"
                                                 aria-labelledby="headingFour44" data-bs-parent="#accordionExample3">
                                                <div className="accordion-body">
                                                    Unfortunately No, we cannot refund.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingFive55">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseFive55"
                                                        aria-expanded="false" aria-controls="collapseFive55">
                                                    How to cancel my plan?
                                                </button>
                                            </h2>
                                            <div id="collapseFive55" className="accordion-collapse collapse"
                                                 aria-labelledby="headingFive55" data-bs-parent="#accordionExample3">
                                                <div className="accordion-body">
                                                    Please login in with your account details and click on Billing and
                                                    cancel the Subscription.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tab-pane bg_transparent " id="integration" role="tabpanel"
                                     aria-labelledby="integration-tab">
                                    <div className="accordion" id="accordionExample4">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="heading111">
                                                <button className="accordion-button collapsed" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapse111"
                                                        aria-expanded="true" aria-controls="collapse111">
                                                    How secure is DocuTick?
                                                </button>
                                            </h2>
                                            <div id="collapse111" className="accordion-collapse collapse"
                                                 aria-labelledby="heading111" data-bs-parent="#accordionExample4">
                                                <div className="accordion-body">
                                                    DocuTick using Bank Graded security. Your documents are stored on
                                                    world No 1 cloud service provider AWS.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Faq;