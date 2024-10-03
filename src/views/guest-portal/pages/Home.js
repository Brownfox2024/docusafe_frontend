import React from "react";
import {NavLink, useNavigate} from "react-router-dom";
import ProductFeatures from "../partials/ProductFeatures";
import Testimonial from "../partials/Testimonial";
import {Lang} from "../../../lang";

function HomePage() {
    const navigate = useNavigate();

    document.title = Lang.homepage_title;
    document.getElementsByTagName("META")[4].content = Lang.homepage_meta_desc;
    document.getElementsByTagName("META")[5].content = Lang.homepage_meta_keyword;

    const handleSignUp = (e) => {
        e.preventDefault();
        navigate('/sign-up');
    };

    return (
        <div className="p-0" style={{minHeight: 'calc(100vh - 401px)'}}>
            <div className="container-fluid" style={{maxWidth: '1600px', width: '100%'}}>
                <div className="row py-5">
                    <div className="col-md-12  d-flex align-items-center justify-content-center  my-4 my-md-0">
                        <div className=" flex-column ms-xxl-0 d-flex align-items-center docutik_home_banner">
                            <h1 className="text-dark text-center  mb-5">Visualise Your Document Collection <span
                                className="text-primary d-block">DocuTick works. Emails don’t.</span>
                            </h1>
                            <ul className="checked_section mb-5">
                                <li className="mb-3"><i className="fa fa-check" aria-hidden="true"/>Request list of
                                    Documents & Information from your clients
                                </li>
                                <li className="mb-3"><i className="fa fa-check" aria-hidden="true"/>Pay when client
                                    upload at least one document in Request
                                </li>
                                <li className="mb-3"><i className="fa fa-check" aria-hidden="true"/>Bank-grade security
                                    and Stored on Amazon cloud AWS
                                </li>
                            </ul>
                            <div
                                className="d-flex flex-wrap align-items-center justify-content-center get_started mb-5">
                                <button type="button" onClick={handleSignUp}
                                        className="btn book-now bg-dark text-white">Get Started
                                </button>
                            </div>
                            <div
                                className="d-flex flex-wrap align-items-center justify-content-center get_started_video mb-5">
                                <iframe src="https://www.youtube.com/embed/oBwpG_t_a7g"
                                        title="YouTube video player" frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen/>
                            </div>
                            <ul className="box_ul">
                                <li className="mb-3">Collect Documents 85% faster from your clients</li>
                                <li className="mb-3">No Credit card Required, Try For Free</li>
                                <li className="mb-3">Manage Requests. Review Documents - Approve or Reject Documents
                                </li>
                                <li className="mb-3">Collect Data or information with Documents too</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 mt-5 text-center">
                        <h1 className="text-dark text-center mb-3">Explore why DocuTick is the first choice for
                            businesses!</h1>
                    </div>
                </div>
            </div>
            <div className="custom_container container tabing_client_portal">
                <div className=" rounded-5 home-page gradient-bg-div">
                    <div className="row my-5 px-2 px-sm-3 px-lg-5 py-sm-4 py-lg-5 py-4 ">
                        <div className="col-lg-12 d-flex align-items-start justify-content-center">
                            <div className="py-3">
                                <ul className="nav nav-tabs justify-content-sm-start  justify-content-lg-between w_42">
                                    <li className="nav-item mx-2" style={{listStyle: 'none'}}>
                                        <a data-bs-toggle="tab" href="#InvitePage"
                                           className="nav-link active text-dark px-0">
                                            <b>Invite Page</b>
                                        </a>
                                    </li>
                                    <li className="nav-item mx-2" style={{listStyle: 'none'}}>
                                        <a data-bs-toggle="tab" href="#ClientPorta"
                                           className="nav-link  text-dark px-0">
                                            <b>Client Portal</b>
                                        </a>
                                    </li>
                                    <li className="nav-item mx-2" style={{listStyle: 'none'}}>
                                        <a data-bs-toggle="tab" href="#CheckingPage"
                                           className="nav-link  text-dark px-0">
                                            <b>Manage Page</b>
                                        </a>
                                    </li>
                                </ul>
                                <div className="tab-content mt-5">
                                    <div id="InvitePage" className="tab-pane  active">
                                        <div className="row">
                                            <div className="col-lg-5">
                                                <h2 className="text-dark text-center text-sm-start mb-3">Explore Request
                                                    Document page</h2>
                                                <p className="text-center text-center text-sm-start">This is the one of
                                                    the page to show you that how our Request Document page looks like.
                                                    You can create envelope and simply follow the steps to send envelope
                                                    request. You can click on Try For Free and Explore DocuTick. </p>
                                                <button type="button" onClick={handleSignUp}
                                                        className="btn book-now bg-primary text-white my-4 d-flex mx-auto mx-sm-0">
                                                    Try For Free
                                                </button>
                                            </div>
                                            <div className="col-lg-7">
                                                <div className="image_wrap">
                                                    <img src="/images/home-1.png" alt="..."/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="ClientPorta" className="tab-pane ">
                                        <div className="row">
                                            <div className="col-lg-5">
                                                <h2 className="text-dark text-center text-sm-start mb-3">Explore Client
                                                    portal page</h2>
                                                <p className="text-center text-center text-sm-start">Client portal page
                                                    allows your clients to upload the Documents, send messages directly
                                                    to you. Click can upload the documents from web or their phone too.
                                                    Documents automatically stored on the client portal once they
                                                    upload. You can Approve or reject the Documents. Simply click on Try
                                                    For Free & try it now. </p>
                                                <button type="button" onClick={handleSignUp}
                                                        className="btn book-now bg-primary text-white my-4 d-flex mx-auto mx-sm-0">
                                                    Try For Free
                                                </button>
                                            </div>
                                            <div className="col-lg-7">
                                                <div className="image_wrap bg">
                                                    <img src="/images/client-portal.png" alt="..."
                                                         className="shadow-sm"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="CheckingPage" className="tab-pane">
                                        <div className="row">
                                            <div className="col-lg-5">
                                                <h2 className="text-dark text-center text-sm-start mb-3">Explore
                                                    Documents manage page</h2>
                                                <p className="text-center text-center text-sm-start">Manage page allows
                                                    you to manage the clients Documents. You can see how many documents
                                                    are uploaded and how many documents are pending for upload by your
                                                    clients. You can also approve and reject the Documents from manage.
                                                    Explore more features of manage page by simply clicking on Try For
                                                    Free.</p>
                                                <button type="button" onClick={handleSignUp}
                                                        className="btn book-now bg-primary text-white my-4 d-flex mx-auto mx-sm-0">
                                                    Try For Free
                                                </button>
                                            </div>
                                            <div className="col-lg-7">
                                                <div className="image_wrap bg">
                                                    <img src="/images/home-3.png" alt="..." className="shadow-sm"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProductFeatures/>

            <div className="custom_container-fluid product py-5" style={{backgroundColor: '#f6f9fc'}}>
                <h2 className="text-dark text-center mb-1">How it Works</h2>
                <h4 className="text-dark text-center mb-1">3 Envelopes Free / Month</h4>
                <p className="text-center mb-5">Follow these easy steps to start with DocuTick:</p>
                <div className="custom_container">
                    <div className="row py-4">
                        <div className="col-md-6 ">
                            <div className="mb-3 mb-md-0 image_wrap">
                                <img src="/images/product-1.png" alt="..."/>
                            </div>
                        </div>
                        <div className="col-md-6 d-md-flex justify-content-end align-items-center">
                            <div className="">
                                <div className="px-3 py-2 mb-4 rounded-3 d-flex mx-auto mx-md-0"
                                     style={{backgroundColor: '#0069f7', width: 'fit-content'}}>
                                    <p onClick={handleSignUp} className="cur-pointer text-white">
                                        <b>Try For Free</b>
                                    </p>
                                </div>
                                <h2 className="text-dark text-center text-md-start  mb-4 mb-md-4">1. Sign Up</h2>
                                <ul>
                                    <li>Click on the ‘Try For Free’ button – It’s totally free. No credit cards are
                                        required.
                                    </li>
                                    <li>Just enter your basic details and create your account. Your sign-up process is
                                        done!
                                    </li>
                                    <li>Get 3 Envelopes free/month.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row py-4">
                        <div className="col-md-6 order-2 order-md-1 d-md-flex justify-content-start align-items-center">
                            <div className="">
                                <div className="px-3 py-2 mb-4 rounded-3 d-flex mx-auto mx-md-0"
                                     style={{backgroundColor: '#0069f7', width: 'fit-content'}}>
                                    <p className="text-white"><b>Request Documents</b></p>
                                </div>
                                <h2 className="text-dark text-center text-md-start  mb-4 mb-md-4">2. Create
                                    Envelope</h2>
                                <p className="mb-0 mb-md-5 text-center text-md-start">Build your own customized envelop
                                    or use pre-made templates. Once you are ready with your envelope, you get the
                                    convenience to add recipients, documents, and forms within it for collection.</p>
                            </div>
                        </div>
                        <div className="col-md-6 order-1 order-md-2">
                            <div className="mb-3 mb-md-0 image_wrap">
                                <img src="/images/product-4.png" alt="..."/>
                            </div>
                        </div>
                    </div>
                    <div className="row py-4">
                        <div className="col-md-6 ">
                            <div className="mb-3 mb-md-0 image_wrap">
                                <img src="/images/product-2.png" alt="..."/>
                            </div>
                        </div>
                        <div className="col-md-6 d-md-flex  justify-content-end align-items-center">
                            <div className="">
                                <div className="px-3 py-2 mb-4 rounded-3 d-flex mx-auto mx-md-0"
                                     style={{backgroundColor: '#0069f7', width: 'fit-content'}}>
                                    <p className="text-white"><b>Client Upload Portal</b></p>
                                </div>
                                <h2 className="text-dark text-center text-md-start  mb-4 mb-md-4">3. Client Upload
                                    Portal</h2>
                                <p className="mb-0 mb-md-5 text-center text-md-start">DocuTick provides space for
                                    uploading documents. The clients will be intimated through SMS or email for
                                    uploading documents. Uploaded documents are stored directly within the client
                                    portal.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row py-4">
                        <div className="col-md-6 order-2 order-md-1 d-md-flex justify-content-start align-items-center">
                            <div className="">
                                <div className="px-3 py-2 mb-4 rounded-3 d-flex mx-auto mx-md-0"
                                     style={{backgroundColor: '#0069f7', width: 'fit-content'}}>
                                    <p className="text-white"><b>Review & Complete</b></p>
                                </div>
                                <h2 className="text-dark text-center text-md-start  mb-4 mb-md-4">4. Review and
                                    Finalize</h2>
                                <p className="mb-0 mb-md-5 text-center text-md-start">You will have the convenience of
                                    reviewing the received documents from your DocuTick account, where you can decide on
                                    its approval. You also have a space to provide reasons for rejecting any document.
                                    Once all tasks are done, the envelop will be moved to ‘completed’ status.</p>
                            </div>
                        </div>
                        <div className="col-md-6 order-1 order-md-2">
                            <div className="mb-3 mb-md-0 image_wrap">
                                <img src="/images/product-3.png" alt="..."/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container custom_container py-5 use-cases-section bg-white">
                <div className="d-flex align-items-center justify-content-center flex-column">
                    <h2 className="text-dark text-center mb-5">USE CASES</h2>
                    <p className="text-center mb-3" style={{maxWidth: '718px', width: '100%'}}>Say goodbye to those
                        time-consuming document collection tasks through emails. Collecting documents through
                        traditional means may not obtain the desired results for you. There should always be a better
                        way out, and that’s the DocuTick WAY!</p>
                    <p className="text-center" style={{maxWidth: '718px', width: '100%'}}>Paperless document is a prime
                        consideration for businesses for easy workflow management. With all its added features, DocuTick
                        can be of great asset for organizations.</p>
                </div>
                <div className="row gx-2 gx-lg-5 gy-4 my-5">
                    <div className="col-md-6">
                        <div className="d-flex">
                            <div className="" style={{width: '70px'}}>
                                <div
                                    className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center "
                                    style={{height: '63px', width: '63px'}}>
                                    <img src="/images/trader.svg" alt="..." style={{maxWidth: '60%'}}/>
                                </div>
                            </div>
                            <div className=" mx-3 d-flex align-items-start justify-content-center flex-column"
                                 style={{width: 'calc(100% - 70px)'}}>
                                <h4 className="text-dark mb-2">Lenders & Brokers</h4>
                                <p>During financial transactions or loan application processes, for lenders and brokers,
                                    the tool will be of great help in gathering and managing documents from their
                                    borrowers. It allows you to streamline and simplify the entire process by
                                    efficiently collecting and organizing client documents professionally.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex">
                            <div className="" style={{width: '70px'}}>
                                <div
                                    className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center "
                                    style={{height: '63px', width: '63px'}}>
                                    <img src="/images/accounting.svg " alt="..." style={{maxWidth: '60%'}}/>
                                </div>
                            </div>
                            <div className=" mx-3 d-flex align-items-start justify-content-center flex-column"
                                 style={{width: 'calc(100% - 70px)'}}>
                                <h4 className="text-dark mb-2">Accountant & Tax Professionals</h4>
                                <p>DocuTick serves as a secure document collection platform for accountant and tax
                                    professionals, particularly during their financial reporting periods and tax
                                    collection seasons. It optimizes document collection, enhances data accuracy and
                                    facilitates client interactions.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex">
                            <div className="" style={{width: '70px'}}>
                                <div
                                    className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center "
                                    style={{height: '63px', width: '63px'}}>
                                    <img src="/images/employment.svg" alt="..." style={{maxWidth: '60%'}}/>
                                </div>
                            </div>
                            <div className=" mx-3 d-flex align-items-start justify-content-center flex-column"
                                 style={{width: 'calc(100% - 70px)'}}>
                                <h4 className="text-dark mb-2">Human Resources</h4>
                                <p>Our document collection software becomes handy for HR professionals in handling their
                                    loaded job applications and employee documents during their work process. The tool
                                    will simplify the tasks, as well as, enhance overall efficiency and data
                                    accuracy.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex">
                            <div className="" style={{width: '70px'}}>
                                <div
                                    className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center "
                                    style={{height: '63px', width: '63px'}}>
                                    <img src="/images/passport.svg" alt="..." style={{maxWidth: '60%'}}/>
                                </div>
                            </div>
                            <div className=" mx-3 d-flex align-items-start justify-content-center flex-column"
                                 style={{width: 'calc(100% - 70px)'}}>
                                <h4 className="text-dark mb-2">Immigration Agents</h4>
                                <p>Whether it is to collect documents from the clients or to verify the received
                                    documents’ compliance with immigration regulations, DocuTick can provide immigration
                                    agents an efficient way of document management.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex">
                            <div className="" style={{width: '70px'}}>
                                <div
                                    className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center "
                                    style={{height: '63px', width: '63px'}}>
                                    <img src="/images/graduation-cap.svg" alt="..." style={{maxWidth: '60%'}}/>
                                </div>
                            </div>
                            <div className=" mx-3 d-flex align-items-start justify-content-center flex-column"
                                 style={{width: 'calc(100% - 70px)'}}>
                                <h4 className="text-dark mb-2">Educational Institutes</h4>
                                <p>Admission application, enrollment management, collaboration with departments and all
                                    those related administrative tasks which educational institutions handle on a daily
                                    basis will be efficiently and professionally performed with the help of
                                    DocuTick.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex">
                            <div className="" style={{width: '70px'}}>
                                <div
                                    className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center "
                                    style={{height: '63px', width: '63px'}}>
                                    <img src="/images/audit.svg" alt="..." style={{maxWidth: '60%'}}/>
                                </div>
                            </div>
                            <div className=" mx-3 d-flex align-items-start justify-content-center flex-column"
                                 style={{width: 'calc(100% - 70px)'}}>
                                <h4 className="text-dark mb-2">Auditors</h4>
                                <p>DocuTick allows auditors to optimize their document management processes during audit
                                    engagements, streamline audit workflow, reduce efforts of manual data entry and
                                    minimize errors.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-center">
                    <NavLink to={'/use-cases'} className="text-primary">
                        <b>Learn More <i className="fa fa-long-arrow-right" aria-hidden="true"/></b>
                    </NavLink>
                </p>
            </div>

            <div className="container-fluid product py-5" style={{backgroundColor: '#f6f9fc'}}>
                <div className="custom_container">
                    <div className="row rounded-4 overflow-hidden">
                        <div className="col-md-6 p-lg-5 p-3 pt-5" style={{backgroundColor: '#2b84fc'}}>
                            <h2 className="text-white  mb-4">Traditional Way</h2>
                            <p className="text-white">Collect Documents Via Email – very time consuming & manually
                                process</p>
                            <div className="row gx-2 gx-lg-5 gy-4 my-5">
                                <div className="col-12">
                                    <div className="d-flex">
                                        <div className="" style={{width: '60px'}}>
                                            <img src="/images/home-cancel.svg" alt="..."/>
                                        </div>
                                        <div
                                            className="mx-3 d-flex align-items-start justify-content-center flex-column"
                                            style={{width: 'calc(100% - 60px)'}}>
                                            <h4 className="text-white mb-2">Collect documents in email:</h4>
                                            <p className="text-white">Documents are sent via email, which is a
                                                time-consuming and tedious tasks. Sometimes multiple documents or huge
                                                files cannot be sent at a stretch, but one-by-one.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-flex">
                                        <div className="" style={{width: '60px'}}>
                                            <img src="/images/home-cancel.svg" alt="..."/>
                                        </div>
                                        <div
                                            className=" mx-3 d-flex align-items-start justify-content-center flex-column"
                                            style={{width: 'calc(100% - 60px)'}}>
                                            <h4 className="text-white mb-2">Verifying documents manually:</h4>
                                            <p className="text-white">It is a very tiring task to go over documents one
                                                after the other, for checking what is pending and missing.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-flex">
                                        <div className="" style={{width: '60px'}}>
                                            <img src="/images/home-cancel.svg" alt="..."/>
                                        </div>
                                        <div
                                            className=" mx-3 d-flex align-items-start justify-content-center flex-column"
                                            style={{width: 'calc(100% - 60px)'}}>
                                            <h4 className="text-white mb-2">Document naming individually:</h4>
                                            <p className="text-white">Naming each document differently than as
                                                received.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-flex">
                                        <div className="" style={{width: '60px'}}>
                                            <img src="/images/home-cancel.svg" alt="..."/>
                                        </div>
                                        <div
                                            className=" mx-3 d-flex align-items-start justify-content-center flex-column"
                                            style={{width: 'calc(100% - 60px)'}}>
                                            <h4 className="text-white mb-2">Manually save documents:</h4>
                                            <p className="text-white">Save documents one by one, as received. Chances of
                                                missing documents are high in this process.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 p-lg-5 p-3 pt-5  bg-primary">
                            <h2 className="text-white  mb-4">DocuTick Way</h2>
                            <p className="text-white">Collect Documents with DocuTick – Set & forget, our system will
                                automatically chase up the documents</p>
                            <div className="row gx-2 gx-lg-5 gy-4 my-5">
                                <div className="col-12">
                                    <div className="d-flex">
                                        <div className="" style={{width: '60px'}}>
                                            <img src="/images/home-true.svg" alt="..."/>
                                        </div>
                                        <div
                                            className=" mx-3 d-flex align-items-start justify-content-center flex-column"
                                            style={{width: 'calc(100% - 60px)'}}>
                                            <h4 className="text-white mb-2">Simplified document collection</h4>
                                            <p className="text-white">Allows you to easily create envelop for your
                                                clients to upload their documents with ease. It also gives you the
                                                convenience to approve, reject and store the documents in this
                                                platform.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-flex">
                                        <div className="" style={{width: '60px'}}>
                                            <img src="/images/home-true.svg" alt="..."/>
                                        </div>
                                        <div
                                            className=" mx-3 d-flex align-items-start justify-content-center flex-column"
                                            style={{width: 'calc(100% - 60px)'}}>
                                            <h4 className="text-white mb-2">Professional client portal</h4>
                                            <p className="text-white">DocuTick provides a convenient client portal for
                                                your clients where they can directly upload their request documents.
                                                Documents can be uploaded even through mobile phones.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-flex">
                                        <div className="" style={{width: '60px'}}>
                                            <img src="/images/home-true.svg" alt="..."/>
                                        </div>
                                        <div
                                            className=" mx-3 d-flex align-items-start justify-content-center flex-column"
                                            style={{width: 'calc(100% - 60px)'}}>
                                            <h4 className="text-white mb-2">Automated documents follow up</h4>
                                            <p className="text-white">The tool can set automated reminders for chasing
                                                pending documents and deadlines.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-flex">
                                        <div className="" style={{width: '60px'}}>
                                            <img src="/images/home-true.svg" alt="..."/>
                                        </div>
                                        <div
                                            className=" mx-3 d-flex align-items-start justify-content-center flex-column"
                                            style={{width: 'calc(100% - 60px)'}}>
                                            <h4 className="text-white mb-2">Bank-grade security & AWS storage</h4>
                                            <p className="text-white">Strong data security measures are implemented with
                                                bank-graded security for the documents. Guaranteed secure storage on
                                                world’s no.1 platform, Amazon Web Services.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-center flex-column">
                        <h2 className="text-dark text-center my-4 ">Don't Miss Out On DocuTick's Easy Start</h2>
                        <button onClick={handleSignUp} type="button" className="btn book-now bg-primary text-white ">
                            3 Envelopes Free/Month
                        </button>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row">
                    <div className="col-md-6 d-flex align-items-center justify-content-center flex-column">
                        <div
                            className="d-flex  align-items-center align-items-md-start justify-content-center flex-column">
                            <div className="px-3 py-2 mb-3 rounded-3"
                                 style={{backgroundColor: '#e6f0ff', width: 'fit-content'}}>
                                <p className="text-dark text-center text-md-start"><b>INTEGRATION</b></p>
                            </div>
                            <h2 className="text-dark my-4 display-5 text-center text-md-start">DocuTick’s Integration
                                with Cloud Apps</h2>
                            <p className="mb-3 text-center text-md-start">DocuTick keeps integrating with various cloud
                                apps. GoogleDrive and OneDrive are some of our successful cloud app integrations. Our
                                seamless integration process keeps your documents automatically synchronized at a single
                                location. As a result, manual document uploads are no more a requirement.</p>
                            <NavLink to={"/integration"} className="text-primary">
                                <b>Learn More <i className="fa fa-long-arrow-right" aria-hidden="true"/></b>
                            </NavLink>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="image_wrap">
                            <img src="/images/home-2.png" alt="..."/>
                        </div>
                    </div>
                </div>
            </div>

            <Testimonial/>

            <div className="container custom_container py-5 use-cases-section bg-white">
                <div className="d-flex align-items-center justify-content-center flex-column">
                    <h2 className="text-dark text-center ">Have Question?</h2>
                </div>
                <div className="row gx-2 gx-lg-5 gy-4 my-5">
                    <div className="col-md-6">
                        <div className="d-flex">
                            <div className="" style={{width: '20px'}}>
                                <img src="/images/questionmark.svg" alt="..."/>
                            </div>
                            <div className=" mx-2 d-flex align-items-start justify-content-center flex-column"
                                 style={{width: 'calc(100% - 20px)'}}>
                                <h5 className="text-dark mb-2">How to Start with DocuTick ?</h5>
                                <p>Simply click on Try For Free and create your account with us. No credit card
                                    required. You will get 3 Envelopes for Trail.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex">
                            <div className="" style={{width: '20px'}}>
                                <img src="/images/questionmark.svg" alt="..."/>
                            </div>
                            <div className=" mx-2 d-flex align-items-start justify-content-center flex-column"
                                 style={{width: 'calc(100% - 20px)'}}>
                                <h5 className="text-dark mb-2">What is Envelope ?</h5>
                                <p>Envelope is a set of Documents. Create an Envelope and add list of Documents in
                                    Envelopes for collection of Documents.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex">
                            <div className="" style={{width: '20px'}}>
                                <img src="/images/questionmark.svg" alt="..."/>
                            </div>
                            <div className=" mx-2 d-flex align-items-start justify-content-center flex-column"
                                 style={{width: 'calc(100% - 20px)'}}>
                                <h5 className="text-dark mb-2">What is Templates ?</h5>
                                <p>Templates are your previous envelopes & you want to use is again. Start with Template
                                    and edit them as needed.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex">
                            <div className="" style={{width: '20px'}}>
                                <img src="/images/questionmark.svg" alt="..."/>
                            </div>
                            <div className=" mx-2 d-flex align-items-start justify-content-center flex-column"
                                 style={{width: 'calc(100% - 20px)'}}>
                                <h5 className="text-dark mb-2">How secure is DocuTick ?</h5>
                                <p>DocuTick using Bank-grade security. Your documents are stored on world No 1 cloud
                                    service provider AWS.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-center">
                    <NavLink to={"/faq"} className="text-primary">
                        <b>Learn More <i className="fa fa-long-arrow-right" aria-hidden="true"/></b>
                    </NavLink>
                </p>
            </div>
            <div className="custom_container my-5">
                <div className="  px-4 py-lg-4 py-5  border_radius  gradient-bg-div text-center">
                    <h2 className="text-dark me-4 text-center mb-3">Thousand + Customers have Docutick.Try it now!</h2>
                    <p className="mb-3 text-dark">No credit card | Cancel at any time</p>
                    <button onClick={handleSignUp} type="button" className="btn book-now bg-primary text-white">
                        3 Envelopes Free/Month
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;