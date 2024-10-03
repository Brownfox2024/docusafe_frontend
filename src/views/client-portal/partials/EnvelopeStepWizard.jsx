import React from "react";

function EnvelopeStepWizard(props) {

    return (
        <div className="step_wizard">
            <div className="container">
                <ul className="steps_list">
                    <li className={`${props.step > 1 ? `active` : ``}`}>Envelope Details</li>
                    <li className="dashed_border"/>
                    <li className={`${props.step > 2 ? `active` : ``}`}>Recipients</li>
                    <li className="dashed_border"/>
                    <li className={`${props.step > 3 ? `active` : ``}`}>Request Documents</li>
                    <li className="dashed_border"/>
                    <li className={`${props.step >= 4 && props.isDone === true ? `active` : ``}`}>Review & Send</li>
                </ul>
            </div>
        </div>
    );
}

export default EnvelopeStepWizard;