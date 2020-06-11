"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interestDateType_1 = require("common/interestDateType");
const interestType_1 = require("claim/form/models/interestType");
const yesNoOption_1 = require("models/yesNoOption");
class ClaimAmount {
    static isCompleted(claim) {
        if (claim.interest.option === yesNoOption_1.YesNoOption.NO) {
            return this.amountAndNoInterestCompleted(claim);
        }
        else {
            return this.amountAndInterestCompleted(claim);
        }
    }
    static amountAndInterestCompleted(claim) {
        if (claim.interestType.option === interestType_1.InterestTypeOption.SAME_RATE) {
            if (claim.interestDate.type === interestDateType_1.InterestDateType.SUBMISSION) {
                return claim.amount.totalAmount() > 0 &&
                    claim.amount.totalAmount() <= 10000 &&
                    claim.interestType.isCompleted() &&
                    claim.interestRate.isCompleted();
            }
            else {
                return claim.amount.totalAmount() > 0 &&
                    claim.amount.totalAmount() <= 10000 &&
                    claim.interestType.isCompleted() &&
                    claim.interestRate.isCompleted() &&
                    claim.interestStartDate.isCompleted() &&
                    claim.interestEndDate.isCompleted();
            }
        }
        else {
            if (claim.interestContinueClaiming.option === yesNoOption_1.YesNoOption.NO) {
                return claim.amount.totalAmount() > 0 &&
                    claim.amount.totalAmount() <= 10000 &&
                    claim.interestTotal.isCompleted() &&
                    claim.interestContinueClaiming.isCompleted();
            }
            else {
                return claim.amount.totalAmount() > 0 &&
                    claim.amount.totalAmount() <= 10000 &&
                    claim.interestTotal.isCompleted() &&
                    claim.interestContinueClaiming.isCompleted() &&
                    claim.interestHowMuch.isCompleted();
            }
        }
    }
    static amountAndNoInterestCompleted(claim) {
        return claim.amount.totalAmount() > 0 && claim.interest.option === yesNoOption_1.YesNoOption.NO;
    }
}
exports.ClaimAmount = ClaimAmount;
