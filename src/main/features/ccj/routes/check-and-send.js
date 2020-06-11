"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("ccj/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const declaration_1 = require("ccj/form/models/declaration");
const ccjClient_1 = require("claims/ccjClient");
const errorHandling_1 = require("shared/errorHandling");
const signatureType_1 = require("common/signatureType");
const qualifiedDeclaration_1 = require("ccj/form/models/qualifiedDeclaration");
const class_transformer_1 = require("class-transformer");
const partyDetails_1 = require("forms/models/partyDetails");
const partyType_1 = require("common/partyType");
const draftService_1 = require("services/draftService");
const ccjModelConverter_1 = require("claims/ccjModelConverter");
const ccjPaymentOption_1 = require("ccj/form/models/ccjPaymentOption");
const paymentOption_1 = require("claims/models/paymentOption");
const paymentDate_1 = require("shared/components/payment-intention/model/paymentDate");
const localDate_1 = require("forms/models/localDate");
const CCJHelper = require("main/common/helpers/ccjHelper");
function prepareUrls(externalId, claim, draft) {
    if (claim.response && claim.isAdmissionsResponse()) {
        if (draft.document.paymentOption.option !== ccjPaymentOption_1.PaymentType.INSTALMENTS) {
            return {
                paidAmountUrl: paths_1.Paths.paidAmountPage.evaluateUri({ externalId: externalId }),
                paymentOptionUrl: paths_1.Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
            };
        }
        else {
            return {
                paidAmountUrl: paths_1.Paths.paidAmountPage.evaluateUri({ externalId: externalId })
            };
        }
    }
    return {
        paidAmountUrl: paths_1.Paths.paidAmountPage.evaluateUri({ externalId: externalId }),
        dateOfBirthUrl: paths_1.Paths.dateOfBirthPage.evaluateUri({ externalId: externalId }),
        paymentOptionUrl: paths_1.Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
    };
}
function convertToPartyDetails(party) {
    return class_transformer_1.plainToClass(partyDetails_1.PartyDetails, party);
}
function retrieveAndSetDateOfBirthIntoDraft(claim, draft) {
    const dateOfBirthFromResponse = claim.retrieveDateOfBirthOfDefendant;
    if (dateOfBirthFromResponse) {
        draft.document.defendantDateOfBirth = dateOfBirthFromResponse;
    }
    return draft;
}
function renderView(form, req, res) {
    const claim = res.locals.claim;
    let draft = res.locals.ccjDraft;
    const defendant = convertToPartyDetails(claim.claimData.defendant);
    draft = retrieveAndSetDateOfBirthIntoDraft(claim, draft);
    draft = retrieveAndSetValuesInDraft(claim, draft);
    if (defendant.type === partyType_1.PartyType.INDIVIDUAL.value) {
        defendant.dateOfBirth = draft.document.defendantDateOfBirth;
    }
    res.render(paths_1.Paths.checkAndSendPage.associatedView, Object.assign({ form: form, claim: claim, draft: draft.document, defendant: defendant, amountToBePaid: calculateAmountToBePaid(claim, draft) }, prepareUrls(req.params.externalId, claim, draft)));
}
function calculateAmountToBePaid(claim, draft) {
    if (CCJHelper.isPartAdmissionAcceptation(claim)) {
        return CCJHelper.amountSettledFor(claim) - (draft.document.paidAmount.amount || 0) + CCJHelper.claimFeeInPennies(claim) / 100;
    }
    return claim.totalAmountTillToday - (draft.document.paidAmount.amount || 0);
}
function retrieveAndSetValuesInDraft(claim, draft) {
    const paymentOption = ccjModelConverter_1.retrievePaymentOptionsFromClaim(claim);
    if (paymentOption) {
        draft.document.paymentOption = paymentOption;
        if (paymentOption && paymentOption.option.value === paymentOption_1.PaymentOption.INSTALMENTS) {
            draft.document.repaymentPlan = ccjModelConverter_1.getRepaymentPlanForm(claim, draft);
        }
        else if (paymentOption && paymentOption.option.value === paymentOption_1.PaymentOption.BY_SPECIFIED_DATE) {
            draft.document.payBySetDate = new paymentDate_1.PaymentDate(localDate_1.LocalDate.fromMoment(claim.settlement.getLastOffer().paymentIntention.paymentDate));
        }
    }
    return draft;
}
function deserializerFunction(value) {
    switch (value.type) {
        case signatureType_1.SignatureType.BASIC:
            return declaration_1.Declaration.fromObject(value);
        case signatureType_1.SignatureType.QUALIFIED:
            return qualifiedDeclaration_1.QualifiedDeclaration.fromObject(value);
        default:
            throw new Error(`Unknown declaration type: ${value.type}`);
    }
}
function getStatementOfTruthClassFor(claim) {
    if (claim.claimData.claimant.isBusiness()) {
        return qualifiedDeclaration_1.QualifiedDeclaration;
    }
    else {
        return declaration_1.Declaration;
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.checkAndSendPage.uri, (req, res) => {
    const claim = res.locals.claim;
    const StatementOfTruthClass = getStatementOfTruthClassFor(claim);
    renderView(new form_1.Form(new StatementOfTruthClass()), req, res);
})
    .post(paths_1.Paths.checkAndSendPage.uri, formValidator_1.FormValidator.requestHandler(undefined, deserializerFunction), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, req, res);
    }
    else {
        const claim = res.locals.claim;
        let draft = res.locals.ccjDraft;
        draft = retrieveAndSetValuesInDraft(claim, draft);
        draft = retrieveAndSetDateOfBirthIntoDraft(claim, draft);
        const user = res.locals.user;
        if (form.model.type === signatureType_1.SignatureType.QUALIFIED) {
            draft.document.qualifiedDeclaration = form.model;
            await new draftService_1.DraftService().save(draft, user.bearerToken);
        }
        const countyCourtJudgment = ccjModelConverter_1.CCJModelConverter.convertForRequest(draft.document, claim);
        await ccjClient_1.CCJClient.request(claim.externalId, countyCourtJudgment, user);
        await new draftService_1.DraftService().delete(draft.id, user.bearerToken);
        res.redirect(paths_1.Paths.ccjConfirmationPage.evaluateUri({ externalId: req.params.externalId }));
    }
}));
