"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const validationErrors_1 = require("forms/validation/validationErrors");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.EXPLAIN_WHY_YOU_REJECT_REPAYMENT_PLAN = 'Enter why you rejected repayment plan';
class RejectionReason {
    constructor(text) {
        this.text = text;
    }
    static fromObject(input) {
        if (input == null) {
            return input;
        }
        return new RejectionReason(input);
    }
    deserialize(input) {
        if (input) {
            this.text = input.text;
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.EXPLAIN_WHY_YOU_REJECT_REPAYMENT_PLAN }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.EXPLAIN_WHY_YOU_REJECT_REPAYMENT_PLAN }),
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], RejectionReason.prototype, "text", void 0);
exports.RejectionReason = RejectionReason;
