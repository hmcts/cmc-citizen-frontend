"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const test_data_1 = require("integration-test/data/test-data");
const helper_1 = require("integration-test/tests/citizen/endToEnd/steps/helper");
const defence_type_1 = require("integration-test/data/defence-type");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const helperSteps = new helper_1.Helper();
const userSteps = new user_1.UserSteps();
Feature('Respond to claim: handoff journey');
Scenario('I can see send your response by email page when I reject all of the claim with counter claim @citizen', { retries: 3 }, async (I) => {
    const claimantEmail = userSteps.getClaimantEmail();
    const defendantEmail = userSteps.getDefendantEmail();
    const claimData = test_data_1.createClaimData(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    const defendant = claimData.defendants[0];
    const claimant = claimData.claimants[0];
    const claimRef = await I.createClaim(claimData, claimantEmail, true, []);
    await helperSteps.enterPinNumber(claimRef, claimantEmail);
    helperSteps.finishResponseWithHandOff(claimRef, defendant, claimant, defendantEmail, defence_type_1.DefenceType.FULL_REJECTION_WITH_COUNTER_CLAIM);
});
Scenario('I can see send your response by email page when I reject all of the claim with amount paid less than claimed amount @nightly', { retries: 3 }, async (I) => {
    const claimantEmail = userSteps.getClaimantEmail();
    const defendantEmail = userSteps.getDefendantEmail();
    const claimData = test_data_1.createClaimData(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    const defendant = claimData.defendants[0];
    const claimant = claimData.claimants[0];
    const claimRef = await I.createClaim(claimData, claimantEmail, true, []);
    await helperSteps.enterPinNumber(claimRef, claimantEmail);
    helperSteps.finishResponseWithHandOff(claimRef, defendant, claimant, defendantEmail, defence_type_1.DefenceType.FULL_REJECTION_BECAUSE_ALREADY_PAID_LESS_THAN_CLAIMED_AMOUNT);
});
