"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("orders/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const disagreeReason_1 = require("orders/form/models/disagreeReason");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const ordersDraft_1 = require("orders/draft/ordersDraft");
const claimStoreClient_1 = require("claims/claimStoreClient");
function renderView(form, res) {
    const user = res.locals.user;
    const claim = res.locals.claim;
    res.render(paths_1.Paths.disagreeReasonPage.associatedView, {
        otherParty: claim.otherPartyName(user),
        form: form
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.disagreeReasonPage.uri, (req, res) => {
    const draft = res.locals.draft;
    renderView(new form_1.Form(draft.document.disagreeReason), res);
})
    .post(paths_1.Paths.disagreeReasonPage.uri, formValidator_1.FormValidator.requestHandler(disagreeReason_1.DisagreeReason), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.draft;
        const user = res.locals.user;
        const claim = res.locals.claim;
        draft.document.disagreeReason = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        await new claimStoreClient_1.ClaimStoreClient().saveOrder(draft.document, claim, user);
        const updatedDraft = await new draftService_1.DraftService().find('orders', '100', user.bearerToken, (value) => {
            return new ordersDraft_1.OrdersDraft().deserialize(value);
        });
        await new draftService_1.DraftService().delete(updatedDraft[0].id, user.bearerToken);
        res.redirect(paths_1.Paths.confirmationPage.evaluateUri({ externalId: res.locals.claim.externalId }));
    }
}));
