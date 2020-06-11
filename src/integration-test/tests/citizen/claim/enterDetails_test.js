"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claim_1 = require("integration-test/tests/citizen/claim/steps/claim");
const interest_1 = require("integration-test/tests/citizen/claim/steps/interest");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const party_type_1 = require("integration-test/data/party-type");
const payment_1 = require("integration-test/tests/citizen/claim/steps/payment");
const testingSupport_1 = require("integration-test/tests/citizen/testingSupport/steps/testingSupport");
const userSteps = new user_1.UserSteps();
const claimSteps = new claim_1.ClaimSteps();
const interestSteps = new interest_1.InterestSteps();
const paymentSteps = new payment_1.PaymentSteps();
const testingSupport = new testingSupport_1.TestingSupportSteps();
Feature('Claimant Enter details of claim');
Scenario('I can prepare a claim with no interest @citizen', { retries: 3 }, async (I) => {
    userSteps.login(userSteps.getClaimantEmail());
    if (process.env.FEATURE_TESTING_SUPPORT === 'true') {
        testingSupport.deleteClaimDraft();
    }
    claimSteps.completeEligibility();
    claimSteps.completeStartOfClaimJourney(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL, true);
    interestSteps.skipClaimInterest();
    I.see('Total amount you’re claiming');
    I.click('summary');
    I.see('Claim amount Claim fee Hearing fee');
    I.see('£0.01 to £300 £25 £25');
    I.see('£300.01 to £500 £35 £55');
    I.see('£500.01 to £1,000 £60 £80');
    I.see('£1,000.01 to £1,500 £70 £115');
    I.see('£1,500.01 to £3,000 £105 £170');
    I.see('£3,000.01 to £5,000 £185 £335');
    I.see('£5,000.01 to £10,000 £410 £335');
    interestSteps.skipClaimantInterestTotalPage();
    I.see('Prepare your claim');
    claimSteps.enterClaimDetails();
    userSteps.selectCheckAndSubmitYourClaim();
    I.see('£80.50');
    I.see('I don’t want to claim interest');
    claimSteps.checkClaimFactsAreTrueAndSubmit(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL, true);
    paymentSteps.enterWorkingCard();
    paymentSteps.cancelPaymentFromConfirmationPage();
    I.waitForText('Your payment has been cancelled');
    paymentSteps.goBackToServiceFromConfirmationPage();
    claimSteps.checkClaimFactsAreTrueAndSubmit(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    paymentSteps.payWithDeclinedCard();
    I.waitForText('Your payment has been declined');
    paymentSteps.goBackToServiceFromConfirmationPage();
    claimSteps.checkClaimFactsAreTrueAndSubmit(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL);
    paymentSteps.payWithWorkingCard();
    I.waitForText('Claim submitted');
});
Scenario('I can prepare a claim with different interest rate and date @citizen', { retries: 3 }, async (I) => {
    userSteps.login(userSteps.getClaimantEmail());
    if (process.env.FEATURE_TESTING_SUPPORT === 'true') {
        testingSupport.deleteClaimDraft();
    }
    claimSteps.completeEligibility();
    claimSteps.completeStartOfClaimJourney(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL, true);
    interestSteps.enterSpecificInterestRateAndDate(2, '1990-01-01');
    I.see('Total amount you’re claiming');
    interestSteps.skipClaimantInterestTotalPage();
    I.see('Prepare your claim');
    claimSteps.enterClaimDetails();
    userSteps.selectCheckAndSubmitYourClaim();
    I.see('£80.50');
    if (process.env.FEATURE_TESTING_SUPPORT === 'true') {
        testingSupport.deleteClaimDraft();
    }
});
Scenario('I can prepare a claim with a manually entered interest amount and a daily amount added @citizen', { retries: 3 }, async (I) => {
    userSteps.login(userSteps.getClaimantEmail());
    if (process.env.FEATURE_TESTING_SUPPORT === 'true') {
        testingSupport.deleteClaimDraft();
    }
    claimSteps.completeEligibility();
    claimSteps.completeStartOfClaimJourney(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL, true);
    interestSteps.enterBreakdownInterestAmountAndDailyAmount();
    I.see('Total amount you’re claiming');
    interestSteps.skipClaimantInterestTotalPage();
    I.see('Prepare your claim');
    claimSteps.enterClaimDetails();
    userSteps.selectCheckAndSubmitYourClaim();
    I.see('£80.50');
    I.see('Break down interest for different time periods or items');
    I.see('Show how you calculated the amount');
    if (process.env.FEATURE_TESTING_SUPPORT === 'true') {
        testingSupport.deleteClaimDraft();
    }
});
// The @citizen-smoke-test tag used for running smoke tests with pre-registered user
Scenario('I can enter a claim details and navigate up to payment page @smoke-test', { retries: 3 }, (I) => {
    claimSteps.makeAClaimAndNavigateUpToPayment();
});
