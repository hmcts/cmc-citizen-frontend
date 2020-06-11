"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const interest_1 = require("claim/form/models/interest");
const yesNoOption_1 = require("models/yesNoOption");
function renderView(form, res) {
    res.render(paths_1.Paths.interestPage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.interestPage.uri, (req, res) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(draft.document.interest), res);
})
    .post(paths_1.Paths.interestPage.uri, formValidator_1.FormValidator.requestHandler(interest_1.Interest, interest_1.Interest.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        if (form.model.option === yesNoOption_1.YesNoOption.NO) {
            draft.document.interestTotal = undefined;
            draft.document.interestContinueClaiming = undefined;
            draft.document.interestHowMuch = undefined;
            draft.document.interestRate = undefined;
            draft.document.interestDate = undefined;
            draft.document.interestStartDate = undefined;
            draft.document.interestEndDate = undefined;
            draft.document.interestType = undefined;
        }
        draft.document.interest = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (form.model.option === yesNoOption_1.YesNoOption.NO) {
            res.redirect(paths_1.Paths.totalPage.uri);
        }
        else {
            res.redirect(paths_1.Paths.interestTypePage.uri);
        }
    }
}));
