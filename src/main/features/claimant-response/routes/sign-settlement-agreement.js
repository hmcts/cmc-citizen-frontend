"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const settlementAgreement_1 = require("features/claimant-response/form/models/settlementAgreement");
const draftService_1 = require("services/draftService");
const responseType_1 = require("claims/models/response/responseType");
const yesNoOption_1 = require("models/yesNoOption");
function getPaymentIntention(response, draft) {
    if (draft.acceptPaymentMethod && draft.acceptPaymentMethod.accept === yesNoOption_1.YesNoOption.YES) {
        return response.paymentIntention;
    }
    else {
        return draft.courtDetermination.courtDecision;
    }
}
function renderView(form, res) {
    const claim = res.locals.claim;
    const draft = res.locals.draft;
    const response = claim.response;
    res.render(paths_1.Paths.signSettlementAgreementPage.associatedView, {
        form: form,
        claim: claim,
        paymentIntention: getPaymentIntention(response, draft.document),
        totalAmount: claim.response.responseType === responseType_1.ResponseType.PART_ADMISSION ? claim.response.amount : claim.totalAmountTillToday
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.signSettlementAgreementPage.uri, (req, res, next) => {
    const draft = res.locals.claimantResponseDraft;
    renderView(new form_1.Form(draft.document.settlementAgreement), res);
})
    .post(paths_1.Paths.signSettlementAgreementPage.uri, formValidator_1.FormValidator.requestHandler(settlementAgreement_1.SettlementAgreement, settlementAgreement_1.SettlementAgreement.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimantResponseDraft;
        const user = res.locals.user;
        draft.document.settlementAgreement = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const externalId = req.params.externalId;
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
    }
}));
