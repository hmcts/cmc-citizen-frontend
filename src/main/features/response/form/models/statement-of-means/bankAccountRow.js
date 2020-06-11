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
const cmc_validators_1 = require("@hmcts/cmc-validators");
const toBoolean = require("to-boolean");
const numericUtils_1 = require("shared/utils/numericUtils");
const bankAccountType_1 = require("response/form/models/statement-of-means/bankAccountType");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.TYPE_OF_ACCOUNT_REQUIRED = 'Select a type of account';
class BankAccountRow extends multiRowFormItem_1.MultiRowFormItem {
    constructor(typeOfAccount, joint, balance) {
        super();
        this.typeOfAccount = typeOfAccount;
        this.joint = joint;
        this.balance = balance;
    }
    static empty() {
        return new BankAccountRow(undefined, undefined, undefined);
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const typeOfAccount = bankAccountType_1.BankAccountType.valueOf(value.typeOfAccount);
        const joint = value.joint !== '' ? toBoolean(value.joint) : undefined;
        const balance = numericUtils_1.toNumberOrUndefined(value.balance);
        return new BankAccountRow(typeOfAccount, joint, balance);
    }
    deserialize(input) {
        if (input) {
            this.typeOfAccount = bankAccountType_1.BankAccountType.valueOf(input.typeOfAccount && input.typeOfAccount.value);
            this.joint = input.joint;
            this.balance = input.balance;
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.isAtLeastOneFieldPopulated()),
    class_validator_1.IsDefined({ message: ValidationErrors.TYPE_OF_ACCOUNT_REQUIRED }),
    class_validator_1.IsIn(bankAccountType_1.BankAccountType.all(), { message: ValidationErrors.TYPE_OF_ACCOUNT_REQUIRED })
], BankAccountRow.prototype, "typeOfAccount", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.isAtLeastOneFieldPopulated()),
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.SELECT_AN_OPTION })
], BankAccountRow.prototype, "joint", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.isAtLeastOneFieldPopulated()),
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.NUMBER_REQUIRED }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS })
], BankAccountRow.prototype, "balance", void 0);
exports.BankAccountRow = BankAccountRow;
