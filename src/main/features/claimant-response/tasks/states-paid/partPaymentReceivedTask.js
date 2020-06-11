"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const validator = new class_validator_1.Validator();
class PartPaymentReceivedTask {
    static isCompleted(value) {
        if (!value.partPaymentReceived) {
            return false;
        }
        return validator.validateSync(value.partPaymentReceived).length === 0;
    }
}
exports.PartPaymentReceivedTask = PartPaymentReceivedTask;
