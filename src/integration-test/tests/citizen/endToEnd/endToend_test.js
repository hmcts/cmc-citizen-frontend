"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const helper_1 = require("integration-test/tests/citizen/endToEnd/steps/helper");
const EndToEndTestData_1 = require("./data/EndToEndTestData");
const helperSteps = new helper_1.Helper();
Feature('E2E tests for Claim and Defence response');
// Warning : Changing the text description of this scenario, could cause failure when running ZAP security test
Scenario('I can as an Individual make a claim against an Individual Without a defendant email address and are able to pay on the Gov Pay page @citizen', { retries: 3 }, async (I) => {
    const testData = await EndToEndTestData_1.EndToEndTestData.prepareDataWithNoDefendantEmail(I, party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    helperSteps.finishResponse(testData, false, false);
});
Scenario('I can as Sole Trader make a claim against an Individual and are able to pay on the Gov Pay page @nightly', { retries: 3 }, async (I) => {
    const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.SOLE_TRADER, party_type_1.PartyType.INDIVIDUAL);
    helperSteps.finishResponse(testData);
});
Scenario('I can as a Individual make a claim against a Company and are able to pay on the Gov Pay page @nightly', { retries: 3 }, async (I) => {
    const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.COMPANY, party_type_1.PartyType.INDIVIDUAL);
    helperSteps.finishResponse(testData);
});
Scenario('I can as a Company make a claim against a company and are able to pay on the Gov Pay page @nightly', { retries: 3 }, async (I) => {
    const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.COMPANY, party_type_1.PartyType.COMPANY);
    helperSteps.finishResponse(testData);
});
Scenario('I can as a Organisation make a claim against an Individual and are able to pay on the Gov Pay page @nightly', { retries: 3 }, async (I) => {
    const testData = await EndToEndTestData_1.EndToEndTestData.prepareData(I, party_type_1.PartyType.ORGANISATION, party_type_1.PartyType.INDIVIDUAL);
    helperSteps.finishResponse(testData);
});
