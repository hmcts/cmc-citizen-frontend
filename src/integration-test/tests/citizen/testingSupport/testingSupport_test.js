"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimant_check_and_send_1 = require("integration-test/tests/citizen/claim/pages/claimant-check-and-send");
const payment_1 = require("integration-test/tests/citizen/claim/steps/payment");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const testingSupport_1 = require("integration-test/tests/citizen/testingSupport/steps/testingSupport");
const userSteps = new user_1.UserSteps();
const testingSupportSteps = new testingSupport_1.TestingSupportSteps();
const paymentSteps = new payment_1.PaymentSteps();
const claimantCheckAndSendPage = new claimant_check_and_send_1.ClaimantCheckAndSendPage();
Feature('Testing support');
Scenario('I create a claim draft using testing support and submit it @nightly', { retries: 3 }, async (I) => {
    const email = userSteps.getClaimantEmail();
    userSteps.login(email);
    testingSupportSteps.createClaimDraft();
    claimantCheckAndSendPage.checkFactsTrueAndSubmit();
    paymentSteps.payWithWorkingCard();
    I.waitForText('Claim submitted');
});
