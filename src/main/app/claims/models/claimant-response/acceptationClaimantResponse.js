"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimantResponseCommon_1 = require("claims/models/claimant-response/claimantResponseCommon");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const paymentIntention_1 = require("claims/models/response/core/paymentIntention");
const courtDetermination_1 = require("claims/models/claimant-response/court-determination/courtDetermination");
var AcceptationClaimantResponse;
(function (AcceptationClaimantResponse) {
    function deserialize(input) {
        if (!input) {
            return input;
        }
        return Object.assign(Object.assign({}, claimantResponseCommon_1.ClaimantResponseCommon.deserialize(input)), { type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION, claimantPaymentIntention: paymentIntention_1.PaymentIntention.deserialize(input.claimantPaymentIntention), courtDetermination: courtDetermination_1.CourtDetermination.deserialize(input.courtDetermination), formaliseOption: input.formaliseOption });
    }
    AcceptationClaimantResponse.deserialize = deserialize;
})(AcceptationClaimantResponse = exports.AcceptationClaimantResponse || (exports.AcceptationClaimantResponse = {}));
