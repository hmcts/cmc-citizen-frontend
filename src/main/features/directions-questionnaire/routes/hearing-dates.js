"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-default-export */
const express = require("express");
const paths_1 = require("directions-questionnaire/paths");
const formValidator_1 = require("forms/validation/formValidator");
const paths_2 = require("response/paths");
const form_1 = require("forms/form");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const availability_1 = require("directions-questionnaire/forms/models/availability");
const localDate_1 = require("forms/models/localDate");
const directionsQuestionnaireHelper_1 = require("directions-questionnaire/helpers/directionsQuestionnaireHelper");
const madeBy_1 = require("claims/models/madeBy");
const paths_3 = require("claimant-response/paths");
function renderPage(res, form) {
    const dates = (form.model && form.model.unavailableDates ? form.model.unavailableDates : [])
        .map(rawDate => localDate_1.LocalDate.fromObject(rawDate))
        .map(localDate => localDate.toMoment());
    res.render(paths_1.Paths.hearingDatesPage.associatedView, {
        externalId: res.locals.claim.externalId,
        form: form,
        dates: dates
    });
}
const ignoreNewDateIfNotAdding = (req, res, next) => {
    const form = req.body;
    if (!form.rawData['addDate']) {
        form.errors = form.errors.filter(error => error.fieldName !== 'newDate');
        delete form.model.newDate;
    }
    next();
};
const ignoreEmptyArrayIfAdding = (req, res, next) => {
    const form = req.body;
    if (form.rawData['addDate']) {
        form.errors = form.errors.filter(error => error.fieldName !== 'unavailableDates');
    }
    next();
};
const ignorePopulatedArrayIfJSEnabled = (req, res, next) => {
    const form = req.body;
    if (!form.rawData['noJS']) {
        form.errors = form.errors.filter(error => error.message !== availability_1.ValidationErrors.CLEAR_ALL_DATES);
    }
    next();
};
exports.default = express.Router()
    .get(paths_1.Paths.hearingDatesPage.uri, (req, res) => {
    const draft = res.locals.draft;
    renderPage(res, new form_1.Form(draft.document.availability));
})
    .post(paths_1.Paths.hearingDatesPage.uri, formValidator_1.FormValidator.requestHandler(availability_1.Availability, availability_1.Availability.fromObject), ignoreNewDateIfNotAdding, ignoreEmptyArrayIfAdding, ignorePopulatedArrayIfJSEnabled, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderPage(res, form);
    }
    else {
        const draft = res.locals.draft;
        const user = res.locals.user;
        draft.document.availability = form.model;
        draft.document.availability.unavailableDates = [...form.model.unavailableDates, form.model.newDate]
            .filter(date => !!date)
            .sort((date1, date2) => date1.toMoment().diff(date2.toMoment()))
            .map(date => localDate_1.LocalDate.fromObject(date));
        delete draft.document.availability.newDate;
        if (!req.body.rawData.addDate && !form.model.hasUnavailableDates) {
            delete draft.document.availability.unavailableDates;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (req.body.rawData.addDate) {
            renderPage(res, form);
        }
        else {
            const claim = res.locals.claim;
            if (directionsQuestionnaireHelper_1.getUsersRole(claim, user) === madeBy_1.MadeBy.DEFENDANT) {
                res.redirect(paths_2.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
            }
            else {
                res.redirect(paths_3.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
            }
        }
    }
}));
