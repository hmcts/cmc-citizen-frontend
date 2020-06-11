"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const claimantTimeline_1 = require("claim/form/models/claimantTimeline");
const page = paths_1.Paths.timelinePage;
function renderView(form, res) {
    res.render(page.associatedView, {
        form: form
    });
}
function actionHandler(req, res, next) {
    if (req.body.action) {
        const form = req.body;
        if (req.body.action.addRow) {
            form.model.appendRow();
        }
        return renderView(form, res);
    }
    next();
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, async (req, res, next) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(draft.document.timeline), res);
})
    .post(page.uri, formValidator_1.FormValidator.requestHandler(claimantTimeline_1.ClaimantTimeline, claimantTimeline_1.ClaimantTimeline.fromObject, undefined, ['addRow']), actionHandler, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        form.model.removeExcessRows();
        draft.document.timeline = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.evidencePage.uri);
    }
}));
