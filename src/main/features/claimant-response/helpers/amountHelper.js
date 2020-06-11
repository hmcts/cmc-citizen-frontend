"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yesNoOption_1 = require("models/yesNoOption");
const responseType_1 = require("claims/models/response/responseType");
const formaliseRepaymentPlanOption_1 = require("claimant-response/form/models/formaliseRepaymentPlanOption");
class AmountHelper {
    static calculateTotalAmount(claim, draft) {
        const settledAmount = AmountHelper.calculateAmountSettledFor(claim, draft);
        if (settledAmount && draft.formaliseRepaymentPlan && draft.formaliseRepaymentPlan.option === formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT) {
            return settledAmount;
        }
        else if (settledAmount) {
            return settledAmount + claim.claimData.feeAmountInPennies / 100;
        }
        return claim.totalAmountTillToday;
    }
    static calculateAmountSettledFor(claim, draft) {
        const settledForLessThanClaimAmount = AmountHelper.isSettledForLessThanClaim(claim, draft);
        if (settledForLessThanClaimAmount) {
            return claim.response.amount;
        }
        return undefined;
    }
    static isSettledForLessThanClaim(claim, draft) {
        return claim.response && claim.response.responseType === responseType_1.ResponseType.PART_ADMISSION
            && draft.settleAdmitted && draft.settleAdmitted.admitted === yesNoOption_1.YesNoOption.YES;
    }
}
exports.AmountHelper = AmountHelper;
