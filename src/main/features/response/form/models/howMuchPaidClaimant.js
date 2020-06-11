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
ValidationErrors.OPTION_REQUIRED = 'Please select a response';
class HowMuchPaidClaimantOption {
    static all() {
        return [
            HowMuchPaidClaimantOption.AMOUNT_CLAIMED,
            HowMuchPaidClaimantOption.LESS_THAN_AMOUNT_CLAIMED
        ];
    }
}
exports.HowMuchPaidClaimantOption = HowMuchPaidClaimantOption;
HowMuchPaidClaimantOption.AMOUNT_CLAIMED = 'amountClaimed';
HowMuchPaidClaimantOption.LESS_THAN_AMOUNT_CLAIMED = 'lessThenAmountClaimed';
class HowMuchPaidClaimant {
    constructor(option) {
        this.option = option;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.OPTION_REQUIRED }),
    class_validator_1.IsIn(HowMuchPaidClaimantOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
], HowMuchPaidClaimant.prototype, "option", void 0);
exports.HowMuchPaidClaimant = HowMuchPaidClaimant;
