"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
const toBoolean = require("to-boolean");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const statementOfTruth_1 = require("forms/models/statementOfTruth");
const feesClient_1 = require("fees/feesClient");
const totalAmount_1 = require("forms/models/totalAmount");
const interestUtils_1 = require("shared/interestUtils");
const partyType_1 = require("common/partyType");
const allClaimTasksCompletedGuard_1 = require("claim/guards/allClaimTasksCompletedGuard");
const signatureType_1 = require("common/signatureType");
const qualifiedStatementOfTruth_1 = require("forms/models/qualifiedStatementOfTruth");
const draftService_1 = require("services/draftService");
async function getClaimAmountTotal(draft) {
    const interest = await interestUtils_1.draftInterestAmount(draft);
    const totalAmount = draft.amount.totalAmount();
    return feesClient_1.FeesClient.calculateIssueFee(totalAmount + interest)
        .then((feeAmount) => new totalAmount_1.TotalAmount(totalAmount, interest, feeAmount));
}
function getBusinessName(partyDetails) {
    if (partyDetails.type === partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value) {
        return partyDetails.businessName;
    }
    else {
        return undefined;
    }
}
function getDateOfBirth(partyDetails) {
    if (partyDetails.type === partyType_1.PartyType.INDIVIDUAL.value) {
        return partyDetails.dateOfBirth;
    }
    else {
        return undefined;
    }
}
function getContactPerson(partyDetails) {
    if (partyDetails.type === partyType_1.PartyType.COMPANY.value) {
        return partyDetails.contactPerson;
    }
    else if (partyDetails.type === partyType_1.PartyType.ORGANISATION.value) {
        return partyDetails.contactPerson;
    }
    else {
        return undefined;
    }
}
function deserializerFunction(value) {
    switch (value.type) {
        case signatureType_1.SignatureType.BASIC:
            return statementOfTruth_1.StatementOfTruth.fromObject(value);
        case signatureType_1.SignatureType.QUALIFIED:
            return qualifiedStatementOfTruth_1.QualifiedStatementOfTruth.fromObject(value);
        default:
            throw new Error(`Unknown statement of truth type: ${value.type}`);
    }
}
function getStatementOfTruthClassFor(draft) {
    if (draft.document.claimant.partyDetails.isBusiness()) {
        return qualifiedStatementOfTruth_1.QualifiedStatementOfTruth;
    }
    else {
        return statementOfTruth_1.StatementOfTruth;
    }
}
function getClaimantPartyDetailsPageUri(partyDetails) {
    switch (partyDetails.type) {
        case partyType_1.PartyType.COMPANY.value:
            return paths_1.Paths.claimantCompanyDetailsPage.uri;
        case partyType_1.PartyType.ORGANISATION.value:
            return paths_1.Paths.claimantOrganisationDetailsPage.uri;
        case partyType_1.PartyType.INDIVIDUAL.value:
            return paths_1.Paths.claimantIndividualDetailsPage.uri;
        case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            return paths_1.Paths.claimantSoleTraderOrSelfEmployedDetailsPage.uri;
        default:
            throw new Error(`Unknown party type: ${partyDetails.type}`);
    }
}
function getDefendantPartyDetailsPageUri(partyDetails) {
    switch (partyDetails.type) {
        case partyType_1.PartyType.COMPANY.value:
            return paths_1.Paths.defendantCompanyDetailsPage.uri;
        case partyType_1.PartyType.ORGANISATION.value:
            return paths_1.Paths.defendantOrganisationDetailsPage.uri;
        case partyType_1.PartyType.INDIVIDUAL.value:
            return paths_1.Paths.defendantIndividualDetailsPage.uri;
        case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            return paths_1.Paths.defendantSoleTraderOrSelfEmployedDetailsPage.uri;
        default:
            throw new Error(`Unknown party type: ${partyDetails.type}`);
    }
}
function renderView(form, res, next) {
    const draft = res.locals.claimDraft;
    getClaimAmountTotal(draft.document)
        .then((interestTotal) => {
        res.render(paths_1.Paths.checkAndSendPage.associatedView, {
            draftClaim: draft.document,
            claimAmountTotal: interestTotal,
            contactPerson: getContactPerson(draft.document.claimant.partyDetails),
            businessName: getBusinessName(draft.document.claimant.partyDetails),
            dateOfBirth: getDateOfBirth(draft.document.claimant.partyDetails),
            defendantBusinessName: getBusinessName(draft.document.defendant.partyDetails),
            partyAsCompanyOrOrganisation: draft.document.claimant.partyDetails.isBusiness(),
            claimantPartyDetailsPageUri: getClaimantPartyDetailsPageUri(draft.document.claimant.partyDetails),
            defendantPartyDetailsPageUri: getDefendantPartyDetailsPageUri(draft.document.defendant.partyDetails),
            paths: paths_1.Paths,
            form: form
        });
    }).catch(next);
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.checkAndSendPage.uri, allClaimTasksCompletedGuard_1.AllClaimTasksCompletedGuard.requestHandler, (req, res, next) => {
    const draft = res.locals.claimDraft;
    const StatementOfTruthClass = getStatementOfTruthClassFor(draft);
    renderView(new form_1.Form(new StatementOfTruthClass()), res, next);
})
    .post(paths_1.Paths.checkAndSendPage.uri, allClaimTasksCompletedGuard_1.AllClaimTasksCompletedGuard.requestHandler, formValidator_1.FormValidator.requestHandler(undefined, deserializerFunction), async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res, next);
    }
    else {
        if (form.model.type === signatureType_1.SignatureType.QUALIFIED) {
            const draft = res.locals.claimDraft;
            const user = res.locals.user;
            draft.document.qualifiedStatementOfTruth = form.model;
            await new draftService_1.DraftService().save(draft, user.bearerToken);
        }
        if (toBoolean(config.get('featureToggles.inversionOfControl'))) {
            res.redirect(paths_1.Paths.initiatePaymentController.uri);
        }
        else {
            res.redirect(paths_1.Paths.startPaymentReceiver.uri);
        }
    }
});
