"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const i18next = require("i18next");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const maximumAgeValidator_1 = require("forms/validation/validators/maximumAgeValidator");
const minimumAgeValidator_1 = require("forms/validation/validators/minimumAgeValidator");
const momentFactory_1 = require("shared/momentFactory");
const momentFormatter_1 = require("utils/momentFormatter");
const localDate_1 = require("forms/models/localDate");
const toBoolean = require("to-boolean");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.DATE_NOT_VALID = 'Please enter a valid date';
ValidationErrors.DATE_UNDER_18 = 'Please enter a date of birth before %s';
class DateOfBirth {
    constructor(known, date) {
        this.known = known;
        this.date = date;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const dateOfBirth = new DateOfBirth(value.known !== undefined ? toBoolean(value.known) === true : undefined, localDate_1.LocalDate.fromObject(value.date));
        if (!dateOfBirth.known) {
            dateOfBirth.date = undefined;
        }
        return dateOfBirth;
    }
    deserialize(input) {
        if (input) {
            this.known = input.known;
            if (input.known) {
                this.date = new localDate_1.LocalDate().deserialize(input.date);
            }
        }
        return this;
    }
    isCompleted() {
        return !!this.date.year && this.date.year.toString().length > 0;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: 'Select an option' })
], DateOfBirth.prototype, "known", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.known === true),
    class_validator_1.ValidateNested(),
    cmc_validators_1.IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID }),
    minimumAgeValidator_1.MinimumAgeValidator(18, {
        message: () => {
            const limit = momentFactory_1.MomentFactory.currentDate().subtract(18, 'years').add(1, 'day');
            return i18next.t(ValidationErrors.DATE_UNDER_18, {
                postProcess: 'sprintf', sprintf: [momentFormatter_1.MomentFormatter.formatLongDate(limit)]
            });
        }
    }),
    maximumAgeValidator_1.MaximumAgeValidator(150, { message: ValidationErrors.DATE_NOT_VALID })
], DateOfBirth.prototype, "date", void 0);
exports.DateOfBirth = DateOfBirth;
