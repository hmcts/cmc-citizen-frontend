"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const claimant_reponse_1 = require("integration-test/tests/citizen/claimantResponse/steps/claimant-reponse");
const helper_1 = require("integration-test/tests/citizen/endToEnd/steps/helper");
const payment_option_1 = require("integration-test/data/payment-option");
const claimant_confirmation_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-confirmation");
const claimant_check_and_send_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send");
const EndToEndTestData_1 = require("integration-test/tests/citizen/endToEnd/data/EndToEndTestData");
const ClaimantResponseTestData_1 = require("integration-test/tests/citizen/claimantResponse/data/ClaimantResponseTestData");
const helperSteps = new helper_1.Helper();
const userSteps = new user_1.UserSteps();
const claimantResponseSteps = new claimant_reponse_1.ClaimantResponseSteps();
const checkAndSendPage = new claimant_check_and_send_1.ClaimantCheckAndSendPage();
const confirmationPage = new claimant_confirmation_1.ClaimantConfirmation();
if (process.env.FEATURE_ADMISSIONS === 'true') {
    Feature('Claimant Response: Fully Admit');
    Scenario('I can as a claimant view the defendants full admission with immediate payment @citizen @admissions', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.IMMEDIATELY;
        // as defendant
        helperSteps.finishResponseWithFullAdmission(testData);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.viewClaimFromDashboard(testData.claimRef);
        I.see(testData.claimRef);
        I.see('The defendant said they’ll pay you immediately');
        I.click('My account');
        I.see(testData.claimRef);
        I.see('Wait for the defendant to pay you');
    });
    Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and accepting defendants payment method @citizen @admissions', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.BY_SET_DATE;
        const claimantResponseTestData = new ClaimantResponseTestData_1.ClaimantResponseTestData();
        // as defendant
        helperSteps.finishResponseWithFullAdmission(testData);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.acceptSettlementFromDashboardWhenAcceptPaymentMethod(testData, claimantResponseTestData, 'View and respond to the offer');
        checkAndSendPage.verifyFactsForSettlement();
        I.click('input[type=submit]');
        I.see('You’ve signed a settlement agreement');
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('You’ve signed a settlement agreement');
    });
    Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and rejecting defendants payment method in favour of immediate payment @nightly @admissions', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.BY_SET_DATE;
        testData.claimantPaymentOption = payment_option_1.PaymentOption.IMMEDIATELY;
        const claimantResponseTestData = new ClaimantResponseTestData_1.ClaimantResponseTestData();
        // as defendant
        helperSteps.finishResponseWithFullAdmission(testData);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond to the offer');
        checkAndSendPage.verifyFactsForSettlement();
        checkAndSendPage.submitNoDq();
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('You’ve signed a settlement agreement');
    });
    Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and rejecting defendants payment method in favour of set date @nightly @admissions', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.BY_SET_DATE;
        testData.claimantPaymentOption = payment_option_1.PaymentOption.BY_SET_DATE;
        const claimantResponseTestData = new ClaimantResponseTestData_1.ClaimantResponseTestData();
        // as defendant
        helperSteps.finishResponseWithFullAdmission(testData);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond to the offer');
        checkAndSendPage.verifyFactsForSettlement();
        checkAndSendPage.submitNoDq();
        I.see('You’ve proposed a different repayment plan');
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('You’ve signed a settlement agreement');
    });
    Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and rejecting defendants payment method in favour of instalments @nightly @admissions', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.BY_SET_DATE;
        testData.claimantPaymentOption = payment_option_1.PaymentOption.INSTALMENTS;
        const claimantResponseTestData = new ClaimantResponseTestData_1.ClaimantResponseTestData();
        // as defendant
        helperSteps.finishResponseWithFullAdmission(testData);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond to the offer');
        checkAndSendPage.verifyFactsForSettlement();
        checkAndSendPage.submitNoDq();
        I.see('You’ve proposed a different repayment plan');
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('You’ve signed a settlement agreement');
    });
    Scenario('I can as a claimant accept the defendants full admission by instalments with settlement agreement and rejecting defendants payment method in favour of courts proposed repayment plan @citizen @admissions', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.INSTALMENTS;
        testData.claimantPaymentOption = payment_option_1.PaymentOption.INSTALMENTS;
        const unreasonableClaimantResponseTestDate = new ClaimantResponseTestData_1.UnreasonableClaimantResponseTestData();
        // as defendant
        helperSteps.finishResponseWithFullAdmission(testData);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.acceptCourtOfferedRepaymentPlan(testData, unreasonableClaimantResponseTestDate, 'View and respond to the offer');
        checkAndSendPage.verifyFactsForSettlement();
        I.see('The court rejected your repayment plan and calculated a more affordable one');
        I.click('input[type=submit]');
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('You’ve signed a settlement agreement');
    });
    Scenario('I can as a claimant accept the defendants full admission by set date with CCJ and no previous payments made @admissions @citizen', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.BY_SET_DATE;
        // as defendant
        helperSteps.finishResponseWithFullAdmission(testData);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.acceptCcjFromDashboardWhenDefendantHasPaidNoneAndAcceptPaymentMethod(testData, 'View and respond to the offer');
        I.see('County Court Judgment requested');
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('County Court Judgment');
    });
    Scenario('I can as a claimant accept the defendants full admission by set date with CCJ and a previous payment made @admissions @citizen', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.BY_SET_DATE;
        // as defendant
        helperSteps.finishResponseWithFullAdmission(testData);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.acceptCcjFromDashboardWhenDefendantHasPaidSomeAndAcceptPaymentMethod(testData, 'View and respond to the offer');
        I.see('County Court Judgment requested');
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('County Court Judgment');
    });
    Scenario('I can as a claimant accept the defendants full admission by instalments and reject defendants payment method in favour of repayment plan, accepting court determination, requesting CCJ then finally settling @admissions @nightly', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.INSTALMENTS;
        testData.claimantPaymentOption = payment_option_1.PaymentOption.INSTALMENTS;
        const claimantResponseTestData = new ClaimantResponseTestData_1.UnreasonableClaimantResponseTestData();
        claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage = true;
        claimantResponseTestData.pageSpecificValues.settleClaimEnterDate = '2019-01-01';
        // as defendant
        helperSteps.finishResponseWithFullAdmission(testData);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.acceptCcjFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond to the offer');
        I.see('County Court Judgment requested');
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('County Court Judgment');
        claimantResponseSteps.settleClaim(testData, claimantResponseTestData, 'Tell us you’ve been paid');
        I.see('The claim is now settled');
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('This claim is settled.');
    });
}
