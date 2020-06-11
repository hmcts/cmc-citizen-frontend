"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const validationConstraints_1 = require("forms/validation/validationConstraints");
const validationErrors_1 = require("forms/validation/validationErrors");
const cmc_validators_1 = require("@hmcts/cmc-validators");
class ImpactOfDispute {
    constructor(text) {
        this.text = text;
    }
    deserialize(input) {
        if (input) {
            this.text = input.text;
        }
        return this;
    }
}
__decorate([
    cmc_validators_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], ImpactOfDispute.prototype, "text", void 0);
exports.ImpactOfDispute = ImpactOfDispute;
