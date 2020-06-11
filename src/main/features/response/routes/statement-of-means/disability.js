"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("response/paths");
const express = require("express");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const disability_1 = require("response/form/models/statement-of-means/disability");
const page = paths_1.StatementOfMeansPaths.disabilityPage;
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), (req, res) => {
    const draft = res.locals.responseDraft;
    res.render(page.associatedView, {
        form: new form_1.Form(draft.document.statementOfMeans.disability)
    });
})
    .post(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), formValidator_1.FormValidator.requestHandler(disability_1.Disability), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    const { externalId } = req.params;
    if (form.hasErrors()) {
        res.render(page.associatedView, { form: form });
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.statementOfMeans.disability = form.model;
        if (form.model.option === disability_1.DisabilityOption.NO) {
            draft.document.statementOfMeans.severeDisability = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (form.model.option === disability_1.DisabilityOption.YES) {
            res.redirect(paths_1.StatementOfMeansPaths.severeDisabilityPage.evaluateUri({ externalId: externalId }));
        }
        else {
            res.redirect(paths_1.StatementOfMeansPaths.residencePage.evaluateUri({ externalId: externalId }));
        }
    }
}));
