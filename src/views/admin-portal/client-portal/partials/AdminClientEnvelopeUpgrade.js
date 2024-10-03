import React, {useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import {adminEnvelopeLeft} from "../../../../services/AdminService";

function AdminClientEnvelopeUpgrade() {
    let {client} = useParams();

    const [totalEnvelope, setTotalEnvelope] = useState(0);
    const [planName, setPlanName] = useState('Free Trial');

    useEffect(function () {
        adminEnvelopeLeft({client_id: client})
            .then(response => {
                setPlanName(response.data.data.plan_name);
                setTotalEnvelope(response.data.data.total_envelope);
            })
            .catch(err => {

            });
    }, [client]);

    return (
        <div className="Envelope_count_section px-5 ">
            <div className="d-flex align-items-center justify-content-end">
                <h2><span>{totalEnvelope} Envelopes </span>Left for {planName}</h2>
                <NavLink to={"/billing/pricing"} className="upgrade ms-3">Upgrade</NavLink>
            </div>
        </div>
    );
}

export default AdminClientEnvelopeUpgrade;