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
const signatureType_1 = require("common/signatureType");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE = 'Please select I believe that the facts stated in this claim are true.';
class StatementOfTruth {
    constructor(signed) {
        this.type = signatureType_1.SignatureType.BASIC;
        this.signed = signed;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new StatementOfTruth(value.signed === 'true');
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE }),
    cmc_validators_1.IsBooleanTrue({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE })
], StatementOfTruth.prototype, "signed", void 0);
exports.StatementOfTruth = StatementOfTruth;
