"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const test_data_1 = require("integration-test/data/test-data");
const accessRoutesSteps_1 = require("integration-test/tests/citizen/govukAccessRoutes/steps/accessRoutesSteps");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const accessRoutesSteps = new accessRoutesSteps_1.AccessRoutesSteps();
const userSteps = new user_1.UserSteps();
Feature('GovUK access routes - respond to claim');
Scenario('I can enter a CCBC reference and get sent to MCOL @nightly', { retries: 3 }, (I) => {
    accessRoutesSteps.respondToClaimMcol();
});
Scenario('I can enter a moneyclaims reference and get sent to enter a pin @nightly', { retries: 3 }, async (I) => {
    const claimantEmail = userSteps.getClaimantEmail();
    const claimRef = await I.createClaim(test_data_1.createClaimData(party_type_1.PartyType.SOLE_TRADER, party_type_1.PartyType.INDIVIDUAL), claimantEmail, false);
    accessRoutesSteps.respondToClaimMoneyClaims(claimRef);
});
