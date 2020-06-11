"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const helper_1 = require("integration-test/tests/citizen/endToEnd/steps/helper");
const EndToEndTestData_1 = require("./data/EndToEndTestData");
const defence_type_1 = require("integration-test/data/defence-type");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const claimant_reponse_1 = require("integration-test/tests/citizen/claimantResponse/steps/claimant-reponse");
const test_data_1 = require("integration-test/data/test-data");
const defendant_claim_details_1 = require("integration-test/tests/citizen/defence/pages/defendant-claim-details");
const ClaimantResponseTestData_1 = require("integration-test/tests/citizen/claimantResponse/data/ClaimantResponseTestData");
const defendant_1 = require("integration-test/tests/citizen/claimantResponse/steps/defendant");
const claimant_check_and_send_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send");
const helperSteps = new helper_1.Helper();
const userSteps = new user_1.UserSteps();
const claimantResponseSteps = new claimant_reponse_1.ClaimantResponseSteps();
const defendantDetails = new defendant_claim_details_1.DashboardClaimDetails();
const defendantResponseSteps = new defendant_1.DefendantResponseSteps();
const checkAndSendPage = new claimant_check_and_send_1.ClaimantCheckAndSendPage();
Feature('E2E tests for defence journeys');
Scenario('I can as an Individual make a claim against an Individual who then fully defends and I proceed with the claim @citizen', { retries: 3 }, async (I) => {
    const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    const claimData = test_data_1.createClaimData(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    testData.defenceType = defence_type_1.DefenceType.FULL_REJECTION_WITH_DISPUTE;
    testData.defendantClaimsToHavePaidInFull = true;
    helperSteps.finishResponse(testData);
    I.see(testData.claimRef);
    // check dashboard
    I.click('My account');
    // check status
    I.click(testData.claimRef);
    I.see(testData.claimRef);
    I.see('Your response to the claim');
    I.see('You have rejected the claim');
    defendantDetails.clickViewClaim();
    defendantDetails.checkClaimData(testData.claimRef, claimData);
    I.click('Sign out');
    // as claimant
    userSteps.login(testData.claimantEmail);
    claimantResponseSteps.viewClaimFromDashboard(testData.claimRef);
    I.see(testData.claimRef);
    I.see('Decide whether to proceed');
    I.see('Mrs. Rose Smith has rejected your claim.');
    I.click('View and respond');
    claimantResponseSteps.decideToProceed();
    checkAndSendPage.checkFactsTrueAndSubmit(testData.defenceType);
    I.see('You’ve rejected their response');
});
Scenario('I can as an Individual make a claim against an Individual who then fully defends and I accept their response @nightly', { retries: 3 }, async (I) => {
    const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    const claimData = test_data_1.createClaimData(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    testData.defenceType = defence_type_1.DefenceType.FULL_REJECTION_WITH_DISPUTE;
    testData.defendantClaimsToHavePaidInFull = true;
    helperSteps.finishResponse(testData);
    I.see(testData.claimRef);
    // check dashboard
    I.click('My account');
    // check status
    I.click(testData.claimRef);
    I.see(testData.claimRef);
    I.see('Your response to the claim');
    I.see('You have rejected the claim');
    defendantDetails.clickViewClaim();
    defendantDetails.checkClaimData(testData.claimRef, claimData);
    I.click('Sign out');
    // as claimant
    userSteps.login(testData.claimantEmail);
    claimantResponseSteps.viewClaimFromDashboard(testData.claimRef);
    I.see(testData.claimRef);
    I.see('Decide whether to proceed');
    I.see('Mrs. Rose Smith has rejected your claim.');
    I.click('View and respond');
    claimantResponseSteps.decideNotToProceed();
});
Scenario('I can as an Individual make a claim against an Individual who then fully rejects the claim as they have already paid the full amount and I proceed with the claim @citizen', { retries: 3 }, async (I) => {
    const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    testData.defenceType = defence_type_1.DefenceType.FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID;
    helperSteps.finishResponse(testData);
    I.click('My account');
    I.see(testData.claimRef);
    I.click(testData.claimRef);
    I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim`);
    I.click('Sign out');
    // as claimant
    userSteps.login(testData.claimantEmail);
    claimantResponseSteps.viewClaimFromDashboard(testData.claimRef);
    I.see(testData.claimRef);
    I.see('Decide whether to proceed');
    I.see('Mrs. Rose Smith has rejected your claim.');
    I.click('View and respond');
    claimantResponseSteps.rejectFullDefencePaidFullAmount(testData);
    I.see('You’ve rejected their response');
});
Scenario('I can as an Individual make a claim against an Individual who then rejects the claim as they have paid the full amount then I accept the defence @nightly', { retries: 3 }, async (I) => {
    const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    const claimantResponseTestData = new ClaimantResponseTestData_1.ClaimantResponseTestData();
    claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation = {
        paidAmount: 105.5,
        date: '2018-01-01',
        explanation: 'My explanation...'
    };
    // as defendant
    defendantResponseSteps.disputeClaimAsAlreadyPaid(testData, claimantResponseTestData, true);
    I.see(testData.claimRef);
    I.see(`You told us you’ve paid £105.50. We’ve sent ${testData.claimantName} this response`);
    // check dashboard
    I.click('My account');
    I.see('Wait for the claimant to respond');
    // check status
    I.click(testData.claimRef);
    I.see(testData.claimRef);
    I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim.`);
    I.click('Sign out');
    // as claimant
    userSteps.login(testData.claimantEmail);
    claimantResponseSteps.viewClaimFromDashboard(testData.claimRef);
    // check dashboard
    I.click('My account');
    I.see(testData.claimRef);
    I.see('Decide whether to proceed');
    I.click(testData.claimRef);
    I.see(testData.claimRef);
    I.see(`${testData.defendantName} has rejected your claim.`);
    I.click('View and respond');
    claimantResponseSteps.acceptFullDefencePaidFullAmount(testData);
    I.click('Sign out');
});
Scenario('I can as an Individual make a claim against an Individual who then rejects the claim as they have paid less than the amount claimed and I then accept their defence @nightly', { retries: 3 }, async (I) => {
    const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    const claimantResponseTestData = new ClaimantResponseTestData_1.ClaimantResponseTestData();
    claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation = {
        paidAmount: 50,
        date: '2018-01-01',
        explanation: 'My explanation...'
    };
    // as defendant
    defendantResponseSteps.disputeClaimAsAlreadyPaid(testData, claimantResponseTestData, false);
    I.see(testData.claimRef);
    I.see(`You told us you’ve paid the £${Number(50).toLocaleString()} you believe you owe. We’ve sent ${testData.claimantName} this response.`);
    // check dashboard
    I.click('My account');
    I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim.`);
    // check status
    I.click(testData.claimRef);
    I.see(testData.claimRef);
    I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim.`);
    I.click('Sign out');
    // as claimant
    userSteps.login(testData.claimantEmail);
    I.see(`Respond to the defendant.`);
    claimantResponseSteps.viewClaimFromDashboard(testData.claimRef);
    I.see(testData.claimRef);
    I.see('Respond to the defendant');
    I.see(`${testData.defendantName} says they paid you £50 on 1 January 2018.`);
    I.click('Respond');
    claimantResponseSteps.acceptFullDefencePaidLessThanFullAmount();
    I.click('Sign out');
});
Scenario('I can as an Individual make a claim against an Individual who then rejects the claim as they have paid less than the amount claimed and I then proceed with the claim @citizen', { retries: 3 }, async (I) => {
    const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    const claimantResponseTestData = new ClaimantResponseTestData_1.ClaimantResponseTestData();
    claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation = {
        paidAmount: 50,
        date: '2018-01-01',
        explanation: 'My explanation...'
    };
    // as defendant
    defendantResponseSteps.disputeClaimAsAlreadyPaid(testData, claimantResponseTestData, false);
    I.see(testData.claimRef);
    I.see(`You told us you’ve paid the £${Number(50).toLocaleString()} you believe you owe. We’ve sent ${testData.claimantName} this response.`);
    // check dashboard
    I.click('My account');
    I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim.`);
    // check status
    I.click(testData.claimRef);
    I.see(testData.claimRef);
    I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim.`);
    I.click('Sign out');
    // as claimant
    userSteps.login(testData.claimantEmail);
    I.see(`Respond to the defendant.`);
    claimantResponseSteps.viewClaimFromDashboard(testData.claimRef);
    I.see(testData.claimRef);
    I.see('Respond to the defendant');
    I.see(`${testData.defendantName} says they paid you £50 on 1 January 2018.`);
    I.click('Respond');
    claimantResponseSteps.rejectFullDefencePaidLessThanFullAmount(testData);
    I.click('Sign out');
});
