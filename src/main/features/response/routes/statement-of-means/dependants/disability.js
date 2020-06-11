"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const dependantsDisability_1 = require("response/form/models/statement-of-means/dependantsDisability");
const page = paths_1.StatementOfMeansPaths.dependantsDisabilityPage;
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), (req, res) => {
    const draft = res.locals.responseDraft;
    res.render(page.associatedView, { form: new form_1.Form(draft.document.statementOfMeans.dependantsDisability) });
})
    .post(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), formValidator_1.FormValidator.requestHandler(dependantsDisability_1.DependantsDisability), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    const { externalId } = req.params;
    if (form.hasErrors()) {
        res.render(page.associatedView, { form: form });
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.statementOfMeans.dependantsDisability = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.StatementOfMeansPaths.otherDependantsPage.evaluateUri({ externalId: externalId }));
    }
}));
