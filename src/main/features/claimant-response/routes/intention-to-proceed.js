"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const errorHandling_1 = require("main/common/errorHandling");
const form_1 = require("main/app/forms/form");
const formValidator_1 = require("main/app/forms/validation/formValidator");
const draftService_1 = require("services/draftService");
const intentionToProceed_1 = require("claimant-response/form/models/intentionToProceed");
const yesNoOption_1 = require("claims/models/response/core/yesNoOption");
function renderView(form, res) {
    res.render(paths_1.Paths.intentionToProceedPage.associatedView, {
        form: form
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.intentionToProceedPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.claimantResponseDraft;
    renderView(new form_1.Form(draft.document.intentionToProceed), res);
}))
    .post(paths_1.Paths.intentionToProceedPage.uri, formValidator_1.FormValidator.requestHandler(intentionToProceed_1.IntentionToProceed, intentionToProceed_1.IntentionToProceed.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimantResponseDraft;
        const mediationDraft = res.locals.mediationDraft;
        const user = res.locals.user;
        if (form.model.proceed.option === yesNoOption_1.YesNoOption.NO && mediationDraft.id) {
            await new draftService_1.DraftService().delete(mediationDraft.id, user.bearerToken);
        }
        draft.document.intentionToProceed = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }));
    }
}));
