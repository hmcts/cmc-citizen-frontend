"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("ccj/paths");
const errorHandling_1 = require("shared/errorHandling");
const ccjPaymentOption_1 = require("ccj/form/models/ccjPaymentOption");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const draftService_1 = require("services/draftService");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.paymentOptionsPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.ccjDraft;
    res.render(paths_1.Paths.paymentOptionsPage.associatedView, { form: new form_1.Form(draft.document.paymentOption) });
}))
    .post(paths_1.Paths.paymentOptionsPage.uri, formValidator_1.FormValidator.requestHandler(ccjPaymentOption_1.CCJPaymentOption, ccjPaymentOption_1.CCJPaymentOption.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        res.render(paths_1.Paths.paymentOptionsPage.associatedView, { form: form });
    }
    else {
        const draft = res.locals.ccjDraft;
        const user = res.locals.user;
        draft.document.paymentOption = form.model;
        if (form.model.option === ccjPaymentOption_1.PaymentType.IMMEDIATELY) {
            draft.document.repaymentPlan = undefined;
            draft.document.payBySetDate = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        switch (form.model.option) {
            case ccjPaymentOption_1.PaymentType.IMMEDIATELY:
                res.redirect(paths_1.Paths.checkAndSendPage.evaluateUri({ externalId: externalId }));
                break;
            case ccjPaymentOption_1.PaymentType.BY_SPECIFIED_DATE:
                res.redirect(paths_1.Paths.payBySetDatePage.evaluateUri({ externalId: externalId }));
                break;
            case ccjPaymentOption_1.PaymentType.INSTALMENTS:
                res.redirect(paths_1.Paths.repaymentPlanPage.evaluateUri({ externalId: externalId }));
                break;
        }
    }
}));
