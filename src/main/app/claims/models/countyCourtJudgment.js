"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repaymentPlan_1 = require("claims/models/repaymentPlan");
const momentFactory_1 = require("shared/momentFactory");
const statementOfTruth_1 = require("claims/models/statementOfTruth");
const numericUtils_1 = require("shared/utils/numericUtils");
class CountyCourtJudgment {
    constructor(defendantDateOfBirth, paymentOption, paidAmount, repaymentPlan, payBySetDate, statementOfTruth, ccjType) {
        this.defendantDateOfBirth = defendantDateOfBirth;
        this.paymentOption = paymentOption;
        this.paidAmount = paidAmount;
        this.repaymentPlan = repaymentPlan;
        this.payBySetDate = payBySetDate;
        this.statementOfTruth = statementOfTruth;
        this.ccjType = ccjType;
        this.defendantDateOfBirth = defendantDateOfBirth;
        this.paymentOption = paymentOption;
        this.paidAmount = paidAmount;
        this.repaymentPlan = repaymentPlan;
        this.payBySetDate = payBySetDate;
        this.ccjType = ccjType;
    }
    deserialize(input) {
        if (input) {
            if (input.defendantDateOfBirth) {
                this.defendantDateOfBirth = momentFactory_1.MomentFactory.parse(input.defendantDateOfBirth);
            }
            this.paymentOption = input.paymentOption;
            this.paidAmount = numericUtils_1.toNumberOrUndefined(input.paidAmount);
            this.repaymentPlan = input.repaymentPlan ? new repaymentPlan_1.RepaymentPlan().deserialize(input.repaymentPlan) : undefined;
            this.payBySetDate = input.payBySetDate ? momentFactory_1.MomentFactory.parse(input.payBySetDate) : undefined;
            this.statementOfTruth = new statementOfTruth_1.StatementOfTruth().deserialize(input.statementOfTruth);
            if (input.ccjType) {
                this.ccjType = input.ccjType;
            }
        }
        return this;
    }
}
exports.CountyCourtJudgment = CountyCourtJudgment;
