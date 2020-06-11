"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("directions-questionnaire/paths");
const form_1 = require("forms/form");
const supportRequired_1 = require("directions-questionnaire/forms/models/supportRequired");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const directionsQuestionnaireHelper_1 = require("directions-questionnaire/helpers/directionsQuestionnaireHelper");
function renderPage(res, form) {
    res.render(paths_1.Paths.supportPage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.supportPage.uri, (req, res) => {
    const draft = res.locals.draft;
    renderPage(res, new form_1.Form(draft.document.supportRequired));
})
    .post(paths_1.Paths.supportPage.uri, formValidator_1.FormValidator.requestHandler(supportRequired_1.SupportRequired, supportRequired_1.SupportRequired.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderPage(res, form);
    }
    else {
        const draft = res.locals.draft;
        const user = res.locals.user;
        draft.document.supportRequired = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const claim = res.locals.claim;
        if (directionsQuestionnaireHelper_1.getUsersRole(claim, user) === directionsQuestionnaireHelper_1.getPreferredParty(claim)) {
            res.redirect(paths_1.Paths.hearingLocationPage.evaluateUri({ externalId: claim.externalId }));
        }
        else {
            res.redirect(paths_1.Paths.hearingExceptionalCircumstancesPage.evaluateUri({ externalId: claim.externalId }));
        }
    }
}));
