"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.OPTION_REQUIRED = 'Choose option: yes or no';
class FreeMediationOption {
    static all() {
        return [
            FreeMediationOption.YES,
            FreeMediationOption.NO
        ];
    }
}
exports.FreeMediationOption = FreeMediationOption;
FreeMediationOption.YES = 'yes';
FreeMediationOption.NO = 'no';
class FreeMediation {
    constructor(option) {
        this.option = option;
    }
    isCompleted() {
        return !!this.option;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.OPTION_REQUIRED }),
    class_validator_1.IsIn(FreeMediationOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
], FreeMediation.prototype, "option", void 0);
exports.FreeMediation = FreeMediation;
