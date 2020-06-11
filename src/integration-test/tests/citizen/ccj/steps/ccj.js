"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const test_data_1 = require("integration-test/data/test-data");
const ccj_check_and_send_1 = require("integration-test/tests/citizen/ccj/pages/ccj-check-and-send");
const defendant_paid_any_money_1 = require("integration-test/tests/citizen/ccj/pages/defendant-paid-any-money");
const defendant_pay_by_instalments_1 = require("integration-test/tests/citizen/ccj/pages/defendant-pay-by-instalments");
const defendant_pay_by_set_date_1 = require("integration-test/tests/citizen/ccj/pages/defendant-pay-by-set-date");
const paid_amount_summary_1 = require("integration-test/tests/citizen/ccj/pages/paid-amount-summary");
const payment_options_1 = require("integration-test/tests/citizen/ccj/pages/payment-options");
const citizen_dob_1 = require("integration-test/tests/citizen/claim/pages/citizen-dob");
const dashboard_1 = require("integration-test/tests/citizen/dashboard/steps/dashboard");
const testingSupport_1 = require("integration-test/tests/citizen/testingSupport/steps/testingSupport");
const I = actor();
const testingSupport = new testingSupport_1.TestingSupportSteps();
const dashboardSteps = new dashboard_1.DashboardSteps();
const ccjDateOfBirthPage = new citizen_dob_1.CitizenDobPage();
const ccjDefendantPaidAnyMoneyPage = new defendant_paid_any_money_1.DefendantPaidAnyMoneyPage();
const ccjPaidAmountSummary = new paid_amount_summary_1.PaidAmountSummaryPage();
const ccjPaymentOptionsPage = new payment_options_1.PaymentOptionsPage();
const ccjDefendantPaidByInstalmentsPage = new defendant_pay_by_instalments_1.DefendantPayByInstalmentsPage();
const ccjDefendantPayBySetDatePage = new defendant_pay_by_set_date_1.DefendantPayBySetDatePage();
const ccjCheckAndSendPage = new ccj_check_and_send_1.CountyCourtJudgementCheckAndSendPage();
const ccjRepaymentPlan = {
    equalInstalment: 20.00,
    firstPaymentDate: '2025-01-01',
    frequency: 'everyWeek'
};
const paymentBySetDate = '2025-01-01';
const defendant = test_data_1.createDefendant(party_type_1.PartyType.INDIVIDUAL, false);
const defendantPaidAmount = 35.50;
class CountyCourtJudgementSteps {
    requestCCJ(claimRef, defendantType) {
        if (process.env.FEATURE_TESTING_SUPPORT === 'true') {
            testingSupport.makeClaimAvailableForCCJ(claimRef);
        }
        dashboardSteps.startCCJ(claimRef);
        if (defendantType === party_type_1.PartyType.INDIVIDUAL) {
            I.see('Do you know the defendant’s date of birth?');
            I.click('input[id=knowntrue]');
            ccjDateOfBirthPage.enterDOB(defendant.dateOfBirth);
        }
        I.see('Has the defendant paid some of the amount owed?');
        ccjDefendantPaidAnyMoneyPage.defendantPaid(defendantPaidAmount);
        ccjPaidAmountSummary.checkAmounts(defendantPaidAmount);
        ccjPaidAmountSummary.continue();
    }
    ccjDefendantToPayByInstalments() {
        ccjPaymentOptionsPage.chooseInstalments();
        ccjDefendantPaidByInstalmentsPage.checkOutstandingAmount(defendantPaidAmount);
        ccjDefendantPaidByInstalmentsPage.enterRepaymentPlan(ccjRepaymentPlan);
    }
    ccjDefendantToPayBySetDate() {
        ccjPaymentOptionsPage.chooseFullBySetDate();
        ccjDefendantPayBySetDatePage.paymentBySetDate(paymentBySetDate);
    }
    ccjDefendantToPayImmediately() {
        ccjPaymentOptionsPage.chooseImmediately();
    }
    checkCCJFactsAreTrueAndSubmit(claimantType, defendant, defendantType) {
        ccjCheckAndSendPage.verifyCheckAndSendAnswers(defendant, defendantType, defendantPaidAmount, defendant.address);
        if (claimantType === party_type_1.PartyType.COMPANY || claimantType === party_type_1.PartyType.ORGANISATION) {
            ccjCheckAndSendPage.signStatementOfTruthAndSubmit('Mr CCJ submitter', 'Director');
        }
        else {
            ccjCheckAndSendPage.checkFactsTrueAndSubmit();
        }
    }
}
exports.CountyCourtJudgementSteps = CountyCourtJudgementSteps;
