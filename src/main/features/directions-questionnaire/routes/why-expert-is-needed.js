"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-default-export */
const express = require("express");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const paths_1 = require("directions-questionnaire/paths");
const whyExpertIsNeeded_1 = require("directions-questionnaire/forms/models/whyExpertIsNeeded");
function renderPage(res, form) {
    res.render(paths_1.Paths.whyExpertIsNeededPage.associatedView, { form: form });
}
exports.default = express.Router()
    .get(paths_1.Paths.whyExpertIsNeededPage.uri, (req, res) => {
    const draft = res.locals.draft;
    renderPage(res, new form_1.Form(draft.document.whyExpertIsNeeded));
})
    .post(paths_1.Paths.whyExpertIsNeededPage.uri, formValidator_1.FormValidator.requestHandler(whyExpertIsNeeded_1.WhyExpertIsNeeded, whyExpertIsNeeded_1.WhyExpertIsNeeded.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderPage(res, form);
    }
    else {
        const draft = res.locals.draft;
        const user = res.locals.user;
        draft.document.whyExpertIsNeeded = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.selfWitnessPage.evaluateUri({ externalId: res.locals.claim.externalId }));
    }
}));
