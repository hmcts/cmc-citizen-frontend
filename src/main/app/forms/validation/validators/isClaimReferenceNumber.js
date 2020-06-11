"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const isCMCReference_1 = require("shared/utils/isCMCReference");
const isCCBCCaseReference_1 = require("shared/utils/isCCBCCaseReference");
let CheckClaimReferenceNumberConstraint = class CheckClaimReferenceNumberConstraint {
    validate(value, args) {
        if (value === undefined || value === '') {
            return true;
        }
        return isCMCReference_1.isCMCReference(value) || isCCBCCaseReference_1.isCCBCCaseReference(value);
    }
};
CheckClaimReferenceNumberConstraint = __decorate([
    class_validator_1.ValidatorConstraint()
], CheckClaimReferenceNumberConstraint);
exports.CheckClaimReferenceNumberConstraint = CheckClaimReferenceNumberConstraint;
/**
 * Verify claim reference is valid.
 */
function IsClaimReferenceNumber(validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: CheckClaimReferenceNumberConstraint
        });
    };
}
exports.IsClaimReferenceNumber = IsClaimReferenceNumber;
