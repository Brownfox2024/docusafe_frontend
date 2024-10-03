import React, {useState, useEffect} from "react";

const Contact = (props) => {
    const [displayName, setDisplayName] = useState('');
    const [address, setAddress] = useState('');

    useEffect(function () {
        let addressData = '';
        if (props?.contactData?.address_1) {
            addressData += props?.contactData?.address_1;
            if (props?.contactData?.address_2) {
                addressData += ', ' + props?.contactData?.address_1;
            }
            addressData += ', ' + props?.contactData?.city;
            addressData += ', ' + props?.contactData?.state;
            addressData += ', ' + props?.contactData?.country_name + '-' + props?.contactData?.zip;

            setAddress(addressData);
        }

        if (props?.contactData?.first_name) {
            let name = props?.contactData.first_name.charAt(0) + props?.contactData.last_name.charAt(0);
            setDisplayName(name);
        }
    }, [props?.contactData]);

    return (
        <div className="tab-pane fade p-4" id="contact" role="tabpanel" aria-labelledby="contact-tab">
            <div className="card background_grey_400">
                <div className="d-flex user_icon_list align-items-center border-bottom w-100 justify-content-center">
                    <span className="user_icon">
                        {props?.contactData?.company_logo ?
                            <img src={props?.contactData?.company_logo} style={{borderRadius: '50px'}}
                                 alt="..."/> : displayName}
                    </span>
                    <p>
                        <span className="user_name">{props?.contactData?.company_name}</span>
                        <span className="user_detail">{address}</span>
                    </p>
                </div>
                <div className="contact_client_portal py-4 mx-auto">
                    <div className="py-2 d-flex">
                        <span className="client_portal_title">User :</span>
                        <span
                            className="client_portal_text">{props?.contactData?.first_name + ' ' + props?.contactData?.last_name}</span>
                    </div>
                    <div className="py-2 d-flex">
                        <span className="client_portal_title">Email :</span>
                        <span className="client_portal_text">{props?.contactData?.email}</span>
                    </div>
                    {props?.contactData?.mobile && (
                        <div className="py-2 d-flex">
                            <span className="client_portal_title">Phone :</span>
                            <span
                                className="client_portal_text">{'+' + props?.contactData?.country_code + props?.contactData?.mobile}</span>
                        </div>
                    )}
                    {address &&
                        <div className="py-2 d-flex">
                            <span className="client_portal_title">Web :</span>
                            <span className="client_portal_text">{props?.contactData?.web_site}</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Contact;
