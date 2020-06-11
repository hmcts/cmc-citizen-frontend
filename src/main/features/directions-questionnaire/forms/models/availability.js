"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const localDate_1 = require("forms/models/localDate");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const dateFutureConstraint_1 = require("forms/validation/validators/dateFutureConstraint");
const availabilityDatesValidator_1 = require("directions-questionnaire/forms/validators/availabilityDatesValidator");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.AT_LEAST_ONE_DATE = 'Select at least one date or choose No';
ValidationErrors.CLEAR_ALL_DATES = 'Remove all dates or choose Yes';
ValidationErrors.DATE_NOT_VALID = 'Please enter a valid date';
ValidationErrors.FUTURE_DATE_REQUIRED = 'Select a date after today';
class Availability {
    constructor(hasUnavailableDates, unavailableDates, newDate) {
        this.hasUnavailableDates = hasUnavailableDates;
        this.unavailableDates = unavailableDates;
        this.newDate = newDate;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new Availability(value.hasUnavailableDates !== undefined ? value.hasUnavailableDates.toString() === 'true' : undefined, value.unavailableDates && (value.unavailableDates.constructor === Array)
            ? value.unavailableDates.map(date => localDate_1.LocalDate.fromObject(date)) : [], localDate_1.LocalDate.fromObject(value.newDate));
    }
    deserialize(input) {
        if (input) {
            this.hasUnavailableDates = input.hasUnavailableDates;
            this.unavailableDates = this.deserializeDates(input.unavailableDates);
            this.newDate = new localDate_1.LocalDate().deserialize(input.newDate);
        }
        return this;
    }
    isCompleted() {
        if (this.hasUnavailableDates === undefined || this.hasUnavailableDates === null) {
            return false;
        }
        if (this.hasUnavailableDates) {
            return !!this.unavailableDates && this.unavailableDates.length > 0;
        }
        return true;
    }
    deserializeDates(dates) {
        if (!dates) {
            return [];
        }
        return dates.map(date => new localDate_1.LocalDate().deserialize(date));
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED })
], Availability.prototype, "hasUnavailableDates", void 0);
__decorate([
    availabilityDatesValidator_1.IsValidAvailabilityDates()
], Availability.prototype, "unavailableDates", void 0);
__decorate([
    dateFutureConstraint_1.IsFutureDate({ message: ValidationErrors.FUTURE_DATE_REQUIRED }),
    cmc_validators_1.IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
], Availability.prototype, "newDate", void 0);
exports.Availability = Availability;
