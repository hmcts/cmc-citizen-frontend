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
const toBoolean = require("to-boolean");
const validationErrors_1 = require("forms/validation/validationErrors");
class Declaration {
    constructor(signed) {
        this.signed = signed;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new Declaration(value.signed && toBoolean(value.signed));
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.DECLARATION_REQUIRED }),
    cmc_validators_1.IsBooleanTrue({ message: validationErrors_1.ValidationErrors.DECLARATION_REQUIRED })
], Declaration.prototype, "signed", void 0);
exports.Declaration = Declaration;
