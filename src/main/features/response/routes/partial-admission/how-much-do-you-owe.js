"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const howMuchDoYouOwe_1 = require("response/form/models/howMuchDoYouOwe");
const partialAdmissionGuard_1 = require("response/guards/partialAdmissionGuard");
const optInFeatureToggleGuard_1 = require("guards/optInFeatureToggleGuard");
const page = paths_1.PartAdmissionPaths.howMuchDoYouOwePage;
function renderView(form, res) {
    res.render(page.associatedView, {
        form: form,
        totalAmount: res.locals.claim.totalAmountTillToday
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, partialAdmissionGuard_1.PartialAdmissionGuard.requestHandler(), optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.partialAdmission.howMuchDoYouOwe), res);
}))
    .post(page.uri, partialAdmissionGuard_1.PartialAdmissionGuard.requestHandler(), optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), formValidator_1.FormValidator.requestHandler(howMuchDoYouOwe_1.HowMuchDoYouOwe, howMuchDoYouOwe_1.HowMuchDoYouOwe.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.partialAdmission.howMuchDoYouOwe = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
    }
}));
