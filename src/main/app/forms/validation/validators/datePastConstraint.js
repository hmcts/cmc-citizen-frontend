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
let DatePastConstraint = class DatePastConstraint {
    validate(value, args) {
        if (value === undefined) {
            return true;
        }
        if (!(value instanceof localDate_1.LocalDate)) {
            return false;
        }
        const date = value.toMoment();
        const now = momentFactory_1.MomentFactory.currentDate();
        return date.isBefore(now);
    }
};
DatePastConstraint = __decorate([
    class_validator_1.ValidatorConstraint()
], DatePastConstraint);
exports.DatePastConstraint = DatePastConstraint;
function IsPastDate(validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: DatePastConstraint
        });
    };
}
exports.IsPastDate = IsPastDate;
