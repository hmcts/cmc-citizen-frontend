"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const test_data_1 = require("integration-test/data/test-data");
const helper_1 = require("integration-test/tests/citizen/endToEnd/steps/helper");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const helperSteps = new helper_1.Helper();
const userSteps = new user_1.UserSteps();
class EndToEndTestData {
    static async prepareData(I, defendantPartyType, claimantPartyType) {
        const claimData = test_data_1.createClaimData(claimantPartyType, defendantPartyType);
        return this.prepare(I, defendantPartyType, claimantPartyType, claimData);
    }
    static async prepareDataWithNoDefendantEmail(I, defendantPartyType, claimantPartyType) {
        const claimData = test_data_1.createClaimData(claimantPartyType, defendantPartyType, false);
        return this.prepare(I, defendantPartyType, claimantPartyType, claimData);
    }
    static async prepare(I, defendantPartyType, claimantPartyType, claimData) {
        const claimantEmail = userSteps.getClaimantEmail();
        const defendantEmail = userSteps.getDefendantEmail();
        const claimRef = await I.createClaim(claimData, claimantEmail, true, ['admissions', 'directionsQuestionnaire'], 'cmc-new-features-consent-given');
        await helperSteps.enterPinNumber(claimRef, claimantEmail);
        const testData = new EndToEndTestData();
        testData.defendantClaimsToHavePaidInFull = true;
        testData.defendantName = (defendantPartyType === party_type_1.PartyType.INDIVIDUAL || party_type_1.PartyType.SOLE_TRADER) ?
            `${claimData.defendants[0].title} ${claimData.defendants[0].firstName} ${claimData.defendants[0].lastName}` :
            claimData.defendants[0].name;
        testData.defendant = claimData.defendants[0];
        testData.claimantName = claimData.claimants[0].name;
        testData.claimant = claimData.claimants[0];
        testData.claimRef = claimRef;
        testData.claimantEmail = claimantEmail;
        testData.defendantEmail = defendantEmail;
        testData.defendantPartyType = defendantPartyType;
        testData.claimantPartyType = claimantPartyType;
        return testData;
    }
}
exports.EndToEndTestData = EndToEndTestData;
