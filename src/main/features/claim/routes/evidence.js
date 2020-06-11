"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const evidence_1 = require("forms/models/evidence");
const page = paths_1.Paths.evidencePage;
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
    renderView(new form_1.Form(draft.document.evidence), res);
})
    .post(page.uri, formValidator_1.FormValidator.requestHandler(evidence_1.Evidence, evidence_1.Evidence.fromObject, undefined, ['addRow']), actionHandler, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        form.model.removeExcessRows();
        draft.document.evidence = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.taskListPage.uri);
    }
}));
