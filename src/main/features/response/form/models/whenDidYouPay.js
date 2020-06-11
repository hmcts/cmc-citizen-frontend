"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const datePastConstraint_1 = require("forms/validation/validators/datePastConstraint");
const localDate_1 = require("forms/models/localDate");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const momentFactory_1 = require("shared/momentFactory");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const validationErrors_1 = require("forms/validation/validationErrors");
const momentFormatter_1 = require("utils/momentFormatter");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.EXPLANATION_REQUIRED = 'Explain how you paid the amount claimed';
ValidationErrors.DATE_OUTSIDE_RANGE = () => {
    const currentDate = momentFormatter_1.MomentFormatter.formatLongDate(momentFactory_1.MomentFactory.currentDate());
    return `Enter date before ${currentDate}`;
};
class WhenDidYouPay {
    constructor(date, text) {
        this.date = date;
        this.text = text;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const date = localDate_1.LocalDate.fromObject(value.date);
        const text = value.text;
        return new WhenDidYouPay(date, text);
    }
    deserialize(input) {
        if (input) {
            this.date = new localDate_1.LocalDate().deserialize(input.date);
            this.text = input.text;
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateNested(),
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.DATE_REQUIRED }),
    datePastConstraint_1.IsPastDate({ message: ValidationErrors.DATE_OUTSIDE_RANGE }),
    cmc_validators_1.IsValidLocalDate({ message: validationErrors_1.ValidationErrors.DATE_NOT_VALID })
], WhenDidYouPay.prototype, "date", void 0);
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.EXPLANATION_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.EXPLANATION_REQUIRED }),
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], WhenDidYouPay.prototype, "text", void 0);
exports.WhenDidYouPay = WhenDidYouPay;
