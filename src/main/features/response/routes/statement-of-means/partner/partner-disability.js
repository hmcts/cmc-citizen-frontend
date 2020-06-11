"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("response/paths");
const express = require("express");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const form_1 = require("main/app/forms/form");
const formValidator_1 = require("main/app/forms/validation/formValidator");
const errorHandling_1 = require("main/common/errorHandling");
const draftService_1 = require("services/draftService");
const partnerDisability_1 = require("response/form/models/statement-of-means/partnerDisability");
const severeDisability_1 = require("response/form/models/statement-of-means/severeDisability");
const page = paths_1.StatementOfMeansPaths.partnerDisabilityPage;
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), (req, res) => {
    const draft = res.locals.responseDraft;
    res.render(page.associatedView, {
        form: new form_1.Form(draft.document.statementOfMeans.partnerDisability)
    });
})
    .post(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), formValidator_1.FormValidator.requestHandler(partnerDisability_1.PartnerDisability), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    const { externalId } = req.params;
    if (form.hasErrors()) {
        res.render(page.associatedView, { form: form });
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.statementOfMeans.partnerDisability = form.model;
        if (form.model.option === partnerDisability_1.PartnerDisabilityOption.NO) {
            draft.document.statementOfMeans.partnerSevereDisability = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (form.model.option === partnerDisability_1.PartnerDisabilityOption.YES
            && draft.document.statementOfMeans.severeDisability
            && draft.document.statementOfMeans.severeDisability.option === severeDisability_1.SevereDisabilityOption.YES) {
            res.redirect(paths_1.StatementOfMeansPaths.partnerSevereDisabilityPage.evaluateUri({ externalId: externalId }));
        }
        else {
            res.redirect(paths_1.StatementOfMeansPaths.dependantsPage.evaluateUri({ externalId: externalId }));
        }
    }
}));
