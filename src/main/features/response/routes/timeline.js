"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const defendantTimeline_1 = require("response/form/models/defendantTimeline");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
const page = paths_1.Paths.timelinePage;
function renderView(form, res) {
    const claim = res.locals.claim;
    res.render(page.associatedView, {
        form: form,
        timeline: claim.claimData.timeline
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
    let timeline;
    if (claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim) && draft.document.isResponsePartiallyAdmitted()) {
        timeline = draft.document.partialAdmission.timeline;
    }
    else {
        timeline = draft.document.timeline;
    }
    renderView(new form_1.Form(timeline), res);
})
    .post(page.uri, formValidator_1.FormValidator.requestHandler(defendantTimeline_1.DefendantTimeline, defendantTimeline_1.DefendantTimeline.fromObject, undefined, ['addRow']), actionHandler, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const claim = res.locals.claim;
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        form.model.removeExcessRows();
        if (draft.document.isResponseRejected()) {
            draft.document.timeline = form.model;
        }
        else {
            draft.document.partialAdmission.timeline = form.model;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.evidencePage.evaluateUri({ externalId: claim.externalId }));
    }
}));
