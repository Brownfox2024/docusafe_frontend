import React, {useState, useEffect} from "react";

const Header = (props) => {
    const [dueDays, setDueDays] = useState(0);
    const [totalDoc, setTotalDoc] = useState(0);

    useEffect(function () {
        if (props?.envelopeData?.due_days) {
            setDueDays(parseInt(props?.envelopeData?.due_days));
        }
        let totalDoc = 0;
        if (props?.envelopeData?.document_list) {
            totalDoc = props?.envelopeData?.document_list.length;
        }
        let totalForm = 0;
        if (props?.envelopeData?.request_form_list) {
            totalForm = props?.envelopeData?.request_form_list.length;
        }
        let totalSignDoc = 0;
        if (props?.envelopeData?.sign_documents) {
            totalSignDoc = props?.envelopeData?.sign_documents.length;
        }
        setTotalDoc(totalDoc + totalForm + totalSignDoc);
    }, [props?.envelopeData]);

    return (
        <nav className="navbar navbar-expand-lg px-5 py-2 shadow-sm">
      <span className="navbar-brand">
        <img src="/images/logo.png" className="h-8" alt="..."/>
      </span>
            <div className=" ms-auto navbar_client">
                <div className="d-flex align-items-center w-100 justify-content-end flex_wrap">
                    <p className="total_data">
                        {props.envelopeData?.request_form_list && props.envelopeData?.request_form_list.length > 0 ?
                            `Total Documents & Information` : `Total Documents`} {totalDoc}
                    </p>
                    {props.envelopeData && !props.envelopeData?.is_finish &&
                    <p className="due_days d-flex">
                        <img src="/images/clock.png" className="me-2"
                             alt="..."/> {dueDays >= 0 ? `Due in ` : `Overdue by `} {Math.abs(dueDays)} Days
                    </p>
                    }
                </div>
            </div>
        </nav>
    );
};

export default Header;
