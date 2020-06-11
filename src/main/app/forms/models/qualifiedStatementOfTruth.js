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
const statementOfTruth_1 = require("forms/models/statementOfTruth");
const signatureType_1 = require("common/signatureType");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE = 'Please select I believe that the facts stated in this claim are true.';
ValidationErrors.SIGNER_NAME_REQUIRED = 'Enter the name of the person signing the statement';
ValidationErrors.SIGNER_NAME_TOO_LONG = 'You’ve entered too many characters';
ValidationErrors.SIGNER_ROLE_REQUIRED = 'Enter the role of the person signing the statement';
ValidationErrors.SIGNER_ROLE_TOO_LONG = 'You’ve entered too many characters';
class QualifiedStatementOfTruth extends statementOfTruth_1.StatementOfTruth {
    constructor(signed, signerName, signerRole) {
        super();
        this.type = signatureType_1.SignatureType.QUALIFIED;
        this.signed = signed;
        this.signerName = signerName;
        this.signerRole = signerRole;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new QualifiedStatementOfTruth((value.signed && toBoolean(value.signed) === true), value.signerName, value.signerRole);
    }
    deserialize(input) {
        if (input) {
            this.signerName = input.signerName;
            this.signerRole = input.signerRole;
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE }),
    cmc_validators_1.IsBooleanTrue({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE })
], QualifiedStatementOfTruth.prototype, "signed", void 0);
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.SIGNER_NAME_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.SIGNER_NAME_REQUIRED }),
    class_validator_1.MaxLength(70, { message: ValidationErrors.SIGNER_NAME_TOO_LONG })
], QualifiedStatementOfTruth.prototype, "signerName", void 0);
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.SIGNER_ROLE_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.SIGNER_ROLE_REQUIRED }),
    class_validator_1.MaxLength(255, { message: ValidationErrors.SIGNER_ROLE_TOO_LONG })
], QualifiedStatementOfTruth.prototype, "signerRole", void 0);
exports.QualifiedStatementOfTruth = QualifiedStatementOfTruth;
