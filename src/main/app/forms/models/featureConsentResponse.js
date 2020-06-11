"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const yesNoOption_1 = require("models/yesNoOption");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.TYPE_REQUIRED = 'Choose your response';
class FeatureConsentResponse {
    constructor(consentResponse) {
        this.consentResponse = consentResponse;
    }
    static fromObject(input) {
        if (input == null) {
            return input;
        }
        return new FeatureConsentResponse(yesNoOption_1.YesNoOption.fromObject(input.consentResponse));
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.TYPE_REQUIRED }),
    class_validator_1.IsIn(yesNoOption_1.YesNoOption.all(), { message: ValidationErrors.TYPE_REQUIRED })
], FeatureConsentResponse.prototype, "consentResponse", void 0);
exports.FeatureConsentResponse = FeatureConsentResponse;
