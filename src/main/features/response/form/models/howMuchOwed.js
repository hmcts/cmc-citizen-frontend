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
const numericUtils_1 = require("shared/utils/numericUtils");
class HowMuchOwed {
    constructor(amount, text) {
        this.amount = amount;
        this.text = text;
    }
    static fromObject(value) {
        if (value) {
            const amount = numericUtils_1.toNumberOrUndefined(value.amount);
            const text = value.text;
            return new HowMuchOwed(amount, text);
        }
        else {
            return new HowMuchOwed();
        }
    }
    deserialize(input) {
        if (input) {
            this.amount = input.amount;
            this.text = input.text;
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.AMOUNT_REQUIRED }),
    class_validator_1.IsPositive({ message: validationErrors_1.ValidationErrors.VALID_OWED_AMOUNT_REQUIRED }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS })
], HowMuchOwed.prototype, "amount", void 0);
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.WHY_NOT_OWE_FULL_AMOUNT_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: validationErrors_1.ValidationErrors.WHY_NOT_OWE_FULL_AMOUNT_REQUIRED }),
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], HowMuchOwed.prototype, "text", void 0);
exports.HowMuchOwed = HowMuchOwed;
