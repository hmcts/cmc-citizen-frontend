"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const claim_1 = require("claims/models/claim");
const claim_store_1 = require("test/http-mocks/claim-store");
const responseData_1 = require("test/data/entity/responseData");
const directionsQuestionnaireHelper_1 = require("claimant-response/helpers/directionsQuestionnaireHelper");
const draftClaimantResponse_1 = require("claimant-response/draft/draftClaimantResponse");
const yesNoOption_1 = require("claims/models/response/core/yesNoOption");
const featureToggles_1 = require("utils/featureToggles");
describe('directionsQuestionnaireHelper', () => {
    it('Should return true if response is full defense and defense type is already paid and claimant want to proceed with the claim', () => {
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.defenceWithAmountClaimedAlreadyPaidData, features: ['directionsQuestionnaire'] }));
        const claimantResponseDraft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            accepted: {
                accepted: {
                    option: yesNoOption_1.YesNoOption.NO
                }
            }
        });
        if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
            chai_1.expect(directionsQuestionnaireHelper_1.DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(claimantResponseDraft, claim)).to.equal(true);
        }
    });
    it('Should return true if response is full defense and defense type is dispute and claimant wants to proceed with the claim', () => {
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.defenceWithDisputeData, features: ['directionsQuestionnaire'] }));
        const claimantResponseDraft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            intentionToProceed: {
                proceed: {
                    option: yesNoOption_1.YesNoOption.YES
                }
            }
        });
        if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
            chai_1.expect(directionsQuestionnaireHelper_1.DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(claimantResponseDraft, claim)).to.equal(true);
        }
    });
    it('Should return true if response is part admission and there is no payment intention and claimant rejects the defence', () => {
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.partialAdmissionAlreadyPaidData, features: ['directionsQuestionnaire'] }));
        const claimantResponseDraft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            accepted: {
                accepted: {
                    option: yesNoOption_1.YesNoOption.NO
                }
            }
        });
        if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
            chai_1.expect(directionsQuestionnaireHelper_1.DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(claimantResponseDraft, claim)).to.equal(true);
        }
    });
    it('Should return false if response is part admission and there is a payment intention and claimant reject admission', () => {
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.partialAdmissionWithImmediatePaymentData(), features: ['directionsQuestionnaire'] }));
        const claimantResponseDraft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            accepted: {
                accepted: {
                    option: yesNoOption_1.YesNoOption.NO
                }
            }
        });
        chai_1.expect(directionsQuestionnaireHelper_1.DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(claimantResponseDraft, claim)).to.equal(false);
    });
    it('Should return false for full admission response', () => {
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.fullAdmissionWithImmediatePaymentData(), features: ['directionsQuestionnaire'] }));
        const claimantResponseDraft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({});
        chai_1.expect(directionsQuestionnaireHelper_1.DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(claimantResponseDraft, claim)).to.equal(false);
    });
});
