"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("testing-support/paths");
const paths_2 = require("claim/paths");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const draftClaim_1 = require("drafts/models/draftClaim");
const claimDraft_1 = require("drafts/draft-data/claimDraft");
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const claimStoreClient_1 = require("claims/claimStoreClient");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.createClaimDraftPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    res.render(paths_1.Paths.createClaimDraftPage.associatedView);
}))
    .post(paths_1.Paths.createClaimDraftPage.uri, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'claim', 100, (value) => {
    return new draftClaim_1.DraftClaim().deserialize(value);
}), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.claimDraft;
    const user = res.locals.user;
    draft.document = new draftClaim_1.DraftClaim().deserialize(claimDraft_1.prepareClaimDraft(user.email));
    await new draftService_1.DraftService().save(draft, user.bearerToken);
    const roles = await claimStoreClient.retrieveUserRoles(user);
    if (roles && !roles.some(role => role.includes('cmc-new-features-consent'))) {
        await claimStoreClient.addRoleToUser(user, 'cmc-new-features-consent-given');
    }
    res.redirect(paths_2.Paths.checkAndSendPage.uri);
}));
