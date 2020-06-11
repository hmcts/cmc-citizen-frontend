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
const isTodayOrInFuture_1 = require("forms/validation/validators/isTodayOrInFuture");
const localDate_1 = require("forms/models/localDate");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.DATE_REQUIRED = 'Enter a date';
ValidationErrors.DATE_NOT_VALID = 'Enter a valid date';
ValidationErrors.DATE_TODAY_OR_IN_FUTURE = 'Enter a date that is today or in the future';
class PaymentDate {
    constructor(date) {
        this.date = date;
    }
    static fromObject(value) {
        if (value == null) {
            return value;
        }
        return new PaymentDate(localDate_1.LocalDate.fromObject(value.date));
    }
    deserialize(input) {
        if (input) {
            this.date = new localDate_1.LocalDate().deserialize(input.date);
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateNested(),
    class_validator_1.IsDefined({ message: ValidationErrors.DATE_REQUIRED }),
    cmc_validators_1.IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID }),
    isTodayOrInFuture_1.IsTodayOrInFuture({ message: ValidationErrors.DATE_TODAY_OR_IN_FUTURE })
], PaymentDate.prototype, "date", void 0);
exports.PaymentDate = PaymentDate;
