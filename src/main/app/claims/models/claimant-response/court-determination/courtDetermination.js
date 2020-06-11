"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentIntention_1 = require("claims/models/response/core/paymentIntention");
var CourtDetermination;
(function (CourtDetermination) {
    function deserialize(input) {
        if (!input) {
            return input;
        }
        return {
            courtDecision: paymentIntention_1.PaymentIntention.deserialize(input.courtDecision),
            courtPaymentIntention: paymentIntention_1.PaymentIntention.deserialize(input.courtPaymentIntention),
            rejectionReason: input.rejectionReason,
            disposableIncome: input.disposableIncome,
            decisionType: input.decisionType
        };
    }
    CourtDetermination.deserialize = deserialize;
})(CourtDetermination = exports.CourtDetermination || (exports.CourtDetermination = {}));
