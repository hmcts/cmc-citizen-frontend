"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const interestHowMuch_1 = require("claim/form/models/interestHowMuch");
const interestRateOption_1 = require("claim/form/models/interestRateOption");
function renderView(form, res) {
    res.render(paths_1.Paths.interestHowMuchPage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.interestHowMuchPage.uri, (req, res) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(draft.document.interestHowMuch), res);
})
    .post(paths_1.Paths.interestHowMuchPage.uri, formValidator_1.FormValidator.requestHandler(interestHowMuch_1.InterestHowMuch, interestHowMuch_1.InterestHowMuch.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        if (form.model.type === interestRateOption_1.InterestRateOption.STANDARD) {
            draft.document.interestHowMuch.dailyAmount = undefined;
        }
        draft.document.interestHowMuch = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.totalPage.uri);
    }
}));
