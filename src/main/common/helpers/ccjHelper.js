"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseType_1 = require("claims/models/response/responseType");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
function amountSettledFor(claim) {
    if (isPartAdmissionAcceptation(claim)) {
        const response = claim.response;
        return Math.max(response.amount - claim.claimData.feeAmountInPennies / 100, 0);
    }
    return undefined;
}
exports.amountSettledFor = amountSettledFor;
function claimFeeInPennies(claim) {
    if (isPartAdmissionAcceptation(claim)) {
        const response = claim.response;
        if (amountSettledFor(claim) === 0 && response.amount < claim.claimData.feeAmountInPennies / 100) {
            return response.amount * 100;
        }
    }
    return claim.claimData.feeAmountInPennies;
}
exports.claimFeeInPennies = claimFeeInPennies;
function isPartAdmissionAcceptation(claim) {
    return claim.response && claim.response.responseType === responseType_1.ResponseType.PART_ADMISSION
        && claim.claimantResponse && claim.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.ACCEPTATION;
}
exports.isPartAdmissionAcceptation = isPartAdmissionAcceptation;
function totalRemainingToPay(claim) {
    let total = amountSettledFor(claim) + claimFeeInPennies(claim) / 100 - claim.amountPaid();
    if (claim.countyCourtJudgment && claim.countyCourtJudgment.paidAmount) {
        total -= claim.countyCourtJudgment.paidAmount;
    }
    return total;
}
exports.totalRemainingToPay = totalRemainingToPay;
