"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const alreadyPaid_1 = require("response/form/models/alreadyPaid");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const partialAdmissionGuard_1 = require("response/guards/partialAdmissionGuard");
const yesNoOption_1 = require("models/yesNoOption");
const optInFeatureToggleGuard_1 = require("guards/optInFeatureToggleGuard");
const page = paths_1.PartAdmissionPaths.alreadyPaidPage;
function renderView(form, res) {
    res.render(page.associatedView, {
        form: form
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, partialAdmissionGuard_1.PartialAdmissionGuard.requestHandler(), optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.partialAdmission.alreadyPaid), res);
}))
    .post(page.uri, partialAdmissionGuard_1.PartialAdmissionGuard.requestHandler(), optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), formValidator_1.FormValidator.requestHandler(alreadyPaid_1.AlreadyPaid, alreadyPaid_1.AlreadyPaid.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.partialAdmission.alreadyPaid = form.model;
        draft.document.fullAdmission = draft.document.rejectAllOfClaim = undefined;
        if (draft.document.partialAdmission.alreadyPaid.option === yesNoOption_1.YesNoOption.YES) {
            draft.document.partialAdmission.howMuchDoYouOwe = undefined;
        }
        else {
            draft.document.partialAdmission.howMuchHaveYouPaid = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
    }
}));
