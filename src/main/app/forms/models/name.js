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
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.NAME_REQUIRED = 'Enter name';
ValidationErrors.NAME_TOO_LONG = 'Name must be no longer than $constraint1 characters';
class Name {
    constructor(name) {
        this.name = name;
    }
    static fromObject(input) {
        return new Name(input.name);
    }
    deserialize(input) {
        if (input) {
            this.name = input.name;
        }
        return this;
    }
    isCompleted() {
        return !!this.name;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.NAME_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.NAME_REQUIRED }),
    class_validator_1.MaxLength(255, { message: ValidationErrors.NAME_TOO_LONG })
], Name.prototype, "name", void 0);
exports.Name = Name;
