"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const claimValidator_1 = require("utils/claimValidator");
const claimAmountBreakdown_1 = require("claim/form/models/claimAmountBreakdown");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
function renderView(form, res) {
    res.render(paths_1.Paths.amountPage.associatedView, {
        form: form,
        totalAmount: form.model.totalAmount(),
        canAddMoreRows: form.model.canAddMoreRows()
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
    .get(paths_1.Paths.amountPage.uri, (req, res) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(draft.document.amount), res);
})
    .post(paths_1.Paths.amountPage.uri, formValidator_1.FormValidator.requestHandler(claimAmountBreakdown_1.ClaimAmountBreakdown, claimAmountBreakdown_1.ClaimAmountBreakdown.fromObject, undefined, ['addRow']), actionHandler, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        form.model.removeExcessRows();
        claimValidator_1.ClaimValidator.claimAmount(form.model.totalAmount());
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        draft.document.amount = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.interestPage.uri);
    }
}));
