"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("testing-support/paths");
const errorHandling_1 = require("shared/errorHandling");
const form_1 = require("forms/form");
const updateResponseDeadlineRequest_1 = require("testing-support/models/updateResponseDeadlineRequest");
const formValidator_1 = require("forms/validation/formValidator");
const testingSupportClient_1 = require("testing-support/testingSupportClient");
function renderView(form, res) {
    res.render(paths_1.Paths.updateResponseDeadlinePage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.updateResponseDeadlinePage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    renderView(new form_1.Form(new updateResponseDeadlineRequest_1.UpdateResponseDeadlineRequest()), res);
}))
    .post(paths_1.Paths.updateResponseDeadlinePage.uri, formValidator_1.FormValidator.requestHandler(updateResponseDeadlineRequest_1.UpdateResponseDeadlineRequest, updateResponseDeadlineRequest_1.UpdateResponseDeadlineRequest.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        testingSupportClient_1.TestingSupportClient.updateResponseDeadline(form.model, res.locals.user);
        res.redirect(paths_1.Paths.indexPage.uri);
    }
}));
