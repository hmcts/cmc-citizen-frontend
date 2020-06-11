"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseCommon_1 = require("claims/models/response/responseCommon");
const responseType_1 = require("claims/models/response/responseType");
const paymentIntention_1 = require("claims/models/response/core/paymentIntention");
var FullAdmissionResponse;
(function (FullAdmissionResponse) {
    function deserialize(input) {
        return Object.assign(Object.assign({}, responseCommon_1.ResponseCommon.deserialize(input)), { responseType: responseType_1.ResponseType.FULL_ADMISSION, paymentIntention: paymentIntention_1.PaymentIntention.deserialize(input.paymentIntention), statementOfMeans: input.statementOfMeans });
    }
    FullAdmissionResponse.deserialize = deserialize;
})(FullAdmissionResponse = exports.FullAdmissionResponse || (exports.FullAdmissionResponse = {}));
