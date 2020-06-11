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
const notInFuture_1 = require("forms/validation/validators/notInFuture");
const localDate_1 = require("forms/models/localDate");
const validationErrors_1 = require("forms/validation/validationErrors");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.REASON_REQUIRED = 'You need to explain why you’re claiming from a particular date';
class InterestStartDate {
    constructor(date, reason) {
        this.date = date;
        this.reason = reason;
    }
    static fromObject(value) {
        if (value == null) {
            return value;
        }
        return new InterestStartDate(localDate_1.LocalDate.fromObject(value.date), value.reason);
    }
    deserialize(input) {
        if (input) {
            this.date = new localDate_1.LocalDate().deserialize(input.date);
            this.reason = input.reason;
        }
        return this;
    }
    isCompleted() {
        return !!this.reason && this.reason.length > 0 && this.date.toMoment().isValid();
    }
}
__decorate([
    class_validator_1.ValidateNested(),
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.DATE_REQUIRED }),
    cmc_validators_1.IsValidLocalDate({ message: validationErrors_1.ValidationErrors.DATE_NOT_VALID }),
    notInFuture_1.IsNotInFuture({ message: validationErrors_1.ValidationErrors.DATE_IN_FUTURE })
], InterestStartDate.prototype, "date", void 0);
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.REASON_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.REASON_REQUIRED }),
    class_validator_1.MaxLength(10000, { message: validationErrors_1.ValidationErrors.REASON_TOO_LONG })
], InterestStartDate.prototype, "reason", void 0);
exports.InterestStartDate = InterestStartDate;
