"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const errorHandling_1 = require("main/common/errorHandling");
const form_1 = require("main/app/forms/form");
const formValidator_1 = require("main/app/forms/validation/formValidator");
const draftService_1 = require("services/draftService");
const yesNoOption_1 = require("main/app/models/yesNoOption");
const partPaymentReceived_1 = require("claimant-response/form/models/states-paid/partPaymentReceived");
const statesPaidHelper_1 = require("claimant-response/helpers/statesPaidHelper");
const guardFactory_1 = require("response/guards/guardFactory");
const errors_1 = require("main/errors");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const stateGuardRequestHandler = guardFactory_1.GuardFactory.create((res) => {
    const claim = res.locals.claim;
    return statesPaidHelper_1.StatesPaidHelper.isAlreadyPaidLessThanAmount(claim);
}, (req) => {
    const logger = nodejs_logging_1.Logger.getLogger('claimant-response/guards/stateGuardRequestHandler');
    logger.warn('State guard: claimant response already exists - redirecting to dashboard');
    throw new errors_1.NotFoundError(req.path);
});
function renderView(form, res) {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.partPaymentReceivedPage.associatedView, {
        form: form,
        paidAmount: statesPaidHelper_1.StatesPaidHelper.getAlreadyPaidAmount(claim)
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.partPaymentReceivedPage.uri, stateGuardRequestHandler, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.claimantResponseDraft;
    renderView(new form_1.Form(draft.document.partPaymentReceived), res);
}))
    .post(paths_1.Paths.partPaymentReceivedPage.uri, stateGuardRequestHandler, formValidator_1.FormValidator.requestHandler(partPaymentReceived_1.PartPaymentReceived, partPaymentReceived_1.PartPaymentReceived.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimantResponseDraft;
        draft.document.partPaymentReceived = form.model;
        if (form.model.received.option === yesNoOption_1.YesNoOption.NO.option) {
            draft.document.accepted = undefined;
            draft.document.rejectionReason = undefined;
        }
        await new draftService_1.DraftService().save(draft, res.locals.user.bearerToken);
        res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }));
    }
}));
