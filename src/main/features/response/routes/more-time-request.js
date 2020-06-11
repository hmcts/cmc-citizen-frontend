"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const moreTimeNeeded_1 = require("response/form/models/moreTimeNeeded");
const claimStoreClient_1 = require("claims/claimStoreClient");
const moreTimeAlreadyRequestedGuard_1 = require("response/guards/moreTimeAlreadyRequestedGuard");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const deadlineCalculatorClient_1 = require("claims/deadlineCalculatorClient");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
async function renderView(form, res, next) {
    try {
        const claim = res.locals.claim;
        const postponedDeadline = await deadlineCalculatorClient_1.DeadlineCalculatorClient.calculatePostponedDeadline(claim.issuedOn);
        const moreTimeDeadline = 'You’ll have to respond before 4pm on ' + postponedDeadline.format('LL');
        const responseDeadline = 'You’ll have to respond before 4pm on ' + claim.responseDeadline.format('LL');
        res.render(paths_1.Paths.moreTimeRequestPage.associatedView, {
            form: form,
            moreTimeDeadline: moreTimeDeadline,
            responseDeadline: responseDeadline
        });
    }
    catch (err) {
        next(err);
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.moreTimeRequestPage.uri, moreTimeAlreadyRequestedGuard_1.MoreTimeAlreadyRequestedGuard.requestHandler, async (req, res, next) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.moreTimeNeeded), res, next);
})
    .post(paths_1.Paths.moreTimeRequestPage.uri, moreTimeAlreadyRequestedGuard_1.MoreTimeAlreadyRequestedGuard.requestHandler, formValidator_1.FormValidator.requestHandler(moreTimeNeeded_1.MoreTimeNeeded), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res, next);
    }
    else {
        const claim = res.locals.claim;
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.moreTimeNeeded = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (form.model.option === moreTimeNeeded_1.MoreTimeNeededOption.YES) {
            await claimStoreClient.requestForMoreTime(claim.externalId, user);
            res.redirect(paths_1.Paths.moreTimeConfirmationPage.evaluateUri({ externalId: claim.externalId }));
        }
        else {
            res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
        }
    }
}));
