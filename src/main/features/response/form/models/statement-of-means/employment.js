"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const toBoolean = require("to-boolean");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const validationErrors_1 = require("forms/validation/validationErrors");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.SELECT_AT_LEAST_ONE_OPTION = 'You must select at least one option';
class Employment {
    constructor(declared, employed, selfEmployed) {
        this.declared = declared;
        if (this.declared) {
            this.employed = employed;
            this.selfEmployed = selfEmployed;
        }
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const declared = value.declared !== undefined ? toBoolean(value.declared) : undefined;
        return new Employment(declared, declared ? value.employed !== undefined ? toBoolean(value.employed) : undefined : undefined, declared ? value.selfEmployed !== undefined ? toBoolean(value.selfEmployed) : undefined : undefined);
    }
    deserialize(input) {
        if (input) {
            this.declared = input.declared;
            if (this.declared) {
                this.employed = input.employed;
                this.selfEmployed = input.selfEmployed;
            }
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED })
], Employment.prototype, "declared", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.declared === true && !o.selfEmployed && !o.employed),
    cmc_validators_1.IsBooleanTrue({ message: ValidationErrors.SELECT_AT_LEAST_ONE_OPTION })
], Employment.prototype, "employed", void 0);
exports.Employment = Employment;
