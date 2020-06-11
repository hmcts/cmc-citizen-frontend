"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yesNoOption_1 = require("models/yesNoOption");
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const validationConstraints_1 = require("forms/validation/validationConstraints");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.REASON_REQUIRED = 'Explain your reason for the hearing to be in a different location';
class ExceptionalCircumstances {
    constructor(exceptionalCircumstances, reason) {
        this.exceptionalCircumstances = exceptionalCircumstances;
        this.reason = reason;
    }
    static fromObject(input) {
        if (!input) {
            return input;
        }
        return new ExceptionalCircumstances(yesNoOption_1.YesNoOption.fromObject(input.exceptionalCircumstances), input.reason);
    }
    deserialize(input) {
        if (!input) {
            return input;
        }
        if (input && input.exceptionalCircumstances && input.exceptionalCircumstances.option) {
            this.exceptionalCircumstances = yesNoOption_1.YesNoOption.fromObject(input.exceptionalCircumstances.option);
            this.reason = input.reason;
        }
        return this;
    }
    isDefendantCompleted() {
        if (this.exceptionalCircumstances === undefined) {
            return false;
        }
        else if (this.exceptionalCircumstances.option === yesNoOption_1.YesNoOption.YES.option) {
            return this.reason !== undefined;
        }
        else {
            return true;
        }
    }
    isClaimantCompleted() {
        if (this.exceptionalCircumstances === undefined) {
            return false;
        }
        else if (this.exceptionalCircumstances.option === yesNoOption_1.YesNoOption.YES.option) {
            return this.reason !== undefined;
        }
        else {
            return true;
        }
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED }),
    class_validator_1.IsIn(yesNoOption_1.YesNoOption.all(), { message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED })
], ExceptionalCircumstances.prototype, "exceptionalCircumstances", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.exceptionalCircumstances && o.exceptionalCircumstances.option === yesNoOption_1.YesNoOption.YES.option),
    class_validator_1.IsNotEmpty({ message: ValidationErrors.REASON_REQUIRED }),
    class_validator_1.IsDefined({ message: ValidationErrors.REASON_REQUIRED }),
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], ExceptionalCircumstances.prototype, "reason", void 0);
exports.ExceptionalCircumstances = ExceptionalCircumstances;
