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
const freeMediation_1 = require("forms/models/freeMediation");
const CanWeUseCompany_1 = require("mediation/form/models/CanWeUseCompany");
function renderView(form, res) {
    res.render(paths_1.Paths.canWeUseCompanyPage.associatedView, {
        form: form,
        contactName: getContactName(res)
    });
}
function getPhoneNumber(res) {
    const claim = res.locals.claim;
    if (!claim.isResponseSubmitted()) {
        const draftResponse = res.locals.responseDraft;
        return draftResponse.document.defendantDetails.phone ? draftResponse.document.defendantDetails.phone.number : undefined;
    }
    else {
        return claim.claimData.claimant.phone;
    }
}
function getContactName(res) {
    const claim = res.locals.claim;
    if (!claim.isResponseSubmitted()) {
        const draftResponse = res.locals.responseDraft;
        return draftResponse.document.defendantDetails.partyDetails.contactPerson ? draftResponse.document.defendantDetails.partyDetails.contactPerson : undefined;
    }
    else {
        return claim.claimData.claimant.contactPerson;
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.canWeUseCompanyPage.uri, (req, res) => {
    const draft = res.locals.mediationDraft;
    if (!draft.document.canWeUseCompany) {
        draft.document.canWeUseCompany = CanWeUseCompany_1.CanWeUseCompany.fromObject({ mediationPhoneNumberConfirmation: getPhoneNumber(res) });
    }
    renderView(new form_1.Form(draft.document.canWeUseCompany), res);
})
    .post(paths_1.Paths.canWeUseCompanyPage.uri, formValidator_1.FormValidator.requestHandler(CanWeUseCompany_1.CanWeUseCompany, CanWeUseCompany_1.CanWeUseCompany.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const claim = res.locals.claim;
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.mediationDraft;
        const user = res.locals.user;
        draft.document.canWeUseCompany = form.model;
        if (form.model.option === freeMediation_1.FreeMediationOption.YES) {
            draft.document.canWeUseCompany.mediationContactPerson = undefined;
            draft.document.canWeUseCompany.mediationPhoneNumber = undefined;
        }
        else {
            draft.document.canWeUseCompany.mediationPhoneNumberConfirmation = undefined;
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
