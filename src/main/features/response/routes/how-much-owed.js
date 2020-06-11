"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("features/response/paths");
const numberFormatter_1 = require("utils/numberFormatter");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const howMuchOwed_1 = require("features/response/form/models/howMuchOwed");
const errorHandling_1 = require("shared/errorHandling");
const class_validator_1 = require("@hmcts/class-validator");
const draftService_1 = require("services/draftService");
async function renderView(form, res, next) {
    try {
        const claim = res.locals.claim;
        res.render(paths_1.Paths.defendantHowMuchOwed.associatedView, {
            form: form,
            amount: claim.totalAmountTillToday,
            claim: claim
        });
    }
    catch (err) {
        next(err);
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.defendantHowMuchOwed.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.responseDraft;
    await renderView(new form_1.Form(draft.document.howMuchOwed), res, next);
}))
    .post(paths_1.Paths.defendantHowMuchOwed.uri, formValidator_1.FormValidator.requestHandler(howMuchOwed_1.HowMuchOwed, howMuchOwed_1.HowMuchOwed.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    const claim = res.locals.claim;
    const user = res.locals.user;
    if (form.model.amount > claim.totalAmountTillToday) {
        let totalAmount = numberFormatter_1.NumberFormatter.formatMoney(claim.totalAmountTillToday);
        let error = new class_validator_1.ValidationError();
        error.property = 'amount';
        error.constraints = { amount: 'Enter a valid amount between £1 and ' + totalAmount };
        form.errors.push(new form_1.FormValidationError(error));
    }
    if (form.hasErrors()) {
        await renderView(form, res, next);
    }
    else {
        const draft = res.locals.responseDraft;
        draft.document.howMuchOwed = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.timelinePage.evaluateUri({ externalId: claim.externalId }));
    }
}));
