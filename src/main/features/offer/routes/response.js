"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const formValidator_1 = require("forms/validation/formValidator");
const paths_1 = require("offer/paths");
const paths_2 = require("dashboard/paths");
const form_1 = require("forms/form");
const defendantResponse_1 = require("offer/form/models/defendantResponse");
const errorHandling_1 = require("shared/errorHandling");
const statementType_1 = require("offer/form/models/statementType");
const offerClient_1 = require("claims/offerClient");
function renderView(form, res, next) {
    const claim = res.locals.claim;
    const offer = claim.defendantOffer;
    if (!offer) {
        const claim = res.locals.claim;
        res.redirect(paths_2.Paths.claimantPage.evaluateUri({ externalId: claim.externalId }));
    }
    else {
        res.render(paths_1.Paths.responsePage.associatedView, {
            form: form,
            claim: claim,
            offer: offer
        });
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.responsePage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    renderView(form_1.Form.empty(), res, next);
}))
    .post(paths_1.Paths.responsePage.uri, formValidator_1.FormValidator.requestHandler(defendantResponse_1.DefendantResponse, defendantResponse_1.DefendantResponse.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res, next);
    }
    else {
        const claim = res.locals.claim;
        const user = res.locals.user;
        switch (form.model.option) {
            case statementType_1.StatementType.ACCEPTATION:
                res.redirect(paths_1.Paths.makeAgreementPage.evaluateUri({ externalId: claim.externalId }));
                break;
            case statementType_1.StatementType.REJECTION:
                await offerClient_1.OfferClient.rejectOffer(claim.externalId, user);
                res.redirect(paths_1.Paths.rejectedPage.evaluateUri({ externalId: claim.externalId }));
                break;
            default:
                throw new Error(`Option ${form.model.option} is not supported`);
        }
    }
}));
