import React from "react";
import {useNavigate} from "react-router-dom";
import ProductFeatures from "../partials/ProductFeatures";
import Testimonial from "../partials/Testimonial";
import {Lang} from "../../../lang";

function Product() {
    const navigate = useNavigate();

    document.title = Lang.product_title;
    document.getElementsByTagName("META")[4].content = Lang.product_meta_desc;
    document.getElementsByTagName("META")[5].content = Lang.product_meta_keyword;

    const handleSignUp = (e) => {
        e.preventDefault();
        navigate('/sign-up');
    };

    return (
        <div className="p-0" style={{minHeight: 'calc(100vh - 401px)'}}>
            <div className="title_container bg-primary px-4 py-5">
                <h1 className="text-dark text-center mb-3">Product</h1>
                <p className="text-dark text-center">DocuTick is a powerful all-in-one software solution for document
                    collection and information management. Now NO more client chase-ups.</p>
            </div>

            <div className="custom_container product_page">
                <div className="row my-5">
                    <div className="col-md-6 order-2 order-md-1">
                        <h2 className="text-dark  mb-4">An Automated Document Collection Platform</h2>
                        <p>DocuTick's intuitive user interface makes document management easy for any business. No more
                            paper documentation processes. Make it quick and easy with this innovative electronic
                            document management system.</p>
                        <ul className="ms-3" style={{listStyle: 'none'}}>
                            <li className="mb-4">
                                <i className="fa fa-arrow-right me-3" aria-hidden="true"/> Create Customized
                                Document Collection Request – You can create your document collection request right from
                                scratch or make use of DocutTick’s premade templates.
                            </li>
                            <li className="mb-4">
                                <i className="fa fa-arrow-right me-3" aria-hidden="true"/> Single-Click Uploading
                                Process – Each document shows real-time status of the document status – what is pending
                                and what has been uploaded. With just a single click, the clients can upload the
                                required documents based on the status shown.
                            </li>
                            <li className="mb-4">
                                <i className="fa fa-arrow-right me-3" aria-hidden="true"/> Quick Document Capture and
                                Automation – Uploaded documents from your clients can be directly received on DocuTick.
                                Document capture enables you to approve or reject as needed, and store the documents on
                                DocuTick or Cloud Apps.
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-6 order-1 order-md-2">
                        <div className="image_wrap">
                            <img src="/images/usecases.png" alt="..."/>
                        </div>
                    </div>
                </div>
                <div className="row my-5">
                    <div className="col-md-6">
                        <div className="image_wrap">
                            <img src="/images/usecases-1.png" alt="..."/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h2 className="text-dark  mt-0 mt-lg-5 mb-4">A platform that delivers real results</h2>
                        <p className="mb-4">An interactive document collection platform that wins user delight and
                            enhances document management.</p>
                        <p className="mb-4">Bring all your document collection requirements in one place with a
                            full-stack solution.</p>
                    </div>
                </div>
                <div className="row my-5">
                    <div className="col-md-6 order-2 order-md-1">
                        <h2 className="text-dark  mb-4">Integrated Client Information Collection</h2>
                        <ul className="ps-3 ms-3">
                            <li className=" mb-4">You have option to collects information while sending document
                                collection request. This is a single solution for all your request form building and
                                document collection requirements.
                            </li>
                            <li className=" mb-4">Comes with multiple options such as single choice, multiple choice
                                question, drop-down menu and much more added features in the request form for collecting
                                information from clients.
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-6 order-1 order-md-2">
                        <div className="image_wrap">
                            <img src="/images/usecases.png" alt="..."/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="custom_container-fluid py-5" style={{backgroundColor: '#f6f9fc'}}>
                <h2 className="text-dark text-center mb-4">Advantages of using Docutick</h2>
                <h4 className="text-dark text-center mb-4">Automate your document & information collection With
                    DocuTick.</h4>
                <p className=" text-center mt-3 mx-auto mb-4" style={{maxWidth: '750px', width: '100%'}}>You can
                    automate and streamline the entire workflow involved with your organization’s document collection
                    processes with DocuTick.</p>
                <div className="custom_container my-5">
                    <div className="row gy-5">
                        <div className="col-lg-4 col-md-6">
                            <div className="w-100 py-3 bg-white d-flex align-items-center justify-content-center"
                                 style={{borderRadius: '25px'}}>
                                <img src="/images/product-name.png" alt="..."/>
                            </div>
                            <div className="px-2">
                                <h4 className="text-dark text-center my-4">Easily Collect Documents, Review, Approve &
                                    Store</h4>
                                <p className="text-center">Easily create envelope and send it to clients for uploading
                                    documents. You can use Templates to repeat use of the same envelope. You can Approve
                                    & reject documents on DocuTick</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="w-100 py-3 bg-white d-flex align-items-center justify-content-center"
                                 style={{borderRadius: '25px'}}>
                                <img src="/images/product-name.png" alt="..."/>
                            </div>
                            <div className="px-2">
                                <h4 className="text-dark text-center my-4">Highly Professional and Feature-Rich Client
                                    Portal</h4>
                                <p className="text-center">Simple yet professional portal for clients to upload the
                                    documents. Added convenience of uploading documents through mobile phones.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="w-100 py-3 bg-white d-flex align-items-center justify-content-center"
                                 style={{borderRadius: '25px'}}>
                                <img src="/images/product-name.png" alt="..."/>
                            </div>
                            <div className="px-2">
                                <h4 className="text-dark text-center my-4">Automatically Chase Up Documents</h4>
                                <p className="text-center">Simply set a Reminder while creating and sending the
                                    envelope. Our system will chase up with the client for collecting documents</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="w-100 py-3 bg-white d-flex align-items-center justify-content-center"
                                 style={{borderRadius: '25px'}}>
                                <img src="/images/product-name.png" alt="..."/>
                            </div>
                            <div className="px-2">
                                <h4 className="text-dark text-center my-4">Bank-Grade Security & AWS Storage
                                    Feature</h4>
                                <p className="text-center">All documents are encrypted with bank-graded security and we
                                    are hosted on the world’s No 1 platform of Amazon Web Service (AWS)</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="w-100 py-3 bg-white d-flex align-items-center justify-content-center"
                                 style={{borderRadius: '25px'}}>
                                <img src="/images/product-name.png" alt="..."/>
                            </div>
                            <div className="px-2">
                                <h4 className="text-dark text-center my-4">Automated Naming Convention</h4>
                                <p className="text-center">Just let us know the name convention style you require while
                                    creating and Envelope request. And we will collect the Document with the naming
                                    convention of your choice.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="w-100 py-3 bg-white d-flex align-items-center justify-content-center"
                                 style={{borderRadius: '25px'}}>
                                <img src="/images/product-name.png" alt="..."/>
                            </div>
                            <div className="px-2">
                                <h4 className="text-dark text-center my-4">Saves Documents Automatically</h4>
                                <p className="text-center">We will automatically save document as received on DocuTick
                                    and cloud Apps. It is very easy & fully automated.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProductFeatures/>

            <Testimonial/>

            <div className="custom_container my-5">
                <div className="  px-4 py-5  border_radius flexWrap bg-primary text-center">
                    <h2 className="text-white me-4 text-center mb-3">Have any Query? Talk to our Support Team.</h2>
                    <p className="mb-3 text-white">Thousand+ Clients all over the world use DocuTick.</p>
                    <button onClick={handleSignUp} type="button" className="btn book-now bg-white text-primary">
                        Try For Free
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Product;