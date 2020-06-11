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
const freeMediation_1 = require("main/app/forms/models/freeMediation");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.OPTION_REQUIRED = 'Choose option: yes or no';
ValidationErrors.NUMBER_REQUIRED = 'Please enter a phone number';
class CanWeUse {
    constructor(option, mediationPhoneNumber) {
        this.option = option;
        this.mediationPhoneNumber = mediationPhoneNumber;
    }
    static fromObject(value) {
        if (value == null) {
            return value;
        }
        return new CanWeUse(value.option, value.mediationPhoneNumber);
    }
    deserialize(input) {
        if (input) {
            this.option = input.option;
            this.mediationPhoneNumber = input.mediationPhoneNumber;
        }
        return this;
    }
    isCompleted() {
        return (!!this.option && this.option === freeMediation_1.FreeMediationOption.YES) ||
            (!!this.option && this.option === freeMediation_1.FreeMediationOption.NO && !!this.mediationPhoneNumber);
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.OPTION_REQUIRED }),
    class_validator_1.IsIn(freeMediation_1.FreeMediationOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
], CanWeUse.prototype, "option", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.option === freeMediation_1.FreeMediationOption.NO),
    class_validator_1.IsDefined({ message: ValidationErrors.NUMBER_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.NUMBER_REQUIRED }),
    class_validator_1.MaxLength(30, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], CanWeUse.prototype, "mediationPhoneNumber", void 0);
exports.CanWeUse = CanWeUse;
