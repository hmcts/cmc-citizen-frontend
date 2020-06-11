"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("eligibility/paths");
const eligibilityPage_1 = require("eligibility/eligibilityPage");
const eligibilityCheck_1 = require("eligibility/model/eligibilityCheck");
const notEligibleReason_1 = require("eligibility/notEligibleReason");
const defendantAgeOption_1 = require("eligibility/model/defendantAgeOption");
class DefendantAgeEligibilityPage extends eligibilityPage_1.EligibilityPage {
    constructor() {
        super(paths_1.Paths.defendantAgePage, paths_1.Paths.over18Page, 'defendantAge');
    }
    checkEligibility(value) {
        switch (value) {
            case defendantAgeOption_1.DefendantAgeOption.YES:
                return eligibilityCheck_1.eligible();
            case defendantAgeOption_1.DefendantAgeOption.COMPANY_OR_ORGANISATION:
                return eligibilityCheck_1.eligible();
            case defendantAgeOption_1.DefendantAgeOption.NO:
                return eligibilityCheck_1.notEligible(notEligibleReason_1.NotEligibleReason.UNDER_18_DEFENDANT);
            default:
                throw new Error(`Unexpected claim value: ${value.option}`);
        }
    }
}
/* tslint:disable:no-default-export */
exports.default = new DefendantAgeEligibilityPage().buildRouter();
