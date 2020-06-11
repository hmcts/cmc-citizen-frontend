"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const momentFactory_1 = require("shared/momentFactory");
const localDate_1 = require("forms/models/localDate");
let MaximumAgeValidatorConstraint = class MaximumAgeValidatorConstraint {
    validate(value, args) {
        const [maxYears] = args.constraints;
        if (!maxYears || maxYears <= 0) {
            throw new Error('Max Years in the past has to be specified and positive value');
        }
        if (value === undefined) {
            return true;
        }
        if (!(value instanceof localDate_1.LocalDate)) {
            return false;
        }
        const today = momentFactory_1.MomentFactory.currentDate();
        const date = value.toMoment();
        const years = today.diff(date, 'years');
        return years <= maxYears;
    }
};
MaximumAgeValidatorConstraint = __decorate([
    class_validator_1.ValidatorConstraint()
], MaximumAgeValidatorConstraint);
exports.MaximumAgeValidatorConstraint = MaximumAgeValidatorConstraint;
/**
 * Verify is a within age limit.
 */
function MaximumAgeValidator(maxYears, validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [maxYears],
            validator: MaximumAgeValidatorConstraint
        });
    };
}
exports.MaximumAgeValidator = MaximumAgeValidator;
