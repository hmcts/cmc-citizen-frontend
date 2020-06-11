"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimant_interest_date_1 = require("integration-test/tests/citizen/claim/pages/claimant-interest-date");
const claimant_interest_total_1 = require("integration-test/tests/citizen/claim/pages/claimant-interest-total");
const claimant_interest_1 = require("integration-test/tests/citizen/claim/pages/claimant-interest");
const claimant_interest_type_1 = require("integration-test/tests/citizen/claim/pages/claimant-interest-type");
const claimant_interest_rate_1 = require("integration-test/tests/citizen/claim/pages/claimant-interest-rate");
const claimant_interest_start_date_1 = require("integration-test/tests/citizen/claim/pages/claimant-interest-start-date");
const claimant_interest_end_date_1 = require("integration-test/tests/citizen/claim/pages/claimant-interest-end-date");
const claimant_interest_continune_claiming_1 = require("integration-test/tests/citizen/claim/pages/claimant-interest-continune-claiming");
const claimant_interest_how_much_1 = require("integration-test/tests/citizen/claim/pages/claimant-interest-how-much");
const claimant_amount_total_1 = require("integration-test/tests/citizen/claim/pages/claimant-amount-total");
const claimantInterestPage = new claimant_interest_1.ClaimantInterestPage();
const claimantInterestTypePage = new claimant_interest_type_1.ClaimantInterestTypePage();
const claimantInterestRatePage = new claimant_interest_rate_1.ClaimantInterestRatePage();
const claimantInterestDatePage = new claimant_interest_date_1.ClaimantInterestDatePage();
const claimantInterestTotalPage = new claimant_interest_total_1.ClaimantInterestTotalPage();
const claimantInterestStartDatePage = new claimant_interest_start_date_1.ClaimantInterestStartDatePage();
const claimantInterestEndDatePage = new claimant_interest_end_date_1.ClaimantInterestEndDatePage();
const claimantInterestContinueClaimingPage = new claimant_interest_continune_claiming_1.ClaimantInterestContinueClaimingPage();
const claimantInterestHowMuchPage = new claimant_interest_how_much_1.ClaimantInterestHowMuchPage();
const claimantInterestAmountTotalPage = new claimant_amount_total_1.ClaimantAmountTotalPage();
class InterestSteps {
    skipClaimInterest() {
        claimantInterestPage.selectNo();
    }
    enterDefaultInterest() {
        claimantInterestPage.selectYes();
        claimantInterestTypePage.selectSameRate();
        claimantInterestRatePage.selectStandardRate();
        claimantInterestDatePage.selectSubmission();
    }
    enterSpecificInterestRateAndDate(rate, date) {
        claimantInterestPage.selectYes();
        claimantInterestTypePage.selectSameRate();
        claimantInterestRatePage.selectDifferent('10', 'Contract');
        claimantInterestDatePage.selectCustom();
        claimantInterestStartDatePage.selectParticularDate('2018-01-01', 'Contract');
        claimantInterestEndDatePage.selectSettledOrJudgment();
    }
    enterBreakdownInterestAmountAndDailyAmount() {
        claimantInterestPage.selectYes();
        claimantInterestTypePage.selectBreakdown();
        claimantInterestTotalPage.selectInterestTotal('1000', 'Contract');
        claimantInterestContinueClaimingPage.selectYes();
        claimantInterestHowMuchPage.selectDifferent('20');
    }
    skipClaimantInterestTotalPage() {
        claimantInterestAmountTotalPage.continue();
    }
}
exports.InterestSteps = InterestSteps;
