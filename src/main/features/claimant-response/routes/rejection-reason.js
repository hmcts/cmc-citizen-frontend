"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const errorHandling_1 = require("shared/errorHandling");
const rejectionReason_1 = require("claimant-response/form/models/rejectionReason");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const draftService_1 = require("services/draftService");
const statesPaidHelper_1 = require("claimant-response/helpers/statesPaidHelper");
const formaliseRepaymentPlanOption_1 = require("claimant-response/form/models/formaliseRepaymentPlanOption");
const formaliseRepaymentPlan_1 = require("claimant-response/form/models/formaliseRepaymentPlan");
function renderView(form, res) {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.rejectionReasonPage.associatedView, {
        form: form,
        alreadyPaid: statesPaidHelper_1.StatesPaidHelper.isResponseAlreadyPaid(claim)
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.rejectionReasonPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.claimantResponseDraft;
    renderView(new form_1.Form(draft.document.rejectionReason), res);
}))
    .post(paths_1.Paths.rejectionReasonPage.uri, formValidator_1.FormValidator.requestHandler(rejectionReason_1.RejectionReason), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimantResponseDraft;
        const user = res.locals.user;
        draft.document.settlementAgreement = undefined;
        draft.document.rejectionReason = form.model;
        if (!statesPaidHelper_1.StatesPaidHelper.isResponseAlreadyPaid(res.locals.claim)) {
            draft.document.formaliseRepaymentPlan = new formaliseRepaymentPlan_1.FormaliseRepaymentPlan(formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REFER_TO_JUDGE);
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
    }
}));
