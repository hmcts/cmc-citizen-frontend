"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseCommon_1 = require("./responseCommon");
const responseType_1 = require("claims/models/response/responseType");
const paymentDeclaration_1 = require("claims/models/paymentDeclaration");
const directionsQuestionnaire_1 = require("claims/models/directions-questionnaire/directionsQuestionnaire");
var FullDefenceResponse;
(function (FullDefenceResponse) {
    function deserialize(input) {
        return Object.assign(Object.assign({}, responseCommon_1.ResponseCommon.deserialize(input)), { responseType: responseType_1.ResponseType.FULL_DEFENCE, defenceType: input.defenceType, paymentDeclaration: input.paymentDeclaration ? new paymentDeclaration_1.PaymentDeclaration().deserialize(input.paymentDeclaration) : undefined, defence: input.defence, timeline: {
                rows: input.timeline && input.timeline.rows || [],
                comment: input.timeline && input.timeline.comment || undefined
            }, evidence: {
                rows: input.evidence && input.evidence.rows || [],
                comment: input.evidence && input.evidence.comment || undefined
            }, directionsQuestionnaire: input.directionsQuestionnaire &&
                directionsQuestionnaire_1.DirectionsQuestionnaire.fromObject(input.directionsQuestionnaire) });
    }
    FullDefenceResponse.deserialize = deserialize;
})(FullDefenceResponse = exports.FullDefenceResponse || (exports.FullDefenceResponse = {}));
