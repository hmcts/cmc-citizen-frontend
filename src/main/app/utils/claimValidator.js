"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("errors");
class ClaimValidator {
    static claimAmount(claimAmount) {
        if (claimAmount == null || claimAmount < 0) {
            throw new Error('Claim amount must be a valid numeric value');
        }
        else if (claimAmount > this.AMOUNT_LIMIT) {
            throw new errors_1.ClaimAmountExceedsLimitError();
        }
    }
}
exports.ClaimValidator = ClaimValidator;
ClaimValidator.AMOUNT_LIMIT = 10000;
