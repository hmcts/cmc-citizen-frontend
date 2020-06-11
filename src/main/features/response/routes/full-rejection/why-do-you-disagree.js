"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const whyDoYouDisagree_1 = require("response/form/models/whyDoYouDisagree");
const fullRejectionGuard_1 = require("response/guards/fullRejectionGuard");
const optInFeatureToggleGuard_1 = require("guards/optInFeatureToggleGuard");
const page = paths_1.FullRejectionPaths.whyDoYouDisagreePage;
function renderView(form, res) {
    res.render(page.associatedView, {
        form: form
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), fullRejectionGuard_1.FullRejectionGuard.requestHandler(), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.rejectAllOfClaim.whyDoYouDisagree), res);
}))
    .post(page.uri, optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), fullRejectionGuard_1.FullRejectionGuard.requestHandler(), formValidator_1.FormValidator.requestHandler(whyDoYouDisagree_1.WhyDoYouDisagree, whyDoYouDisagree_1.WhyDoYouDisagree.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.rejectAllOfClaim.whyDoYouDisagree = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        res.redirect(paths_1.Paths.timelinePage.evaluateUri({ externalId: externalId }));
    }
}));
