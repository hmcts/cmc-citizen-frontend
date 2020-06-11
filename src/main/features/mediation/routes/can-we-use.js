"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("mediation/paths");
const paths_2 = require("response/paths");
const paths_3 = require("claimant-response/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const CanWeUse_1 = require("mediation/form/models/CanWeUse");
const freeMediation_1 = require("forms/models/freeMediation");
function renderView(form, res) {
    const claim = res.locals.claim;
    let phoneNumber;
    if (!claim.isResponseSubmitted()) {
        const draftResponse = res.locals.responseDraft;
        phoneNumber = draftResponse.document.defendantDetails.phone ? draftResponse.document.defendantDetails.phone.number : undefined;
    }
    else {
        phoneNumber = claim.claimData.claimant.phone;
    }
    res.render(paths_1.Paths.canWeUsePage.associatedView, {
        form: form,
        phoneNumber: phoneNumber
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.canWeUsePage.uri, (req, res) => {
    const draft = res.locals.mediationDraft;
    renderView(new form_1.Form(draft.document.canWeUse), res);
})
    .post(paths_1.Paths.canWeUsePage.uri, formValidator_1.FormValidator.requestHandler(CanWeUse_1.CanWeUse, CanWeUse_1.CanWeUse.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const claim = res.locals.claim;
        const draft = res.locals.mediationDraft;
        const user = res.locals.user;
        draft.document.canWeUse = form.model;
        if (form.model.option === freeMediation_1.FreeMediationOption.YES) {
            draft.document.canWeUse.mediationPhoneNumber = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (!claim.isResponseSubmitted()) {
            res.redirect(paths_2.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
        }
        else {
            res.redirect(paths_3.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
        }
    }
}));
