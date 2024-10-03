import React, {useRef} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Utils from "../../../../utils";
import {adminCancelPlanAutoRenew} from "../../../../services/AdminService";

function AdminClientEnableRenewPlan(props) {
    let {client} = useParams();
    const clsCancelRenewPlanRef = useRef(null);

    const handleCancelAutoRenew = (e) => {
        e.preventDefault();

        props.setLoading(true);

        adminCancelPlanAutoRenew({client_id: client, is_renew: 1})
            .then(response => {
                toast.success(response.data.message);
                clsCancelRenewPlanRef?.current.click();

                let companyData = {...props.companyData};
                companyData.is_auto_renew = 1;
                companyData.auto_renew = 'Enabled';
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
             id="EnableRenewPlan">
            <div className="modal-dialog modal-lg"
                 ref={(el) => el && el.style.setProperty('max-width', '650px', "important")}
                 style={{borderRadius: '20px'}}>
                <div className="modal-content" style={{borderRadius: '20px'}}>
                    <div className="modal-header">
                        <h4 className="Cancel-Renew-header">Enable Auto Renew</h4>
                        <button type="button" className="btn-close" ref={clsCancelRenewPlanRef}
                                data-bs-dismiss="modal">
                            <i className="fa fa-times-circle Cancel-Renew-header" aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="modal-body Cancel-Renew-content ">
                        <p className="form-label py-3 fw-light">Do you want to enable auto renew?</p>
                    </div>
                    <div className="modal-footer auto-renew-btn">
                        <button type="button" className="btn" data-bs-dismiss="modal">Close</button>
                        <button type="button" onClick={handleCancelAutoRenew} className="btn btn-primary">Enable
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminClientEnableRenewPlan;