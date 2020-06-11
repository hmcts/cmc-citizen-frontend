"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const guardFactory_1 = require("response/guards/guardFactory");
const paths_1 = require("response/paths");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const selfEmployment_1 = require("response/form/models/statement-of-means/selfEmployment");
const draftService_1 = require("services/draftService");
const uuidUtils_1 = require("shared/utils/uuidUtils");
const page = paths_1.StatementOfMeansPaths.selfEmploymentPage;
const stateGuardRequestHandler = guardFactory_1.GuardFactory.create((res) => {
    const draft = res.locals.responseDraft;
    return draft.document.statementOfMeans.employment !== undefined
        && draft.document.statementOfMeans.employment.declared === true
        && draft.document.statementOfMeans.employment.selfEmployed === true;
}, (req, res) => {
    res.redirect(paths_1.StatementOfMeansPaths.employmentPage.evaluateUri({ externalId: uuidUtils_1.UUIDUtils.extractFrom(req.path) }));
});
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), stateGuardRequestHandler, (req, res) => {
    const draft = res.locals.responseDraft;
    res.render(page.associatedView, { form: new form_1.Form(draft.document.statementOfMeans.selfEmployment) });
})
    .post(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), stateGuardRequestHandler, formValidator_1.FormValidator.requestHandler(selfEmployment_1.SelfEmployment, selfEmployment_1.SelfEmployment.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        res.render(page.associatedView, { form: form });
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.statementOfMeans.selfEmployment = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        res.redirect(paths_1.StatementOfMeansPaths.onTaxPaymentsPage.evaluateUri({ externalId: externalId }));
    }
}));
