"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimantResponseCommon_1 = require("claims/models/claimant-response/claimantResponseCommon");
var ResponseRejection;
(function (ResponseRejection) {
    function deserialize(input) {
        return Object.assign(Object.assign({}, claimantResponseCommon_1.ClaimantResponseCommon.deserialize(input)), { reason: input.reason, freeMediation: input.freeMediation });
    }
    ResponseRejection.deserialize = deserialize;
})(ResponseRejection = exports.ResponseRejection || (exports.ResponseRejection = {}));
