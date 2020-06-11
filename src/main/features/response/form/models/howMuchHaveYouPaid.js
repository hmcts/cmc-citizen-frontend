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
const momentFormatter_1 = require("utils/momentFormatter");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const validationErrors_1 = require("forms/validation/validationErrors");
const numericUtils_1 = require("shared/utils/numericUtils");
const currentDate = momentFormatter_1.MomentFormatter.formatLongDate(momentFactory_1.MomentFactory.currentDate());
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.EXPLANATION_REQUIRED = 'Enter text explaining how you paid';
ValidationErrors.AMOUNT_NOT_VALID = 'Enter valid amount';
ValidationErrors.VALID_PAST_DATE = `Enter date before ${currentDate}`;
class HowMuchHaveYouPaid {
    constructor(amount, date, text) {
        this.amount = amount;
        this.date = date;
        this.text = text;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const amount = numericUtils_1.toNumberOrUndefined(value.amount);
        const pastDate = localDate_1.LocalDate.fromObject(value.date);
        const text = value.text;
        return new HowMuchHaveYouPaid(amount, pastDate, text);
    }
    deserialize(input) {
        if (input) {
            this.amount = input.amount;
            this.date = new localDate_1.LocalDate().deserialize(input.date);
            this.text = input.text;
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.AMOUNT_REQUIRED }),
    class_validator_1.IsPositive({ message: ValidationErrors.AMOUNT_NOT_VALID }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS })
], HowMuchHaveYouPaid.prototype, "amount", void 0);
__decorate([
    class_validator_1.ValidateNested(),
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.DATE_REQUIRED }),
    cmc_validators_1.IsValidLocalDate({ message: validationErrors_1.ValidationErrors.DATE_REQUIRED }),
    datePastConstraint_1.IsPastDate({ message: ValidationErrors.VALID_PAST_DATE })
], HowMuchHaveYouPaid.prototype, "date", void 0);
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.EXPLANATION_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.EXPLANATION_REQUIRED }),
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], HowMuchHaveYouPaid.prototype, "text", void 0);
exports.HowMuchHaveYouPaid = HowMuchHaveYouPaid;
