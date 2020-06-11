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
const dateFutureConstraint_1 = require("forms/validation/validators/dateFutureConstraint");
const localDate_1 = require("forms/models/localDate");
const validationConstraints_1 = require("forms/validation/validationConstraints");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.DATE_REQUIRED = 'Please enter a valid date';
ValidationErrors.DATE_NOT_VALID = 'Please enter a valid date';
ValidationErrors.FUTURE_DATE = 'Enter an offer date in the future';
ValidationErrors.OFFER_REQUIRED = 'You haven’t made your offer';
ValidationErrors.OFFER_TEXT_TOO_LONG = 'You’ve entered too many characters';
class Offer {
    constructor(offerText, completionDate) {
        this.offerText = offerText;
        this.completionDate = completionDate;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new Offer(value.offerText, localDate_1.LocalDate.fromObject(value.completionDate));
    }
    deserialize(input) {
        if (input) {
            this.offerText = input.offerText;
            this.completionDate = new localDate_1.LocalDate().deserialize(input.completionDate);
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.OFFER_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.OFFER_REQUIRED }),
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: ValidationErrors.OFFER_TEXT_TOO_LONG })
], Offer.prototype, "offerText", void 0);
__decorate([
    class_validator_1.ValidateNested(),
    class_validator_1.IsDefined({ message: ValidationErrors.DATE_REQUIRED }),
    cmc_validators_1.IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID }),
    dateFutureConstraint_1.IsFutureDate({ message: ValidationErrors.FUTURE_DATE })
], Offer.prototype, "completionDate", void 0);
exports.Offer = Offer;
