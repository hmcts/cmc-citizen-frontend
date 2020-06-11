"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("eligibility/paths");
const eligibilityPage_1 = require("eligibility/eligibilityPage");
const claimValue_1 = require("eligibility/model/claimValue");
const eligibilityCheck_1 = require("eligibility/model/eligibilityCheck");
const notEligibleReason_1 = require("eligibility/notEligibleReason");
class ClaimValueEligibilityPage extends eligibilityPage_1.EligibilityPage {
    constructor() {
        super(paths_1.Paths.claimValuePage, paths_1.Paths.helpWithFeesPage, 'claimValue');
    }
    checkEligibility(value) {
        switch (value) {
            case claimValue_1.ClaimValue.NOT_KNOWN:
                return eligibilityCheck_1.notEligible(notEligibleReason_1.NotEligibleReason.CLAIM_VALUE_NOT_KNOWN);
            case claimValue_1.ClaimValue.OVER_10000:
                return eligibilityCheck_1.notEligible(notEligibleReason_1.NotEligibleReason.CLAIM_VALUE_OVER_10000);
            case claimValue_1.ClaimValue.UNDER_10000:
                return eligibilityCheck_1.eligible();
            default:
                throw new Error(`Unexpected claim value: ${value.option}`);
        }
    }
}
/* tslint:disable:no-default-export */
exports.default = new ClaimValueEligibilityPage().buildRouter();
