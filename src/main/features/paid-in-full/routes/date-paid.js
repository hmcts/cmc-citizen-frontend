"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("paid-in-full/paths");
const errorHandling_1 = require("shared/errorHandling");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const datePaid_1 = require("paid-in-full/form/models/datePaid");
const claimStoreClient_1 = require("claims/claimStoreClient");
function renderView(form, res) {
    res.render(paths_1.Paths.datePaidPage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.datePaidPage.uri, (req, res) => {
    const draft = res.locals.paidInFullDraft;
    renderView(new form_1.Form(draft.document.datePaid), res);
})
    .post(paths_1.Paths.datePaidPage.uri, formValidator_1.FormValidator.requestHandler(datePaid_1.DatePaid, datePaid_1.DatePaid.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.paidInFullDraft;
        const user = res.locals.user;
        draft.document.datePaid = form.model;
        const { externalId } = req.params;
        await new claimStoreClient_1.ClaimStoreClient().savePaidInFull(externalId, user, draft.document);
        res.redirect(paths_1.Paths.confirmationPage.uri.replace(':externalId', externalId));
    }
}));
