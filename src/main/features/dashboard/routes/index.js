"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("dashboard/paths");
const claimStoreClient_1 = require("claims/claimStoreClient");
const errorHandling_1 = require("shared/errorHandling");
const claim_state_1 = require("dashboard/claims-state-machine/claim-state");
const actor_type_1 = require("claims/models/claim-states/actor-type");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.dashboardPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const claimDraft = res.locals.claimDraft;
    const responseDraft = res.locals.responseDraft;
    const user = res.locals.user;
    const claimsAsClaimant = await claimStoreClient.retrieveByClaimantId(user);
    const claimDraftSaved = claimDraft.document && claimDraft.id !== 0;
    const responseDraftSaved = responseDraft && responseDraft.document && responseDraft.id !== 0;
    const claimsAsDefendant = await claimStoreClient.retrieveByDefendantId(user);
    claim_state_1.claimState(claimsAsClaimant, actor_type_1.ActorType.CLAIMANT);
    claim_state_1.claimState(claimsAsDefendant, actor_type_1.ActorType.DEFENDANT);
    res.render(paths_1.Paths.dashboardPage.associatedView, {
        claimsAsClaimant: claimsAsClaimant,
        claimDraftSaved: claimDraftSaved,
        claimsAsDefendant: claimsAsDefendant,
        responseDraftSaved: responseDraftSaved
    });
}));
