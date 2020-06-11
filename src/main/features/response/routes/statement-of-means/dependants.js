"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const dependants_1 = require("response/form/models/statement-of-means/dependants");
const disability_1 = require("response/form/models/statement-of-means/disability");
const severeDisability_1 = require("response/form/models/statement-of-means/severeDisability");
const cohabiting_1 = require("response/form/models/statement-of-means/cohabiting");
const partnerDisability_1 = require("response/form/models/statement-of-means/partnerDisability");
const page = paths_1.StatementOfMeansPaths.dependantsPage;
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), (req, res) => {
    const draft = res.locals.responseDraft;
    res.render(page.associatedView, { form: new form_1.Form(draft.document.statementOfMeans.dependants) });
})
    .post(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), formValidator_1.FormValidator.requestHandler(dependants_1.Dependants, dependants_1.Dependants.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        res.render(page.associatedView, { form: form });
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.statementOfMeans.dependants = form.model;
        // skip if defendant and partner are both disabled, or if defendant is severely disabled
        const defendantIsDisabled = draft.document.statementOfMeans.disability.option === disability_1.DisabilityOption.YES;
        const defendantIsSeverelyDisabled = draft.document.statementOfMeans.severeDisability
            && draft.document.statementOfMeans.severeDisability.option === severeDisability_1.SevereDisabilityOption.YES;
        const partnerIsDisabled = draft.document.statementOfMeans.cohabiting.option === cohabiting_1.CohabitingOption.YES
            && draft.document.statementOfMeans.partnerDisability.option === partnerDisability_1.PartnerDisabilityOption.YES;
        // also skip if there aren't any children
        const hasChildren = form.model.numberOfChildren && totalNumberOfChildren(form.model) > 0;
        const skipDisabilityQuestion = !hasChildren || (defendantIsDisabled && partnerIsDisabled) || defendantIsSeverelyDisabled;
        if (!form.model.numberOfChildren || !form.model.numberOfChildren.between16and19) {
            draft.document.statementOfMeans.education = undefined;
        }
        if (skipDisabilityQuestion) {
            draft.document.statementOfMeans.dependantsDisability = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        if (form.model.numberOfChildren && form.model.numberOfChildren.between16and19) {
            res.redirect(paths_1.StatementOfMeansPaths.educationPage.evaluateUri({ externalId: externalId }));
        }
        else if (skipDisabilityQuestion) {
            res.redirect(paths_1.StatementOfMeansPaths.otherDependantsPage.evaluateUri({ externalId: externalId }));
        }
        else {
            res.redirect(paths_1.StatementOfMeansPaths.dependantsDisabilityPage.evaluateUri({ externalId: externalId }));
        }
    }
}));
function totalNumberOfChildren(dependants) {
    let count = 0;
    count += dependants.numberOfChildren.under11 || 0;
    count += dependants.numberOfChildren.between11and15 || 0;
    count += dependants.numberOfChildren.between16and19 || 0;
    return count;
}
