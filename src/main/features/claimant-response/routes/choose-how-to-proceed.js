"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const errorHandling_1 = require("shared/errorHandling");
const formValidator_1 = require("forms/validation/formValidator");
const formaliseRepaymentPlan_1 = require("claimant-response/form/models/formaliseRepaymentPlan");
const form_1 = require("forms/form");
const draftService_1 = require("services/draftService");
const formaliseRepaymentPlanOption_1 = require("claimant-response/form/models/formaliseRepaymentPlanOption");
function renderView(form, res) {
    res.render(paths_1.Paths.chooseHowToProceedPage.associatedView, {
        form: form
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.chooseHowToProceedPage.uri, async (req, res, next) => {
    const draft = res.locals.claimantResponseDraft;
    renderView(new form_1.Form(draft.document.formaliseRepaymentPlan), res);
})
    .post(paths_1.Paths.chooseHowToProceedPage.uri, formValidator_1.FormValidator.requestHandler(formaliseRepaymentPlan_1.FormaliseRepaymentPlan, formaliseRepaymentPlan_1.FormaliseRepaymentPlan.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimantResponseDraft;
        const user = res.locals.user;
        draft.document.formaliseRepaymentPlan = form.model;
        switch (form.model.option) {
            case formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT:
                delete draft.document.paidAmount;
                delete draft.document.settlementAgreement;
                break;
            case formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT:
                delete draft.document.settlementAgreement;
                break;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const externalId = req.params.externalId;
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
    }
}));
