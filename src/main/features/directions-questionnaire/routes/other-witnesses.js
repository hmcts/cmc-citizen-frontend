"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("directions-questionnaire/paths");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const draftService_1 = require("services/draftService");
const errorHandling_1 = require("shared/errorHandling");
const otherWitnesses_1 = require("directions-questionnaire/forms/models/otherWitnesses");
function renderPage(res, form) {
    res.render(paths_1.Paths.otherWitnessesPage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.otherWitnessesPage.uri, (req, res) => {
    const draft = res.locals.draft;
    renderPage(res, new form_1.Form(draft.document.otherWitnesses));
})
    .post(paths_1.Paths.otherWitnessesPage.uri, formValidator_1.FormValidator.requestHandler(otherWitnesses_1.OtherWitnesses, otherWitnesses_1.OtherWitnesses.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderPage(res, form);
    }
    else {
        const draft = res.locals.draft;
        const user = res.locals.user;
        draft.document.otherWitnesses = form.model;
        if (draft.document.otherWitnesses.otherWitnesses === false) {
            draft.document.otherWitnesses.howMany = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.hearingDatesPage.evaluateUri({ externalId: res.locals.claim.externalId }));
    }
}));
