"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const howMuchHaveYouPaid_1 = require("response/form/models/howMuchHaveYouPaid");
const whyDoYouDisagree_1 = require("response/form/models/whyDoYouDisagree");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.OPTION_REQUIRED = 'Please select a response';
class RejectAllOfClaimOption {
    static all() {
        return [
            RejectAllOfClaimOption.ALREADY_PAID,
            RejectAllOfClaimOption.DISPUTE,
            RejectAllOfClaimOption.COUNTER_CLAIM
        ];
    }
    static except(value) {
        if (value === undefined) {
            throw new Error('Option is required');
        }
        return RejectAllOfClaimOption.all().filter(option => option !== value);
    }
}
exports.RejectAllOfClaimOption = RejectAllOfClaimOption;
RejectAllOfClaimOption.ALREADY_PAID = 'alreadyPaid';
RejectAllOfClaimOption.DISPUTE = 'dispute';
RejectAllOfClaimOption.COUNTER_CLAIM = 'counterClaim';
class RejectAllOfClaim {
    constructor(option, howMuchHaveYouPaid, whyDoYouDisagree) {
        this.option = option;
        this.howMuchHaveYouPaid = howMuchHaveYouPaid;
        this.whyDoYouDisagree = whyDoYouDisagree;
    }
    deserialize(input) {
        if (input) {
            if (input.option) {
                this.option = input.option;
            }
            if (input.howMuchHaveYouPaid) {
                this.howMuchHaveYouPaid = new howMuchHaveYouPaid_1.HowMuchHaveYouPaid().deserialize(input.howMuchHaveYouPaid);
            }
            if (input.whyDoYouDisagree) {
                this.whyDoYouDisagree = new whyDoYouDisagree_1.WhyDoYouDisagree().deserialize(input.whyDoYouDisagree);
            }
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.OPTION_REQUIRED }),
    class_validator_1.IsIn(RejectAllOfClaimOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
], RejectAllOfClaim.prototype, "option", void 0);
exports.RejectAllOfClaim = RejectAllOfClaim;
