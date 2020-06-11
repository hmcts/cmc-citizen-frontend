"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const statementType_1 = require("./statementType");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.OPTION_REQUIRED = 'Choose option: yes or no or make an offer';
class DefendantResponse {
    constructor(option) {
        this.option = option;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new DefendantResponse(statementType_1.StatementType.valueOf(value.option));
    }
    deserialize(input) {
        if (input) {
            this.option = statementType_1.StatementType.valueOf(input.option);
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.OPTION_REQUIRED }),
    class_validator_1.IsIn(statementType_1.StatementType.all(), { message: ValidationErrors.OPTION_REQUIRED })
], DefendantResponse.prototype, "option", void 0);
exports.DefendantResponse = DefendantResponse;
