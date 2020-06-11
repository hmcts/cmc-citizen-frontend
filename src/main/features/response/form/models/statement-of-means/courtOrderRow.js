"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const multiRowFormItem_1 = require("forms/models/multiRowFormItem");
const numericUtils_1 = require("shared/utils/numericUtils");
const cmc_validators_1 = require("@hmcts/cmc-validators");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.CLAIM_NUMBER_REQUIRED = 'Enter a claim number';
class CourtOrderRow extends multiRowFormItem_1.MultiRowFormItem {
    constructor(amount, instalmentAmount, claimNumber) {
        super();
        this.instalmentAmount = instalmentAmount;
        this.amount = amount;
        this.claimNumber = claimNumber;
    }
    static empty() {
        return new CourtOrderRow(undefined, undefined, undefined);
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const instalmentAmount = numericUtils_1.toNumberOrUndefined(value.instalmentAmount);
        const amount = numericUtils_1.toNumberOrUndefined(value.amount);
        const claimNumber = value.claimNumber || undefined;
        return new CourtOrderRow(amount, instalmentAmount, claimNumber);
    }
    deserialize(input) {
        if (input) {
            this.instalmentAmount = input.instalmentAmount;
            this.amount = input.amount;
            this.claimNumber = input.claimNumber;
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.isAtLeastOneFieldPopulated()),
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.AMOUNT_REQUIRED }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS }),
    class_validator_1.Min(0, { message: validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED })
], CourtOrderRow.prototype, "instalmentAmount", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.isAtLeastOneFieldPopulated()),
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.AMOUNT_REQUIRED }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS }),
    class_validator_1.Min(1.00, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND })
], CourtOrderRow.prototype, "amount", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.isAtLeastOneFieldPopulated()),
    class_validator_1.IsDefined({ message: ValidationErrors.CLAIM_NUMBER_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.CLAIM_NUMBER_REQUIRED })
], CourtOrderRow.prototype, "claimNumber", void 0);
exports.CourtOrderRow = CourtOrderRow;
