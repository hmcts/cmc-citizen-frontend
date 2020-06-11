"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const yesNoOption_1 = require("models/yesNoOption");
const validationErrors_1 = require("forms/validation/validationErrors");
class SelfWitness {
    constructor(option) {
        this.option = option;
    }
    static fromObject(input) {
        if (!input) {
            return input;
        }
        return new SelfWitness(yesNoOption_1.YesNoOption.fromObject(input.option));
    }
    deserialize(input) {
        if (input && input.option) {
            this.option = yesNoOption_1.YesNoOption.fromObject(input.option);
        }
        return this;
    }
    isCompleted() {
        return this.option !== undefined;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED }),
    class_validator_1.IsIn(yesNoOption_1.YesNoOption.all(), { message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED })
], SelfWitness.prototype, "option", void 0);
exports.SelfWitness = SelfWitness;
