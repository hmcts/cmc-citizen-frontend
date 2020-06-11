"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const organisationDetails_1 = require("forms/models/organisationDetails");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
function renderView(form, res) {
    res.render(paths_1.Paths.defendantOrganisationDetailsPage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.defendantOrganisationDetailsPage.uri, (req, res) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(draft.document.defendant.partyDetails), res);
})
    .post(paths_1.Paths.defendantOrganisationDetailsPage.uri, formValidator_1.FormValidator.requestHandler(organisationDetails_1.OrganisationDetails, organisationDetails_1.OrganisationDetails.fromObject, 'defendant'), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        draft.document.defendant.partyDetails = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.defendantEmailPage.uri);
    }
}));
