"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-default-export */
const express = require("express");
const paths_1 = require("response/paths");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const howMuchHaveYouPaid_1 = require("response/form/models/howMuchHaveYouPaid");
const fullRejectionGuard_1 = require("response/guards/fullRejectionGuard");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
const page = paths_1.FullRejectionPaths.howMuchHaveYouPaidPage;
function renderView(form, res) {
    res.render(page.associatedView, {
        form: form
    });
}
exports.default = express.Router()
    .get(page.uri, fullRejectionGuard_1.FullRejectionGuard.requestHandler(), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.rejectAllOfClaim.howMuchHaveYouPaid), res);
}))
    .post(page.uri, formValidator_1.FormValidator.requestHandler(howMuchHaveYouPaid_1.HowMuchHaveYouPaid, howMuchHaveYouPaid_1.HowMuchHaveYouPaid.fromObject), fullRejectionGuard_1.FullRejectionGuard.requestHandler(), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const claim = res.locals.claim;
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.rejectAllOfClaim.howMuchHaveYouPaid = form.model;
        const { externalId } = req.params;
        const paidLessThanClaimed = form.model.amount < claim.totalAmountTillToday;
        const admissionsEnabled = claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim);
        if (!paidLessThanClaimed) {
            delete draft.document.rejectAllOfClaim.whyDoYouDisagree;
            delete draft.document.timeline;
            delete draft.document.evidence;
            delete draft.document.freeMediation;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (paidLessThanClaimed) {
            if (admissionsEnabled) {
                res.redirect(paths_1.FullRejectionPaths.youHavePaidLessPage.evaluateUri({ externalId: externalId }));
            }
            else {
                res.redirect(paths_1.Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }));
            }
        }
        else if (admissionsEnabled) {
            res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
        }
        else {
            res.redirect(paths_1.Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }));
        }
    }
}));
