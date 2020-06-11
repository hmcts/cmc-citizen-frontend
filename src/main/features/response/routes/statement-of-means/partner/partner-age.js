"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("response/paths");
const express = require("express");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const form_1 = require("main/app/forms/form");
const formValidator_1 = require("main/app/forms/validation/formValidator");
const errorHandling_1 = require("main/common/errorHandling");
const draftService_1 = require("services/draftService");
const partnerAge_1 = require("response/form/models/statement-of-means/partnerAge");
const disability_1 = require("response/form/models/statement-of-means/disability");
const page = paths_1.StatementOfMeansPaths.partnerAgePage;
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), (req, res) => {
    const draft = res.locals.responseDraft;
    res.render(page.associatedView, {
        form: new form_1.Form(draft.document.statementOfMeans.partnerAge)
    });
})
    .post(page.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), formValidator_1.FormValidator.requestHandler(partnerAge_1.PartnerAge), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    const { externalId } = req.params;
    if (form.hasErrors()) {
        res.render(page.associatedView, { form: form });
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.statementOfMeans.partnerAge = form.model;
        if (form.model.option === partnerAge_1.PartnerAgeOption.NO) {
            draft.document.statementOfMeans.partnerPension = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (form.model.option === partnerAge_1.PartnerAgeOption.YES) {
            res.redirect(paths_1.StatementOfMeansPaths.partnerPensionPage.evaluateUri({ externalId: externalId }));
        }
        else if (draft.document.statementOfMeans.disability && draft.document.statementOfMeans.disability.option === disability_1.DisabilityOption.YES) {
            res.redirect(paths_1.StatementOfMeansPaths.partnerDisabilityPage.evaluateUri({ externalId: externalId }));
        }
        else {
            res.redirect(paths_1.StatementOfMeansPaths.dependantsPage.evaluateUri({ externalId: externalId }));
        }
    }
}));
