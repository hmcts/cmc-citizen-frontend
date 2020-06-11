"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const howMuchHaveYouPaid_1 = require("response/form/models/howMuchHaveYouPaid");
const partialAdmissionGuard_1 = require("response/guards/partialAdmissionGuard");
const momentFactory_1 = require("shared/momentFactory");
const optInFeatureToggleGuard_1 = require("guards/optInFeatureToggleGuard");
const page = paths_1.PartAdmissionPaths.howMuchHaveYouPaidPage;
function renderView(form, res) {
    const pastDate = momentFactory_1.MomentFactory.currentDate().subtract(3, 'months');
    res.render(page.associatedView, {
        form: form,
        totalAmount: res.locals.claim.totalAmountTillToday,
        pastDate
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, partialAdmissionGuard_1.PartialAdmissionGuard.requestHandler(), optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.partialAdmission.howMuchHaveYouPaid), res);
}))
    .post(page.uri, partialAdmissionGuard_1.PartialAdmissionGuard.requestHandler(), optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), formValidator_1.FormValidator.requestHandler(howMuchHaveYouPaid_1.HowMuchHaveYouPaid, howMuchHaveYouPaid_1.HowMuchHaveYouPaid.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.partialAdmission.howMuchHaveYouPaid = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
    }
}));
