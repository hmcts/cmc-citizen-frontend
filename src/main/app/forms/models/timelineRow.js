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
const multiRowFormItem_1 = require("forms/models/multiRowFormItem");
const validationErrors_1 = require("forms/validation/validationErrors");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.DATE_TOO_LONG = 'Enter a date no longer than $constraint1 characters';
ValidationErrors.DESCRIPTION_REQUIRED = 'Enter a description of what happened';
class ValidationConstraints {
}
exports.ValidationConstraints = ValidationConstraints;
ValidationConstraints.DATE_MAX_LENGTH = 20;
class TimelineRow extends multiRowFormItem_1.MultiRowFormItem {
    constructor(date, description) {
        super();
        this.date = date;
        this.description = description;
    }
    static empty() {
        return new TimelineRow(undefined, undefined);
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const date = value.date || undefined;
        const description = value.description || undefined;
        return new TimelineRow(date, description);
    }
    deserialize(input) {
        if (input) {
            this.date = input.date;
            this.description = input.description;
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.isAtLeastOneFieldPopulated()),
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.DATE_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: validationErrors_1.ValidationErrors.DATE_REQUIRED }),
    cmc_validators_1.MaxLength(ValidationConstraints.DATE_MAX_LENGTH, { message: ValidationErrors.DATE_TOO_LONG })
], TimelineRow.prototype, "date", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.isAtLeastOneFieldPopulated()),
    class_validator_1.IsDefined({ message: ValidationErrors.DESCRIPTION_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.DESCRIPTION_REQUIRED }),
    cmc_validators_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], TimelineRow.prototype, "description", void 0);
exports.TimelineRow = TimelineRow;
