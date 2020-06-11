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
const validationErrors_1 = require("forms/validation/validationErrors");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const multiRowFormItem_1 = require("forms/models/multiRowFormItem");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.EMPLOYER_NAME_REQUIRED = 'Enter an employer name';
ValidationErrors.JOB_TITLE_REQUIRED = 'Enter a job title';
class EmployerRow extends multiRowFormItem_1.MultiRowFormItem {
    constructor(employerName, jobTitle) {
        super();
        this.jobTitle = undefined;
        this.employerName = employerName;
        this.jobTitle = jobTitle;
    }
    static empty() {
        return new EmployerRow(undefined, undefined);
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const employerName = value.employerName || undefined;
        const jobTitle = value.jobTitle || undefined;
        return new EmployerRow(employerName, jobTitle);
    }
    deserialize(input) {
        if (input) {
            this.employerName = input.employerName;
            this.jobTitle = input.jobTitle;
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.jobTitle !== undefined),
    class_validator_1.IsDefined({ message: ValidationErrors.EMPLOYER_NAME_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.EMPLOYER_NAME_REQUIRED }),
    cmc_validators_1.MaxLength(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], EmployerRow.prototype, "employerName", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.employerName !== undefined),
    class_validator_1.IsDefined({ message: ValidationErrors.JOB_TITLE_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.JOB_TITLE_REQUIRED }),
    cmc_validators_1.MaxLength(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], EmployerRow.prototype, "jobTitle", void 0);
exports.EmployerRow = EmployerRow;
