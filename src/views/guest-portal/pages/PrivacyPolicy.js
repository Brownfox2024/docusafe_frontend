import React from "react";
import {Lang} from "../../../lang";

function PrivacyPolicy() {

    document.title = Lang.privacy_policy_title;
    document.getElementsByTagName("META")[4].content = Lang.privacy_policy_meta_desc;
    document.getElementsByTagName("META")[5].content = Lang.privacy_policy_meta_keyword;

    return (
        <div className=" p-0" style={{minHeight: 'calc(100vh - 406px)'}}>
            <div className="title_container px-4 py-5">
                <h1 className="text-dark text-center mb-3">Privacy Policy</h1>
                <p className="text-dark text-center">We are extremely concerned to protect your privacy and
                    confidentiality. Our policy includes what we can record about you & your provided information on our
                    website.</p>
                <br/>
            </div>
            <div className=" custom_container_portal py-5 px-3">
                <h3 className="text-dark mb-4">Privacy Policy for www.DocuTick.com</h3>
                <p>Effective Date: 01/05/2023</p>
                <br></br>
                <h3 className="text-dark mb-4">1. Introduction</h3>
                <p className="mb-4">Welcome to www.DocuTick.com ("we," "our," or "us"). We are committed to protecting the privacy of our users and their personal information. This Privacy Policy explains how we collect, use, disclose, and protect the information collected through our document collection software.</p>

                <h3 className="text-dark mb-4">2. Information We Collect</h3>
                <p className="mb-4">2.1 <b className="text-dark">User-Provided Information:</b> We may collect information that you or your clients provide directly when using our software. This may include:</p>
                <ul className="pl-0 mb-5">
                    <li className="mb-3 ps-2">Personal information such as your name, email address, and contact information.
                    </li>
                    <li className="mb-3 ps-2">Documents and data you or your clients upload or input into the software.
                    </li>
                </ul>
                <p className="mb-4">2.2 <b className="text-dark">Automatically Collected Information:</b> We may collect certain information automatically when you use our software, including:</p>
                <ul className="pl-0 mb-5">
                    <li className="mb-3 ps-2">Device information (e.g., IP address, device type, operating system).
                    </li>
                    <li className="mb-3 ps-2">Usage information (e.g., interactions with the software, pages visited, actions taken).
                    </li>
                </ul>

                <h3 className="text-dark mb-4">3. How We Use Your Information</h3>
                <p className="mb-4">We use the information collected for the following purposes:</p>
                <ul className="pl-0 mb-5">
                    <li className="mb-3 ps-2">To provide and improve our software and services.
                    </li>
                    <li className="mb-3 ps-2">To communicate with you regarding your account and software updates.
                    </li>
                    <li className="mb-3 ps-2">To respond to your inquiries and provide customer support.
                    </li>
                    <li className="mb-3 ps-2">To ensure the security of our software and users' data.
                    </li>
                    <li className="mb-3 ps-2">To comply with legal obligations
                    </li>
                </ul>


                <h3 className="text-dark mb-4">4. Sharing Your Information</h3>
                <p className="mb-4">We do not sell, trade, or rent your personal information to third parties. However, we may share your information with:</p>
                <ul className="pl-0 mb-5">
                    <li className="mb-3 ps-2">Service providers and partners who assist us in delivering our software and services.
                    </li>
                    <li className="mb-3 ps-2">Law enforcement or government authorities when required by applicable law.
                    </li>
                    <li className="mb-3 ps-2">In the event of a business merger, acquisition, or sale, your information may be transferred to a successor entity.
                    </li>
                </ul>

                <h3 className="text-dark mb-4">5. Data Security</h3>
                <p className="mb-4">We implement reasonable security measures to protect your data. However, no method of data transmission or storage is completely secure. We cannot guarantee the security of your information or your client’s documents and information.</p>
                
                <h3 className="text-dark mb-4">6. Your Choices</h3>
                <p className="mb-4">You have the following choices regarding your information:</p>
                <ul className="pl-0 mb-5">
                    <li className="mb-3 ps-2">You can review and update your personal information by logging into your account.
                    </li>
                    <li className="mb-3 ps-2">You may opt-out of receiving marketing communications from us
                    </li>
                    <li className="mb-3 ps-2">You can request the deletion of your account and associated data, subject to legal requirements.
                    </li>
                </ul>

                <h3 className="text-dark mb-4">7. Third-Party Links and Services</h3>
                <p className="mb-4">Our software may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. Please review their privacy policies before using their services.</p>

                <h3 className="text-dark mb-4">8. Changes to this Privacy Policy</h3>
                <p className="mb-4">We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised effective date.</p>
                
                <h3 className="text-dark mb-4">9. Contact Us</h3>
                <p className="mb-4">If you have questions or concerns about this Privacy Policy or our data practices, please contact us at <a href="mailto:hello@docutick.com">hello@docutick.com</a>.</p>

            </div>
        </div>
    );
}

export default PrivacyPolicy;