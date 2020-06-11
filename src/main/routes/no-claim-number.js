"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
const errorHandling_1 = require("shared/errorHandling");
const paths_1 = require("paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const noClaimNumber_1 = require("forms/models/noClaimNumber");
const service_1 = require("models/service");
function renderView(form, res) {
    res.render(paths_1.Paths.noClaimNumberPage.associatedView, { form: form });
}
const mcolUrl = config.get('mcol.url');
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.noClaimNumberPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    renderView(form_1.Form.empty(), res);
}))
    .post(paths_1.Paths.noClaimNumberPage.uri, formValidator_1.FormValidator.requestHandler(undefined, noClaimNumber_1.NoClaimNumber.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        return renderView(form, res);
    }
    switch (form.model.service) {
        case service_1.Service.MONEYCLAIMS:
            res.redirect(paths_1.Paths.homePage.uri);
            break;
        case service_1.Service.MCOL:
            res.redirect(mcolUrl);
            break;
        default:
            throw new Error(`Unexpected service: ${form.model.service}`);
    }
}));
