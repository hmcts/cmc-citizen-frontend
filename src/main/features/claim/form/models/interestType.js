"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
class InterestTypeOption {
    static all() {
        return [
            InterestTypeOption.SAME_RATE,
            InterestTypeOption.BREAKDOWN
        ];
    }
}
exports.InterestTypeOption = InterestTypeOption;
InterestTypeOption.SAME_RATE = 'same';
InterestTypeOption.BREAKDOWN = 'breakdown';
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.INTEREST_TYPE_REQUIRED = 'Choose same rate or breakdown';
class InterestType {
    constructor(option) {
        this.option = option;
    }
    static fromObject(value) {
        if (value == null) {
            return value;
        }
        return new InterestType(value.option);
    }
    deserialize(input) {
        if (input) {
            this.option = input.option;
        }
        return this;
    }
    isCompleted() {
        return !!this.option && (this.option === InterestTypeOption.SAME_RATE || this.option === InterestTypeOption.BREAKDOWN);
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.INTEREST_TYPE_REQUIRED }),
    class_validator_1.IsIn(InterestTypeOption.all(), { message: ValidationErrors.INTEREST_TYPE_REQUIRED })
], InterestType.prototype, "option", void 0);
exports.InterestType = InterestType;
