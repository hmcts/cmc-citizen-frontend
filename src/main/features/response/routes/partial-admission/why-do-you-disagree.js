"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const partialAdmissionGuard_1 = require("response/guards/partialAdmissionGuard");
const whyDoYouDisagree_1 = require("response/form/models/whyDoYouDisagree");
const optInFeatureToggleGuard_1 = require("guards/optInFeatureToggleGuard");
const page = paths_1.PartAdmissionPaths.whyDoYouDisagreePage;
function renderView(form, res) {
    res.render(page.associatedView, {
        form: form,
        totalAmount: res.locals.claim.totalAmountTillToday
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), partialAdmissionGuard_1.PartialAdmissionGuard.requestHandler(), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.partialAdmission.whyDoYouDisagree), res);
}))
    .post(page.uri, optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), partialAdmissionGuard_1.PartialAdmissionGuard.requestHandler(), formValidator_1.FormValidator.requestHandler(whyDoYouDisagree_1.WhyDoYouDisagree, whyDoYouDisagree_1.WhyDoYouDisagree.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.partialAdmission.whyDoYouDisagree = form.model;
        draft.document.fullAdmission = draft.document.rejectAllOfClaim = undefined;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        res.redirect(paths_1.Paths.timelinePage.evaluateUri({ externalId: externalId }));
    }
}));
