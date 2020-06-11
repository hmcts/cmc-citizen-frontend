"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const validator = new class_validator_1.Validator();
function isValid(input) {
    return input !== undefined && validator.validateSync(input).length === 0;
}
class DecideHowYouWillPayTask {
    static isCompleted(responseDraft) {
        return responseDraft.fullAdmission.paymentIntention !== undefined
            && isValid(responseDraft.fullAdmission.paymentIntention.paymentOption)
            && this.paymentDetailsAreProvidedFor(responseDraft);
    }
    static paymentDetailsAreProvidedFor(responseDraft) {
        switch (responseDraft.fullAdmission.paymentIntention.paymentOption.option) {
            case paymentOption_1.PaymentType.IMMEDIATELY:
                return true;
            case paymentOption_1.PaymentType.INSTALMENTS:
                return true;
            case paymentOption_1.PaymentType.BY_SET_DATE:
                return isValid(responseDraft.fullAdmission.paymentIntention.paymentDate);
            default:
                throw new Error(`Unknown payment option: ${responseDraft.fullAdmission.paymentIntention.paymentOption.option}`);
        }
    }
}
exports.DecideHowYouWillPayTask = DecideHowYouWillPayTask;
