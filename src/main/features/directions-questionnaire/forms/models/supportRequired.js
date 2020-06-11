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
const validationConstraints_1 = require("forms/validation/validationConstraints");
const validationErrors_1 = require("forms/validation/validationErrors");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.NO_LANGUAGE_ENTERED = 'Enter the language that needs to be interpreted';
ValidationErrors.NO_SIGN_LANGUAGE_ENTERED = 'Enter the sign language you need';
ValidationErrors.NO_OTHER_SUPPORT = 'Enter the other support you need at your hearing';
class SupportRequired {
    constructor(languageSelected, languageInterpreted, signLanguageSelected, signLanguageInterpreted, hearingLoopSelected, disabledAccessSelected, otherSupportSelected, otherSupport) {
        this.languageSelected = languageSelected;
        this.languageInterpreted = languageInterpreted;
        this.signLanguageSelected = signLanguageSelected;
        this.signLanguageInterpreted = signLanguageInterpreted;
        this.hearingLoopSelected = hearingLoopSelected;
        this.disabledAccessSelected = disabledAccessSelected;
        this.otherSupportSelected = otherSupportSelected;
        this.otherSupport = otherSupport;
    }
    static fromObject(input) {
        if (!input) {
            return input;
        }
        return new SupportRequired(input.languageSelected, input.languageInterpreted, input.signLanguageSelected, input.signLanguageInterpreted, input.hearingLoopSelected, input.disabledAccessSelected, input.otherSupportSelected, input.otherSupport);
    }
    deserialize(input) {
        if (input) {
            this.languageSelected = input.languageSelected;
            this.languageInterpreted = input.languageInterpreted;
            this.signLanguageSelected = input.signLanguageSelected;
            this.signLanguageInterpreted = input.signLanguageInterpreted;
            this.hearingLoopSelected = input.hearingLoopSelected;
            this.disabledAccessSelected = input.disabledAccessSelected;
            this.otherSupportSelected = input.otherSupportSelected;
            this.otherSupport = input.otherSupport;
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.languageSelected),
    class_validator_1.IsDefined({ message: ValidationErrors.NO_LANGUAGE_ENTERED }),
    class_validator_1.IsNotEmpty({ message: ValidationErrors.NO_LANGUAGE_ENTERED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.NO_LANGUAGE_ENTERED }),
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], SupportRequired.prototype, "languageInterpreted", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.signLanguageSelected),
    class_validator_1.IsDefined({ message: ValidationErrors.NO_SIGN_LANGUAGE_ENTERED }),
    class_validator_1.IsNotEmpty({ message: ValidationErrors.NO_SIGN_LANGUAGE_ENTERED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.NO_SIGN_LANGUAGE_ENTERED }),
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], SupportRequired.prototype, "signLanguageInterpreted", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.otherSupportSelected),
    class_validator_1.IsDefined({ message: ValidationErrors.NO_OTHER_SUPPORT }),
    class_validator_1.IsNotEmpty({ message: ValidationErrors.NO_OTHER_SUPPORT }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.NO_OTHER_SUPPORT }),
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], SupportRequired.prototype, "otherSupport", void 0);
exports.SupportRequired = SupportRequired;
