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
ValidationErrors.DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE = 'The hearing requirement details on this page are true to the best of my knowledge.';
class StatementOfTruth {
    constructor(type, directionsQuestionnaireSigned) {
        if (type) {
            this.type = type;
        }
        else {
            this.type = signatureType_1.SignatureType.BASIC;
        }
        if (directionsQuestionnaireSigned !== undefined) {
            this.directionsQuestionnaireSigned = directionsQuestionnaireSigned;
        }
    }
    static fromObject(input) {
        if (input && input.type === signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE) {
            return new StatementOfTruth(signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE, input.directionsQuestionnaireSigned === 'true');
        }
        else {
            return new StatementOfTruth();
        }
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.type === signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE),
    class_validator_1.IsDefined({ message: ValidationErrors.DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE }),
    cmc_validators_1.IsBooleanTrue({ message: ValidationErrors.DIRECTION_QUESTIONNAIRE_REQUIRED_MESSAGE })
], StatementOfTruth.prototype, "directionsQuestionnaireSigned", void 0);
exports.StatementOfTruth = StatementOfTruth;
