"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const errorHandling_1 = require("main/common/errorHandling");
const form_1 = require("main/app/forms/form");
const claimSettled_1 = require("claimant-response/form/models/states-paid/claimSettled");
const formValidator_1 = require("main/app/forms/validation/formValidator");
const draftService_1 = require("services/draftService");
const yesNoOption_1 = require("main/app/models/yesNoOption");
const statesPaidHelper_1 = require("claimant-response/helpers/statesPaidHelper");
function renderView(form, res) {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.settleClaimPage.associatedView, {
        form: form,
        totalAmount: statesPaidHelper_1.StatesPaidHelper.getAlreadyPaidAmount(claim),
        paidInFull: !statesPaidHelper_1.StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.settleClaimPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.claimantResponseDraft;
    renderView(new form_1.Form(draft.document.accepted), res);
}))
    .post(paths_1.Paths.settleClaimPage.uri, formValidator_1.FormValidator.requestHandler(claimSettled_1.ClaimSettled, claimSettled_1.ClaimSettled.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimantResponseDraft;
        draft.document.accepted = form.model;
        if (form.model.accepted.option === yesNoOption_1.YesNoOption.YES.option) {
            draft.document.rejectionReason = undefined;
            draft.document.freeMediation = undefined;
        }
        await new draftService_1.DraftService().save(draft, res.locals.user.bearerToken);
        if (draft.document.accepted.accepted.option === yesNoOption_1.YesNoOption.NO.option) {
            res.redirect(paths_1.Paths.rejectionReasonPage.evaluateUri({ externalId: res.locals.claim.externalId }));
        }
        else {
            res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }));
        }
    }
}));
