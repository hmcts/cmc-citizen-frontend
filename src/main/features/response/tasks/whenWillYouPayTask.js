"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const yesNoOption_1 = require("models/yesNoOption");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const validator = new class_validator_1.Validator();
function isValid(model) {
    return !!model && validator.validateSync(model).length === 0;
}
class WhenWillYouPayTask {
    static isCompleted(responseDraft) {
        if (responseDraft.partialAdmission.paymentIntention
            && responseDraft.partialAdmission.paymentIntention.paymentOption
            && responseDraft.partialAdmission.paymentIntention.paymentOption.isOfType(paymentOption_1.PaymentType.BY_SET_DATE)) {
            return isValid(responseDraft.partialAdmission.paymentIntention.paymentDate);
        }
        return responseDraft.partialAdmission.alreadyPaid.option === yesNoOption_1.YesNoOption.NO
            && responseDraft.partialAdmission.paymentIntention !== undefined
            && isValid(responseDraft.partialAdmission.paymentIntention.paymentOption);
    }
}
exports.WhenWillYouPayTask = WhenWillYouPayTask;
