"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const class_transformer_1 = require("class-transformer");
const paths_1 = require("response/paths");
const errorHandling_1 = require("shared/errorHandling");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const partyType_1 = require("common/partyType");
const partyDetails_1 = require("forms/models/partyDetails");
const individualDetails_1 = require("forms/models/individualDetails");
const soleTraderDetails_1 = require("forms/models/soleTraderDetails");
const companyDetails_1 = require("forms/models/companyDetails");
const organisationDetails_1 = require("forms/models/organisationDetails");
const draftService_1 = require("services/draftService");
const phone_1 = require("forms/models/phone");
function renderView(form, res) {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.defendantYourDetailsPage.associatedView, {
        form: form,
        claim: claim
    });
}
function deserializeFn(value) {
    switch (value.type) {
        case partyType_1.PartyType.INDIVIDUAL.value:
            return individualDetails_1.IndividualDetails.fromObject(value);
        case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            return soleTraderDetails_1.SoleTraderDetails.fromObject(value);
        case partyType_1.PartyType.COMPANY.value:
            return companyDetails_1.CompanyDetails.fromObject(value);
        case partyType_1.PartyType.ORGANISATION.value:
            return organisationDetails_1.OrganisationDetails.fromObject(value);
        default:
            throw new Error(`Unknown party type: ${value.type}`);
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.defendantYourDetailsPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.responseDraft;
    const claim = res.locals.claim;
    if (!draft.document.defendantDetails.partyDetails.address.postcode) {
        const partyDetails = class_transformer_1.plainToClass(partyDetails_1.PartyDetails, claim.claimData.defendant);
        draft.document.defendantDetails.partyDetails.address = partyDetails.address;
    }
    renderView(new form_1.Form(draft.document.defendantDetails.partyDetails), res);
}))
    .post(paths_1.Paths.defendantYourDetailsPage.uri, formValidator_1.FormValidator.requestHandler(partyDetails_1.PartyDetails, deserializeFn, 'response'), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    const claim = res.locals.claim;
    const draft = res.locals.responseDraft;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const mediationDraft = res.locals.mediationDraft;
        const user = res.locals.user;
        const oldPartyDetails = draft.document.defendantDetails.partyDetails;
        draft.document.defendantDetails.partyDetails = form.model;
        if (draft.document.defendantDetails.partyDetails.phone !== undefined) {
            draft.document.defendantDetails.phone =
                new phone_1.Phone(draft.document.defendantDetails.partyDetails.phone);
        }
        // Cache date of birth so we don't overwrite it
        if (oldPartyDetails && oldPartyDetails.type === partyType_1.PartyType.INDIVIDUAL.value && oldPartyDetails['dateOfBirth']) {
            draft.document.defendantDetails.partyDetails.dateOfBirth =
                oldPartyDetails.dateOfBirth;
        }
        // Store read only properties
        draft.document.defendantDetails.partyDetails.name = claim.claimData.defendant.name;
        if (claim.claimData.defendant.type === partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value) {
            draft.document.defendantDetails.partyDetails.businessName =
                claim.claimData.defendant.businessName;
        }
        if (oldPartyDetails.contactPerson !== draft.document.defendantDetails.partyDetails.contactPerson) {
            mediationDraft.document.canWeUseCompany = undefined;
            await new draftService_1.DraftService().save(mediationDraft, user.bearerToken);
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        switch (draft.document.defendantDetails.partyDetails.type) {
            case partyType_1.PartyType.INDIVIDUAL.value:
                res.redirect(paths_1.Paths.defendantDateOfBirthPage.evaluateUri({ externalId: claim.externalId }));
                break;
            case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            case partyType_1.PartyType.COMPANY.value:
            case partyType_1.PartyType.ORGANISATION.value:
                if (claim.claimData.defendant.phone === undefined) {
                    res.redirect(paths_1.Paths.defendantPhonePage.evaluateUri({ externalId: claim.externalId }));
                }
                else {
                    res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
                }
                break;
            default:
                throw new Error(`Unknown party type: ${draft.document.defendantDetails.partyDetails.type}`);
        }
    }
}));
