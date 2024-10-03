import React from "react";

function CustomerPortalTab(props) {
    return (
        <div className="nav nav-tabs pt-4" id="nav-tab" role="tablist">
            <div data-toggle="tooltip" title=""
                 data-bs-original-title={`Upload Documents ${props.envelopeData?.request_form_list && props.envelopeData?.request_form_list.length > 0 ? `or Enter Data` : ``}`}>
                <button className="nav-link active" id="document-form" data-bs-toggle="tab"
                        data-bs-target="#document-form-detail" type="button" role="tab"
                        aria-controls="document-form-detail" aria-selected="true">
                    <i className="fa fa-drivers-license-o me-1" aria-hidden="true"/>
                    {props.envelopeData?.request_form_list && props.envelopeData?.request_form_list.length > 0 ?
                        `Documents & Information` : `Documents`
                    }
                </button>
            </div>
            <div data-toggle="tooltip" title="" data-bs-original-title="Sender messages will appear here.">
                <button className="nav-link" id="messages-tab" data-bs-toggle="tab"
                        data-bs-target="#messages" type="button" role="tab" aria-controls="messages"
                        aria-selected="false">
                    <i className="fa fa-comments-o me-1" aria-hidden="true"/>
                    Messages
                    <span className="red_dot"/>
                </button>
            </div>
            <div data-toggle="tooltip" title="" data-bs-original-title="Sender contact details showing here.">
                <button className="nav-link" id="contact-tab" data-bs-toggle="tab"
                        data-bs-target="#contact" type="button" role="tab" aria-controls="contact"
                        aria-selected="false">
                    <i className="fa fa-address-book-o me-1"/>
                    Contact
                </button>
            </div>
            <div data-toggle="tooltip" title="" data-bs-original-title="Read the FAQs for Help">
                <button className="nav-link" id="help-tab" data-bs-toggle="tab" data-bs-target="#help"
                        type="button" role="tab" aria-controls="help" aria-selected="false">
                    <i className="fa fa-question-circle-o me-1" aria-hidden="true"/>
                    Help
                </button>
            </div>
        </div>
    );
}

export default CustomerPortalTab;