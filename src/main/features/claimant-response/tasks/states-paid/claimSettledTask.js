"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const yesNoOption_1 = require("models/yesNoOption");
const validator = new class_validator_1.Validator();
class ClaimSettledTask {
    static isCompleted(value) {
        if (!value.accepted || validator.validateSync(value.accepted).length > 0) {
            return false;
        }
        const isReasonNeeded = value.accepted.accepted.option === yesNoOption_1.YesNoOption.NO.option;
        if (isReasonNeeded) {
            return value.rejectionReason !== undefined && validator.validateSync(value.rejectionReason).length === 0;
        }
        else {
            return true;
        }
    }
}
exports.ClaimSettledTask = ClaimSettledTask;
