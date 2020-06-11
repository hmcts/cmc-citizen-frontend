"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimantResponseCommon_1 = require("claims/models/claimant-response/claimantResponseCommon");
var ResponseAcceptation;
(function (ResponseAcceptation) {
    function deserialize(input) {
        return Object.assign({}, claimantResponseCommon_1.ClaimantResponseCommon.deserialize(input));
    }
    ResponseAcceptation.deserialize = deserialize;
})(ResponseAcceptation = exports.ResponseAcceptation || (exports.ResponseAcceptation = {}));
