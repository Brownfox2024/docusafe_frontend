import React from 'react';

function CheckEnvelopeStorage() {
    return (
        <div className="modal fade" id="checkEnvelopeStorage" tabIndex={-1} aria-labelledby="checkEnvelopeStorageLabel"
             aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        <p className="py-2">Storage Space Limit Reached ,Please click on Billing to upgrade
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

export default CheckEnvelopeStorage;