"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("mediation/paths");
const errorHandling_1 = require("main/common/errorHandling");
const freeMediation_1 = require("forms/models/freeMediation");
const draftService_1 = require("services/draftService");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
const paths_2 = require("claimant-response/paths");
const paths_3 = require("response/paths");
function renderView(res) {
    res.render(paths_1.Paths.howMediationWorksPage.associatedView, {
        mediationPilot: claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(res.locals.claim, 'mediationPilot')
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.howMediationWorksPage.uri, (req, res) => {
    renderView(res);
})
    .post(paths_1.Paths.howMediationWorksPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const user = res.locals.user;
    const draft = res.locals.mediationDraft;
    draft.document.willYouTryMediation = new freeMediation_1.FreeMediation(req.body.mediationYes ? freeMediation_1.FreeMediationOption.YES : freeMediation_1.FreeMediationOption.NO);
    if (claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(res.locals.claim, 'mediationPilot')) {
        if (draft.document.willYouTryMediation.option === freeMediation_1.FreeMediationOption.YES) {
            draft.document.mediationDisagreement = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
    }
    const { externalId } = req.params;
    if (req.body.mediationNo) {
        const claim = res.locals.claim;
        if (claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(res.locals.claim, 'mediationPilot')) {
            res.redirect(paths_1.Paths.mediationDisagreementPage.evaluateUri({ externalId }));
        }
        else if (!claim.isResponseSubmitted()) {
            res.redirect(paths_3.Paths.taskListPage.evaluateUri({ externalId: externalId }));
        }
        else {
            res.redirect(paths_2.Paths.taskListPage.evaluateUri({ externalId: externalId }));
        }
    }
    else if (claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(res.locals.claim, 'mediationPilot')) {
        res.redirect(paths_1.Paths.mediationAgreementPage.evaluateUri({ externalId }));
    }
    else {
        res.redirect(paths_1.Paths.willYouTryMediation.evaluateUri({ externalId }));
    }
}));
