"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const multiRowFormItem_1 = require("forms/models/multiRowFormItem");
const localDate_1 = require("forms/models/localDate");
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const datePastConstraint_1 = require("forms/validation/validators/datePastConstraint");
const validationConstraints_1 = require("forms/validation/validationConstraints");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.NAME_REQUIRED = 'Enter the expert’s name';
ValidationErrors.DATE_REQUIRED = validationErrors_1.ValidationErrors.DATE_REQUIRED;
ValidationErrors.PAST_DATE_REQUIRED = validationErrors_1.ValidationErrors.DATE_IN_FUTURE;
ValidationErrors.VALID_DATE_REQUIRED = validationErrors_1.ValidationErrors.DATE_NOT_VALID;
class ReportRow extends multiRowFormItem_1.MultiRowFormItem {
    constructor(expertName, reportDate) {
        super();
        this.expertName = expertName;
        this.reportDate = reportDate;
    }
    static empty() {
        return new ReportRow(undefined, undefined);
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const expertName = value.expertName || undefined;
        let reportDate = undefined;
        if (value.reportDate && (value.reportDate.year || value.reportDate.month || value.reportDate.day)) {
            reportDate = localDate_1.LocalDate.fromObject(value.reportDate);
        }
        return new ReportRow(expertName, reportDate);
    }
    deserialize(input) {
        if (input) {
            this.expertName = input.expertName;
            if (input.reportDate) {
                this.reportDate = new localDate_1.LocalDate().deserialize(input.reportDate);
            }
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.reportDate && o.reportDate !== new localDate_1.LocalDate()),
    class_validator_1.IsDefined({ message: ValidationErrors.NAME_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.NAME_REQUIRED }),
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], ReportRow.prototype, "expertName", void 0);
__decorate([
    class_validator_1.ValidateIf(o => !!o.expertName),
    class_validator_1.IsDefined({ message: ValidationErrors.DATE_REQUIRED }),
    cmc_validators_1.IsValidLocalDate({ message: ValidationErrors.VALID_DATE_REQUIRED }),
    datePastConstraint_1.IsPastDate({ message: ValidationErrors.PAST_DATE_REQUIRED }),
    class_validator_1.ValidateNested()
], ReportRow.prototype, "reportDate", void 0);
exports.ReportRow = ReportRow;
