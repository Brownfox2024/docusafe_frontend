import React from "react";

function ProductFeatures() {
    return (
        <div className="custom_container  my-5 py-5">
            <div className="row gy-4">
                <div className="col-lg-4 col-sm-12">
                    <div
                        className="d-flex align-items-center align-items-lg-start justify-content-center flex-column h-100 pb-3 pb-lg-0">
                        <div className="px-3 py-2 rounded-3 mb-3"
                             style={{backgroundColor: '#e6f0ff', width: 'fit-content'}}>
                            <p className="text-dark"><b>PRODUCT FEATURES</b></p>
                        </div>
                        <h2 className="text-dark text-center text-sm-start display-6">PRODUCT FEATURES</h2>
                    </div>
                </div>
                <div className="col-lg-4 col-sm-6">
                    <div
                        className="d-flex align-items-center product_div flex-column p-lg-4 p-sm-3 py-5 px-4 border border-3 rounded-4"
                        ref={(el) => el && el.style.setProperty('border-color', '#d6e7ff', "important")}>
                        <div
                            className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center"
                            style={{height: '73px', width: '73px'}}>
                            <img src="/images/driver-license.svg" alt="..." style={{maxWidth: '60%'}}/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <h4 className="text-dark mb-4">Request Document Dashboard</h4>
                            <p className="text-center">Create customized document request lists and send them to
                                multiple recipients with a single click from the ‘Request Document’ dashboard.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-sm-6">
                    <div
                        className="d-flex align-items-center product_div flex-column p-lg-4 p-sm-3 py-5 px-4 border border-3 rounded-4"
                        ref={(el) => el && el.style.setProperty('border-color', '#d6e7ff', "important")}>
                        <div
                            className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center "
                            style={{height: '73px', width: '73px'}}>
                            <img src="/images/mail.svg" alt="..." style={{maxWidth: '60%'}}/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <h4 className="text-dark mb-4">Request Data Form</h4>
                            <p className="text-center">You can build your own data collection form with a tailored
                                questionnaire and survey to gather specific information from your clients.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-sm-6">
                    <div
                        className="d-flex align-items-center product_div flex-column p-lg-4 p-sm-3 py-5 px-4 border border-3 rounded-4"
                        ref={(el) => el && el.style.setProperty('border-color', '#d6e7ff', "important")}>
                        <div
                            className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center "
                            style={{height: '73px', width: '73px'}}>
                            <img src="images/website-design.svg" alt="..." style={{maxWidth: '60%'}}/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <h4 className="text-dark mb-4">Client Upload Portal</h4>
                            <p className="text-center">It provides a designated space for your clients to conveniently
                                and securely upload their requested documents and files. No need to sign up or
                                register.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-sm-6">
                    <div
                        className="d-flex align-items-center product_div flex-column p-lg-4 p-sm-3 py-5 px-4 border border-3 rounded-4"
                        ref={(el) => el && el.style.setProperty('border-color', '#d6e7ff', "important")}>
                        <div
                            className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center "
                            style={{height: '73px', width: '73px'}}>
                            <img src="/images/approve.svg" alt="..." style={{maxWidth: '60%'}}/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <h4 className="text-dark mb-4">Review</h4>
                            <p className="text-center">Easily review received information by performing the review
                                process online. Resubmission option is available for the rejected documents. Clients can
                                rectify the issue & upload the documents again.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-sm-6">
                    <div
                        className="d-flex align-items-center product_div flex-column p-lg-4 p-sm-3 py-5 px-4 border border-3 rounded-4"
                        ref={(el) => el && el.style.setProperty('border-color', '#d6e7ff', "important")}>
                        <div
                            className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center "
                            style={{height: '73px', width: '73px'}}>
                            <img src="/images/cloud-computing.svg" alt="..." style={{maxWidth: '60%'}}/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <h4 className="text-dark mb-4">Document Storage</h4>
                            <p className="text-center">You have the option to store your received documents in a
                                centralized location in DocuTick, or save them in a cloud platform of your choice.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-sm-6">
                    <div
                        className="d-flex align-items-center product_div flex-column p-lg-4 p-sm-3 py-5 px-4 border border-3 rounded-4"
                        ref={(el) => el && el.style.setProperty('border-color', '#d6e7ff', "important")}>
                        <div
                            className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center"
                            style={{height: '73px', width: '73px'}}>
                            <img src="/images/bell.svg" alt="..." style={{maxWidth: '60%'}}/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <h4 className="text-dark mb-4">Automated Reminders</h4>
                            <p className="text-center">The system will facilitate the process of sending reminders to
                                your clients, when and as required. No further manual client chasing is required.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-sm-6">
                    <div
                        className="d-flex align-items-center product_div flex-column p-lg-4 p-sm-3 py-5 px-4 border border-3 rounded-4"
                        ref={(el) => el && el.style.setProperty('border-color', '#d6e7ff', "important")}>
                        <div
                            className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center "
                            style={{height: '73px', width: '73px'}}>
                            <img src="/images/signature.svg" alt="..." style={{maxWidth: '60%'}}/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <h4 className="text-dark mb-4">Naming Convention</h4>
                            <p className="text-center">With the file naming convention feature, DocuTick allows you to
                                stay more organized. Your files will be named in a way for easy identification of the
                                content inside.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-sm-6">
                    <div
                        className="d-flex align-items-center product_div flex-column p-lg-4 p-sm-3 py-5 px-4 border border-3 rounded-4"
                        ref={(el) => el && el.style.setProperty('border-color', '#d6e7ff', "important")}>
                        <div
                            className="mb-4 bg-primary  rounded-circle d-flex align-items-center justify-content-center "
                            style={{height: '73px', width: '73px'}}>
                            <img src="/images/staff.svg" alt="..." style={{maxWidth: '60%'}}/>
                        </div>
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <h4 className="text-dark mb-4">Multiple User Access</h4>
                            <p className="text-center">You may add more users or staff, as required, under your DocuTick
                                user account. You have complete access control in granting permission.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductFeatures;