"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("offer/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const offer_1 = require("offer/form/models/offer");
const errorHandling_1 = require("shared/errorHandling");
const offerClient_1 = require("claims/offerClient");
async function renderView(form, res, next) {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.offerPage.associatedView, {
        form: form,
        claim: claim
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.offerPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    await renderView(form_1.Form.empty(), res, next);
}))
    .post(paths_1.Paths.offerPage.uri, formValidator_1.FormValidator.requestHandler(offer_1.Offer, offer_1.Offer.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res, next);
    }
    else {
        const claim = res.locals.claim;
        const user = res.locals.user;
        const offer = form.model;
        await offerClient_1.OfferClient.makeOffer(claim.externalId, user, offer);
        res.redirect(paths_1.Paths.offerConfirmationPage.evaluateUri({ externalId: claim.externalId }));
    }
}));
