"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const phone_1 = require("forms/models/phone");
function renderView(form, res) {
    res.render(paths_1.Paths.defendantPhonePage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.defendantPhonePage.uri, (req, res, next) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(draft.document.defendant.phone), res);
})
    .post(paths_1.Paths.defendantPhonePage.uri, formValidator_1.FormValidator.requestHandler(phone_1.Phone, phone_1.Phone.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        draft.document.defendant.phone = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.taskListPage.uri);
    }
}));
