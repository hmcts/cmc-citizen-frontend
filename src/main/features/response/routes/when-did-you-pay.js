"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("features/response/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const whenDidYouPay_1 = require("features/response/form/models/whenDidYouPay");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
function renderView(form, res) {
    res.render(paths_1.Paths.whenDidYouPay.associatedView, {
        form: form
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.whenDidYouPay.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.whenDidYouPay), res);
}))
    .post(paths_1.Paths.whenDidYouPay.uri, formValidator_1.FormValidator.requestHandler(whenDidYouPay_1.WhenDidYouPay, whenDidYouPay_1.WhenDidYouPay.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.whenDidYouPay = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const claim = res.locals.claim;
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
    }
}));
