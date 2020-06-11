"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const formaliseRepaymentPlanOption_1 = require("claimant-response/form/models/formaliseRepaymentPlanOption");
const validationErrors_1 = require("forms/validation/validationErrors");
class FormaliseRepaymentPlan {
    constructor(option) {
        this.option = option;
    }
    static fromObject(input) {
        if (!input) {
            return input;
        }
        return new FormaliseRepaymentPlan(formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.valueOf(input.option));
    }
    deserialize(input) {
        if (input && input.option) {
            this.option = formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.valueOf(input.option.value);
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.SELECT_AN_OPTION }),
    class_validator_1.IsIn(formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.all(), { message: validationErrors_1.ValidationErrors.SELECT_AN_OPTION })
], FormaliseRepaymentPlan.prototype, "option", void 0);
exports.FormaliseRepaymentPlan = FormaliseRepaymentPlan;
