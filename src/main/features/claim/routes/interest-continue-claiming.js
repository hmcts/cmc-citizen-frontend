"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const interestContinueClaiming_1 = require("claim/form/models/interestContinueClaiming");
const yesNoOption_1 = require("models/yesNoOption");
function renderView(form, res) {
    res.render(paths_1.Paths.interestContinueClaimingPage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.interestContinueClaimingPage.uri, (req, res) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(draft.document.interestContinueClaiming), res);
})
    .post(paths_1.Paths.interestContinueClaimingPage.uri, formValidator_1.FormValidator.requestHandler(interestContinueClaiming_1.InterestContinueClaiming, interestContinueClaiming_1.InterestContinueClaiming.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        draft.document.interestContinueClaiming = form.model;
        if (form.model.option === yesNoOption_1.YesNoOption.NO) {
            draft.document.interestHowMuch = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (form.model.option === yesNoOption_1.YesNoOption.NO) {
            res.redirect(paths_1.Paths.totalPage.uri);
        }
        else {
            res.redirect(paths_1.Paths.interestHowMuchPage.uri);
        }
    }
}));
