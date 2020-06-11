"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const defence_1 = require("response/form/models/defence");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
async function renderView(form, res, next) {
    try {
        const claim = res.locals.claim;
        res.render(paths_1.Paths.defencePage.associatedView, {
            form: form,
            claim: claim
        });
    }
    catch (err) {
        next(err);
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.defencePage.uri, async (req, res, next) => {
    const draft = res.locals.responseDraft;
    await renderView(new form_1.Form(draft.document.defence), res, next);
})
    .post(paths_1.Paths.defencePage.uri, formValidator_1.FormValidator.requestHandler(defence_1.Defence), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        await renderView(form, res, next);
    }
    else {
        const claim = res.locals.claim;
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.defence = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.timelinePage.evaluateUri({ externalId: claim.externalId }));
    }
}));
