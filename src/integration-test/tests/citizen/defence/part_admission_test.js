"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_data_1 = require("integration-test/data/test-data");
const party_type_1 = require("integration-test/data/party-type");
const payment_option_1 = require("integration-test/data/payment-option");
const helper_1 = require("integration-test/tests/citizen/endToEnd/steps/helper");
const defence_1 = require("integration-test/tests/citizen/defence/steps/defence");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const helperSteps = new helper_1.Helper();
const defenceSteps = new defence_1.DefenceSteps();
const userSteps = new user_1.UserSteps();
async function prepareClaim(I) {
    const claimantEmail = userSteps.getClaimantEmail();
    const defendantEmail = userSteps.getDefendantEmail();
    const claimData = test_data_1.createClaimData(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    const claimRef = await I.createClaim(claimData, claimantEmail);
    await helperSteps.enterPinNumber(claimRef, claimantEmail);
    helperSteps.linkClaimToDefendant(defendantEmail);
    helperSteps.startResponseFromDashboard(claimRef);
    return { data: claimData };
}
if (process.env.FEATURE_ADMISSIONS === 'true') {
    Feature('Partially admit the claim');
    Scenario('I can complete the journey when I partially admit the claim with payment already made @citizen @admissions', { retries: 3 }, async (I) => {
        const claimData = await prepareClaim(I);
        defenceSteps.makePartialAdmission(claimData.data.defendants[0]);
        defenceSteps.partialPaymentMade(party_type_1.PartyType.INDIVIDUAL);
    });
    Scenario('I can complete the journey when I partially admit the claim with immediate payment @nightly @admissions', { retries: 3 }, async (I) => {
        const claimData = await prepareClaim(I);
        defenceSteps.makePartialAdmission(claimData.data.defendants[0]);
        defenceSteps.partialPaymentNotMade(party_type_1.PartyType.INDIVIDUAL, payment_option_1.PaymentOption.IMMEDIATELY);
    });
    Scenario('I can complete the journey when I partially admit the claim with by set date payment @citizen @admissions', { retries: 3 }, async (I) => {
        const claimData = await prepareClaim(I);
        defenceSteps.makePartialAdmission(claimData.data.defendants[0]);
        defenceSteps.partialPaymentNotMade(party_type_1.PartyType.INDIVIDUAL, payment_option_1.PaymentOption.BY_SET_DATE);
    });
    Scenario('I can complete the journey when I partially admit the claim with instalments payment @nightly @admissions', { retries: 3 }, async (I) => {
        const claimData = await prepareClaim(I);
        defenceSteps.makePartialAdmission(claimData.data.defendants[0]);
        defenceSteps.partialPaymentNotMade(party_type_1.PartyType.INDIVIDUAL, payment_option_1.PaymentOption.INSTALMENTS);
    });
}
