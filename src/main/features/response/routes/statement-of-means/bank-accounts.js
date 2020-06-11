"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const bankAccounts_1 = require("response/form/models/statement-of-means/bankAccounts");
const page = paths_1.StatementOfMeansPaths.bankAccountsPage;
function renderView(form, res) {
    res.render(page.associatedView, { form: form });
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
    .get(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), async (req, res) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.statementOfMeans.bankAccounts), res);
})
    .post(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), formValidator_1.FormValidator.requestHandler(bankAccounts_1.BankAccounts, bankAccounts_1.BankAccounts.fromObject, undefined, ['addRow']), actionHandler, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const claim = res.locals.claim;
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        form.model.removeExcessRows();
        draft.document.statementOfMeans.bankAccounts = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.StatementOfMeansPaths.disabilityPage.evaluateUri({ externalId: claim.externalId }));
    }
}));
