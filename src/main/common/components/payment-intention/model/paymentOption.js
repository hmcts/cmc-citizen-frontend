"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
class PaymentTypeLabels {
}
exports.PaymentTypeLabels = PaymentTypeLabels;
PaymentTypeLabels.INSTALMENTS = 'By instalments';
PaymentTypeLabels.BY_SET_DATE = 'By a set date';
PaymentTypeLabels.IMMEDIATELY = 'Immediately';
class PaymentType {
    constructor(value) {
        this.value = value;
    }
    get displayValue() {
        switch (this.value) {
            case PaymentType.INSTALMENTS.value:
                return PaymentTypeLabels.INSTALMENTS;
            case PaymentType.BY_SET_DATE.value:
                return PaymentTypeLabels.BY_SET_DATE;
            case PaymentType.IMMEDIATELY.value:
                return PaymentTypeLabels.IMMEDIATELY;
            default:
                throw new Error('Unknown defendant payment option!');
        }
    }
    static all() {
        return [
            PaymentType.IMMEDIATELY,
            PaymentType.BY_SET_DATE,
            PaymentType.INSTALMENTS
        ];
    }
    static except(paymentType) {
        if (paymentType === undefined) {
            throw new Error('Payment type is required');
        }
        return PaymentType.all().filter(item => item !== paymentType);
    }
    static valueOf(value) {
        return PaymentType.all()
            .filter(type => type.value === value)
            .pop();
    }
}
exports.PaymentType = PaymentType;
PaymentType.INSTALMENTS = new PaymentType('INSTALMENTS');
PaymentType.BY_SET_DATE = new PaymentType('BY_SPECIFIED_DATE');
PaymentType.IMMEDIATELY = new PaymentType('IMMEDIATELY');
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.OPTION_REQUIRED = 'Choose a payment option';
class PaymentOption {
    constructor(option) {
        this.option = option;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        if (value.option) {
            const option = PaymentType.valueOf(value.option);
            return new PaymentOption(option);
        }
        else {
            return new PaymentOption();
        }
    }
    deserialize(input) {
        if (input && input.option) {
            this.option = PaymentType.valueOf(input.option.value);
        }
        return this;
    }
    isOfType(paymentType) {
        if (!this.option) {
            return false;
        }
        return this.option.value === paymentType.value;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.OPTION_REQUIRED }),
    class_validator_1.IsIn(PaymentType.all(), { message: ValidationErrors.OPTION_REQUIRED })
], PaymentOption.prototype, "option", void 0);
exports.PaymentOption = PaymentOption;
