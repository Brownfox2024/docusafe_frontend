import React from "react";
import {Lang} from "../../../lang";

function UseCases() {

    document.title = Lang.use_cases_title;
    document.getElementsByTagName("META")[4].content = Lang.use_cases_meta_desc;
    document.getElementsByTagName("META")[5].content = Lang.use_cases_meta_keyword;

    return (
        <div className="p-0" style={{minHeight: 'calc(100vh - 406px)'}}>
            <div className="title_container bg-primary px-4 py-5">
                <h1 className="text-dark text-center mb-3">Use Cases</h1>
                <p className="text-dark text-center mb-4">Document collection can be performed in a number of ways, and
                    emails are the most sought-after conventional method among them. Though email offers quick
                    communication, it becomes less efficient when we attempt to gather a large pool of documents.</p>
                <p className="text-dark text-center">In such a scenario, we prefer a better way, which is the ‘DocuTick
                    Way’, a way more efficient, effective and essential solution for any business.</p>
            </div>

            <div className="custom_container_portal use-cases">
                <div className="row my-5">
                    <div className="col-md-6 order-2 order-md-1">
                        <h3 className="text-dark  mb-4">Lenders & Brokers</h3>
                        <p>The tool will be of great help to lenders and brokers in gathering and managing documents
                            from their borrowers during financial transactions or loan application processes. It allows
                            you to streamline and simplify the entire process by efficiently collecting and organizing
                            client documents professionally.</p>
                        <h5 className="text-dark my-4">Benefits</h5>
                        <ul>
                            <li className="ps-4 mb-3">Gather documents faster</li>
                            <li className="ps-4 mb-3">Fast turnaround</li>
                            <li className="ps-4 mb-3">Improve overall sales</li>
                            <li className="ps-4 mb-3">Scale your business process</li>
                            <li className="ps-4 mb-3">Exceptional and professional client portal</li>
                            <li className="ps-4 mb-3">Staff can focus on other Important Tasks</li>
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
                        <h3 className="text-dark  mb-4">Accountant & Tax Professionals</h3>
                        <p>DocuTick serves as a secure document collection platform for accountants and tax
                            professionals, particularly during their financial reporting periods and tax collection
                            seasons. It optimizes document collection, enhances data accuracy and facilitates client
                            interactions.</p>
                        <h5 className="text-dark my-4">Benefits</h5>
                        <ul>
                            <li className="ps-4 mb-3">Automated reminders</li>
                            <li className="ps-4 mb-3">Improve your workflow</li>
                            <li className="ps-4 mb-3">Wow your clients</li>
                            <li className="ps-4 mb-3">Improve your business sales</li>
                            <li className="ps-4 mb-3">Save more time to focus on your core business matters</li>
                            <li className="ps-4 mb-3">No compliance issues</li>
                        </ul>
                    </div>
                </div>

                <div className="row my-5">
                    <div className="col-md-6 order-2 order-md-1">
                        <h3 className="text-dark  mb-4">Human Resources</h3>
                        <p>Our document collection software becomes handy for HR professionals in handling their loaded
                            job applications and employee documents during their work process. The tool will simplify
                            the tasks, as well as, enhance overall efficiency and data accuracy.</p>
                        <h5 className="text-dark my-4">Benefits</h5>
                        <ul>
                            <li className="ps-4 mb-3">No need to follow up with documents</li>
                            <li className="ps-4 mb-3">One single portal for clients to upload documents</li>
                            <li className="ps-4 mb-3">Filled form can be added with Request</li>
                            <li className="ps-4 mb-3">No missing information or documents</li>
                            <li className="ps-4 mb-3">Focus on clients, not on document collection</li>
                            <li className="ps-4 mb-3">Save Time & Money</li>
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
                        <h3 className="text-dark  mb-4">Immigration Agents</h3>
                        <p>Whether it is to collect documents from the clients or to verify the received documents’
                            compliance with immigration regulations, DocuTick can provide immigration agents with an
                            efficient way of document management.</p>
                        <h5 className="text-dark my-4">Benefits</h5>
                        <ul>
                            <li className="ps-4 mb-3">Request large volume of documents requests</li>
                            <li className="ps-4 mb-3">Collect large volume of documents</li>
                            <li className="ps-4 mb-3">Review Documents</li>
                            <li className="ps-4 mb-3">Store Documents on DocuTick or on Could Apps</li>
                            <li className="ps-4 mb-3">Highly competitive pricing</li>
                            <li className="ps-4 mb-3">Extremely secure & safe</li>
                        </ul>
                    </div>
                </div>

                <div className="row my-5">
                    <div className="col-md-6 order-2 order-md-1">
                        <h3 className="text-dark  mb-4">Educational Institutes</h3>
                        <p>Admission application, enrollment management, collaboration with departments and all those
                            related administrative tasks which educational institutions handle on a daily basis will be
                            efficiently and professionally performed with the help of DocuTick.</p>
                        <h5 className="text-dark my-4">Benefits</h5>
                        <ul>
                            <li className="ps-4 mb-3">Huge time saver</li>
                            <li className="ps-4 mb-3">Avoid errors</li>
                            <li className="ps-4 mb-3">Very user-friendly application</li>
                            <li className="ps-4 mb-3">Premade templates for repeated use</li>
                            <li className="ps-4 mb-3">Quick turnaround</li>
                            <li className="ps-4 mb-3">Scale up your business process</li>
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
                        <h3 className="text-dark  mb-4">Auditors</h3>
                        <p>DocuTick allows auditors to optimize their document management processes during audit
                            engagements, streamline audit workflow, reduce efforts of manual data entry and minimize
                            errors.</p>
                        <h5 className="text-dark my-4">Benefits</h5>
                        <ul>
                            <li className="ps-4 mb-3">A worry-free document collection process</li>
                            <li className="ps-4 mb-3">Automated follow-up</li>
                            <li className="ps-4 mb-3">Manage complex list of documents</li>
                            <li className="ps-4 mb-3">No reminder emails to send</li>
                            <li className="ps-4 mb-3">Simple document upload client portal</li>
                            <li className="ps-4 mb-3">Fully Automated, no more manual documentation processes</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UseCases;