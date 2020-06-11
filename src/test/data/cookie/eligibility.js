"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimType_1 = require("eligibility/model/claimType");
const claimValue_1 = require("eligibility/model/claimValue");
const defendantAgeOption_1 = require("eligibility/model/defendantAgeOption");
const yesNoOption_1 = require("models/yesNoOption");
exports.eligibleCookie = {
    claimValue: {
        option: claimValue_1.ClaimValue.UNDER_10000.option
    },
    helpWithFees: {
        option: yesNoOption_1.YesNoOption.NO.option
    },
    claimantAddress: {
        option: yesNoOption_1.YesNoOption.YES.option
    },
    defendantAddress: {
        option: yesNoOption_1.YesNoOption.YES.option
    },
    eighteenOrOver: {
        option: yesNoOption_1.YesNoOption.YES.option
    },
    defendantAge: {
        option: defendantAgeOption_1.DefendantAgeOption.YES.option
    },
    claimType: {
        option: claimType_1.ClaimType.PERSONAL_CLAIM.option
    },
    singleDefendant: {
        option: yesNoOption_1.YesNoOption.NO.option
    },
    governmentDepartment: {
        option: yesNoOption_1.YesNoOption.NO.option
    },
    claimIsForTenancyDeposit: {
        option: yesNoOption_1.YesNoOption.NO.option
    }
};
