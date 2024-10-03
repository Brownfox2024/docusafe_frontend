import React from "react";

function ViewDocument(props) {

    const hideApproveRejectDoc = (e) => {
        e.preventDefault();

        props.setDocDetail({
            id: 0,
            envelope_id: 0,
            recipient_id: 0,
            is_call: false,
            doc_detail: {}
        });
    };

    return (
        <div className="offcanvas offcanvas-end ManageDocument w-80" data-bs-scroll="true" tabIndex="-1"
             data-bs-keyboard="false" data-bs-backdrop="static" id="viewDocument" aria-labelledby="viewDocumentLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="viewDocumentLabel">Document View
                    - {props?.docDetail?.doc_detail?.doc_name}</h5>
                <button type="button" className="btn close_btn text-reset" data-bs-dismiss="offcanvas"
                        onClick={hideApproveRejectDoc} aria-label="Close">
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                </button>
            </div>
            <div className="offcanvas-body">
                <div className="accordion mx-3 mb-3" id="doc_view">
                    {props?.docDetail?.doc_detail?.upload_file_list && props?.docDetail?.doc_detail?.upload_file_list.map((item, index) =>
                        <div key={index} className="accordion-item">
                            <h2 className="accordion-header " id={`docView_${index}`}>
                                <button className="accordion-button py-0" type="button" data-bs-toggle="collapse"
                                        data-bs-target={`#Doc-View-${index}`} aria-expanded="true"
                                        aria-controls={`Doc-View-${index}`}>
                                    {item.file_name}
                                </button>
                            </h2>
                            <div id={`Doc-View-${index}`} className="accordion-collapse collapse show"
                                 aria-labelledby={`docView_${index}`} data-bs-parent="#doc_view">
                                <div className="accordion-body">
                                    {item.ext === 'doc' || item.ext === 'docx' ?
                                        <iframe style={{width: '100%', height: '350px'}}
                                                src={`https://docs.google.com/gview?url=${item.file_path}&embedded=true`}
                                                title={item.file_name} allowFullScreen/>
                                        :
                                        <>
                                            {item.ext === 'jpg' || item.ext === 'jpeg' || item.ext === 'png' || item.ext === 'JPG' || item.ext === 'JPEG' || item.ext === 'PNG'
                                                ? <img src={item.file_path} alt="..."/>
                                                : <iframe src={item.file_path} style={{width: '100%', height: '350px'}}
                                                          title={item.file_name} allowFullScreen/>
                                            }
                                        </>
                                    }

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewDocument;