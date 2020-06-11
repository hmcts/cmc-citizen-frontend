"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("features/response/paths");
const errorHandling_1 = require("shared/errorHandling");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const impactOfDispute_1 = require("response/form/models/impactOfDispute");
const draftService_1 = require("services/draftService");
function renderView(form, res) {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.impactOfDisputePage.associatedView, {
        form: form,
        claimantName: claim.claimData.claimant.name
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.impactOfDisputePage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.impactOfDispute), res);
}))
    .post(paths_1.Paths.impactOfDisputePage.uri, formValidator_1.FormValidator.requestHandler(impactOfDispute_1.ImpactOfDispute), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const claim = res.locals.claim;
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.impactOfDispute = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
    }
}));
