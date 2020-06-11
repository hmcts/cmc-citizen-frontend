"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const paths_1 = require("claimant-response/paths");
const acceptPaymentMethod_1 = require("claimant-response/form/models/acceptPaymentMethod");
const responseType_1 = require("claims/models/response/responseType");
function renderView(form, res) {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.acceptPaymentMethodPage.associatedView, {
        form: form,
        claim: claim,
        paymentOption: getPaymentOption(claim.response),
        paymentDate: getPaymentDate(claim.response)
    });
}
function getPaymentOption(response) {
    switch (response.responseType) {
        case responseType_1.ResponseType.FULL_ADMISSION:
        case responseType_1.ResponseType.PART_ADMISSION:
            return response.paymentIntention && response.paymentIntention.paymentOption;
        default:
            return undefined;
    }
}
function getPaymentDate(response) {
    switch (response.responseType) {
        case responseType_1.ResponseType.FULL_ADMISSION:
        case responseType_1.ResponseType.PART_ADMISSION:
            return response.paymentIntention && response.paymentIntention.paymentDate;
        default:
            return undefined;
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.acceptPaymentMethodPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.claimantResponseDraft;
    renderView(new form_1.Form(draft.document.acceptPaymentMethod), res);
}))
    .post(paths_1.Paths.acceptPaymentMethodPage.uri, formValidator_1.FormValidator.requestHandler(acceptPaymentMethod_1.AcceptPaymentMethod, acceptPaymentMethod_1.AcceptPaymentMethod.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimantResponseDraft;
        const user = res.locals.user;
        draft.document.acceptPaymentMethod = form.model;
        draft.document.alternatePaymentMethod = undefined;
        draft.document.formaliseRepaymentPlan = undefined;
        draft.document.courtDetermination = undefined;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
    }
}));
