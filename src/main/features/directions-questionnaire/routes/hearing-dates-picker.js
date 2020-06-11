"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("directions-questionnaire/paths");
const errorHandling_1 = require("shared/errorHandling");
const availability_1 = require("directions-questionnaire/forms/models/availability");
const draftService_1 = require("services/draftService");
const localDate_1 = require("forms/models/localDate");
const Moment = require("moment");
const formValidator_1 = require("forms/validation/formValidator");
function renderFragment(res, draft) {
    res.render('directions-questionnaire/views/components/date-list', {
        dates: draft.document.availability && draft.document.availability.unavailableDates
            ? draft.document.availability.unavailableDates
                .map(rawDate => localDate_1.LocalDate.fromObject(rawDate))
                .map(localDate => localDate.toMoment())
            : [],
        externalId: res.locals.claim.externalId
    });
}
function sortDates(dates) {
    if (!dates) {
        return [];
    }
    return dates.sort((date1, date2) => Moment(date1).valueOf() - Moment(date2).valueOf());
}
const ignoreEmptyArrayError = (req, res, next) => {
    const form = req.body;
    form.errors = form.errors.filter(error => error.message !== availability_1.ValidationErrors.AT_LEAST_ONE_DATE);
    next();
};
/* tslint:disable:no-default-export */
exports.default = express.Router()
    /*
     * The delete date functionality comes from a simple hyperlink, hence get.
     * To 'post' would need nested forms for the non-JS page.
     */
    .get(paths_1.Paths.hearingDatesDeleteReceiver.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.draft;
    draft.document.availability = draft.document.availability || new availability_1.Availability(undefined, []);
    const availability = draft.document.availability;
    // The 'date-' prefix is needed because our RoutablePath class rejects :segments with only numbers
    const dateIndex = Number(/date-([\d+])/.exec(req.params.index)[1]);
    availability.unavailableDates = availability.unavailableDates
        .filter((date, index) => index !== dateIndex)
        .map(date => localDate_1.LocalDate.fromObject(date));
    const user = res.locals.user;
    await new draftService_1.DraftService().save(draft, user.bearerToken);
    res.redirect(paths_1.Paths.hearingDatesPage.evaluateUri({ externalId: res.locals.claim.externalId }));
}))
    .post(paths_1.Paths.hearingDatesReplaceReceiver.uri, formValidator_1.FormValidator.requestHandler(availability_1.Availability, availability_1.Availability.fromObject), ignoreEmptyArrayError, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        res.sendStatus(400);
    }
    else {
        const draft = res.locals.draft;
        const unavailableDates = form.model.unavailableDates;
        draft.document.availability = form.model;
        const availability = draft.document.availability;
        availability.unavailableDates = sortDates(unavailableDates).map(date => localDate_1.LocalDate.fromObject(date));
        const user = res.locals.user;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        renderFragment(res, draft);
    }
}));
