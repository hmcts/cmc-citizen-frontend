"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const validator = new class_validator_1.Validator();
function isValid(input) {
    return !!input && validator.validateSync(input).length === 0;
}
class YourRepaymentPlanTask {
    static isCompleted(paymentPlan) {
        return isValid(paymentPlan);
    }
}
exports.YourRepaymentPlanTask = YourRepaymentPlanTask;
