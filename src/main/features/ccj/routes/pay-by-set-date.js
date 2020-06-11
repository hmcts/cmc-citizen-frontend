"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("ccj/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const paymentDate_1 = require("shared/components/payment-intention/model/paymentDate");
const draftService_1 = require("services/draftService");
const errorHandling_1 = require("shared/errorHandling");
const momentFactory_1 = require("shared/momentFactory");
function renderView(form, res) {
    const futureDate = momentFactory_1.MomentFactory.currentDate().add(30, 'days');
    res.render(paths_1.Paths.payBySetDatePage.associatedView, {
        form: form,
        futureDate: futureDate
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.payBySetDatePage.uri, (req, res) => {
    const draft = res.locals.ccjDraft;
    renderView(new form_1.Form(draft.document.payBySetDate), res);
})
    .post(paths_1.Paths.payBySetDatePage.uri, formValidator_1.FormValidator.requestHandler(paymentDate_1.PaymentDate, paymentDate_1.PaymentDate.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.ccjDraft;
        const user = res.locals.user;
        draft.document.payBySetDate = form.model;
        draft.document.repaymentPlan = undefined;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const { externalId } = req.params;
        res.redirect(paths_1.Paths.checkAndSendPage.evaluateUri({ externalId: externalId }));
    }
}));
