"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("offer/paths");
const errorHandling_1 = require("shared/errorHandling");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const declaration_1 = require("offer/form/models/declaration");
const offerClient_1 = require("claims/offerClient");
const offerAcceptedGuard_1 = require("offer/guards/offerAcceptedGuard");
const claimStatus_1 = require("claims/models/claimStatus");
function renderView(form, res) {
    const claim = res.locals.claim;
    const user = res.locals.user;
    res.render(paths_1.Paths.declarationPage.associatedView, {
        claim: claim,
        form: form,
        offer: claim.status === claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_COURT_PLAN_SETTLEMENT ? claim.settlement.getLastOffer() : claim.defendantOffer,
        isThroughAdmissions: claim.settlement && claim.settlement.isThroughAdmissions(),
        otherPartyName: user.id === claim.defendantId ? claim.claimData.claimant.name : claim.claimData.defendant.name
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.declarationPage.uri, offerAcceptedGuard_1.OfferAcceptedGuard.check(), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    renderView(form_1.Form.empty(), res);
}))
    .post(paths_1.Paths.declarationPage.uri, offerAcceptedGuard_1.OfferAcceptedGuard.check(), formValidator_1.FormValidator.requestHandler(declaration_1.Declaration, declaration_1.Declaration.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const claim = res.locals.claim;
        const user = res.locals.user;
        if (user.id === claim.defendantId && claim.settlement.isOfferAccepted()) {
            await offerClient_1.OfferClient.countersignOffer(claim.externalId, user);
            res.redirect(paths_1.Paths.settledPage.evaluateUri({ externalId: claim.externalId }));
        }
        else {
            await offerClient_1.OfferClient.acceptOffer(claim.externalId, user);
            res.redirect(paths_1.Paths.acceptedPage.evaluateUri({ externalId: claim.externalId }));
        }
    }
}));
