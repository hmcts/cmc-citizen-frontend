"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const paths_1 = require("claimant-response/paths");
const settleAdmitted_1 = require("claimant-response/form/models/settleAdmitted");
const paymentOption_1 = require("claims/models/paymentOption");
function renderView(form, res) {
    const claim = res.locals.claim;
    const hasPaymentIntention = claim.response.paymentIntention.paymentOption !== paymentOption_1.PaymentOption.IMMEDIATELY;
    res.render(paths_1.Paths.settleAdmittedPage.associatedView, {
        form: form,
        claim: claim,
        hasPaymentIntention: hasPaymentIntention
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.settleAdmittedPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.claimantResponseDraft;
    renderView(new form_1.Form(draft.document.settleAdmitted), res);
}))
    .post(paths_1.Paths.settleAdmittedPage.uri, formValidator_1.FormValidator.requestHandler(settleAdmitted_1.SettleAdmitted, settleAdmitted_1.SettleAdmitted.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimantResponseDraft;
        const user = res.locals.user;
        draft.document.settleAdmitted = form.model;
        draft.document.acceptPaymentMethod = undefined;
        draft.document.alternatePaymentMethod = undefined;
        draft.document.formaliseRepaymentPlan = undefined;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
    }
}));
