import React from "react";
import {Lang} from "../../../lang";

function TermsConditions(props) {

    // Accessing the prop value
    const isUpdateMeta = props?.isUpdateMeta;

    if(isUpdateMeta === undefined){
        document.title = Lang.term_condition_title;
        document.getElementsByTagName("META")[4].content = Lang.term_condition_meta_desc;
        document.getElementsByTagName("META")[5].content = Lang.term_condition_meta_keyword;
    }
   
    return (
        <div className="p-0" style={{minHeight: 'calc(100vh - 406px)'}}>
            <div className="title_container px-4 py-5">
                <h1 className="text-dark text-center mb-3">Terms & Conditions</h1>
                <p className="text-dark text-center">These terms and conditions regulate the business relationship
                    between you and us. When you visit our site, register with us or pay for services on our website,
                    you agree to be bound as below. </p>
            </div>
            
            <div className=" custom_container_portal py-5 px-3">
                <h3 className="text-dark mb-4">Terms and Conditions for www.DocuTick.com</h3>
                <p className="mb-4">Effective Date: 01/05/2023</p>
                <h3 className="text-dark mb-4">1. Acceptance of Terms</h3>
                <p className="mb-4">By accessing or using www.DocuTick.com ("the Software"), you agree to comply with and be bound by these Terms and Conditions ("Terms"). If you do not agree with these Terms, please refrain from using the Software.</p>
                <h3 className="text-dark mb-4">2. Use of the Software</h3>
                <p className="mb-4">2.1 <b className="text-dark">Eligibility:</b> You must be at least 18 years old or the legal age of majority in your jurisdiction to use the Software.</p>
                <p className="mb-4">2.2 <b className="text-dark">License:</b> We grant you a limited, non-exclusive, non-transferable license to use the Software for its intended purpose, subject to these Terms.</p>
                <p className="mb-4">2.3 <b className="text-dark">User Account:</b> You may be required to create an account to access certain features of the Software. You are responsible for maintaining the security of your account information and for any activities that occur under your account.</p>
                <p className="mb-4">2.4 <b className="text-dark">User Conduct:</b> You agree not to:</p>
                <ul className="pl-0 mb-5">
                    <li className="mb-3 ps-2">Use the Software for any unlawful or unauthorized purpose.
                    </li>
                    <li className="mb-3 ps-2">Upload or transmit any malicious code, viruses, or other harmful content.
                    </li>
                    <li className="mb-3 ps-2">Interfere with or disrupt the operation of the Software.
                    </li>
                    <li className="mb-3 ps-2">Attempt to access or use the Software in a manner not explicitly permitted by these Terms.
                    </li>
                </ul>
                <h3 className="text-dark mb-4">3. Data Collection and Privacy</h3>
                <p className="mb-4">Our data collection and usage practices are outlined in our Privacy Policy, which is incorporated by reference into these Terms. Please review our Privacy Policy to understand how we handle your data.</p>
                <h3 className="text-dark mb-4">4. Intellectual Property Rights</h3>
                <p className="mb-4">4.1 <b className="text-dark">Ownership:</b> We retain all rights, title, and interest in and to the Software, including all intellectual property rights.</p>
                <p className="mb-4">4.2 <b className="text-dark">User Content:</b> By using the Software, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute the content you submit to the Software.</p>
                <h3 className="text-dark mb-4">5. Termination</h3>
                <p className="mb-4">We may terminate or suspend your access to the Software without prior notice if you violate these Terms. Upon termination, you will no longer have access to your account and any associated data.</p>
                <h3 className="text-dark mb-4">6. Disclaimers and Limitations of Liability</h3>
                <p className="mb-4">6.1 <b className="text-dark">No Warranty:</b> The Software is provided "as-is" and "as available." We make no warranties, express or implied, regarding the Software's accuracy, reliability, or fitness for a particular purpose..</p>
                <p className="mb-4">6.2 <b className="text-dark">Limitation of Liability:</b> To the extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with the use of the Software.</p>
                <h3 className="text-dark mb-4">7. Indemnification</h3>
                <p className="mb-4">You agree to indemnify and hold us harmless from any claims, losses, liabilities, damages, and expenses, including attorneys' fees, arising out of your use of the Software or violation of these Terms.</p>
                <h3 className="text-dark mb-4">8. Changes to the Terms</h3>
                <p className="mb-4">We may update these Terms from time to time, and any changes will be posted on this page with a revised effective date. Continued use of the Software after such changes constitutes acceptance of the new Terms.</p> 
                <h3 className="text-dark mb-4">9. Governing Law and Jurisdiction</h3>
                <p className="mb-4">These Terms are governed by and construed in accordance with the laws of NSW, Australia. Any disputes arising from or relating to these Terms or the Software shall be subject to the exclusive jurisdiction of the courts in NSW, Australia.</p>  
                <h3 className="text-dark mb-4">10. Contact Information</h3>
                <p className="mb-4">If you have questions or concerns about these Terms, please contact us at <a href="mailto:hello@docutick.com">hello@docutick.com</a></p>    
            </div>
        </div>
    );
}

export default TermsConditions;