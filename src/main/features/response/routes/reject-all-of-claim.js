"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const responseType_1 = require("response/form/models/responseType");
const rejectAllOfClaim_1 = require("response/form/models/rejectAllOfClaim");
const errorHandling_1 = require("shared/errorHandling");
const guardFactory_1 = require("response/guards/guardFactory");
const draftService_1 = require("services/draftService");
function isRequestAllowed(res) {
    const draft = res.locals.responseDraft;
    return draft.document.response !== undefined
        && draft.document.response.type === responseType_1.ResponseType.DEFENCE;
}
function accessDeniedCallback(req, res) {
    const claim = res.locals.claim;
    res.redirect(paths_1.Paths.responseTypePage.evaluateUri({ externalId: claim.externalId }));
}
const guardRequestHandler = guardFactory_1.GuardFactory.create(isRequestAllowed, accessDeniedCallback);
function renderView(form, res) {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.defenceRejectAllOfClaimPage.associatedView, {
        form: form,
        claimantName: claim.claimData.claimant.name
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.defenceRejectAllOfClaimPage.uri, guardRequestHandler, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.rejectAllOfClaim), res);
}))
    .post(paths_1.Paths.defenceRejectAllOfClaimPage.uri, guardRequestHandler, formValidator_1.FormValidator.requestHandler(rejectAllOfClaim_1.RejectAllOfClaim), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.rejectAllOfClaim = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        switch (draft.document.rejectAllOfClaim.option) {
            case rejectAllOfClaim_1.RejectAllOfClaimOption.COUNTER_CLAIM:
                res.redirect(paths_1.Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }));
                break;
            case rejectAllOfClaim_1.RejectAllOfClaimOption.ALREADY_PAID:
            case rejectAllOfClaim_1.RejectAllOfClaimOption.DISPUTE:
                res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
                break;
            default:
                throw new Error(`Unknown rejection option: ${draft.document.rejectAllOfClaim.option}`);
        }
    }
}));
