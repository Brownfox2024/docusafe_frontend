import React from "react";

function AdminPortalPlans() {
    return (
        <div className="custom_container">
            <h2 className="main_title mb-3">Plans</h2>
            <div className="tab-content pb-4" id="nav-tabContent">
                <div className="tab-pane fade active show" id="Completed" role="tabpanel"
                     aria-labelledby="Completed-tab">
                    <div className="table-responsive mb-0">
                        <table className="table align-middle mb-0 bg-white in_progress_table shadow-sm mb-2">
                            <thead>
                            <tr className="bg_blue">
                                <th>Plan Name</th>
                                <th>Monthly Fees</th>
                                <th>Yearly Fees</th>
                                <th>Edit</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td colSpan={4} className="text-center">No data available.</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPortalPlans;