"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const defendantEvidence_1 = require("response/form/models/defendantEvidence");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
const page = paths_1.Paths.evidencePage;
function renderView(form, res) {
    const claim = res.locals.claim;
    res.render(page.associatedView, {
        form: form,
        evidence: claim.claimData.evidence
    });
}
function actionHandler(req, res, next) {
    if (req.body.action) {
        const form = req.body;
        if (req.body.action.addRow) {
            form.model.appendRow();
        }
        return renderView(form, res);
    }
    next();
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, async (req, res, next) => {
    const draft = res.locals.responseDraft;
    const claim = res.locals.claim;
    let evidence;
    if (claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim) && draft.document.isResponsePartiallyAdmitted()) {
        evidence = draft.document.partialAdmission.evidence;
    }
    else {
        evidence = draft.document.evidence;
    }
    renderView(new form_1.Form(evidence), res);
})
    .post(page.uri, formValidator_1.FormValidator.requestHandler(defendantEvidence_1.DefendantEvidence, defendantEvidence_1.DefendantEvidence.fromObject, undefined, ['addRow']), actionHandler, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const claim = res.locals.claim;
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        form.model.removeExcessRows();
        if (claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim) && draft.document.isResponsePartiallyAdmitted()) {
            draft.document.partialAdmission.evidence = form.model;
            await new draftService_1.DraftService().save(draft, user.bearerToken);
            res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
        }
        else {
            draft.document.evidence = form.model;
            await new draftService_1.DraftService().save(draft, user.bearerToken);
            if (draft.document.isResponseRejected()) {
                res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
            }
            else {
                res.redirect(paths_1.Paths.impactOfDisputePage.evaluateUri({ externalId: claim.externalId }));
            }
        }
    }
}));
