"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const guardFactory_1 = require("response/guards/guardFactory");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const education_1 = require("response/form/models/statement-of-means/education");
const uuidUtils_1 = require("shared/utils/uuidUtils");
const disability_1 = require("response/form/models/statement-of-means/disability");
const severeDisability_1 = require("response/form/models/statement-of-means/severeDisability");
const cohabiting_1 = require("response/form/models/statement-of-means/cohabiting");
const partnerDisability_1 = require("response/form/models/statement-of-means/partnerDisability");
const page = paths_1.StatementOfMeansPaths.educationPage;
const stateGuardRequestHandler = guardFactory_1.GuardFactory.create((res) => {
    const draft = res.locals.responseDraft;
    return draft.document.statementOfMeans.dependants !== undefined
        && draft.document.statementOfMeans.dependants.declared === true
        && draft.document.statementOfMeans.dependants.numberOfChildren.between16and19 > 0;
}, (req, res) => {
    res.redirect(paths_1.StatementOfMeansPaths.dependantsPage.evaluateUri({ externalId: uuidUtils_1.UUIDUtils.extractFrom(req.path) }));
});
function renderView(form, res) {
    const draft = res.locals.responseDraft;
    const numberOfChildren = draft.document.statementOfMeans.dependants.numberOfChildren;
    res.render(page.associatedView, {
        form: form,
        numberOfChildrenBetween16and19: (numberOfChildren && numberOfChildren.between16and19) || 0
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), stateGuardRequestHandler, (req, res) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.statementOfMeans.education), res);
})
    .post(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), stateGuardRequestHandler, formValidator_1.FormValidator.requestHandler(education_1.Education, education_1.Education.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.statementOfMeans.education = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        // skip if defendant and partner are both disabled, or if defendant is severely disabled
        const defendantIsDisabled = draft.document.statementOfMeans.disability.option === disability_1.DisabilityOption.YES;
        const defendantIsSeverelyDisabled = draft.document.statementOfMeans.severeDisability
            && draft.document.statementOfMeans.severeDisability.option === severeDisability_1.SevereDisabilityOption.YES;
        const partnerIsDisabled = draft.document.statementOfMeans.cohabiting.option === cohabiting_1.CohabitingOption.YES
            && draft.document.statementOfMeans.partnerDisability.option === partnerDisability_1.PartnerDisabilityOption.YES;
        const skipDisabilityQuestion = (defendantIsDisabled && partnerIsDisabled) || defendantIsSeverelyDisabled;
        if (skipDisabilityQuestion) {
            res.redirect(paths_1.StatementOfMeansPaths.otherDependantsPage.evaluateUri({ externalId: externalId }));
        }
        else {
            res.redirect(paths_1.StatementOfMeansPaths.dependantsDisabilityPage.evaluateUri({ externalId: externalId }));
        }
    }
}));
