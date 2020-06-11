"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const partyTypeResponse_1 = require("forms/models/partyTypeResponse");
const partyType_1 = require("common/partyType");
const errorHandling_1 = require("shared/errorHandling");
const partyDetailsFactory_1 = require("forms/models/partyDetailsFactory");
const draftService_1 = require("services/draftService");
function renderView(form, res, next) {
    res.render(paths_1.Paths.defendantPartyTypeSelectionPage.associatedView, {
        form: form
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.defendantPartyTypeSelectionPage.uri, async (req, res, next) => {
    const draft = res.locals.claimDraft;
    renderView(new form_1.Form(new partyTypeResponse_1.PartyTypeResponse(draft.document.defendant.partyDetails ? partyType_1.PartyType.valueOf(draft.document.defendant.partyDetails.type) : undefined)), res, next);
})
    .post(paths_1.Paths.defendantPartyTypeSelectionPage.uri, formValidator_1.FormValidator.requestHandler(partyTypeResponse_1.PartyTypeResponse, partyTypeResponse_1.PartyTypeResponse.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res, next);
    }
    else {
        const draft = res.locals.claimDraft;
        const user = res.locals.user;
        let partyDetails = draft.document.defendant.partyDetails;
        if (partyDetails === undefined || partyDetails.type !== form.model.type.value) {
            partyDetails = draft.document.defendant.partyDetails = partyDetailsFactory_1.PartyDetailsFactory.createInstance(form.model.type.value);
            await new draftService_1.DraftService().save(draft, user.bearerToken);
        }
        switch (partyDetails.type) {
            case partyType_1.PartyType.INDIVIDUAL.value:
                res.redirect(paths_1.Paths.defendantIndividualDetailsPage.uri);
                break;
            case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
                res.redirect(paths_1.Paths.defendantSoleTraderOrSelfEmployedDetailsPage.uri);
                break;
            case partyType_1.PartyType.COMPANY.value:
                res.redirect(paths_1.Paths.defendantCompanyDetailsPage.uri);
                break;
            case partyType_1.PartyType.ORGANISATION.value:
                res.redirect(paths_1.Paths.defendantOrganisationDetailsPage.uri);
                break;
        }
    }
}));
