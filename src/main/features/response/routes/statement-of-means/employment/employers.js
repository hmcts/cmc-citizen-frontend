"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const guardFactory_1 = require("response/guards/guardFactory");
const paths_1 = require("response/paths");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const employers_1 = require("response/form/models/statement-of-means/employers");
const uuidUtils_1 = require("shared/utils/uuidUtils");
const page = paths_1.StatementOfMeansPaths.employersPage;
const stateGuardRequestHandler = guardFactory_1.GuardFactory.create((res) => {
    const draft = res.locals.responseDraft;
    return draft.document.statementOfMeans.employment !== undefined
        && draft.document.statementOfMeans.employment.declared === true
        && draft.document.statementOfMeans.employment.employed === true;
}, (req, res) => {
    res.redirect(paths_1.StatementOfMeansPaths.employmentPage.evaluateUri({ externalId: uuidUtils_1.UUIDUtils.extractFrom(req.path) }));
});
function renderView(form, res) {
    res.render(page.associatedView, {
        form: form,
        canAddMoreJobs: form.model.canAddMoreRows()
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
    .get(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), stateGuardRequestHandler, async (req, res) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.statementOfMeans.employers), res);
})
    .post(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), stateGuardRequestHandler, formValidator_1.FormValidator.requestHandler(employers_1.Employers, employers_1.Employers.fromObject, undefined, ['addRow']), actionHandler, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        form.model.removeExcessRows();
        draft.document.statementOfMeans.employers = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        if (draft.document.statementOfMeans.employment.selfEmployed) {
            res.redirect(paths_1.StatementOfMeansPaths.selfEmploymentPage.evaluateUri({ externalId: externalId }));
        }
        else {
            res.redirect(paths_1.StatementOfMeansPaths.courtOrdersPage.evaluateUri({ externalId: externalId }));
        }
    }
}));
