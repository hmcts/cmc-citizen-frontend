"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const formaliseOption_1 = require("claims/models/claimant-response/formaliseOption");
const paymentIntentionData_1 = require("test/data/entity/paymentIntentionData");
const courtDeterminationData_1 = require("test/data/entity/courtDeterminationData");
const draft_store_1 = require("test/http-mocks/draft-store");
exports.baseDeterminationAcceptationClaimantResponseData = {
    type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION,
    claimantPaymentIntention: paymentIntentionData_1.monthlyInstalmentPaymentIntentionData,
    courtDetermination: courtDeterminationData_1.courtDeterminationData,
    amountPaid: 100
};
exports.baseAcceptationClaimantResponseData = {
    type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION
};
const baseRejectionClaimantResponseData = {
    type: claimantResponseType_1.ClaimantResponseType.REJECTION,
    amountPaid: 100
};
exports.ccjAcceptationClaimantResponseData = Object.assign(Object.assign({}, exports.baseDeterminationAcceptationClaimantResponseData), { formaliseOption: formaliseOption_1.FormaliseOption.CCJ });
exports.settlementAcceptationClaimantResponseData = Object.assign(Object.assign({}, exports.baseDeterminationAcceptationClaimantResponseData), { formaliseOption: formaliseOption_1.FormaliseOption.SETTLEMENT });
exports.referToJudgeAcceptationClaimantResponseData = Object.assign(Object.assign({}, exports.baseDeterminationAcceptationClaimantResponseData), { formaliseOption: formaliseOption_1.FormaliseOption.REFER_TO_JUDGE });
exports.partAdmissionStatesPaidClaimantResponseData = Object.assign(Object.assign({}, exports.baseAcceptationClaimantResponseData), { claimantPaymentIntention: null, formaliseOption: formaliseOption_1.FormaliseOption.SETTLEMENT });
exports.rejectionClaimantResponseData = Object.assign(Object.assign({}, baseRejectionClaimantResponseData), { freeMediation: 'yes', reason: 'reason' });
exports.rejectionClaimantResponseWithDQ = Object.assign(Object.assign({}, baseRejectionClaimantResponseData), { directionsQuestionnaire: draft_store_1.sampleDirectionsQuestionnaireDraftObj, freeMediation: 'yes', reason: 'reason' });
