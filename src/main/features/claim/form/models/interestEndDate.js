"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
class InterestEndDateOption {
    static all() {
        return [
            InterestEndDateOption.SUBMISSION,
            InterestEndDateOption.SETTLED_OR_JUDGMENT
        ];
    }
}
exports.InterestEndDateOption = InterestEndDateOption;
InterestEndDateOption.SUBMISSION = 'submission';
InterestEndDateOption.SETTLED_OR_JUDGMENT = 'settled_or_judgment';
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.INTEREST_END_DATE_REQUIRED = 'Choose when you want to stop claiming interest';
class InterestEndDate {
    constructor(option) {
        this.option = option;
    }
    static fromObject(value) {
        if (value == null) {
            return value;
        }
        return new InterestEndDate(value.option);
    }
    deserialize(input) {
        if (input) {
            this.option = input.option;
        }
        return this;
    }
    isCompleted() {
        return !!this.option && (this.option === InterestEndDateOption.SETTLED_OR_JUDGMENT || this.option === InterestEndDateOption.SUBMISSION);
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.INTEREST_END_DATE_REQUIRED }),
    class_validator_1.IsIn(InterestEndDateOption.all(), { message: ValidationErrors.INTEREST_END_DATE_REQUIRED })
], InterestEndDate.prototype, "option", void 0);
exports.InterestEndDate = InterestEndDate;
