"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("settlement-agreement/paths");
const errorHandling_1 = require("main/common/errorHandling");
const defendantSettlementResponse_1 = require("settlement-agreement/form/models/defendantSettlementResponse");
const form_1 = require("main/app/forms/form");
const formValidator_1 = require("main/app/forms/validation/formValidator");
const yesNoOption_1 = require("main/app/models/yesNoOption");
const settlementAgreementClient_1 = require("main/app/claims/settlementAgreementClient");
const settlementAgreementClient = new settlementAgreementClient_1.SettlementAgreementClient();
async function renderView(form, res, next) {
    try {
        const claim = res.locals.claim;
        res.render(paths_1.Paths.signSettlementAgreement.associatedView, {
            form: form,
            claim: claim,
            offer: claim.settlement.getLastOffer(),
            name: 'option'
        });
    }
    catch (err) {
        next(err);
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.signSettlementAgreement.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    renderView(new form_1.Form(new defendantSettlementResponse_1.DefendantSettlementResponse()), res, next);
}))
    .post(paths_1.Paths.signSettlementAgreement.uri, formValidator_1.FormValidator.requestHandler(defendantSettlementResponse_1.DefendantSettlementResponse), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res, next);
    }
    else {
        const claim = res.locals.claim;
        const user = res.locals.user;
        if (form.model.option === yesNoOption_1.YesNoOption.YES.option) {
            await settlementAgreementClient.countersignSettlementAgreement(claim.externalId, user);
        }
        else {
            await settlementAgreementClient.rejectSettlementAgreement(claim.externalId, user);
        }
        res.redirect(paths_1.Paths.settlementAgreementConfirmation.evaluateUri({ externalId: claim.externalId }));
    }
}));
