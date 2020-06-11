"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("ccj/paths");
const paths_2 = require("dashboard/paths");
const guardFactory_1 = require("response/guards/guardFactory");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const dateOfBirth_1 = require("forms/models/dateOfBirth");
const partyType_1 = require("common/partyType");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const logger = nodejs_logging_1.Logger.getLogger('ccj/guards/individualDateOfBirth');
const accessGuardRequestHandler = guardFactory_1.GuardFactory.create((res) => {
    const claim = res.locals.claim;
    return claim.claimData.defendant.type === partyType_1.PartyType.INDIVIDUAL.value;
}, (req, res) => {
    logger.warn(`CCJ state guard: defendant date of birth is only available for individual defendants - redirecting to dashboard page`);
    res.redirect(paths_2.Paths.dashboardPage.uri);
});
function renderView(form, res) {
    res.render(paths_1.Paths.dateOfBirthPage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.dateOfBirthPage.uri, accessGuardRequestHandler, (req, res) => {
    const draft = res.locals.ccjDraft;
    renderView(new form_1.Form(draft.document.defendantDateOfBirth), res);
})
    .post(paths_1.Paths.dateOfBirthPage.uri, accessGuardRequestHandler, formValidator_1.FormValidator.requestHandler(dateOfBirth_1.DateOfBirth, dateOfBirth_1.DateOfBirth.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.ccjDraft;
        const user = res.locals.user;
        draft.document.defendantDateOfBirth = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        res.redirect(paths_1.Paths.paidAmountPage.uri.replace(':externalId', externalId));
    }
}));
