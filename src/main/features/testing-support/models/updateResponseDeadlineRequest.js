"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const localDate_1 = require("forms/models/localDate");
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const cmc_validators_1 = require("@hmcts/cmc-validators");
class ValidationErrors {
}
ValidationErrors.CLAIM_NUMBER_REQUIRED = 'Enter a claim number';
class UpdateResponseDeadlineRequest {
    constructor(claimNumber, date) {
        this.claimNumber = claimNumber;
        this.date = date;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new UpdateResponseDeadlineRequest(value.claimNumber, localDate_1.LocalDate.fromObject(value.date));
    }
}
__decorate([
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.CLAIM_NUMBER_REQUIRED })
], UpdateResponseDeadlineRequest.prototype, "claimNumber", void 0);
__decorate([
    class_validator_1.ValidateNested(),
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.DATE_REQUIRED }),
    cmc_validators_1.IsValidLocalDate({ message: validationErrors_1.ValidationErrors.DATE_NOT_VALID })
], UpdateResponseDeadlineRequest.prototype, "date", void 0);
exports.UpdateResponseDeadlineRequest = UpdateResponseDeadlineRequest;
