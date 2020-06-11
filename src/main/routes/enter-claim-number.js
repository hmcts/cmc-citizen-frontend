"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
const errorHandling_1 = require("shared/errorHandling");
const paths_1 = require("paths");
const formValidator_1 = require("forms/validation/formValidator");
const claimReference_1 = require("forms/models/claimReference");
const isCMCReference_1 = require("shared/utils/isCMCReference");
const form_1 = require("forms/form");
function renderView(form, res) {
    res.render(paths_1.Paths.enterClaimNumberPage.associatedView, { form: form });
}
const mcolUrl = config.get('mcol.url');
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.enterClaimNumberPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    renderView(form_1.Form.empty(), res);
}))
    .post(paths_1.Paths.enterClaimNumberPage.uri, formValidator_1.FormValidator.requestHandler(claimReference_1.ClaimReference), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        if (isCMCReference_1.isCMCReference(form.model.reference)) {
            res.redirect(paths_1.Paths.homePage.uri);
        }
        else {
            res.redirect(mcolUrl);
        }
    }
}));
