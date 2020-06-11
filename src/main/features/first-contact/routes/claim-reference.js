"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
const paths_1 = require("first-contact/paths");
const paths_2 = require("paths");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const claimReference_1 = require("forms/models/claimReference");
const claimStoreClient_1 = require("claims/claimStoreClient");
const errorHandling_1 = require("shared/errorHandling");
const oAuthHelper_1 = require("idam/oAuthHelper");
const isCCBCCaseReference_1 = require("shared/utils/isCCBCCaseReference");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
function renderView(form, res) {
    res.render(paths_1.Paths.claimReferencePage.associatedView, { form: form });
}
const mcolUrl = config.get('mcol.url');
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.claimReferencePage.uri, (req, res) => {
    renderView(form_1.Form.empty(), res);
})
    .post(paths_1.Paths.claimReferencePage.uri, formValidator_1.FormValidator.requestHandler(claimReference_1.ClaimReference), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        if (isCCBCCaseReference_1.isCCBCCaseReference(form.model.reference)) {
            return res.redirect(mcolUrl);
        }
        const linked = await claimStoreClient.isClaimLinked(form.model.reference);
        if (linked) {
            return res.redirect(paths_2.Paths.homePage.uri);
        }
        res.redirect(oAuthHelper_1.OAuthHelper.forPin(req, res, form.model.reference.toUpperCase()));
    }
}));
