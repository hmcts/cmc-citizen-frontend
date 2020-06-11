"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const yesNoOption_1 = require("ccj/form/models/yesNoOption");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const numericUtils_1 = require("shared/utils/numericUtils");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.OPTION_REQUIRED = 'Choose option: yes or no';
ValidationErrors.AMOUNT_REQUIRED = 'Enter an amount';
ValidationErrors.AMOUNT_NOT_VALID = 'Invalid amount';
ValidationErrors.AMOUNT_INVALID_DECIMALS = 'Enter valid amount, maximum two decimal places';
ValidationErrors.PAID_AMOUNT_GREATER_THAN_TOTAL_AMOUNT = 'Paid amount cannot be greater than or equal to admitted amount';
class PaidAmount {
    constructor(option, amount, claimedAmount) {
        this.option = option;
        this.amount = amount;
        this.claimedAmount = claimedAmount;
    }
    static fromObject(value) {
        if (value && value.option) {
            const amount = numericUtils_1.toNumberOrUndefined(value.amount);
            const claimedAmount = numericUtils_1.toNumberOrUndefined(value.claimedAmount);
            const option = yesNoOption_1.PaidAmountOption.all()
                .filter(option => option.value === value.option)
                .pop();
            return new PaidAmount(option, amount, claimedAmount);
        }
        else {
            return new PaidAmount();
        }
    }
    deserialize(input) {
        if (input && input.option) {
            this.option = yesNoOption_1.PaidAmountOption.all()
                .filter(option => option.value === input.option.value)
                .pop();
            this.amount = (input.option && input.option.value === yesNoOption_1.PaidAmountOption.YES.value) ? input.amount : undefined;
            this.claimedAmount = numericUtils_1.toNumberOrUndefined(input.claimedAmount);
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.OPTION_REQUIRED }),
    class_validator_1.IsIn(yesNoOption_1.PaidAmountOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
], PaidAmount.prototype, "option", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.option === yesNoOption_1.PaidAmountOption.YES),
    class_validator_1.IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED }),
    class_validator_1.IsPositive({ message: ValidationErrors.AMOUNT_NOT_VALID }),
    cmc_validators_1.Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS }),
    cmc_validators_1.IsLessThan('claimedAmount', { message: ValidationErrors.PAID_AMOUNT_GREATER_THAN_TOTAL_AMOUNT })
], PaidAmount.prototype, "amount", void 0);
exports.PaidAmount = PaidAmount;
