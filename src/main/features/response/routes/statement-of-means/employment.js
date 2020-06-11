"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const employment_1 = require("response/form/models/statement-of-means/employment");
const draftService_1 = require("services/draftService");
const page = paths_1.StatementOfMeansPaths.employmentPage;
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), (req, res) => {
    const draft = res.locals.responseDraft;
    res.render(page.associatedView, { form: new form_1.Form(draft.document.statementOfMeans.employment) });
})
    .post(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), formValidator_1.FormValidator.requestHandler(employment_1.Employment, employment_1.Employment.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        res.render(page.associatedView, { form: form });
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.statementOfMeans.employment = form.model;
        if (form.model.declared) {
            draft.document.statementOfMeans.unemployment = undefined;
        }
        else {
            draft.document.statementOfMeans.employers = draft.document.statementOfMeans.selfEmployment = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        if (form.model.declared === false) {
            res.redirect(paths_1.StatementOfMeansPaths.unemployedPage.evaluateUri({ externalId: externalId }));
        }
        else {
            if (form.model.employed) {
                res.redirect(paths_1.StatementOfMeansPaths.employersPage.evaluateUri({ externalId: externalId }));
            }
            else {
                res.redirect(paths_1.StatementOfMeansPaths.selfEmploymentPage.evaluateUri({ externalId: externalId }));
            }
        }
    }
}));
