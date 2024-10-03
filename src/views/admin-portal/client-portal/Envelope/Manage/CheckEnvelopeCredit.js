import React from 'react';

function AdminCheckEnvelopeCredit() {
    return (
        <div className="modal fade" id="checkEnvelopeCredit" tabIndex={-1} aria-labelledby="checkEnvelopeCreditLabel"
             aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        <p className="py-2">You don't have enough credits, please buy more credits by clicking
                            Billing.</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Okay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCheckEnvelopeCredit;