"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("eligibility/paths");
const notEligibleReason_1 = require("eligibility/notEligibleReason");
const eligibilityPage_1 = require("eligibility/eligibilityPage");
const claimType_1 = require("eligibility/model/claimType");
const eligibilityCheck_1 = require("eligibility/model/eligibilityCheck");
class ClaimTypeEligibilityPage extends eligibilityPage_1.EligibilityPage {
    constructor() {
        super(paths_1.Paths.claimTypePage, paths_1.Paths.claimantAddressPage, 'claimType');
    }
    checkEligibility(value) {
        switch (value) {
            case claimType_1.ClaimType.PERSONAL_CLAIM:
                return eligibilityCheck_1.eligible();
            case claimType_1.ClaimType.MULTIPLE_CLAIM:
                return eligibilityCheck_1.notEligible(notEligibleReason_1.NotEligibleReason.MULTIPLE_CLAIMANTS);
            case claimType_1.ClaimType.REPRESENTATIVE_CLAIM:
                return eligibilityCheck_1.notEligible(notEligibleReason_1.NotEligibleReason.CLAIM_ON_BEHALF);
            default:
                throw new Error(`Unexpected ClaimType: ${value.option}`);
        }
    }
}
/* tslint:disable:no-default-export */
exports.default = new ClaimTypeEligibilityPage().buildRouter();
