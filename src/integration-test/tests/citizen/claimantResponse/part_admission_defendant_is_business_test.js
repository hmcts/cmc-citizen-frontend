"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const claimant_reponse_1 = require("integration-test/tests/citizen/claimantResponse/steps/claimant-reponse");
const helper_1 = require("integration-test/tests/citizen/endToEnd/steps/helper");
const payment_option_1 = require("integration-test/data/payment-option");
const claimant_check_and_send_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send");
const EndToEndTestData_1 = require("integration-test/tests/citizen/endToEnd/data/EndToEndTestData");
const defence_type_1 = require("integration-test/data/defence-type");
const ClaimantResponseTestData_1 = require("./data/ClaimantResponseTestData");
const helperSteps = new helper_1.Helper();
const userSteps = new user_1.UserSteps();
const claimantResponseSteps = new claimant_reponse_1.ClaimantResponseSteps();
const checkAndSendPage = new claimant_check_and_send_1.ClaimantCheckAndSendPage();
if (process.env.FEATURE_ADMISSIONS === 'true') {
    Feature('Claimant Response ::: Part admit when defendant is business');
    Scenario('I can as a claimant accept and suggest an alternative payment intention with set date @nightly @admissions @business', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.COMPANY, party_type_1.PartyType.INDIVIDUAL);
        testData.defenceType = defence_type_1.DefenceType.PART_ADMISSION_NONE_PAID;
        testData.paymentOption = payment_option_1.PaymentOption.BY_SET_DATE;
        // as defendant
        helperSteps.finishResponse(testData, false);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.viewClaimFromDashboard(testData.claimRef);
        I.click('View and respond');
        claimantResponseSteps.acceptPartAdmitFromBusinessWithAlternativePaymentIntention();
        checkAndSendPage.verifyFactsForPartAdmitFromBusiness();
        checkAndSendPage.submitNoDq();
        I.see(testData.claimRef);
        I.see('You’ve proposed a different repayment plan');
        I.click('My account');
        I.see(testData.claimRef);
        I.see('You need to send the defendant’s financial details to the court.');
    });
    Scenario('I can as a claimant accept and suggest an alternative payment intention with instalments @citizen @admissions @business', { retries: 3 }, async (I) => {
        const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.COMPANY, party_type_1.PartyType.INDIVIDUAL);
        testData.defenceType = defence_type_1.DefenceType.PART_ADMISSION_NONE_PAID;
        testData.paymentOption = payment_option_1.PaymentOption.IMMEDIATELY;
        const claimantResponseTestData = new ClaimantResponseTestData_1.ClaimantResponseTestData();
        // as defendant
        helperSteps.finishResponse(testData, false);
        I.click('Sign out');
        // as claimant
        userSteps.login(testData.claimantEmail);
        claimantResponseSteps.viewClaimFromDashboard(testData.claimRef);
        I.click('View and respond');
        claimantResponseSteps.acceptFullAdmitFromBusinessWithAlternativePaymentIntention(claimantResponseTestData);
        checkAndSendPage.verifyFactsForPartAdmitFromBusiness();
        checkAndSendPage.submitNoDq();
        I.see(testData.claimRef);
        I.see('You’ve proposed a different repayment plan');
        I.click('My account');
        I.see(testData.claimRef);
        I.see('You need to send the defendant’s financial details to the court.');
    });
}
