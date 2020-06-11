"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseCommon_1 = require("claims/models/response/responseCommon");
const responseType_1 = require("claims/models/response/responseType");
const paymentIntention_1 = require("claims/models/response/core/paymentIntention");
const directionsQuestionnaire_1 = require("claims/models/directions-questionnaire/directionsQuestionnaire");
var PartialAdmissionResponse;
(function (PartialAdmissionResponse) {
    function deserialize(input) {
        return Object.assign(Object.assign({}, responseCommon_1.ResponseCommon.deserialize(input)), { responseType: responseType_1.ResponseType.PART_ADMISSION, amount: input.amount, paymentDeclaration: input.paymentDeclaration
                && {
                    paidDate: input.paymentDeclaration.paidDate,
                    explanation: input.paymentDeclaration.explanation
                }, defence: input.defence, timeline: {
                rows: input.timeline && input.timeline.rows || [],
                comment: input.timeline && input.timeline.comment || undefined
            }, evidence: {
                rows: input.evidence && input.evidence.rows || [],
                comment: input.evidence && input.evidence.comment || undefined
            }, paymentIntention: paymentIntention_1.PaymentIntention.deserialize(input.paymentIntention), statementOfMeans: input.statementOfMeans, directionsQuestionnaire: input.directionsQuestionnaire &&
                directionsQuestionnaire_1.DirectionsQuestionnaire.fromObject(input.directionsQuestionnaire) });
    }
    PartialAdmissionResponse.deserialize = deserialize;
})(PartialAdmissionResponse = exports.PartialAdmissionResponse || (exports.PartialAdmissionResponse = {}));
