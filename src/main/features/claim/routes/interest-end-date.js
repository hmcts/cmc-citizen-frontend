"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const errorHandling_1 = require("shared/errorHandling");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const draftService_1 = require("services/draftService");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
function renderView(form, res) {
    res.render(paths_1.Paths.interestEndDatePage.associatedView, {
        form: form
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.interestEndDatePage.uri, (req, res) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(draft.document.interestEndDate), res);
})
    .post(paths_1.Paths.interestEndDatePage.uri, formValidator_1.FormValidator.requestHandler(interestEndDate_1.InterestEndDate, interestEndDate_1.InterestEndDate.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        draft.document.interestEndDate = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.totalPage.uri);
    }
}));
