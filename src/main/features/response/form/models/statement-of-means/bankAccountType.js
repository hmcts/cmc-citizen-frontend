"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BankAccountType {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
    }
    static all() {
        return [
            BankAccountType.CURRENT_ACCOUNT,
            BankAccountType.SAVING_ACCOUNT,
            BankAccountType.ISA,
            BankAccountType.OTHER
        ];
    }
    static valueOf(value) {
        return BankAccountType.all()
            .filter(type => type.value === value)
            .pop();
    }
}
exports.BankAccountType = BankAccountType;
BankAccountType.CURRENT_ACCOUNT = new BankAccountType('CURRENT_ACCOUNT', 'Current account');
BankAccountType.SAVING_ACCOUNT = new BankAccountType('SAVINGS_ACCOUNT', 'Saving account');
BankAccountType.ISA = new BankAccountType('ISA', 'ISA');
BankAccountType.OTHER = new BankAccountType('OTHER', 'Other');
