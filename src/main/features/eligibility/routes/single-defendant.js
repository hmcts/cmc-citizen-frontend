"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("eligibility/paths");
const eligibilityPage_1 = require("eligibility/eligibilityPage");
const yesNoOption_1 = require("models/yesNoOption");
const eligibilityCheck_1 = require("eligibility/model/eligibilityCheck");
const notEligibleReason_1 = require("eligibility/notEligibleReason");
class SingleDefendantEligibilityPage extends eligibilityPage_1.EligibilityPage {
    constructor() {
        super(paths_1.Paths.singleDefendantPage, paths_1.Paths.defendantAddressPage, 'singleDefendant');
    }
    checkEligibility(value) {
        return value === yesNoOption_1.YesNoOption.NO ? eligibilityCheck_1.eligible() : eligibilityCheck_1.notEligible(notEligibleReason_1.NotEligibleReason.MULTIPLE_DEFENDANTS);
    }
}
/* tslint:disable:no-default-export */
exports.default = new SingleDefendantEligibilityPage().buildRouter();
