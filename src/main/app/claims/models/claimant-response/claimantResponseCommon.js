"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClaimantResponseCommon;
(function (ClaimantResponseCommon) {
    function deserialize(input) {
        return {
            type: input.type,
            amountPaid: input.amountPaid,
            paymentReceived: input.paymentReceived,
            settleForAmount: input.settleForAmount
        };
    }
    ClaimantResponseCommon.deserialize = deserialize;
})(ClaimantResponseCommon = exports.ClaimantResponseCommon || (exports.ClaimantResponseCommon = {}));
