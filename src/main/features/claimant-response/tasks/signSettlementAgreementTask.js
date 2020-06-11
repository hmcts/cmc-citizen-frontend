"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const validator = new class_validator_1.Validator();
class SignSettlementAgreementTask {
    static isCompleted(value) {
        return value !== undefined && validator.validateSync(value).length === 0;
    }
}
exports.SignSettlementAgreementTask = SignSettlementAgreementTask;
