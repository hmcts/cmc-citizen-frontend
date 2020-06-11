"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const dateOfBirth_1 = require("forms/models/dateOfBirth");
const partyType_1 = require("common/partyType");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const dateUnder18Pattern = dateOfBirth_1.ValidationErrors.DATE_UNDER_18.replace('%s', '.*');
function renderView(form, res) {
    res.render(paths_1.Paths.defendantDateOfBirthPage.associatedView, {
        form: form
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.defendantDateOfBirthPage.uri, (req, res) => {
    const claim = res.locals.claim;
    const draft = res.locals.responseDraft;
    switch (draft.document.defendantDetails.partyDetails.type) {
        case partyType_1.PartyType.INDIVIDUAL.value:
            renderView(new form_1.Form(draft.document.defendantDetails.partyDetails.dateOfBirth), res);
            break;
        default:
            res.redirect(paths_1.Paths.defendantPhonePage.evaluateUri({ externalId: claim.externalId }));
            break;
    }
})
    .post(paths_1.Paths.defendantDateOfBirthPage.uri, formValidator_1.FormValidator.requestHandler(dateOfBirth_1.DateOfBirth, dateOfBirth_1.DateOfBirth.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    const claim = res.locals.claim;
    if (form.hasErrors()) {
        if (form.errors.some(error => error.message.search(dateUnder18Pattern) >= 0)) {
            res.redirect(paths_1.Paths.under18Page.evaluateUri({ externalId: claim.externalId }));
        }
        else {
            renderView(form, res);
        }
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        switch (draft.document.defendantDetails.partyDetails.type) {
            case partyType_1.PartyType.INDIVIDUAL.value:
                draft.document.defendantDetails.partyDetails.dateOfBirth = form.model;
                break;
            default:
                throw Error('Date of birth is only supported for defendant types individual and sole trader');
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (claim.claimData.defendant.phone === undefined) {
            res.redirect(paths_1.Paths.defendantPhonePage.evaluateUri({ externalId: claim.externalId }));
        }
        else {
            res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
        }
    }
}));
