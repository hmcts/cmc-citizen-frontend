"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.OPTION_REQUIRED = 'Choose option';
class PaymentType {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
    }
    static all() {
        return [
            PaymentType.IMMEDIATELY,
            PaymentType.INSTALMENTS,
            PaymentType.BY_SPECIFIED_DATE
        ];
    }
    static valueOf(value) {
        return PaymentType.all()
            .filter(type => type.value === value)
            .pop();
    }
}
exports.PaymentType = PaymentType;
PaymentType.IMMEDIATELY = new PaymentType('IMMEDIATELY', 'Immediately');
PaymentType.INSTALMENTS = new PaymentType('INSTALMENTS', 'By instalments');
PaymentType.BY_SPECIFIED_DATE = new PaymentType('BY_SPECIFIED_DATE', 'By a set date');
class CCJPaymentOption {
    constructor(option) {
        this.option = option;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        if (value.option) {
            const option = PaymentType.valueOf(value.option);
            return new CCJPaymentOption(option);
        }
        else {
            return new CCJPaymentOption();
        }
    }
    deserialize(input) {
        if (input && input.option) {
            this.option = PaymentType.valueOf(input.option.value);
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.OPTION_REQUIRED }),
    class_validator_1.IsIn(PaymentType.all(), { message: ValidationErrors.OPTION_REQUIRED })
], CCJPaymentOption.prototype, "option", void 0);
exports.CCJPaymentOption = CCJPaymentOption;
