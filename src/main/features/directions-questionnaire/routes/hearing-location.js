"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("directions-questionnaire/paths");
const form_1 = require("forms/form");
const hearingLocation_1 = require("directions-questionnaire/forms/models/hearingLocation");
const court_1 = require("court-finder-client/court");
const formValidator_1 = require("forms/validation/formValidator");
const draftService_1 = require("services/draftService");
const errorHandling_1 = require("shared/errorHandling");
const yesNoOption_1 = require("models/yesNoOption");
const madeBy_1 = require("claims/models/madeBy");
const directionsQuestionnaireHelper_1 = require("directions-questionnaire/helpers/directionsQuestionnaireHelper");
function renderPage(res, form, fallbackPage) {
    res.render(paths_1.Paths.hearingLocationPage.associatedView, {
        form: form,
        fallbackPage: fallbackPage,
        party: directionsQuestionnaireHelper_1.getUsersRole(res.locals.claim, res.locals.user)
    });
}
function getDefaultPostcode(res) {
    const claim = res.locals.claim;
    const user = res.locals.user;
    if (directionsQuestionnaireHelper_1.getUsersRole(claim, user) === madeBy_1.MadeBy.DEFENDANT) {
        const responseDraft = res.locals.responseDraft;
        const partyDetails = responseDraft.document.defendantDetails.partyDetails;
        if (partyDetails && partyDetails.address.postcode) {
            return responseDraft.document.defendantDetails.partyDetails.address.postcode;
        }
        else {
            return claim.claimData.defendant.address.postcode;
        }
    }
    else {
        return claim.claimData.claimant.address.postcode;
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.hearingLocationPage.uri, async (req, res, next) => {
    try {
        const draft = res.locals.draft;
        if (draft.document.hearingLocation.alternativeOption !== undefined && draft.document.hearingLocation.alternativeOption === hearingLocation_1.AlternativeCourtOption.BY_POSTCODE) {
            renderPage(res, new form_1.Form(new hearingLocation_1.HearingLocation(draft.document.hearingLocation.courtName, draft.document.hearingLocation.alternativePostcode, draft.document.hearingLocation.facilities, draft.document.hearingLocation.courtAccepted)), false);
        }
        else if (draft.document.hearingLocation.alternativeOption !== undefined && draft.document.hearingLocation.alternativeOption === hearingLocation_1.AlternativeCourtOption.BY_NAME) {
            renderPage(res, new form_1.Form(new hearingLocation_1.HearingLocation(draft.document.hearingLocation.courtName, undefined, undefined, draft.document.hearingLocation.courtAccepted, draft.document.hearingLocation.alternativeOption, draft.document.hearingLocation.alternativeCourtName)), false);
        }
        else {
            const postcode = getDefaultPostcode(res);
            const court = await court_1.Court.getNearestCourt(postcode);
            if (court) {
                const courtDetails = await court_1.Court.getCourtDetails(court.slug);
                renderPage(res, new form_1.Form(new hearingLocation_1.HearingLocation(court.name, undefined, courtDetails.facilities, draft.document.hearingLocation.courtAccepted)), false);
            }
            else {
                renderPage(res, new form_1.Form(new hearingLocation_1.HearingLocation()), true);
            }
        }
    }
    catch (err) {
        next(err);
    }
})
    .post(paths_1.Paths.hearingLocationPage.uri, formValidator_1.FormValidator.requestHandler(hearingLocation_1.HearingLocation, hearingLocation_1.HearingLocation.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderPage(res, form, false);
    }
    else {
        try {
            const draft = res.locals.draft;
            const user = res.locals.user;
            draft.document.hearingLocation = form.model;
            if (form.model.courtAccepted === yesNoOption_1.YesNoOption.NO && form.model.alternativeOption === hearingLocation_1.AlternativeCourtOption.BY_POSTCODE) {
                const court = await court_1.Court.getNearestCourt(form.model.alternativePostcode);
                if (court !== undefined) {
                    const alternativeCourtDetails = await court_1.Court.getCourtDetails(court.slug);
                    draft.document.hearingLocation.alternativeCourtName = court.name;
                    draft.document.hearingLocation.alternativePostcode = form.model.alternativePostcode;
                    draft.document.hearingLocation.alternativeOption = form.model.alternativeOption;
                    draft.document.hearingLocation.facilities = alternativeCourtDetails.facilities;
                    draft.document.hearingLocationSlug = court.slug;
                    form.model = new hearingLocation_1.HearingLocation(court.name, form.model.alternativePostcode, alternativeCourtDetails.facilities);
                }
                await new draftService_1.DraftService().save(draft, user.bearerToken);
                renderPage(res, form, court === undefined);
            }
            else if (form.model.courtAccepted === yesNoOption_1.YesNoOption.NO && form.model.alternativeOption === hearingLocation_1.AlternativeCourtOption.BY_NAME) {
                draft.document.hearingLocation = form.model;
                draft.document.hearingLocation.alternativeOption = form.model.alternativeOption;
                draft.document.hearingLocation.courtName = form.model.alternativeCourtName;
                draft.document.hearingLocationSlug = '';
                await new draftService_1.DraftService().save(draft, user.bearerToken);
                res.redirect(paths_1.Paths.expertPage.evaluateUri({ externalId: res.locals.claim.externalId }));
            }
            else {
                if (form.model.alternativeOption !== undefined && form.model.alternativeOption === hearingLocation_1.AlternativeCourtOption.BY_NAME) {
                    draft.document.hearingLocation.alternativeCourtName = '';
                    draft.document.hearingLocation.alternativeOption = undefined;
                }
                else if (draft.document.hearingLocationSlug && !draft.document.hearingLocationSlug.length) {
                    const postcode = getDefaultPostcode(res);
                    const court = await court_1.Court.getNearestCourt(postcode);
                    if (court !== undefined) {
                        draft.document.hearingLocationSlug = court.slug;
                    }
                    else {
                        draft.document.hearingLocationSlug = '';
                    }
                }
                draft.document.hearingLocation.courtName = form.model.courtName;
                draft.document.hearingLocation.courtAccepted = form.model.courtAccepted;
                await new draftService_1.DraftService().save(draft, user.bearerToken);
                res.redirect(paths_1.Paths.expertPage.evaluateUri({ externalId: res.locals.claim.externalId }));
            }
        }
        catch (err) {
            next(err);
        }
    }
}));
