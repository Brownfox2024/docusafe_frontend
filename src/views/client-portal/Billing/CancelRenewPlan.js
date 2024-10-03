import React, {useRef} from "react";
import {cancelPlanAutoRenew} from "../../../services/BilingService";
import {toast} from "react-toastify";
import Utils from "../../../utils";

function CancelRenewPlan(props) {

    const clsCancelRenewPlanRef = useRef(null);

    const handleCancelAutoRenew = (e) => {
        e.preventDefault();

        props.setLoading(true);

        cancelPlanAutoRenew({is_renew: 0})
            .then(response => {
                toast.success(response.data.message);
                clsCancelRenewPlanRef?.current.click();

                let companyData = {...props.companyData};
                companyData.is_auto_renew = 0;
                companyData.auto_renew = 'Disabled';
                props.setCompanyData(companyData);

                props.setLoading(false);
            })
            .catch(err => {
                props.setLoading(false);
                toast.error(Utils.getErrorMessage(err));
            });

    };

    return (
        <div className="modal fade" style={{top: '136px'}} data-bs-keyboard="false" data-bs-backdrop="static"
             id="CancelRenewPlan">
            <div className="modal-dialog modal-lg"
                 ref={(el) => el && el.style.setProperty('max-width', '650px', "important")}
                 style={{borderRadius: '20px'}}>
                <div className="modal-content" style={{borderRadius: '20px'}}>
                    <div className="modal-header">
                        <h4 className="Cancel-Renew-header">Disable Auto Renew</h4>
                        <button type="button" className="btn-close" ref={clsCancelRenewPlanRef}
                                data-bs-dismiss="modal">
                            <i className="fa fa-times-circle Cancel-Renew-header" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body Cancel-Renew-content ">
                        <p className="form-label py-3 fw-light">Do you want to cancel auto renew?</p>
                    </div>
                    <div className="modal-footer auto-renew-btn">
                        <button type="button" className="btn" data-bs-dismiss="modal">Close</button>
                        <button type="button" onClick={handleCancelAutoRenew} className="btn btn-primary">Disable
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CancelRenewPlan;