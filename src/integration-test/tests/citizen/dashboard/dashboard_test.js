"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const test_data_1 = require("integration-test/data/test-data");
const amountHelper_1 = require("integration-test/helpers/amountHelper");
const defendant_claim_details_1 = require("integration-test/tests/citizen/defence/pages/defendant-claim-details");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const userSteps = new user_1.UserSteps();
const dashboardClaimDetails = new defendant_claim_details_1.DashboardClaimDetails();
Feature('Dashboard');
Scenario('Check newly created claim is in my account dashboard with correct claim amount @citizen', { retries: 3 }, async (I) => {
    const email = userSteps.getClaimantEmail();
    const claimData = test_data_1.createClaimData(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    const claimRef = await I.createClaim(claimData, email);
    userSteps.login(email);
    I.waitForOpenClaim(claimRef);
    I.click('My account');
    I.see('Your money claims account');
    I.see(claimRef + ' ' + `${claimData.defendants[0].title} ${claimData.defendants[0].firstName} ${claimData.defendants[0].lastName}` + ' ' + amountHelper_1.AmountHelper.formatMoney(test_data_1.claimAmount.getTotal()));
    I.click(claimRef);
    I.see('Claim number:');
    I.see(claimRef);
    dashboardClaimDetails.clickViewClaim();
    dashboardClaimDetails.checkClaimData(claimRef, claimData);
});
