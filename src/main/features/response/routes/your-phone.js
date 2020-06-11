"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const phone_1 = require("forms/models/phone");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
function renderView(form, res) {
    res.render(paths_1.Paths.defendantPhonePage.associatedView, {
        form: form
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.defendantPhonePage.uri, (req, res) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.defendantDetails.phone), res);
})
    .post(paths_1.Paths.defendantPhonePage.uri, formValidator_1.FormValidator.requestHandler(phone_1.Phone), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const claim = res.locals.claim;
        const draft = res.locals.responseDraft;
        const mediationDraft = res.locals.mediationDraft;
        const user = res.locals.user;
        if (draft.document.defendantDetails.phone &&
            draft.document.defendantDetails.phone.number !== form.model.number && mediationDraft) {
            mediationDraft.document.canWeUseCompany = undefined;
            mediationDraft.document.canWeUse = undefined;
            await new draftService_1.DraftService().save(mediationDraft, user.bearerToken);
        }
        draft.document.defendantDetails.phone = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
    }
}));
