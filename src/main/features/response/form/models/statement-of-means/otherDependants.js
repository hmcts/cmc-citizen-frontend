"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const toBoolean = require("to-boolean");
const validationErrors_1 = require("forms/validation/validationErrors");
const numberOfPeople_1 = require("response/form/models/statement-of-means/numberOfPeople");
class OtherDependants {
    constructor(declared, numberOfPeople) {
        this.declared = declared;
        this.numberOfPeople = numberOfPeople;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const declared = value.declared !== undefined ?
            toBoolean(value.declared) : undefined;
        return new OtherDependants(declared, declared ? numberOfPeople_1.NumberOfPeople.fromObject(value.numberOfPeople) : undefined);
    }
    deserialize(input) {
        if (input) {
            this.declared = input.declared;
            if (this.declared) {
                this.numberOfPeople = new numberOfPeople_1.NumberOfPeople().deserialize(input.numberOfPeople);
            }
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED })
], OtherDependants.prototype, "declared", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.declared === true),
    class_validator_1.ValidateNested()
], OtherDependants.prototype, "numberOfPeople", void 0);
exports.OtherDependants = OtherDependants;
