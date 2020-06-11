"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRoutesSteps_1 = require("integration-test/tests/citizen/govukAccessRoutes/steps/accessRoutesSteps");
const party_type_1 = require("integration-test/data/party-type");
const test_data_1 = require("integration-test/data/test-data");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const accessRoutesSteps = new accessRoutesSteps_1.AccessRoutesSteps();
const userSteps = new user_1.UserSteps();
Feature('GovUK access routes - return to claim');
Scenario('I can enter a CCBC reference and get sent to MCOL @nightly', { retries: 3 }, (I) => {
    accessRoutesSteps.returnToClaimMcol();
});
Scenario('I can enter a moneyclaims reference and login to see the dashboard @citizen', { retries: 3 }, async (I) => {
    const claimantEmail = userSteps.getClaimantEmail();
    const claimRef = await I.createClaim(test_data_1.createClaimData(party_type_1.PartyType.SOLE_TRADER, party_type_1.PartyType.INDIVIDUAL), claimantEmail);
    accessRoutesSteps.returnToClaimMoneyClaims(claimRef, claimantEmail);
});
Scenario('I can select don’t have a claim number and choose to go to moneyclaims, login and see the dashboard @nightly', { retries: 3 }, async (I) => {
    const claimantEmail = userSteps.getClaimantEmail();
    await I.createClaim(test_data_1.createClaimData(party_type_1.PartyType.SOLE_TRADER, party_type_1.PartyType.INDIVIDUAL), claimantEmail);
    accessRoutesSteps.dontHaveAReferenceMoneyClaims(claimantEmail);
});
Scenario('I can select don’t have a claim number and choose to go to MCOL @nightly', { retries: 3 }, (I) => {
    accessRoutesSteps.dontHaveAReferenceMcol();
});
