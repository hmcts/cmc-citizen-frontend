"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cmc_validators_1 = require("@hmcts/cmc-validators");
const class_validator_1 = require("@hmcts/class-validator");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.ADDRESS_NOT_VALID = 'Enter valid email address';
class Email {
    constructor(address) {
        this.address = address;
    }
    deserialize(input) {
        if (input) {
            this.address = input.address;
        }
        return this;
    }
    isCompleted() {
        return new class_validator_1.Validator().validateSync(this).length === 0;
    }
}
__decorate([
    cmc_validators_1.IsEmail({ message: ValidationErrors.ADDRESS_NOT_VALID })
], Email.prototype, "address", void 0);
exports.Email = Email;
