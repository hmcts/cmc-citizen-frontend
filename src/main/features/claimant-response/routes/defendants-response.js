"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const statesPaidHelper_1 = require("claimant-response/helpers/statesPaidHelper");
const featureToggles_1 = require("utils/featureToggles");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
function renderView(res, page) {
    const claim = res.locals.claim;
    const alreadyPaid = statesPaidHelper_1.StatesPaidHelper.isResponseAlreadyPaid(claim);
    const dqsEnabled = claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire');
    let directionsQuestionnaireEnabled = false;
    if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire') &&
        claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) {
        directionsQuestionnaireEnabled = true;
    }
    res.render(paths_1.Paths.defendantsResponsePage.associatedView, {
        claim: claim,
        page: page,
        alreadyPaid: alreadyPaid,
        dqsEnabled: dqsEnabled,
        partiallyPaid: alreadyPaid ? statesPaidHelper_1.StatesPaidHelper.isAlreadyPaidLessThanAmount(claim) : undefined,
        directionsQuestionnaireEnabled: directionsQuestionnaireEnabled
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.defendantsResponsePage.uri, (req, res) => {
    const page = 0;
    renderView(res, page);
})
    .post(paths_1.Paths.defendantsResponsePage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.claimantResponseDraft;
    const user = res.locals.user;
    const claim = res.locals.claim;
    const alreadyPaid = statesPaidHelper_1.StatesPaidHelper.isResponseAlreadyPaid(claim);
    if (req.body.action && req.body.action.showPage && !alreadyPaid) {
        const page = +req.body.action.showPage;
        return renderView(res, page);
    }
    draft.document.defendantResponseViewed = true;
    await new draftService_1.DraftService().save(draft, user.bearerToken);
    const { externalId } = req.params;
    res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
}));
