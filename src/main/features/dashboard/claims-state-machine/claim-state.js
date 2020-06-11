"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const initial_transitions_1 = require("dashboard/claims-state-machine/initial-transitions");
const full_defence_transitions_1 = require("dashboard/claims-state-machine/full-defence-transitions");
const full_defence_states_1 = require("claims/models/claim-states/full-defence-states");
function claimState(claims, type) {
    claims.forEach(function (eachClaim) {
        let claimantState = initial_transitions_1.initialTransitions(eachClaim);
        claimantState.findState(claimantState);
        if (claimantState.is(full_defence_states_1.FullDefenceStates.FULL_DEFENCE)) {
            claimantState = full_defence_transitions_1.fullDefenceTransitions(eachClaim);
            claimantState.findState(claimantState);
        }
        eachClaim.template = claimantState.getTemplate(type);
    });
}
exports.claimState = claimState;
