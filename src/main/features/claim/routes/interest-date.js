"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const errorHandling_1 = require("shared/errorHandling");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const interestDate_1 = require("claim/form/models/interestDate");
const draftService_1 = require("services/draftService");
const interestDateType_1 = require("common/interestDateType");
function renderView(form, res) {
    res.render(paths_1.Paths.interestDatePage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.interestDatePage.uri, (req, res) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(draft.document.interestDate), res);
})
    .post(paths_1.Paths.interestDatePage.uri, formValidator_1.FormValidator.requestHandler(interestDate_1.InterestDate, interestDate_1.InterestDate.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        draft.document.interestDate = form.model;
        if (form.model.type === interestDateType_1.InterestDateType.SUBMISSION) {
            draft.document.interestStartDate = undefined;
            draft.document.interestEndDate = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (form.model.type === interestDateType_1.InterestDateType.SUBMISSION) {
            res.redirect(paths_1.Paths.totalPage.uri);
        }
        else {
            res.redirect(paths_1.Paths.interestStartDatePage.uri);
        }
    }
}));
