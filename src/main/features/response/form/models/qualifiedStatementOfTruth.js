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
const signatureType_1 = require("common/signatureType");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE = 'Tell us if you believe the facts stated in this response are true.';
ValidationErrors.SIGNER_NAME_REQUIRED = 'Enter the name of the person signing the statement';
ValidationErrors.SIGNER_NAME_TOO_LONG = 'You’ve entered too many characters';
ValidationErrors.SIGNER_ROLE_REQUIRED = 'Enter the role of the person signing the statement';
ValidationErrors.SIGNER_ROLE_TOO_LONG = 'You’ve entered too many characters';
ValidationErrors.DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE = 'Tell us if you believe the hearing requirement details on this page are true.';
class QualifiedStatementOfTruth {
    constructor(signed, directionsQuestionnaireSigned, signerName, signerRole) {
        this.type = signatureType_1.SignatureType.QUALIFIED;
        this.signed = signed;
        this.directionsQuestionnaireSigned = directionsQuestionnaireSigned;
        this.signerName = signerName;
        this.signerRole = signerRole;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new QualifiedStatementOfTruth((value.signed && toBoolean(value.signed) === true), (value.directionsQuestionnaireSigned && toBoolean(value.directionsQuestionnaireSigned) === true), value.signerName, value.signerRole);
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
    class_validator_1.ValidateIf(o => o.type === signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE),
    class_validator_1.IsDefined({ message: ValidationErrors.DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE }),
    cmc_validators_1.IsBooleanTrue({ message: ValidationErrors.DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE })
], QualifiedStatementOfTruth.prototype, "directionsQuestionnaireSigned", void 0);
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
