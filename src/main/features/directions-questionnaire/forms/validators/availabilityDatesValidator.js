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
const availability_1 = require("directions-questionnaire/forms/models/availability");
let AvailabilityDatesConstraint = class AvailabilityDatesConstraint {
    constructor() {
        this.isValidLocalDate = new cmc_validators_1.IsValidLocalDateConstraint();
    }
    validate(value, args) {
        if (args && args.object && args.object instanceof availability_1.Availability) {
            const availability = args.object;
            if (availability.hasUnavailableDates) {
                if (!availability.unavailableDates || availability.unavailableDates.length === 0) {
                    return false;
                }
                if (availability.unavailableDates.some(date => !this.isValidLocalDate.validate(date, null))) {
                    return false;
                }
            }
            else if (availability.unavailableDates && availability.unavailableDates.length > 0) {
                return false;
            }
        }
        return true;
    }
    defaultMessage(args) {
        const availability = args.object;
        if (availability.hasUnavailableDates) {
            if (!availability.unavailableDates || availability.unavailableDates.length === 0) {
                return availability_1.ValidationErrors.AT_LEAST_ONE_DATE;
            }
            if (availability.unavailableDates.some(date => !this.isValidLocalDate.validate(date, null))) {
                return availability_1.ValidationErrors.DATE_NOT_VALID;
            }
        }
        else if (availability.unavailableDates && availability.unavailableDates.length > 0) {
            return availability_1.ValidationErrors.CLEAR_ALL_DATES;
        }
    }
};
AvailabilityDatesConstraint = __decorate([
    class_validator_1.ValidatorConstraint()
], AvailabilityDatesConstraint);
exports.AvailabilityDatesConstraint = AvailabilityDatesConstraint;
function IsValidAvailabilityDates(validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: AvailabilityDatesConstraint
        });
    };
}
exports.IsValidAvailabilityDates = IsValidAvailabilityDates;
