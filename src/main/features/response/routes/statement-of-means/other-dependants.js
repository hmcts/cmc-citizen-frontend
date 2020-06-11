"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const otherDependants_1 = require("response/form/models/statement-of-means/otherDependants");
const dependantsDisability_1 = require("response/form/models/statement-of-means/dependantsDisability");
const otherDependantsDisability_1 = require("response/form/models/statement-of-means/otherDependantsDisability");
const disability_1 = require("response/form/models/statement-of-means/disability");
const cohabiting_1 = require("response/form/models/statement-of-means/cohabiting");
const partnerDisability_1 = require("response/form/models/statement-of-means/partnerDisability");
const severeDisability_1 = require("response/form/models/statement-of-means/severeDisability");
const page = paths_1.StatementOfMeansPaths.otherDependantsPage;
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), (req, res) => {
    const draft = res.locals.responseDraft;
    res.render(page.associatedView, {
        form: new form_1.Form(draft.document.statementOfMeans.otherDependants)
    });
})
    .post(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), formValidator_1.FormValidator.requestHandler(otherDependants_1.OtherDependants, otherDependants_1.OtherDependants.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    const { externalId } = req.params;
    if (form.hasErrors()) {
        res.render(page.associatedView, { form: form });
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.statementOfMeans.otherDependants = form.model;
        // skip if any dependants are disabled, or if defendant and partner are both disabled, or if defendant is severely disabled
        const anyDisabledDependants = (draft.document.statementOfMeans.dependantsDisability && draft.document.statementOfMeans.dependantsDisability.option === dependantsDisability_1.DependantsDisabilityOption.YES)
            || (draft.document.statementOfMeans.otherDependantsDisability && draft.document.statementOfMeans.otherDependantsDisability.option === otherDependantsDisability_1.OtherDependantsDisabilityOption.YES);
        const defendantIsDisabled = draft.document.statementOfMeans.disability.option === disability_1.DisabilityOption.YES;
        const partnerIsDisabled = draft.document.statementOfMeans.cohabiting.option === cohabiting_1.CohabitingOption.YES
            && draft.document.statementOfMeans.partnerDisability.option === partnerDisability_1.PartnerDisabilityOption.YES;
        const defendantIsSeverelyDisabled = draft.document.statementOfMeans.severeDisability
            && draft.document.statementOfMeans.severeDisability.option === severeDisability_1.SevereDisabilityOption.YES;
        const skipCarerPage = anyDisabledDependants || (defendantIsDisabled && partnerIsDisabled) || defendantIsSeverelyDisabled;
        if (skipCarerPage) {
            draft.document.statementOfMeans.carer = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (skipCarerPage) {
            res.redirect(paths_1.StatementOfMeansPaths.employmentPage.evaluateUri({ externalId: externalId }));
        }
        else {
            res.redirect(paths_1.StatementOfMeansPaths.carerPage.evaluateUri({ externalId: externalId }));
        }
    }
}));
