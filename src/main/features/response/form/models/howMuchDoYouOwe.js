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
const numericUtils_1 = require("shared/utils/numericUtils");
class HowMuchDoYouOwe {
    constructor(amount, totalAmount) {
        this.amount = amount;
        this.totalAmount = totalAmount;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const amount = numericUtils_1.toNumberOrUndefined(value.amount);
        const totalAmount = numericUtils_1.toNumberOrUndefined(value.totalAmount);
        return new HowMuchDoYouOwe(amount, totalAmount);
    }
    deserialize(input) {
        if (input) {
            this.amount = input.amount;
            this.totalAmount = input.totalAmount;
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.AMOUNT_REQUIRED }),
    cmc_validators_1.IsLessThan('totalAmount', { message: validationErrors_1.ValidationErrors.AMOUNT_ENTERED_TOO_LARGE }),
    class_validator_1.IsPositive({ message: validationErrors_1.ValidationErrors.AMOUNT_NOT_VALID }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS })
], HowMuchDoYouOwe.prototype, "amount", void 0);
exports.HowMuchDoYouOwe = HowMuchDoYouOwe;
