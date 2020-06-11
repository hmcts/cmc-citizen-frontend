"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const errorHandling_1 = require("shared/errorHandling");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const draftService_1 = require("services/draftService");
const momentFactory_1 = require("shared/momentFactory");
const interestStartDate_1 = require("claim/form/models/interestStartDate");
function renderView(form, res) {
    const pastDate = momentFactory_1.MomentFactory.currentDate().subtract(1, 'year');
    res.render(paths_1.Paths.interestStartDatePage.associatedView, {
        form: form,
        pastDate: pastDate
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.interestStartDatePage.uri, (req, res) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(draft.document.interestStartDate), res);
})
    .post(paths_1.Paths.interestStartDatePage.uri, formValidator_1.FormValidator.requestHandler(interestStartDate_1.InterestStartDate, interestStartDate_1.InterestStartDate.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        draft.document.interestStartDate = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.interestEndDatePage.uri);
    }
}));
