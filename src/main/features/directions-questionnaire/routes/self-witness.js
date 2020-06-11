"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("directions-questionnaire/paths");
const formValidator_1 = require("forms/validation/formValidator");
const selfWitness_1 = require("directions-questionnaire/forms/models/selfWitness");
const form_1 = require("forms/form");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
function renderPage(res, form) {
    res.render(paths_1.Paths.selfWitnessPage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.selfWitnessPage.uri, (req, res) => {
    const draft = res.locals.draft;
    renderPage(res, new form_1.Form(draft.document.selfWitness));
})
    .post(paths_1.Paths.selfWitnessPage.uri, formValidator_1.FormValidator.requestHandler(selfWitness_1.SelfWitness, selfWitness_1.SelfWitness.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderPage(res, form);
    }
    else {
        const draft = res.locals.draft;
        const user = res.locals.user;
        draft.document.selfWitness = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.otherWitnessesPage.evaluateUri({ externalId: res.locals.claim.externalId }));
    }
}));
