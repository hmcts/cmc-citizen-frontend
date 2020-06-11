"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ccjPaymentOption_1 = require("ccj/form/models/ccjPaymentOption");
const paidAmount_1 = require("ccj/form/models/paidAmount");
const paymentDate_1 = require("shared/components/payment-intention/model/paymentDate");
const repaymentPlan_1 = require("ccj/form/models/repaymentPlan");
const qualifiedDeclaration_1 = require("ccj/form/models/qualifiedDeclaration");
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const dateOfBirth_1 = require("forms/models/dateOfBirth");
class DraftCCJ extends cmc_draft_store_middleware_1.DraftDocument {
    constructor(defendantDateOfBirth = new dateOfBirth_1.DateOfBirth(), paymentOption = new ccjPaymentOption_1.CCJPaymentOption(), paidAmount, repaymentPlan, qualifiedDeclaration) {
        super();
        this.paymentOption = new ccjPaymentOption_1.CCJPaymentOption();
        this.defendantDateOfBirth = defendantDateOfBirth;
        this.paymentOption = paymentOption;
        this.paidAmount = paidAmount;
        this.repaymentPlan = repaymentPlan;
        this.qualifiedDeclaration = qualifiedDeclaration;
    }
    deserialize(input) {
        if (input) {
            this.externalId = input.externalId;
            if (input.defendantDateOfBirth) {
                this.defendantDateOfBirth = new dateOfBirth_1.DateOfBirth().deserialize(input.defendantDateOfBirth);
            }
            this.paymentOption = new ccjPaymentOption_1.CCJPaymentOption().deserialize(input.paymentOption);
            this.paidAmount = new paidAmount_1.PaidAmount().deserialize(input.paidAmount);
            this.payBySetDate = new paymentDate_1.PaymentDate().deserialize(input.payBySetDate);
            this.repaymentPlan = new repaymentPlan_1.RepaymentPlan().deserialize(input.repaymentPlan);
            if (input.qualifiedDeclaration) {
                this.qualifiedDeclaration = new qualifiedDeclaration_1.QualifiedDeclaration().deserialize(input.qualifiedDeclaration);
            }
        }
        return this;
    }
}
exports.DraftCCJ = DraftCCJ;
