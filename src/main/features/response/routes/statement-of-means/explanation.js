"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const explanation_1 = require("response/form/models/statement-of-means/explanation");
function renderView(form, res) {
    res.render(paths_1.StatementOfMeansPaths.explanationPage.associatedView, {
        form: form
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.StatementOfMeansPaths.explanationPage.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.statementOfMeans.explanation), res);
}))
    .post(paths_1.StatementOfMeansPaths.explanationPage.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), formValidator_1.FormValidator.requestHandler(explanation_1.Explanation), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.statementOfMeans.explanation = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const claim = res.locals.claim;
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
    }
}));
