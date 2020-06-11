"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const email_1 = require("forms/models/email");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const partyType_1 = require("common/partyType");
function renderView(form, res, draft) {
    const individual = draft.document.defendant.partyDetails.type === partyType_1.PartyType.INDIVIDUAL.value;
    res.render(paths_1.Paths.defendantEmailPage.associatedView, {
        form: form,
        individual: individual
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.defendantEmailPage.uri, (req, res) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(draft.document.defendant.email), res, draft);
})
    .post(paths_1.Paths.defendantEmailPage.uri, formValidator_1.FormValidator.requestHandler(email_1.Email), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    const draft = res.locals.claimDraft;
    if (form.hasErrors()) {
        renderView(form, res, draft);
    }
    else {
        const user = res.locals.user;
        draft.document.defendant.email = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.defendantPhonePage.uri);
    }
}));
