"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const interestType_1 = require("claim/form/models/interestType");
function renderView(form, res) {
    res.render(paths_1.Paths.interestTypePage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.interestTypePage.uri, (req, res) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(draft.document.interestType), res);
})
    .post(paths_1.Paths.interestTypePage.uri, formValidator_1.FormValidator.requestHandler(interestType_1.InterestType, interestType_1.InterestType.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        if (form.model.option === interestType_1.InterestTypeOption.SAME_RATE) {
            draft.document.interestTotal = undefined;
            draft.document.interestContinueClaiming = undefined;
            draft.document.interestHowMuch = undefined;
        }
        else {
            draft.document.interestRate = undefined;
            draft.document.interestDate = undefined;
            draft.document.interestStartDate = undefined;
            draft.document.interestEndDate = undefined;
        }
        draft.document.interestType = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (form.model.option === interestType_1.InterestTypeOption.SAME_RATE) {
            res.redirect(paths_1.Paths.interestRatePage.uri);
        }
        else {
            res.redirect(paths_1.Paths.interestTotalPage.uri);
        }
    }
}));
