"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const acceptationClaimantResponse_1 = require("claims/models/claimant-response/acceptationClaimantResponse");
const rejectionClaimantResponse_1 = require("claims/models/claimant-response/rejectionClaimantResponse");
const deserializers = {
    [claimantResponseType_1.ClaimantResponseType.ACCEPTATION]: acceptationClaimantResponse_1.AcceptationClaimantResponse.deserialize,
    [claimantResponseType_1.ClaimantResponseType.REJECTION]: rejectionClaimantResponse_1.RejectionClaimantResponse.deserialize
};
var ClaimantResponse;
(function (ClaimantResponse) {
    function deserialize(input) {
        if (!input) {
            return input;
        }
        return deserializers[input.type](input);
    }
    ClaimantResponse.deserialize = deserialize;
})(ClaimantResponse = exports.ClaimantResponse || (exports.ClaimantResponse = {}));
