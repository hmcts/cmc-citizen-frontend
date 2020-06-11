"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_option_1 = require("integration-test/data/payment-option");
const test_data_1 = require("integration-test/data/test-data");
const defendant_check_and_send_1 = require("integration-test/tests/citizen/defence/pages/defendant-check-and-send");
const defendant_defence_type_1 = require("integration-test/tests/citizen/defence/pages/defendant-defence-type");
const defendant_dob_1 = require("integration-test/tests/citizen/defence/pages/defendant-dob");
const defendant_enter_claim_pin_number_1 = require("integration-test/tests/citizen/defence/pages/defendant-enter-claim-pin-number");
const defendant_enter_claim_reference_1 = require("integration-test/tests/citizen/defence/pages/defendant-enter-claim-reference");
const defendant_how_much_have_you_paid_1 = require("integration-test/tests/citizen/defence/pages/defendant-how-much-have-you-paid");
const defendant_impact_of_dispute_1 = require("integration-test/tests/citizen/defence/pages/defendant-impact-of-dispute");
const defendant_more_time_request_1 = require("integration-test/tests/citizen/defence/pages/defendant-more-time-request");
const defendant_name_and_address_1 = require("integration-test/tests/citizen/defence/pages/defendant-name-and-address");
const defendant_payment_date_1 = require("integration-test/tests/citizen/defence/pages/defendant-payment-date");
const defendant_payment_plan_1 = require("integration-test/tests/citizen/defence/pages/defendant-payment-plan");
// import { DefendantRegisterPage } from 'integration-test/tests/citizen/defence/pages/defendant-register'
const defendant_reject_all_of_claim_1 = require("integration-test/tests/citizen/defence/pages/defendant-reject-all-of-claim");
const defendant_start_1 = require("integration-test/tests/citizen/defence/pages/defendant-start");
const defendant_task_list_1 = require("integration-test/tests/citizen/defence/pages/defendant-task-list");
const defendant_timeline_events_1 = require("integration-test/tests/citizen/defence/pages/defendant-timeline-events");
const defendant_view_claim_1 = require("integration-test/tests/citizen/defence/pages/defendant-view-claim");
const defendant_when_will_you_pay_1 = require("integration-test/tests/citizen/defence/pages/defendant-when-will-you-pay");
const defendant_your_defence_1 = require("integration-test/tests/citizen/defence/pages/defendant-your-defence");
const defendant_more_time_confirmation_1 = require("integration-test/tests/citizen/defence/pages/defendant-more-time-confirmation");
const defendant_send_company_financial_details_1 = require("integration-test/tests/citizen/defence/pages/defendant-send-company-financial-details");
const statementOfMeans_1 = require("integration-test/tests/citizen/defence/steps/statementOfMeans");
const login_1 = require("integration-test/tests/citizen/home/pages/login");
const defendant_1 = require("integration-test/tests/citizen/home/steps/defendant");
const party_type_1 = require("integration-test/data/party-type");
const defence_type_1 = require("integration-test/data/defence-type");
const claimStoreClient_1 = require("integration-test/helpers/clients/claimStoreClient");
const idamClient_1 = require("integration-test/helpers/clients/idamClient");
const defendant_evidence_1 = require("integration-test/tests/citizen/defence/pages/defendant-evidence");
const already_paid_1 = require("integration-test/tests/citizen/defence/pages/statement-of-means/already-paid");
const defendant_have_you_paid_the_claimant_the_amount_you_admit_you_owe_1 = require("integration-test/tests/citizen/defence/pages/defendant-have-you-paid-the-claimant-the-amount-you-admit-you-owe");
const defendant_how_much_you_owe_1 = require("integration-test/tests/citizen/defence/pages/defendant-how-much-you-owe");
const mediation_1 = require("integration-test/tests/citizen/mediation/steps/mediation");
const defendant_phone_1 = require("integration-test/tests/citizen/defence/pages/defendant-phone");
const I = actor();
const defendantStartPage = new defendant_start_1.DefendantStartPage();
const defendantEnterClaimRefPage = new defendant_enter_claim_reference_1.DefendantEnterClaimReferencePage();
const defendantEnterPinPage = new defendant_enter_claim_pin_number_1.DefendantEnterClaimPinNumberPage();
const defendantViewClaimPage = new defendant_view_claim_1.DefendantViewClaimPage();
// const defendantRegisterPage: DefendantRegisterPage = new DefendantRegisterPage()
const defendantNameAndAddressPage = new defendant_name_and_address_1.DefendantNameAndAddressPage();
const defendantDobPage = new defendant_dob_1.DefendantDobPage();
const defendantPhonePage = new defendant_phone_1.DefendantPhonePage();
const defendantMoreTimeRequestPage = new defendant_more_time_request_1.DefendantMoreTimeRequestPage();
const defendantDefenceTypePage = new defendant_defence_type_1.DefendantDefenceTypePage();
const defendantRejectAllOfClaimPage = new defendant_reject_all_of_claim_1.DefendantRejectAllOfClaimPage();
const defendantYourDefencePage = new defendant_your_defence_1.DefendantYourDefencePage();
const alreadyPaidPage = new already_paid_1.AlreadyPaidPage();
const defendantCheckAndSendPage = new defendant_check_and_send_1.DefendantCheckAndSendPage();
const defendantHowMuchHaveYouPaidTheClaimant = new defendant_how_much_have_you_paid_1.DefendantHowMuchHaveYouPaidPage();
const defendantTimelineOfEventsPage = new defendant_timeline_events_1.DefendantTimelineEventsPage();
const defendantEvidencePage = new defendant_evidence_1.DefendantEvidencePage();
const defendantImpactOfDisputePage = new defendant_impact_of_dispute_1.DefendantImpactOfDisputePage();
const defendantMoreTimeConfirmationPage = new defendant_more_time_confirmation_1.DefendantMoreTimeConfirmationPage();
const loginPage = new login_1.LoginPage();
const defendantTaskListPage = new defendant_task_list_1.DefendantTaskListPage();
const defendantPaymentDatePage = new defendant_payment_date_1.DefendantPaymentDatePage();
const defendantPaymentPlanPage = new defendant_payment_plan_1.DefendantPaymentPlanPage();
const defendantWhenWillYouPage = new defendant_when_will_you_pay_1.DefendantWhenWillYouPayPage();
const sendCompanyDetailsPage = new defendant_send_company_financial_details_1.DefendantSendCompanyFinancialDetails();
const defendantSteps = new defendant_1.DefendantSteps();
const statementOfMeansSteps = new statementOfMeans_1.StatementOfMeansSteps();
const defendantHowMuchHaveYouPaidPage = new defendant_how_much_have_you_paid_1.DefendantHowMuchHaveYouPaidPage();
const haveYouPaidTheClaimantPage = new defendant_have_you_paid_the_claimant_the_amount_you_admit_you_owe_1.DefendantHaveYouPaidTheClaimantTheAmountYouAdmitYouOwePage();
const defendantHowMuchYouOwePage = new defendant_how_much_you_owe_1.DefendantHowMuchYouOwePage();
const updatedAddress = { line1: 'ABC Street', line2: 'A cool place', city: 'Bristol', postcode: 'BS1 5TL' };
const mediationSteps = new mediation_1.MediationSteps();
const defendantRepaymentPlan = {
    equalInstalment: 20.00,
    firstPaymentDate: '2025-01-01',
    frequency: 'everyWeek'
};
class DefenceSteps {
    async getClaimPin(claimRef, authorisation) {
        const claim = await claimStoreClient_1.ClaimStoreClient.retrieveByReferenceNumber(claimRef, { bearerToken: authorisation });
        return idamClient_1.IdamClient.getPin(claim.letterHolderId);
    }
    enterClaimReference(claimRef) {
        defendantStartPage.open();
        defendantStartPage.start();
        defendantEnterClaimRefPage.enterClaimReference(claimRef);
    }
    async enterClaimPin(claimRef, authorisation) {
        const claimPinNumber = await this.getClaimPin(claimRef, authorisation);
        defendantEnterPinPage.enterPinNumber(claimPinNumber);
    }
    respondToClaim() {
        I.see('Claim number');
        I.see('Claim amount');
        I.see('Reason for claim');
        defendantViewClaimPage.clickRespondToClaim();
    }
    loginAsDefendant(defendantEmail) {
        // defendantRegisterPage.clickLinkIAlreadyHaveAnAccount()
        loginPage.open();
        loginPage.login(defendantEmail, test_data_1.DEFAULT_PASSWORD);
    }
    confirmYourDetails(defendant, expectPhonePage = false) {
        defendantSteps.selectTaskConfirmYourDetails();
        defendantNameAndAddressPage.enterAddress(updatedAddress);
        if (defendant.type === party_type_1.PartyType.INDIVIDUAL) {
            defendantDobPage.enterDOB(defendant.dateOfBirth);
        }
        if (expectPhonePage) {
            defendantPhonePage.enterPhone(defendant.phone);
        }
    }
    requestNoExtraTimeToRespond() {
        defendantSteps.selectTaskMoreTimeNeededToRespond();
        defendantMoreTimeRequestPage.chooseNo();
    }
    requestMoreTimeToRespond() {
        defendantSteps.selectTaskMoreTimeNeededToRespond();
        defendantMoreTimeRequestPage.chooseYes();
        defendantMoreTimeConfirmationPage.confirm();
    }
    rejectAllOfClaimAsDisputeClaim() {
        defendantSteps.selectTaskChooseAResponse();
        defendantDefenceTypePage.rejectAllOfMoneyClaim();
        defendantRejectAllOfClaimPage.selectDisputeTheClaimOption();
    }
    rejectAllOfClaimAsAlreadyPaid() {
        defendantSteps.selectTaskChooseAResponse();
        defendantDefenceTypePage.rejectAllOfMoneyClaim();
        defendantRejectAllOfClaimPage.selectAlreadyPaidOption();
    }
    addTimeLineOfEvents(timeline) {
        I.see('Add your timeline of events');
        defendantTimelineOfEventsPage.enterTimelineEvent(0, timeline.events[0].date, timeline.events[0].description);
        defendantTimelineOfEventsPage.enterTimelineEvent(1, timeline.events[1].date, timeline.events[1].description);
        defendantTimelineOfEventsPage.submitForm();
    }
    enterEvidence(description, comment) {
        I.see('List your evidence');
        defendantEvidencePage.enterEvidenceRow('CONTRACTS_AND_AGREEMENTS', description, comment);
    }
    explainImpactOfDispute(impactOfDispute) {
        I.see('How this dispute has affected you?');
        defendantImpactOfDisputePage.enterImpactOfDispute(impactOfDispute);
        defendantImpactOfDisputePage.submitForm();
    }
    admitAllOfClaim() {
        defendantSteps.selectTaskChooseAResponse();
        defendantDefenceTypePage.admitAllOfMoneyClaim();
    }
    admitPartOfClaim() {
        defendantSteps.selectTaskChooseAResponse();
        defendantDefenceTypePage.admitPartOfMoneyClaim();
    }
    admitAllOfClaimAndMakeCounterClaim() {
        defendantSteps.selectTaskChooseAResponse();
        defendantDefenceTypePage.rejectAllOfMoneyClaim();
        defendantRejectAllOfClaimPage.selectCounterClaimOption();
    }
    chooseLessThenAmountClaimedOption() {
        defendantSteps.selectTaskChooseAResponse();
        defendantDefenceTypePage.rejectAllOfMoneyClaim();
        defendantRejectAllOfClaimPage.selectAlreadyPaidOption();
        defendantSteps.selectTaskTellUsHowMuchYouHavePaid();
        defendantHowMuchHaveYouPaidPage.enterAmountPaidWithDateAndExplanation(test_data_1.claimAmount.getTotal() - 1, '2018-01-01', 'Paid Cash');
    }
    enterWhenDidYouPay(defence) {
        defendantSteps.selectTaskChooseAResponse();
        defendantDefenceTypePage.rejectAllOfMoneyClaim();
        defendantRejectAllOfClaimPage.selectAlreadyPaidOption();
        defendantSteps.selectTaskTellUsHowMuchYouHavePaid();
        defendantHowMuchHaveYouPaidPage.enterAmountPaidWithDateAndExplanation(test_data_1.claimAmount.getTotal(), '2018-01-01', 'Paid Cash');
    }
    admitPartOfTheClaim(defence) {
        defendantSteps.selectTaskChooseAResponse();
        defendantDefenceTypePage.admitPartOfMoneyClaim();
        alreadyPaidPage.chooseNo();
        defendantTaskListPage.selectTaskHowMuchMoneyBelieveYouOwe();
        defendantHowMuchYouOwePage.enterAmountOwed(50);
        defendantSteps.selectTaskWhyDoYouDisagreeWithTheAmountClaimed();
        defendantYourDefencePage.enterYourDefence('I do not like it');
        this.addTimeLineOfEvents(defence.timeline);
        this.enterEvidence('description', 'They do not have evidence');
        defendantTaskListPage.selectTaskWhenWillYouPay();
        defendantWhenWillYouPage.chooseFullBySetDate();
        defendantPaymentDatePage.enterDate('2025-01-01');
        defendantPaymentDatePage.saveAndContinue();
        I.see('Respond to a money claim');
    }
    admitPartOfTheClaimAlreadyPaid(defence, isClaimAlreadyPaid = true) {
        defendantSteps.selectTaskChooseAResponse();
        defendantDefenceTypePage.admitPartOfMoneyClaim();
        if (isClaimAlreadyPaid) {
            alreadyPaidPage.chooseYes();
            I.see('How much have you paid?');
            defendantSteps.selectTaskHowMuchHaveYouPaid();
            defendantHowMuchHaveYouPaidTheClaimant.enterAmountPaidWithDateAndExplanation(100, '1990-01-01', 'I will not pay that much!');
            defendantSteps.selectTaskWhyDoYouDisagreeWithTheAmountClaimed();
            defendantYourDefencePage.enterYourDefence('I do not like it');
            this.addTimeLineOfEvents(defence.timeline);
            this.enterEvidence('description', 'They do not have evidence');
        }
        else {
            alreadyPaidPage.chooseNo();
            I.see('How much money do you admit you owe?');
            defendantSteps.selectTaskHowMuchMoneyBelieveYouOwe();
            defendantHowMuchYouOwePage.enterAmountOwed(50);
            defendantSteps.selectTaskWhyDoYouDisagreeWithTheAmountClaimed();
            defendantYourDefencePage.enterYourDefence('I paid half');
            this.addTimeLineOfEvents(defence.timeline);
            this.enterEvidence('description', 'Some evidence');
            I.see('When will you pay the £50?');
            defendantSteps.selectTaskWhenYouWillPay();
            defendantWhenWillYouPage.chooseInstalments();
            defendantTaskListPage.selectYourRepaymentPlanTask();
            defendantPaymentPlanPage.enterRepaymentPlan(defendantRepaymentPlan);
            defendantPaymentPlanPage.saveAndContinue();
            defendantTaskListPage.selectShareYourFinancialDetailsTask();
            statementOfMeansSteps.fillStatementOfMeansWithFullDataSet();
        }
        I.see('Respond to a money claim');
    }
    submitDefenceText(text) {
        defendantSteps.selectTaskWhyDoYouDisagreeWithTheClaim();
        defendantYourDefencePage.enterYourDefence(text);
    }
    askForMediation(defendantType = party_type_1.PartyType.INDIVIDUAL) {
        defendantSteps.selectTaskFreeMediation(defendantType);
    }
    askForHearingRequirements(defendantType = party_type_1.PartyType.INDIVIDUAL) {
        defendantSteps.selectTaskHearingRequirements(defendantType);
    }
    verifyCheckAndSendPageCorrespondsTo(defenceType) {
        if (defenceType === defence_type_1.DefenceType.PART_ADMISSION_BECAUSE_AMOUNT_IS_TOO_HIGH) {
            defendantCheckAndSendPage.verifyFactsPartialResponseClaimAmountTooMuch();
        }
        else {
            defendantCheckAndSendPage.verifyFactsPartialResponseIBelieveIPaidWhatIOwe();
        }
    }
    verifyImpactOfDisputeIsVisible(impactOfDispute) {
        I.see(impactOfDispute);
    }
    checkAndSendAndSubmit(defendantType, defenceType) {
        if (defendantType === party_type_1.PartyType.COMPANY || defendantType === party_type_1.PartyType.ORGANISATION) {
            defendantCheckAndSendPage.signStatementOfTruthAndSubmit('Jonny', 'Director', defenceType);
        }
        else {
            defendantCheckAndSendPage.checkFactsTrueAndSubmit(defenceType);
        }
    }
    makeDefenceAndSubmit(defendantParty, defendantEmail, defendantType, defenceType, isRequestMoreTimeToRespond = true, isClaimAlreadyPaid = true, expectPhonePage = false) {
        I.see('Confirm your details');
        I.see('Decide if you need more time to respond');
        I.see('Choose a response');
        this.confirmYourDetails(defendantParty, expectPhonePage);
        I.see('COMPLETE');
        if (isRequestMoreTimeToRespond) {
            this.requestMoreTimeToRespond();
        }
        else {
            this.requestNoExtraTimeToRespond();
        }
        switch (defenceType) {
            case defence_type_1.DefenceType.FULL_REJECTION_WITH_DISPUTE:
                this.rejectAllOfClaimAsDisputeClaim();
                I.see('Tell us why you disagree with the claim');
                this.submitDefenceText('I fully dispute this claim');
                this.addTimeLineOfEvents({
                    events: [{ date: 'may', description: 'ok' }, {
                            date: 'june',
                            description: 'ok'
                        }]
                });
                this.enterEvidence('description', 'comment');
                this.askForMediation(defendantType);
                this.askForHearingRequirements(defendantType);
                defendantSteps.selectCheckAndSubmitYourDefence();
                break;
            case defence_type_1.DefenceType.FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID:
                this.enterWhenDidYouPay(test_data_1.defence);
                this.askForMediation(defendantType);
                this.askForHearingRequirements(defendantType);
                defendantSteps.selectCheckAndSubmitYourDefence();
                I.see('When did you pay this amount?');
                I.see('How did you pay this amount?');
                break;
            case defence_type_1.DefenceType.PART_ADMISSION_NONE_PAID:
                this.admitPartOfTheClaim(test_data_1.defence);
                this.askForMediation(defendantType);
                this.askForHearingRequirements(defendantType);
                if (defendantType === party_type_1.PartyType.COMPANY || defendantType === party_type_1.PartyType.ORGANISATION) {
                    defendantTaskListPage.selectShareYourFinancialDetailsTask();
                    sendCompanyDetailsPage.continue();
                }
                defendantSteps.selectCheckAndSubmitYourDefence();
                I.see('How much money do you admit you owe?');
                break;
            case defence_type_1.DefenceType.PART_ADMISSION:
                this.admitPartOfTheClaimAlreadyPaid(test_data_1.defence, isClaimAlreadyPaid);
                this.askForMediation(defendantType);
                this.askForHearingRequirements(defendantType);
                defendantSteps.selectCheckAndSubmitYourDefence();
                if (isClaimAlreadyPaid) {
                    I.see('How much money have you paid?');
                }
                else {
                    I.see('How much money do you admit you owe?');
                }
                break;
            default:
                throw new Error('Unknown DefenceType');
        }
        this.checkAndSendAndSubmit(defendantType, defenceType);
        I.see('You’ve submitted your response');
    }
    makeFullAdmission(defendantParty, defendantType, paymentOption, claimantName, statementOfMeansFullDataSet = true) {
        this.confirmYourDetails(defendantParty);
        this.requestMoreTimeToRespond();
        defendantSteps.selectTaskChooseAResponse();
        defendantDefenceTypePage.admitAllOfMoneyClaim();
        defendantSteps.selectTaskDecideHowWillYouPay();
        switch (paymentOption) {
            case payment_option_1.PaymentOption.IMMEDIATELY:
                defendantWhenWillYouPage.chooseImmediately();
                break;
            case payment_option_1.PaymentOption.BY_SET_DATE:
                defendantWhenWillYouPage.chooseFullBySetDate();
                defendantPaymentDatePage.enterDate('2025-01-01');
                defendantPaymentDatePage.saveAndContinue();
                defendantTaskListPage.selectShareYourFinancialDetailsTask();
                statementOfMeansSteps.fillStatementOfMeansWithMinimalDataSet();
                break;
            case payment_option_1.PaymentOption.INSTALMENTS:
                defendantWhenWillYouPage.chooseInstalments();
                defendantTaskListPage.selectYourRepaymentPlanTask();
                defendantPaymentPlanPage.enterRepaymentPlan(defendantRepaymentPlan);
                defendantPaymentPlanPage.saveAndContinue();
                defendantTaskListPage.selectShareYourFinancialDetailsTask();
                statementOfMeansFullDataSet ? statementOfMeansSteps.fillStatementOfMeansWithFullDataSet()
                    : statementOfMeansSteps.fillStatementOfMeansWithMinimalDataSet('50');
                break;
            default:
                throw new Error(`Unknown payment option: ${paymentOption}`);
        }
        defendantSteps.selectCheckAndSubmitYourDefence();
        this.checkAndSendAndSubmit(defendantType, defence_type_1.DefenceType.FULL_ADMISSION);
        I.see('You’ve submitted your response');
        switch (paymentOption) {
            case payment_option_1.PaymentOption.IMMEDIATELY:
                I.see(`We’ve emailed ${claimantName} to tell them you’ll pay immediately.`);
                break;
            case payment_option_1.PaymentOption.BY_SET_DATE:
                I.see(`We’ve emailed ${claimantName} your offer to pay by 1 January 2025 and your explanation of why you can’t pay before then.`);
                break;
            case payment_option_1.PaymentOption.INSTALMENTS:
                I.see(`We’ve emailed ${claimantName} to tell them you’ve suggested paying by instalments.`);
                break;
            default:
                throw new Error(`Unknown payment option: ${paymentOption}`);
        }
    }
    makePartialAdmission(defendantParty) {
        this.confirmYourDetails(defendantParty);
        this.requestMoreTimeToRespond();
        defendantSteps.selectTaskChooseAResponse();
        defendantDefenceTypePage.admitPartOfMoneyClaim();
    }
    partialPaymentMade(defendantType) {
        I.see('Have you paid the claimant the amount you admit you owe?');
        haveYouPaidTheClaimantPage.selectYesOption();
        defendantSteps.selectTaskHowMuchHaveYouPaid();
        defendantHowMuchHaveYouPaidTheClaimant.enterAmountPaidWithDateAndExplanation(test_data_1.defence.paidWhatIBelieveIOwe.howMuchAlreadyPaid, test_data_1.defence.paidWhatIBelieveIOwe.paidDate, test_data_1.defence.paidWhatIBelieveIOwe.explanation);
        defendantSteps.selectTaskWhyDoYouDisagreeWithTheAmountClaimed();
        defendantYourDefencePage.enterYourDefence('I have already paid for the bill');
        this.addTimeLineOfEvents(test_data_1.defence.timeline);
        this.enterEvidence('description', 'They do not have evidence');
        this.askForMediation(defendantType);
        this.askForHearingRequirements(defendantType);
        defendantSteps.selectCheckAndSubmitYourDefence();
        this.checkAndSendAndSubmit(defendantType, defence_type_1.DefenceType.PART_ADMISSION);
        I.see('You’ve submitted your response');
    }
    partialPaymentNotMade(defendantType, paymentOption) {
        I.see('Have you paid the claimant the amount you admit you owe?');
        haveYouPaidTheClaimantPage.selectNoOption();
        defendantTaskListPage.selectTaskHowMuchMoneyBelieveYouOwe();
        defendantHowMuchYouOwePage.enterAmountOwed(10);
        defendantTaskListPage.selectTaskWhyDoYouDisagreeWithTheAmountClaimed();
        defendantYourDefencePage.enterYourDefence('random text');
        this.addTimeLineOfEvents(test_data_1.defence.timeline);
        this.enterEvidence('description', 'They do not have evidence');
        defendantTaskListPage.selectTaskWhenWillYouPay();
        switch (paymentOption) {
            case payment_option_1.PaymentOption.IMMEDIATELY:
                defendantWhenWillYouPage.chooseImmediately();
                break;
            case payment_option_1.PaymentOption.BY_SET_DATE:
                defendantWhenWillYouPage.chooseFullBySetDate();
                defendantPaymentDatePage.enterDate('2025-01-01');
                defendantPaymentDatePage.saveAndContinue();
                defendantTaskListPage.selectShareYourFinancialDetailsTask();
                statementOfMeansSteps.fillStatementOfMeansWithMinimalDataSet();
                break;
            case payment_option_1.PaymentOption.INSTALMENTS:
                defendantRepaymentPlan.equalInstalment = 5.00; // total claimed = £10
                defendantWhenWillYouPage.chooseInstalments();
                defendantTaskListPage.selectYourRepaymentPlanTask();
                defendantPaymentPlanPage.enterRepaymentPlan(defendantRepaymentPlan);
                defendantPaymentPlanPage.saveAndContinue();
                defendantTaskListPage.selectShareYourFinancialDetailsTask();
                statementOfMeansSteps.fillStatementOfMeansWithFullDataSet();
                break;
            default:
                throw new Error(`Unknown payment option: ${paymentOption}`);
        }
        defendantTaskListPage.selectTaskFreeMediation();
        mediationSteps.rejectMediation();
        this.askForHearingRequirements(defendantType);
        defendantTaskListPage.selectTaskCheckAndSendYourResponse();
        this.checkAndSendAndSubmit(defendantType, defence_type_1.DefenceType.PART_ADMISSION_NONE_PAID);
        I.see('You’ve submitted your response');
    }
    sendDefenceResponseHandOff(claimRef, defendant, claimant, defenceType) {
        I.click('Respond to claim');
        I.see('Confirm your details');
        I.see('Decide if you need more time to respond');
        I.see('Choose a response');
        I.dontSee('Your defence');
        this.confirmYourDetails(defendant);
        I.see('COMPLETE');
        this.requestMoreTimeToRespond();
        switch (defenceType) {
            case defence_type_1.DefenceType.FULL_REJECTION_WITH_COUNTER_CLAIM:
                this.admitAllOfClaimAndMakeCounterClaim();
                I.see('Download the defence and counterclaim form.');
                break;
            case defence_type_1.DefenceType.FULL_REJECTION_BECAUSE_ALREADY_PAID_LESS_THAN_CLAIMED_AMOUNT:
                this.chooseLessThenAmountClaimedOption();
                I.see('Download the admission form and the defence form');
                break;
            default:
                throw new Error('Unknown DefenceType');
        }
        I.see('Post your response');
        I.see(claimRef);
        I.see(claimant.name);
        I.see(defendant.title);
        I.see(defendant.firstName);
        I.see(defendant.lastName);
    }
}
exports.DefenceSteps = DefenceSteps;
