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
const multiRowFormItem_1 = require("forms/models/multiRowFormItem");
const evidenceType_1 = require("forms/models/evidenceType");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.TYPE_REQUIRED = 'Choose type of evidence';
class EvidenceRow extends multiRowFormItem_1.MultiRowFormItem {
    constructor(type, description) {
        super();
        this.type = type;
        this.description = description;
    }
    static empty() {
        return new EvidenceRow(undefined, undefined);
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const type = evidenceType_1.EvidenceType.valueOf(value.type);
        const description = value.description || undefined;
        return new EvidenceRow(type, description);
    }
    deserialize(input) {
        if (input && input.type) {
            this.type = evidenceType_1.EvidenceType.valueOf(input.type.value);
            this.description = input.description;
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.type !== undefined),
    class_validator_1.IsDefined({ message: ValidationErrors.TYPE_REQUIRED }),
    class_validator_1.IsIn(evidenceType_1.EvidenceType.all(), { message: ValidationErrors.TYPE_REQUIRED })
], EvidenceRow.prototype, "type", void 0);
__decorate([
    cmc_validators_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], EvidenceRow.prototype, "description", void 0);
exports.EvidenceRow = EvidenceRow;
