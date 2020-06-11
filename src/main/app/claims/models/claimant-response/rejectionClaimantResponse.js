"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimantResponseCommon_1 = require("claims/models/claimant-response/claimantResponseCommon");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const directionsQuestionnaire_1 = require("claims/models/directions-questionnaire/directionsQuestionnaire");
var RejectionClaimantResponse;
(function (RejectionClaimantResponse) {
    function deserialize(input) {
        if (!input) {
            return input;
        }
        return Object.assign(Object.assign({}, claimantResponseCommon_1.ClaimantResponseCommon.deserialize(input)), { type: claimantResponseType_1.ClaimantResponseType.REJECTION, freeMediation: input.freeMediation, reason: input.reason, directionsQuestionnaire: directionsQuestionnaire_1.DirectionsQuestionnaire.fromObject(input.directionsQuestionnaire) });
    }
    RejectionClaimantResponse.deserialize = deserialize;
})(RejectionClaimantResponse = exports.RejectionClaimantResponse || (exports.RejectionClaimantResponse = {}));
