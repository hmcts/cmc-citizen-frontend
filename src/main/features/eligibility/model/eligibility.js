"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yesNoOption_1 = require("models/yesNoOption");
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const claimValue_1 = require("eligibility/model/claimValue");
const claimType_1 = require("eligibility/model/claimType");
const defendantAgeOption_1 = require("eligibility/model/defendantAgeOption");
class Eligibility {
    constructor(claimValue, helpWithFees, claimantAddress, defendantAddress, eighteenOrOver, defendantAge, claimType, singleClaimant, governmentDepartment, claimIsForTenancyDeposit) {
        this.claimValue = claimValue;
        this.helpWithFees = helpWithFees;
        this.claimantAddress = claimantAddress;
        this.defendantAddress = defendantAddress;
        this.eighteenOrOver = eighteenOrOver;
        this.defendantAge = defendantAge;
        this.claimType = claimType;
        this.singleDefendant = singleClaimant;
        this.governmentDepartment = governmentDepartment;
        this.claimIsForTenancyDeposit = claimIsForTenancyDeposit;
    }
    static fromObject(input) {
        if (input == null) {
            return input;
        }
        return new Eligibility(claimValue_1.ClaimValue.fromObject(input.claimValue), yesNoOption_1.YesNoOption.fromObject(input.helpWithFees), yesNoOption_1.YesNoOption.fromObject(input.claimantAddress), yesNoOption_1.YesNoOption.fromObject(input.defendantAddress), yesNoOption_1.YesNoOption.fromObject(input.eighteenOrOver), defendantAgeOption_1.DefendantAgeOption.fromObject(input.defendantAge), claimType_1.ClaimType.fromObject(input.claimType), yesNoOption_1.YesNoOption.fromObject(input.singleDefendant), yesNoOption_1.YesNoOption.fromObject(input.governmentDepartment), yesNoOption_1.YesNoOption.fromObject(input.claimIsForTenancyDeposit));
    }
    deserialize(input) {
        if (input) {
            if (input.claimValue) {
                this.claimValue = claimValue_1.ClaimValue.fromObject(input.claimValue.option);
            }
            if (input.helpWithFees) {
                this.helpWithFees = yesNoOption_1.YesNoOption.fromObject(input.helpWithFees.option);
            }
            if (input.claimantAddress) {
                this.claimantAddress = yesNoOption_1.YesNoOption.fromObject(input.claimantAddress.option);
            }
            if (input.defendantAddress) {
                this.defendantAddress = yesNoOption_1.YesNoOption.fromObject(input.defendantAddress.option);
            }
            if (input.eighteenOrOver) {
                this.eighteenOrOver = yesNoOption_1.YesNoOption.fromObject(input.eighteenOrOver.option);
            }
            if (input.defendantAge) {
                this.defendantAge = defendantAgeOption_1.DefendantAgeOption.fromObject(input.defendantAge.option);
            }
            if (input.claimType) {
                this.claimType = claimType_1.ClaimType.fromObject(input.claimType.option);
            }
            if (input.singleDefendant) {
                this.singleDefendant = yesNoOption_1.YesNoOption.fromObject(input.singleDefendant.option);
            }
            if (input.governmentDepartment) {
                this.governmentDepartment = yesNoOption_1.YesNoOption.fromObject(input.governmentDepartment.option);
            }
            if (input.claimIsForTenancyDeposit) {
                this.claimIsForTenancyDeposit = yesNoOption_1.YesNoOption.fromObject(input.claimIsForTenancyDeposit.option);
            }
        }
        return this;
    }
    get eligible() {
        return this.claimValue === claimValue_1.ClaimValue.UNDER_10000 &&
            this.helpWithFees === yesNoOption_1.YesNoOption.NO &&
            this.claimantAddress === yesNoOption_1.YesNoOption.YES &&
            this.defendantAddress === yesNoOption_1.YesNoOption.YES &&
            this.eighteenOrOver === yesNoOption_1.YesNoOption.YES &&
            (this.defendantAge === defendantAgeOption_1.DefendantAgeOption.YES || this.defendantAge === defendantAgeOption_1.DefendantAgeOption.COMPANY_OR_ORGANISATION) &&
            this.claimType === claimType_1.ClaimType.PERSONAL_CLAIM &&
            this.singleDefendant === yesNoOption_1.YesNoOption.NO &&
            this.governmentDepartment === yesNoOption_1.YesNoOption.NO &&
            this.claimIsForTenancyDeposit === yesNoOption_1.YesNoOption.NO;
    }
}
__decorate([
    class_validator_1.IsIn(claimValue_1.ClaimValue.all(), { message: validationErrors_1.ValidationErrors.SELECT_AN_OPTION, groups: ['claimValue'] })
], Eligibility.prototype, "claimValue", void 0);
__decorate([
    class_validator_1.IsIn(yesNoOption_1.YesNoOption.all(), { message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED, groups: ['helpWithFees'] })
], Eligibility.prototype, "helpWithFees", void 0);
__decorate([
    class_validator_1.IsIn(yesNoOption_1.YesNoOption.all(), { message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED, groups: ['claimantAddress'] })
], Eligibility.prototype, "claimantAddress", void 0);
__decorate([
    class_validator_1.IsIn(yesNoOption_1.YesNoOption.all(), { message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED, groups: ['defendantAddress'] })
], Eligibility.prototype, "defendantAddress", void 0);
__decorate([
    class_validator_1.IsIn(yesNoOption_1.YesNoOption.all(), { message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED, groups: ['eighteenOrOver'] })
], Eligibility.prototype, "eighteenOrOver", void 0);
__decorate([
    class_validator_1.IsIn(defendantAgeOption_1.DefendantAgeOption.all(), { message: validationErrors_1.ValidationErrors.DEFENDANT_AGE_REQUIRED, groups: ['defendantAge'] })
], Eligibility.prototype, "defendantAge", void 0);
__decorate([
    class_validator_1.IsIn(claimType_1.ClaimType.all(), { message: validationErrors_1.ValidationErrors.SELECT_AN_OPTION, groups: ['claimType'] })
], Eligibility.prototype, "claimType", void 0);
__decorate([
    class_validator_1.IsIn(yesNoOption_1.YesNoOption.all(), { message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED, groups: ['singleDefendant'] })
], Eligibility.prototype, "singleDefendant", void 0);
__decorate([
    class_validator_1.IsIn(yesNoOption_1.YesNoOption.all(), { message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED, groups: ['governmentDepartment'] })
], Eligibility.prototype, "governmentDepartment", void 0);
__decorate([
    class_validator_1.IsIn(yesNoOption_1.YesNoOption.all(), { message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED, groups: ['claimIsForTenancyDeposit'] })
], Eligibility.prototype, "claimIsForTenancyDeposit", void 0);
exports.Eligibility = Eligibility;
