"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
let AtLeastOnePopulatedRowConstraint = class AtLeastOnePopulatedRowConstraint {
    validate(value, args) {
        if (value === undefined) {
            return true;
        }
        if (!(value instanceof Array)) {
            return false;
        }
        return value.filter(item => !item.isEmpty()).length >= 1;
    }
};
AtLeastOnePopulatedRowConstraint = __decorate([
    class_validator_1.ValidatorConstraint()
], AtLeastOnePopulatedRowConstraint);
exports.AtLeastOnePopulatedRowConstraint = AtLeastOnePopulatedRowConstraint;
/**
 * Verify there is at least one populated row in multi-row form.
 */
function AtLeastOnePopulatedRow(validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: AtLeastOnePopulatedRowConstraint
        });
    };
}
exports.AtLeastOnePopulatedRow = AtLeastOnePopulatedRow;
