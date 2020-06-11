"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const validationErrors_1 = require("forms/validation/validationErrors");
class DisagreeReason {
    constructor(reason) {
        this.reason = reason;
    }
    deserialize(input) {
        if (input) {
            this.reason = input.reason;
        }
        return this;
    }
}
__decorate([
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH_1000, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], DisagreeReason.prototype, "reason", void 0);
exports.DisagreeReason = DisagreeReason;
