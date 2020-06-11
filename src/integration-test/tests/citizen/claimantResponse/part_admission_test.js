"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const defence_type_1 = require("integration-test/data/defence-type");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const claimant_reponse_1 = require("integration-test/tests/citizen/claimantResponse/steps/claimant-reponse");
const helper_1 = require("integration-test/tests/citizen/endToEnd/steps/helper");
const payment_option_1 = require("integration-test/data/payment-option");
const claimant_confirmation_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-confirmation");
const claimant_check_and_send_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send");
const EndToEndTestData_1 = require("integration-test/tests/citizen/endToEnd/data/EndToEndTestData");
const ClaimantResponseTestData_1 = require("./data/ClaimantResponseTestData");
const helperSteps = new helper_1.Helper();
const userSteps = new user_1.UserSteps();
const claimantResponseSteps = new claimant_reponse_1.ClaimantResponseSteps();
const checkAndSendPage = new claimant_check_and_send_1.ClaimantCheckAndSendPage();
const confirmationPage = new claimant_confirmation_1.ClaimantConfirmation();
Feature('EMPTY');
if (process.env.FEATURE_ADMISSIONS === 'true') {
    Feature('Claimant Response: Part Admit');
    Scenario('I can as a claimant reject the defendants part admission by immediately @nightly @admissions', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.IMMEDIATELY;
        testData.defenceType = defence_type_1.DefenceType.PART_ADMISSION;
        testData.defendantClaimsToHavePaidInFull = false;
        const claimantResponseTestData = new ClaimantResponseTestData_1.ClaimantResponseTestData();
        claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage = true;
        // as defendant
        helperSteps.finishResponse(testData, false);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.viewClaimFromDashboard(testData.claimRef);
        claimantResponseSteps.respondToOffer('View and respond');
        claimantResponseSteps.reject(testData, claimantResponseTestData);
        checkAndSendPage.verifyFactsForPartAdmitRejection();
        checkAndSendPage.checkFactsTrueAndSubmit(testData.defenceType);
        I.see('You agreed to try to resolve the claim using mediation');
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('We’ll contact you to try to arrange a mediation appointment');
    });
    Scenario('I can as a claimant accept the defendants part admission by immediately with settlement agreement and accepting defendants payment method @nightly @admissions', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.IMMEDIATELY;
        testData.defenceType = defence_type_1.DefenceType.PART_ADMISSION;
        testData.defendantClaimsToHavePaidInFull = false;
        const claimantResponseTestData = new ClaimantResponseTestData_1.ClaimantResponseTestData();
        claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage = true;
        // as defendant
        helperSteps.finishResponse(testData);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.acceptSettlementFromDashboardWhenAcceptPaymentMethod(testData, claimantResponseTestData, 'View and respond');
        checkAndSendPage.verifyFactsForSettlement();
        checkAndSendPage.submitNoDq();
        I.see('You’ve signed a settlement agreement');
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('You’ve signed a settlement agreement.');
    });
    Scenario('I can as a claimant accept the defendants part admission by instalments with settlement agreement and rejecting defendants payment method in favour of immediate payment @citizen @admissions', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.INSTALMENTS;
        testData.defenceType = defence_type_1.DefenceType.PART_ADMISSION;
        testData.claimantPaymentOption = payment_option_1.PaymentOption.IMMEDIATELY;
        testData.defendantClaimsToHavePaidInFull = false;
        const claimantResponseTestData = new ClaimantResponseTestData_1.ClaimantResponseTestData();
        claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage = true;
        // as defendant
        helperSteps.finishResponse(testData);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond');
        checkAndSendPage.verifyFactsForSettlement();
        I.click('input[type=submit]');
        I.see('You’ve signed a settlement agreement');
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('You’ve signed a settlement agreement.');
    });
    Scenario('I can as a claimant accept the defendants part admission by instalments with settlement agreement and rejecting defendants payment method in favour of set date @nightly @admissions', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.INSTALMENTS;
        testData.defenceType = defence_type_1.DefenceType.PART_ADMISSION;
        testData.claimantPaymentOption = payment_option_1.PaymentOption.BY_SET_DATE;
        testData.defendantClaimsToHavePaidInFull = false;
        const claimantResponseTestData = new ClaimantResponseTestData_1.ClaimantResponseTestData();
        claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage = true;
        claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage = true;
        // as defendant
        helperSteps.finishResponse(testData);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond');
        checkAndSendPage.verifyFactsForSettlement();
        checkAndSendPage.submitNoDq();
        I.see('You’ve signed a settlement agreement');
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('You’ve signed a settlement agreement.');
    });
    Scenario('I can as a claimant accept the defendants part admission by instalments with settlement agreement and rejecting defendants payment method in favour of instalments @nightly @admissions', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
        testData.paymentOption = payment_option_1.PaymentOption.BY_SET_DATE;
        testData.defenceType = defence_type_1.DefenceType.PART_ADMISSION;
        testData.claimantPaymentOption = payment_option_1.PaymentOption.INSTALMENTS;
        testData.defendantClaimsToHavePaidInFull = false;
        const claimantResponseTestData = new ClaimantResponseTestData_1.ClaimantResponseTestData();
        claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage = true;
        // as defendant
        helperSteps.finishResponse(testData);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond');
        checkAndSendPage.verifyFactsForSettlement();
        checkAndSendPage.submitNoDq();
        I.see('You’ve proposed a different repayment plan');
        confirmationPage.clickGoToYourAccount();
        I.see(testData.claimRef);
        I.see('You’ve signed a settlement agreement.');
    });
}
