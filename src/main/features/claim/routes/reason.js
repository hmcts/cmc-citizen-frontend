"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const reason_1 = require("claim/form/models/reason");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
function renderView(form, res) {
    const draft = res.locals.claimDraft;
    const defendantName = (draft.document.defendant
        && draft.document.defendant.partyDetails
        && draft.document.defendant.partyDetails.name)
        ? draft.document.defendant.partyDetails.name : '';
    res.render(paths_1.Paths.reasonPage.associatedView, { form: form, defendantName: defendantName });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.reasonPage.uri, (req, res) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(draft.document.reason), res);
})
    .post(paths_1.Paths.reasonPage.uri, formValidator_1.FormValidator.requestHandler(reason_1.Reason), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        draft.document.reason = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.timelinePage.uri);
    }
}));
