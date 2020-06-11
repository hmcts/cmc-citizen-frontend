"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const test_data_1 = require("integration-test/data/test-data");
const citizen_completing_claim_info_1 = require("integration-test/tests/citizen/claim/pages/citizen-completing-claim-info");
const citizen_dob_1 = require("integration-test/tests/citizen/claim/pages/citizen-dob");
const citizen_email_1 = require("integration-test/tests/citizen/claim/pages/citizen-email");
const citizen_phone_1 = require("integration-test/tests/citizen/claim/pages/citizen-phone");
const citizen_resolve_dispute_1 = require("integration-test/tests/citizen/claim/pages/citizen-resolve-dispute");
const claimant_check_and_send_1 = require("integration-test/tests/citizen/claim/pages/claimant-check-and-send");
const claimant_claim_amount_1 = require("integration-test/tests/citizen/claim/pages/claimant-claim-amount");
const claimant_claim_confirmed_1 = require("integration-test/tests/citizen/claim/pages/claimant-claim-confirmed");
const claimant_reason_1 = require("integration-test/tests/citizen/claim/pages/claimant-reason");
const company_details_1 = require("integration-test/tests/citizen/claim/pages/company-details");
const individual_details_1 = require("integration-test/tests/citizen/claim/pages/individual-details");
const organisation_details_1 = require("integration-test/tests/citizen/claim/pages/organisation-details");
const party_type_2 = require("integration-test/tests/citizen/claim/pages/party-type");
const eligibility_1 = require("integration-test/tests/citizen/claim/steps/eligibility");
const interest_1 = require("integration-test/tests/citizen/claim/steps/interest");
const payment_1 = require("integration-test/tests/citizen/claim/steps/payment");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const claimant_timeline_1 = require("integration-test/tests/citizen/claim/pages/claimant-timeline");
const claimant_evidence_1 = require("integration-test/tests/citizen/claim/pages/claimant-evidence");
const amountHelper_1 = require("integration-test/helpers/amountHelper");
const new_features_1 = require("integration-test/tests/citizen/claim/pages/new-features");
const testingSupport_1 = require("integration-test/tests/citizen/testingSupport/steps/testingSupport");
const I = actor();
const citizenResolveDisputePage = new citizen_resolve_dispute_1.CitizenResolveDisputePage();
const citizenCompletingClaimInfoPage = new citizen_completing_claim_info_1.CitizenCompletingClaimInfoPage();
const partyTypePage = new party_type_2.PartyTypePage();
const companyDetailsPage = new company_details_1.CompanyDetailsPage();
const individualDetailsPage = new individual_details_1.IndividualDetailsPage();
const organisationDetailsPage = new organisation_details_1.OrganisationDetailsPage();
const citizenDOBPage = new citizen_dob_1.CitizenDobPage();
const citizenPhonePage = new citizen_phone_1.CitizenPhonePage();
const citizenEmailPage = new citizen_email_1.CitizenEmailPage();
const claimantClaimAmountPage = new claimant_claim_amount_1.ClaimantClaimAmountPage();
const claimantReasonPage = new claimant_reason_1.ClaimantReasonPage();
const claimantTimelinePage = new claimant_timeline_1.ClaimantTimelinePage();
const claimantEvidencePage = new claimant_evidence_1.ClaimantEvidencePage();
const claimantCheckAndSendPage = new claimant_check_and_send_1.ClaimantCheckAndSendPage();
const claimantClaimConfirmedPage = new claimant_claim_confirmed_1.ClaimantClaimConfirmedPage();
const newFeaturesPage = new new_features_1.NewFeaturesPage();
const testingSupport = new testingSupport_1.TestingSupportSteps();
const userSteps = new user_1.UserSteps();
const interestSteps = new interest_1.InterestSteps();
const eligibilitySteps = new eligibility_1.EligibilitySteps();
const paymentSteps = new payment_1.PaymentSteps();
class ClaimSteps {
    enterTestDataClaimAmount() {
        claimantClaimAmountPage.enterAmount(test_data_1.claimAmount.rows[0].amount, test_data_1.claimAmount.rows[1].amount, test_data_1.claimAmount.rows[2].amount);
    }
    resolveDispute() {
        citizenResolveDisputePage.confirmRead();
    }
    readCompletingYourClaim() {
        citizenCompletingClaimInfoPage.confirmRead();
    }
    enterMyDetails(claimantType) {
        const claimant = test_data_1.createClaimant(claimantType);
        switch (claimantType) {
            case party_type_1.PartyType.INDIVIDUAL:
                partyTypePage.selectIndividual();
                individualDetailsPage.enterName(claimant.name);
                individualDetailsPage.enterAddresses(claimant.address, claimant.correspondenceAddress);
                individualDetailsPage.submit();
                citizenDOBPage.enterDOB(claimant.dateOfBirth);
                break;
            case party_type_1.PartyType.SOLE_TRADER:
                partyTypePage.selectSoleTrader();
                individualDetailsPage.enterName(claimant.name);
                individualDetailsPage.enterAddresses(claimant.address, claimant.correspondenceAddress);
                individualDetailsPage.submit();
                break;
            case party_type_1.PartyType.COMPANY:
                partyTypePage.selectCompany();
                companyDetailsPage.enterCompanyName(claimant.name);
                companyDetailsPage.enterContactPerson(claimant.contactPerson);
                companyDetailsPage.enterAddresses(claimant.address, claimant.correspondenceAddress);
                companyDetailsPage.submit();
                break;
            case party_type_1.PartyType.ORGANISATION:
                partyTypePage.selectOrganisationl();
                organisationDetailsPage.enterOrganisationName(claimant.name);
                organisationDetailsPage.enterContactPerson(claimant.contactPerson);
                organisationDetailsPage.enterAddresses(claimant.address, claimant.correspondenceAddress);
                organisationDetailsPage.submit();
                break;
            default:
                throw new Error('non-matching claimant type for claim');
        }
        citizenPhonePage.enterPhone(claimant.phone);
    }
    enterTheirDetails(defendantType, enterDefendantEmail = true, byLookup = false) {
        const defendant = test_data_1.createDefendant(defendantType, enterDefendantEmail);
        let manualEntryLink = true;
        switch (defendantType) {
            case party_type_1.PartyType.INDIVIDUAL:
                partyTypePage.selectIndividual();
                individualDetailsPage.enterTitle(defendant.title);
                individualDetailsPage.enterFirstName(defendant.firstName);
                individualDetailsPage.enterLastName(defendant.lastName);
                if (byLookup) {
                    individualDetailsPage.lookupAddress(test_data_1.postcodeLookupQuery);
                    manualEntryLink = false;
                }
                individualDetailsPage.enterAddress(defendant.address, manualEntryLink);
                individualDetailsPage.submit();
                break;
            case party_type_1.PartyType.SOLE_TRADER:
                partyTypePage.selectSoleTrader();
                individualDetailsPage.enterFirstName(defendant.firstName);
                individualDetailsPage.enterLastName(defendant.lastName);
                if (byLookup) {
                    individualDetailsPage.lookupAddress(test_data_1.postcodeLookupQuery);
                    manualEntryLink = false;
                }
                individualDetailsPage.enterAddress(defendant.address, manualEntryLink);
                individualDetailsPage.submit();
                break;
            case party_type_1.PartyType.COMPANY:
                partyTypePage.selectCompany();
                companyDetailsPage.enterCompanyName(defendant.name);
                if (byLookup) {
                    individualDetailsPage.lookupAddress(test_data_1.postcodeLookupQuery);
                    manualEntryLink = false;
                }
                companyDetailsPage.enterAddress(defendant.address, manualEntryLink);
                companyDetailsPage.submit();
                break;
            case party_type_1.PartyType.ORGANISATION:
                partyTypePage.selectOrganisationl();
                organisationDetailsPage.enterOrganisationName(defendant.name);
                if (byLookup) {
                    individualDetailsPage.lookupAddress(test_data_1.postcodeLookupQuery);
                    manualEntryLink = false;
                }
                organisationDetailsPage.enterAddress(defendant.address, manualEntryLink);
                organisationDetailsPage.submit();
                break;
            default:
                throw new Error('non-matching defendant Type type for claim');
        }
        if (enterDefendantEmail) {
            citizenEmailPage.enterEmail(defendant.email);
        }
        else {
            citizenEmailPage.submitForm();
        }
        citizenPhonePage.enterPhone(defendant.phone);
    }
    enterClaimAmount(amount1, amount2, amount3) {
        claimantClaimAmountPage.enterAmount(amount1, amount2, amount3);
    }
    claimantTotalAmountPageRead() {
        claimantClaimAmountPage.continue();
    }
    enterClaimReason() {
        claimantReasonPage.enterReason(test_data_1.claimReason);
    }
    enterClaimTimeline() {
        claimantTimelinePage.enterTimelineRow('may', 'ok');
    }
    enterClaimEvidence() {
        claimantEvidencePage.enterEvidenceRow('CONTRACTS_AND_AGREEMENTS', 'ok');
    }
    checkClaimFactsAreTrueAndSubmit(claimantType, defendantType, enterDefendantEmail = true) {
        claimantCheckAndSendPage.verifyCheckAndSendAnswers(claimantType, defendantType, enterDefendantEmail);
        if (claimantType === party_type_1.PartyType.COMPANY || claimantType === party_type_1.PartyType.ORGANISATION) {
            claimantCheckAndSendPage.signStatementOfTruthAndSubmit('Jonny', 'Director');
        }
        else {
            claimantCheckAndSendPage.checkFactsTrueAndSubmit();
        }
    }
    makeAClaimAndSubmitStatementOfTruth(email, claimantType, defendantType, enterDefendantEmail = true) {
        userSteps.login(email);
        if (process.env.FEATURE_TESTING_SUPPORT === 'true') {
            testingSupport.deleteClaimDraft();
        }
        this.completeEligibility();
        userSteps.selectResolvingThisDispute();
        this.resolveDispute();
        userSteps.selectCompletingYourClaim();
        this.readCompletingYourClaim();
        userSteps.selectYourDetails();
        this.enterMyDetails(claimantType);
        userSteps.selectTheirDetails();
        this.enterTheirDetails(defendantType, enterDefendantEmail);
        userSteps.selectClaimAmount();
        this.enterTestDataClaimAmount();
        this.claimantTotalAmountPageRead();
        interestSteps.enterDefaultInterest();
        I.see('Total amount you’re claiming');
        I.see(amountHelper_1.AmountHelper.formatMoney(test_data_1.claimAmount.getClaimTotal()), 'table.table-form > tbody > tr:nth-of-type(1) >td.numeric.last > span');
        I.see(amountHelper_1.AmountHelper.formatMoney(test_data_1.claimAmount.getTotal()), 'table.table-form > tfoot > tr > td.numeric.last > span');
        interestSteps.skipClaimantInterestTotalPage();
        this.enterClaimDetails();
        userSteps.selectCheckAndSubmitYourClaim();
        this.checkClaimFactsAreTrueAndSubmit(claimantType, defendantType, enterDefendantEmail);
    }
    makeAClaimAndSubmit(email, claimantType, defendantType, enterDefendantEmail = true) {
        this.makeAClaimAndSubmitStatementOfTruth(email, claimantType, defendantType, enterDefendantEmail);
        paymentSteps.payWithWorkingCard();
        I.waitForText('Claim submitted');
        return claimantClaimConfirmedPage.getClaimReference();
    }
    completeEligibility() {
        eligibilitySteps.complete();
    }
    optIntoNewFeatures() {
        newFeaturesPage.optIn();
    }
    makeAClaimAndNavigateUpToPayment() {
        const claimant = test_data_1.createClaimant(party_type_1.PartyType.INDIVIDUAL);
        const defendant = test_data_1.createDefendant(party_type_1.PartyType.INDIVIDUAL, true);
        userSteps.loginWithPreRegisteredUser(test_data_1.SMOKE_TEST_CITIZEN_USERNAME, test_data_1.SMOKE_TEST_USER_PASSWORD);
        if (process.env.FEATURE_TESTING_SUPPORT === 'true') {
            testingSupport.deleteClaimDraft();
        }
        this.completeEligibility();
        userSteps.selectResolvingThisDispute();
        this.resolveDispute();
        userSteps.selectCompletingYourClaim();
        this.readCompletingYourClaim();
        userSteps.selectYourDetails();
        partyTypePage.selectIndividual();
        individualDetailsPage.enterName(claimant.name);
        individualDetailsPage.lookupAddress(test_data_1.postcodeLookupQuery);
        individualDetailsPage.enterAddress(claimant.address, false);
        individualDetailsPage.submit();
        citizenDOBPage.enterDOB(claimant.dateOfBirth);
        citizenPhonePage.enterPhone(claimant.phone);
        userSteps.selectTheirDetails();
        partyTypePage.selectIndividual();
        individualDetailsPage.enterTitle(defendant.title);
        individualDetailsPage.enterFirstName(defendant.firstName);
        individualDetailsPage.enterLastName(defendant.lastName);
        individualDetailsPage.lookupAddress(test_data_1.postcodeLookupQuery);
        individualDetailsPage.enterAddress(defendant.address, false);
        individualDetailsPage.submit();
        citizenEmailPage.enterEmail(defendant.email);
        citizenPhonePage.enterPhone(claimant.phone);
        userSteps.selectClaimAmount();
        I.see('Claim amount');
        this.enterClaimAmount(10, 20.50, 50);
        I.see('£80.50');
        this.claimantTotalAmountPageRead();
        I.see('Do you want to claim interest?');
        interestSteps.enterDefaultInterest();
        I.see('Total amount you’re claiming');
        I.see('£25');
        I.see(amountHelper_1.AmountHelper.formatMoney(test_data_1.claimAmount.getClaimTotal()), 'table.table-form > tbody > tr:nth-of-type(1) >td.numeric.last > span');
        I.see(amountHelper_1.AmountHelper.formatMoney(test_data_1.claimAmount.getTotal()), 'table.table-form > tfoot > tr > td.numeric.last > span');
        interestSteps.skipClaimantInterestTotalPage();
        this.enterClaimDetails();
        userSteps.selectCheckAndSubmitYourClaim();
        I.see('John Smith');
        I.see('10, DALBERG');
        I.see('LONDON');
        I.see('SW2 1AN');
        I.see('07700000001');
        I.see(test_data_1.claimReason);
        claimantCheckAndSendPage.verifyDefendantCheckAndSendAnswers(party_type_1.PartyType.INDIVIDUAL, true);
        claimantCheckAndSendPage.verifyClaimAmount();
        if (!process.env.CITIZEN_APP_URL.includes('sprod')) {
            claimantCheckAndSendPage.checkFactsTrueAndSubmit();
            I.waitForText('Enter card details');
        }
    }
    completeStartOfClaimJourney(claimantType, defendantType, enterDefendantEmail = true) {
        userSteps.selectResolvingThisDispute();
        this.resolveDispute();
        userSteps.selectCompletingYourClaim();
        this.readCompletingYourClaim();
        userSteps.selectYourDetails();
        this.enterMyDetails(claimantType);
        userSteps.selectTheirDetails();
        this.enterTheirDetails(defendantType, enterDefendantEmail, true);
        userSteps.selectClaimAmount();
        I.see('Claim amount');
        this.enterClaimAmount(10, 20.50, 50);
        I.see('£80.50');
        this.claimantTotalAmountPageRead();
        I.see('Do you want to claim interest?');
    }
    enterClaimDetails() {
        userSteps.selectClaimDetails();
        this.enterClaimReason();
        this.enterClaimTimeline();
        this.enterClaimEvidence();
    }
}
exports.ClaimSteps = ClaimSteps;
