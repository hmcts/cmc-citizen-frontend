"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const multiRowFormItem_1 = require("forms/models/multiRowFormItem");
const numericUtils_1 = require("shared/utils/numericUtils");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const cmc_validators_1 = require("@hmcts/cmc-validators");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.DESCRIPTION_REQUIRED = 'Enter name for item you added';
ValidationErrors.DESCRIPTION_TOO_LONG = 'Name is too long';
ValidationErrors.AMOUNT_REQUIRED = 'Enter amount for item you added';
ValidationErrors.AMOUNT_INVALID_DECIMALS = 'Maximum two decimal places for item you added';
ValidationErrors.POSITIVE_NUMBER_REQUIRED = 'Enter a number higher than 0 for item you added';
class AmountDescriptionRow extends multiRowFormItem_1.MultiRowFormItem {
    constructor(description, amount) {
        super();
        this.description = description;
        this.amount = amount;
    }
    static empty() {
        return new AmountDescriptionRow(undefined, undefined);
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new AmountDescriptionRow(value.description || undefined, numericUtils_1.toNumberOrUndefined(value.amount));
    }
    deserialize(input) {
        if (input) {
            this.amount = input.amount;
            this.description = input.description;
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.isAtLeastOneFieldPopulated()),
    class_validator_1.IsDefined({ message: ValidationErrors.DESCRIPTION_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.DESCRIPTION_REQUIRED }),
    cmc_validators_1.MaxLength(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: ValidationErrors.DESCRIPTION_TOO_LONG })
], AmountDescriptionRow.prototype, "description", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.isAtLeastOneFieldPopulated()),
    class_validator_1.IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED }),
    cmc_validators_1.Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS }),
    class_validator_1.Min(1, { message: ValidationErrors.POSITIVE_NUMBER_REQUIRED })
], AmountDescriptionRow.prototype, "amount", void 0);
exports.AmountDescriptionRow = AmountDescriptionRow;
