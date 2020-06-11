"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("directions-questionnaire/paths");
const formValidator_1 = require("forms/validation/formValidator");
const exceptionalCircumstances_1 = require("directions-questionnaire/forms/models/exceptionalCircumstances");
const form_1 = require("forms/form");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const yesNoOption_1 = require("models/yesNoOption");
const directionsQuestionnaireHelper_1 = require("directions-questionnaire/helpers/directionsQuestionnaireHelper");
const exceptionalCircumstancesGuard_1 = require("directions-questionnaire/guard/exceptionalCircumstancesGuard");
const madeBy_1 = require("claims/models/madeBy");
const court_1 = require("court-finder-client/court");
const hearingLocation_1 = require("claims/models/directions-questionnaire/hearingLocation");
function getPostcode(defendantDirectionsQuestionnaire, claim) {
    const postcodeFromDirectionQuestionnaire = defendantDirectionsQuestionnaire.hearingLocation.courtAddress !== undefined
        ? defendantDirectionsQuestionnaire.hearingLocation.courtAddress.postcode
        : undefined;
    return defendantDirectionsQuestionnaire.hearingLocation.locationOption === hearingLocation_1.CourtLocationType.SUGGESTED_COURT
        ? claim.response.defendant.address.postcode
        : postcodeFromDirectionQuestionnaire;
}
async function renderPage(res, form) {
    const party = directionsQuestionnaireHelper_1.getUsersRole(res.locals.claim, res.locals.user);
    let defendantCourt = '';
    let courtDetails = undefined;
    if (party === madeBy_1.MadeBy.CLAIMANT && res.locals.claim.response.directionsQuestionnaire) {
        const claim = res.locals.claim;
        const defendantDirectionsQuestionnaire = res.locals.claim.response.directionsQuestionnaire;
        const postcode = getPostcode(defendantDirectionsQuestionnaire, claim);
        if (postcode) {
            const court = await court_1.Court.getNearestCourt(postcode);
            if (court) {
                courtDetails = await court_1.Court.getCourtDetails(court.slug);
            }
        }
        defendantCourt = defendantDirectionsQuestionnaire.hearingLocation.courtName;
    }
    res.render(paths_1.Paths.hearingExceptionalCircumstancesPage.associatedView, {
        form: form,
        party: party,
        courtName: defendantCourt,
        facilities: courtDetails ? courtDetails.facilities : undefined
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.hearingExceptionalCircumstancesPage.uri, exceptionalCircumstancesGuard_1.ExceptionalCircumstancesGuard.requestHandler, async (req, res, next) => {
    const draft = res.locals.draft;
    try {
        await renderPage(res, new form_1.Form(draft.document.exceptionalCircumstances));
    }
    catch (err) {
        next(err);
    }
})
    .post(paths_1.Paths.hearingExceptionalCircumstancesPage.uri, exceptionalCircumstancesGuard_1.ExceptionalCircumstancesGuard.requestHandler, formValidator_1.FormValidator.requestHandler(exceptionalCircumstances_1.ExceptionalCircumstances, exceptionalCircumstances_1.ExceptionalCircumstances.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    const party = directionsQuestionnaireHelper_1.getUsersRole(res.locals.claim, res.locals.user);
    if (form.hasErrors()) {
        await renderPage(res, form);
    }
    else {
        const draft = res.locals.draft;
        const user = res.locals.user;
        if (party === madeBy_1.MadeBy.CLAIMANT && res.locals.claim.response.directionsQuestionnaire) {
            const defendantDirectionsQuestionnaire = res.locals.claim.response.directionsQuestionnaire;
            if (form.model.exceptionalCircumstances.option === yesNoOption_1.YesNoOption.NO.option) {
                draft.document.hearingLocation.courtName = defendantDirectionsQuestionnaire.hearingLocation.courtName;
                draft.document.hearingLocation.courtAccepted = yesNoOption_1.YesNoOption.YES;
                form.model.reason = undefined;
            }
        }
        else if (form.model.exceptionalCircumstances.option === yesNoOption_1.YesNoOption.YES.option) {
            draft.document.hearingLocation = undefined;
        }
        draft.document.exceptionalCircumstances = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (form.model.exceptionalCircumstances.option === yesNoOption_1.YesNoOption.NO.option) {
            res.redirect(paths_1.Paths.expertPage.evaluateUri({ externalId: res.locals.claim.externalId }));
        }
        else {
            res.redirect(paths_1.Paths.hearingLocationPage.evaluateUri({ externalId: res.locals.claim.externalId }));
        }
    }
}));
