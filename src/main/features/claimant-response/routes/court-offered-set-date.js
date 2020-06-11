"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const formValidator_1 = require("main/app/forms/validation/formValidator");
const form_1 = require("main/app/forms/form");
const errorHandling_1 = require("main/common/errorHandling");
const draftService_1 = require("services/draftService");
const paths_1 = require("claimant-response/paths");
const yesNoOption_1 = require("models/yesNoOption");
const acceptCourtOffer_1 = require("claimant-response/form/models/acceptCourtOffer");
const decisionType_1 = require("common/court-calculations/decisionType");
function getPayBySetDate(draft, claimResponse) {
    const courtDetermination = draft.document.courtDetermination;
    switch (courtDetermination.decisionType) {
        case decisionType_1.DecisionType.DEFENDANT:
            return claimResponse.paymentIntention.paymentDate;
        case decisionType_1.DecisionType.COURT:
            return draft.document.courtDetermination.courtDecision.paymentDate;
        case decisionType_1.DecisionType.CLAIMANT:
        case decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT:
            return draft.document.alternatePaymentMethod.paymentDate.date.toMoment();
    }
}
function renderView(form, res) {
    const claim = res.locals.claim;
    const draft = res.locals.draft;
    const claimResponse = claim.response;
    const payBySetDate = getPayBySetDate(draft, claimResponse);
    res.render(paths_1.Paths.courtOfferedSetDatePage.associatedView, {
        form: form,
        claim: claim,
        paymentDate: payBySetDate
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.courtOfferedSetDatePage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.claimantResponseDraft;
    renderView(new form_1.Form(draft.document.acceptCourtOffer), res);
}))
    .post(paths_1.Paths.courtOfferedSetDatePage.uri, formValidator_1.FormValidator.requestHandler(acceptCourtOffer_1.AcceptCourtOffer, acceptCourtOffer_1.AcceptCourtOffer.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimantResponseDraft;
        const user = res.locals.user;
        const { externalId } = req.params;
        draft.document.acceptCourtOffer = form.model;
        if (draft.document.courtDetermination.rejectionReason || draft.document.formaliseRepaymentPlan) {
            delete draft.document.courtDetermination.rejectionReason;
            delete draft.document.formaliseRepaymentPlan;
            delete draft.document.settlementAgreement;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (form.model.accept.option === yesNoOption_1.YesNoOption.YES.option) {
            res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
        }
        else {
            res.redirect(paths_1.Paths.rejectionReasonPage.evaluateUri({ externalId: externalId }));
        }
    }
}));
