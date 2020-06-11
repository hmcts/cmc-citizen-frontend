"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const allClaimantResponseTasksCompletedGuard_1 = require("claimant-response/guards/allClaimantResponseTasksCompletedGuard");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const statesPaidHelper_1 = require("claimant-response/helpers/statesPaidHelper");
const claimStoreClient_1 = require("claims/claimStoreClient");
const amountHelper_1 = require("claimant-response/helpers/amountHelper");
const yesNoOption_1 = require("claims/models/response/core/yesNoOption");
const responseType_1 = require("claims/models/response/responseType");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
const featureToggles_1 = require("utils/featureToggles");
const signatureType_1 = require("common/signatureType");
const form_1 = require("forms/form");
const statementOfTruth_1 = require("claimant-response/form/models/statementOfTruth");
const formValidator_1 = require("forms/validation/formValidator");
const directionsQuestionnaireHelper_1 = require("claimant-response/helpers/directionsQuestionnaireHelper");
const freeMediationUtil_1 = require("shared/utils/freeMediationUtil");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const momentFactory_1 = require("shared/momentFactory");
function getPaymentIntention(draft, claim) {
    const response = claim.response;
    if (draft.settleAdmitted && draft.settleAdmitted.admitted.option === yesNoOption_1.YesNoOption.NO) {
        // claimant rejected a part admit, so no payment plan has been agreed at all
        return undefined;
    }
    if (draft.acceptPaymentMethod) {
        if (draft.acceptPaymentMethod.accept.option === yesNoOption_1.YesNoOption.YES) {
            // both parties agree the amount
            return response.paymentIntention;
        }
        if (!draft.courtDetermination) {
            // the court calculator was not invoked, so the alternate plan must have been more lenient than the defendant's
            return draft.alternatePaymentMethod.toDomainInstance();
        }
        return draft.courtDetermination.courtDecision;
    }
    // claimant was not asked to accept the payment method, so it must have been IMMEDIATELY
    return response.paymentIntention;
}
function deserializerFunction(value) {
    return statementOfTruth_1.StatementOfTruth.fromObject(value);
}
function renderView(form, res) {
    const draft = res.locals.claimantResponseDraft;
    const mediationDraft = res.locals.mediationDraft;
    const directionsQuestionnaireDraft = res.locals.directionsQuestionnaireDraft;
    const claim = res.locals.claim;
    const alreadyPaid = statesPaidHelper_1.StatesPaidHelper.isResponseAlreadyPaid(claim);
    const paymentIntention = alreadyPaid || claim.response.responseType === responseType_1.ResponseType.FULL_DEFENCE ? undefined : getPaymentIntention(draft.document, claim);
    const mediationPilot = claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'mediationPilot');
    const dqsEnabled = directionsQuestionnaireHelper_1.DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(draft.document, claim);
    const dispute = claim.response.responseType === responseType_1.ResponseType.FULL_DEFENCE;
    let datesUnavailable;
    if (dqsEnabled) {
        datesUnavailable = directionsQuestionnaireDraft.document.availability.unavailableDates.map(date => date.toMoment().format('LL'));
    }
    let alternatePaymentMethodDate;
    if (draft.document.alternatePaymentMethod) {
        if (draft.document.alternatePaymentMethod.paymentOption.option === paymentOption_1.PaymentType.INSTALMENTS) {
            alternatePaymentMethodDate = draft.document.alternatePaymentMethod.paymentPlan.firstPaymentDate.toMoment();
        }
        else if (draft.document.alternatePaymentMethod.paymentOption.option === paymentOption_1.PaymentType.BY_SET_DATE) {
            alternatePaymentMethodDate = draft.document.alternatePaymentMethod.paymentDate.date.toMoment();
        }
        else {
            alternatePaymentMethodDate = momentFactory_1.MomentFactory.currentDate().add(5, 'days');
        }
    }
    form.model.type = dqsEnabled ? signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE : form.model.type;
    res.render(paths_1.Paths.checkAndSendPage.associatedView, {
        draft: draft.document,
        claim: claim,
        form: form,
        totalAmount: amountHelper_1.AmountHelper.calculateTotalAmount(claim, res.locals.draft.document),
        paymentIntention: paymentIntention,
        claimantPaymentPlan: draft.document.alternatePaymentMethod ? draft.document.alternatePaymentMethod.toDomainInstance() : undefined,
        alreadyPaid: alreadyPaid,
        amount: alreadyPaid ? statesPaidHelper_1.StatesPaidHelper.getAlreadyPaidAmount(claim) : undefined,
        mediationEnabled: featureToggles_1.FeatureToggles.isEnabled('mediation'),
        directionsQuestionnaireEnabled: dqsEnabled,
        mediationDraft: mediationDraft.document,
        contactPerson: freeMediationUtil_1.FreeMediationUtil.getMediationContactPerson(claim, mediationDraft.document),
        contactNumber: freeMediationUtil_1.FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft.document),
        directionsQuestionnaireDraft: directionsQuestionnaireDraft.document,
        datesUnavailable: datesUnavailable,
        dispute: dispute,
        mediationPilot: mediationPilot,
        alternatePaymentMethodDate: alternatePaymentMethodDate
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.checkAndSendPage.uri, allClaimantResponseTasksCompletedGuard_1.AllClaimantResponseTasksCompletedGuard.requestHandler, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = new form_1.Form(new statementOfTruth_1.StatementOfTruth());
    renderView(form, res);
}))
    .post(paths_1.Paths.checkAndSendPage.uri, allClaimantResponseTasksCompletedGuard_1.AllClaimantResponseTasksCompletedGuard.requestHandler, formValidator_1.FormValidator.requestHandler(undefined, deserializerFunction), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const claim = res.locals.claim;
        const draft = res.locals.claimantResponseDraft;
        const mediationDraft = res.locals.mediationDraft;
        const user = res.locals.user;
        const directionsQuestionnaireDraft = res.locals.directionsQuestionnaireDraft;
        const draftService = new draftService_1.DraftService();
        await new claimStoreClient_1.ClaimStoreClient().saveClaimantResponse(claim, draft, mediationDraft, user, directionsQuestionnaireDraft.document);
        await new draftService_1.DraftService().delete(draft.id, user.bearerToken);
        if (directionsQuestionnaireHelper_1.DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(draft.document, claim) && directionsQuestionnaireDraft.id) {
            await draftService.delete(directionsQuestionnaireDraft.id, user.bearerToken);
        }
        if (claim.response.responseType !== responseType_1.ResponseType.FULL_ADMISSION && mediationDraft.id) {
            await draftService.delete(mediationDraft.id, user.bearerToken);
        }
        res.redirect(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }));
    }
}));
