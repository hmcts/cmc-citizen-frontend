"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("eligibility/paths");
const eligibilityPage_1 = require("eligibility/eligibilityPage");
const yesNoOption_1 = require("models/yesNoOption");
const eligibilityCheck_1 = require("eligibility/model/eligibilityCheck");
const notEligibleReason_1 = require("eligibility/notEligibleReason");
class ClaimantAddressEligibilityPage extends eligibilityPage_1.EligibilityPage {
    constructor() {
        super(paths_1.Paths.claimantAddressPage, paths_1.Paths.claimIsForTenancyDepositPage, 'claimantAddress');
    }
    checkEligibility(value) {
        return value === yesNoOption_1.YesNoOption.YES ? eligibilityCheck_1.eligible() : eligibilityCheck_1.notEligible(notEligibleReason_1.NotEligibleReason.CLAIMANT_ADDRESS);
    }
}
/* tslint:disable:no-default-export */
exports.default = new ClaimantAddressEligibilityPage().buildRouter();
