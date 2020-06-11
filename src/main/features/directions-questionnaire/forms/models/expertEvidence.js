"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const validationErrors_1 = require("forms/validation/validationErrors");
const class_validator_1 = require("@hmcts/class-validator");
const yesNoOption_1 = require("models/yesNoOption");
const validationConstraints_1 = require("forms/validation/validationConstraints");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.REASON_REQUIRED = 'Explain what there is to examine';
class ExpertEvidence {
    constructor(expertEvidence, whatToExamine) {
        this.expertEvidence = expertEvidence;
        this.whatToExamine = whatToExamine;
    }
    static fromObject(input) {
        if (!input) {
            return input;
        }
        return new ExpertEvidence(yesNoOption_1.YesNoOption.fromObject(input.expertEvidence), input.whatToExamine);
    }
    deserialize(input) {
        if (input && input.expertEvidence) {
            this.expertEvidence = yesNoOption_1.YesNoOption.fromObject(input.expertEvidence.option);
            this.whatToExamine = input.whatToExamine;
        }
        return this;
    }
    isCompleted() {
        if (!this.expertEvidence) {
            return false;
        }
        else if (this.expertEvidence === yesNoOption_1.YesNoOption.YES) {
            return this.whatToExamine !== undefined;
        }
        else {
            return true;
        }
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED }),
    class_validator_1.IsIn(yesNoOption_1.YesNoOption.all(), { message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED })
], ExpertEvidence.prototype, "expertEvidence", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.expertEvidence && o.expertEvidence.option === yesNoOption_1.YesNoOption.YES.option),
    class_validator_1.IsNotEmpty({ message: ValidationErrors.REASON_REQUIRED }),
    class_validator_1.IsDefined({ message: ValidationErrors.REASON_REQUIRED }),
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], ExpertEvidence.prototype, "whatToExamine", void 0);
exports.ExpertEvidence = ExpertEvidence;
