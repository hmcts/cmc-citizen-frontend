"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_option_1 = require("integration-test/data/payment-option");
const claimant_accept_payment_method_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-accept-payment-method");
const claimant_task_list_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-task-list");
const claimant_choose_how_to_proceed_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-choose-how-to-proceed");
const claimant_check_and_send_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send");
const claimant_sign_settlement_agreement_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-sign-settlement-agreement");
const claimant_ccj_paid_amount_summary_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-ccj-paid-amount-summary");
const claimant_ccj_paid_any_money_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-ccj-paid-any-money");
const claimant_payment_option_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-payment-option");
const claimant_payment_date_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-payment-date");
const claimant_payment_plan_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-payment-plan");
const claimant_defendant_response_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-defendant-response");
const claimant_court_offered_set_date_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-court-offered-set-date");
const claimant_court_offered_instalments_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-court-offered-instalments");
const claimant_pay_by_set_date_accepted_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-pay-by-set-date-accepted");
const claimant_settle_admitted_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-settle-admitted");
const claimant_paid_in_full_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-paid-in-full");
const mediation_1 = require("integration-test/tests/citizen/mediation/steps/mediation");
const directionsQuestionnaireSteps_1 = require("integration-test/tests/citizen/directionsQuestionnaire/steps/directionsQuestionnaireSteps");
const claimant_intention_to_proceed_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-intention-to-proceed");
const claimant_part_payment_received_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-part-payment-received");
const claimant_rejection_reason_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-rejection-reason");
const test_data_1 = require("integration-test/data/test-data");
const claimant_settle_claim_1 = require("integration-test/tests/citizen/claimantResponse/pages/claimant-settle-claim");
const I = actor();
const taskListPage = new claimant_task_list_1.ClaimantTaskListPage();
const acceptPaymentMethodPage = new claimant_accept_payment_method_1.ClaimantAcceptPaymentMethod();
const chooseHowToProceedPage = new claimant_choose_how_to_proceed_1.ClaimantChooseHowToProceed();
const checkAndSendPage = new claimant_check_and_send_1.ClaimantCheckAndSendPage();
const signSettlementAgreementPage = new claimant_sign_settlement_agreement_1.ClaimantSignSettlementAgreement();
const ccjPaidAmountSummaryPage = new claimant_ccj_paid_amount_summary_1.ClaimantCcjPaidAmountSummaryPage();
const ccjPaidAnyMoneyPage = new claimant_ccj_paid_any_money_1.ClaimantCcjPaidAnyMoneyPage();
const paymentOptionPage = new claimant_payment_option_1.ClaimantPaymentOptionPage();
const paymentDatePage = new claimant_payment_date_1.ClaimantPaymentDatePage();
const paymentPlanPage = new claimant_payment_plan_1.ClaimantPaymentPlanPage();
const courtOfferedSetDataPage = new claimant_court_offered_set_date_1.ClaimantCourtOfferedSetDatePage();
const courtOfferedInstalmentsPage = new claimant_court_offered_instalments_1.ClaimantCourtOfferedInstalmentsPage();
const payBySetDateAccepted = new claimant_pay_by_set_date_accepted_1.ClaimantPayBySetDateAcceptedPage();
const viewDefendantsResponsePage = new claimant_defendant_response_1.ClaimantDefendantResponsePage();
const settleAdmittedPage = new claimant_settle_admitted_1.ClaimantSettleAdmittedPage();
const settleClaimPage = new claimant_paid_in_full_1.PaidInFullPage();
const mediationSteps = new mediation_1.MediationSteps();
const directionsQuestionnaireSteps = new directionsQuestionnaireSteps_1.DirectionsQuestionnaireSteps();
const intentionToProceedSteps = new claimant_intention_to_proceed_1.ClaimantIntentionToProceedPage();
const partPaymentReceivedPage = new claimant_part_payment_received_1.ClaimantPartPaymentReceivedPage();
const claimantRejectionReasonPage = new claimant_rejection_reason_1.ClaimantRejectionReasonPage();
const claimantSettleClaimPage = new claimant_settle_claim_1.ClaimantSettleClaimPage();
class ClaimantResponseSteps {
    acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, buttonText) {
        this.viewClaimFromDashboard(testData.claimRef);
        this.respondToOffer(buttonText);
        this.acceptSettlementWithClaimantPaymentOption(testData, claimantResponseTestData);
    }
    acceptCourtOfferedRepaymentPlan(testData, unReasonableClaimantResponseTestData, buttonText) {
        this.viewClaimFromDashboard(testData.claimRef);
        this.respondToOffer(buttonText);
        this.acceptCourtOffer(testData, unReasonableClaimantResponseTestData);
    }
    acceptSettlementFromDashboardWhenAcceptPaymentMethod(testData, claimantResponseTestData, buttonText) {
        this.viewClaimFromDashboard(testData.claimRef);
        this.respondToOffer(buttonText);
        this.acceptSettlement(testData, claimantResponseTestData);
    }
    acceptCcjFromDashboardWhenDefendantHasPaidNoneAndAcceptPaymentMethod(testData, buttonText) {
        this.viewClaimFromDashboard(testData.claimRef);
        this.respondToOffer(buttonText);
        this.acceptCCJ(false);
    }
    acceptCcjFromDashboardWhenDefendantHasPaidSomeAndAcceptPaymentMethod(testData, buttonText) {
        this.viewClaimFromDashboard(testData.claimRef);
        this.respondToOffer(buttonText);
        this.acceptCCJ(true);
    }
    acceptCcjFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, buttonText) {
        this.viewClaimFromDashboard(testData.claimRef);
        this.respondToOffer(buttonText);
        this.acceptCCJWithClaimantPaymentOption(false, testData, claimantResponseTestData);
    }
    viewClaimFromDashboard(claimRef) {
        I.click('My account');
        I.see('Your money claims account');
        I.click(claimRef);
    }
    respondToOffer(buttonText) {
        I.click(buttonText);
    }
    reject(testData, claimantResponseTestData) {
        taskListPage.selectTaskViewDefendantResponse();
        viewDefendantsResponsePage.submit();
        if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
            viewDefendantsResponsePage.submitHowTheyWantToPay();
        }
        I.see('COMPLETE');
        if (!testData.defendantClaimsToHavePaidInFull) {
            taskListPage.selectTaskAcceptOrRejectSpecificAmount(50);
            settleAdmittedPage.selectAdmittedNo();
        }
        taskListPage.selectTaskFreeMediation();
        mediationSteps.acceptMediationAfterDisagreeing();
        taskListPage.selectTaskHearingRequirements();
        directionsQuestionnaireSteps.acceptDirectionsQuestionnaireNoJourneyAsClaimant();
        taskListPage.selectTaskCheckandSubmitYourResponse();
    }
    decideToProceed() {
        taskListPage.selectTaskViewDefendantResponse();
        viewDefendantsResponsePage.submit();
        I.see('COMPLETE');
        I.click('Decide whether to proceed');
        I.see('Do you want to proceed with the claim?');
        intentionToProceedSteps.chooseYes();
        this.finishClaimantResponse();
    }
    decideNotToProceed() {
        taskListPage.selectTaskViewDefendantResponse();
        viewDefendantsResponsePage.submit();
        I.see('COMPLETE');
        I.click('Decide whether to proceed');
        I.see('Do you want to proceed with the claim?');
        intentionToProceedSteps.chooseNo();
        I.see('COMPLETE');
        I.click('Check and submit your response');
        I.see('Do you want to proceed with the claim?');
        I.see('No');
        I.click('input[type=submit]');
        I.see('You didn’t proceed with the claim');
    }
    finishClaimantResponse() {
        taskListPage.selectTaskFreeMediation();
        mediationSteps.acceptMediationAfterDisagreeing();
        taskListPage.selectTaskHearingRequirements();
        directionsQuestionnaireSteps.acceptDirectionsQuestionnaireNoJourneyAsClaimant();
        taskListPage.selectTaskCheckandSubmitYourResponse();
    }
    settleClaim(testData, claimantResponseTestData, buttonText) {
        this.viewClaimFromDashboard(testData.claimRef);
        this.respondToOffer(buttonText);
        settleClaimPage.enterDate(claimantResponseTestData.pageSpecificValues.settleClaimEnterDate);
        settleClaimPage.saveAndContinue();
    }
    acceptPartAdmitFromBusinessWithAlternativePaymentIntention() {
        taskListPage.selectTaskViewDefendantResponse();
        viewDefendantsResponsePage.submit();
        viewDefendantsResponsePage.submitHowTheyWantToPay();
        I.see('COMPLETE');
        taskListPage.selectTaskAcceptOrRejectSpecificAmount(50);
        settleAdmittedPage.selectAdmittedYes();
        taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan();
        acceptPaymentMethodPage.chooseNo();
        taskListPage.selectProposeAnAlternativeRepaymentPlan();
        paymentOptionPage.chooseFullBySetDate();
        paymentDatePage.enterDate('2024-01-01');
        paymentDatePage.saveAndContinue();
        taskListPage.selectTaskCheckandSubmitYourResponse();
    }
    acceptFullAdmitFromBusinessWithAlternativePaymentIntention(claimantResponseTestData) {
        taskListPage.selectTaskViewDefendantResponse();
        viewDefendantsResponsePage.submit();
        viewDefendantsResponsePage.submitHowTheyWantToPay();
        I.see('COMPLETE');
        taskListPage.selectTaskAcceptOrRejectSpecificAmount(50);
        settleAdmittedPage.selectAdmittedYes();
        taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan();
        acceptPaymentMethodPage.chooseNo();
        taskListPage.selectProposeAnAlternativeRepaymentPlan();
        paymentOptionPage.chooseInstalments();
        paymentPlanPage.enterRepaymentPlan(claimantResponseTestData.pageSpecificValues.paymentPlanPageEnterRepaymentPlan);
        paymentDatePage.saveAndContinue();
        taskListPage.selectTaskCheckandSubmitYourResponse();
    }
    acceptSettlement(testData, claimantResponseTestData) {
        taskListPage.selectTaskViewDefendantResponse();
        viewDefendantsResponsePage.submit();
        if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
            viewDefendantsResponsePage.submitHowTheyWantToPay();
        }
        I.see('COMPLETE');
        if (!testData.defendantClaimsToHavePaidInFull) {
            taskListPage.selectTaskAcceptOrRejectSpecificAmount(50);
            settleAdmittedPage.selectAdmittedYes();
        }
        taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan();
        acceptPaymentMethodPage.chooseYes();
        taskListPage.selectTaskChooseHowToFormaliseRepayment();
        chooseHowToProceedPage.chooseSettlement();
        taskListPage.selectTaskSignASettlementAgreement();
        signSettlementAgreementPage.confirm();
        taskListPage.selectTaskChooseHowToFormaliseRepayment();
        chooseHowToProceedPage.chooseSettlement();
        taskListPage.selectTaskSignASettlementAgreement();
        signSettlementAgreementPage.confirm();
        taskListPage.selectTaskCheckandSubmitYourResponse();
    }
    acceptSettlementWithClaimantPaymentOption(testData, claimantResponseTestData) {
        taskListPage.selectTaskViewDefendantResponse();
        viewDefendantsResponsePage.submit();
        if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
            viewDefendantsResponsePage.submitHowTheyWantToPay();
        }
        I.see('COMPLETE');
        if (!testData.defendantClaimsToHavePaidInFull) {
            taskListPage.selectTaskAcceptOrRejectSpecificAmount(50);
            settleAdmittedPage.selectAdmittedYes();
        }
        taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan();
        acceptPaymentMethodPage.chooseNo();
        taskListPage.selectProposeAnAlternativeRepaymentPlan();
        switch (testData.claimantPaymentOption) {
            case payment_option_1.PaymentOption.IMMEDIATELY:
                paymentOptionPage.chooseImmediately();
                courtOfferedSetDataPage.accept();
                break;
            case payment_option_1.PaymentOption.BY_SET_DATE:
                paymentOptionPage.chooseFullBySetDate();
                paymentDatePage.enterDate(claimantResponseTestData.pageSpecificValues.paymentDatePageEnterDate);
                paymentDatePage.saveAndContinue();
                payBySetDateAccepted.continue();
                if (claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage) {
                    courtOfferedInstalmentsPage.accept();
                }
                break;
            case payment_option_1.PaymentOption.INSTALMENTS:
                paymentOptionPage.chooseInstalments();
                paymentPlanPage.enterRepaymentPlan(claimantResponseTestData.pageSpecificValues.paymentPlanPageEnterRepaymentPlan);
                paymentPlanPage.saveAndContinue();
                payBySetDateAccepted.continue();
                break;
            default:
                throw new Error(`Unknown payment option: ${testData.claimantPaymentOption}`);
        }
        taskListPage.selectTaskChooseHowToFormaliseRepayment();
        chooseHowToProceedPage.chooseSettlement();
        taskListPage.selectTaskSignASettlementAgreement();
        signSettlementAgreementPage.confirm();
        taskListPage.selectTaskCheckandSubmitYourResponse();
    }
    acceptCourtOffer(testData, unReasonableClaimantResponseTestData) {
        taskListPage.selectTaskViewDefendantResponse();
        viewDefendantsResponsePage.submit();
        if (unReasonableClaimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
            viewDefendantsResponsePage.submitHowTheyWantToPay();
        }
        taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan();
        acceptPaymentMethodPage.chooseNo();
        taskListPage.selectProposeAnAlternativeRepaymentPlan();
        paymentOptionPage.chooseInstalments();
        paymentPlanPage.enterRepaymentPlan(unReasonableClaimantResponseTestData.pageSpecificValues.paymentPlanPageEnterRepaymentPlan);
        paymentPlanPage.saveAndContinue();
        courtOfferedInstalmentsPage.checkingCourtOfferedPlanAndAccept();
        taskListPage.selectTaskChooseHowToFormaliseRepayment();
        chooseHowToProceedPage.chooseSettlement();
        taskListPage.selectTaskSignASettlementAgreement();
        signSettlementAgreementPage.confirm();
        taskListPage.selectTaskCheckandSubmitYourResponse();
    }
    acceptCCJ(shouldPaySome) {
        taskListPage.selectTaskViewDefendantResponse();
        I.click('Continue');
        I.see('COMPLETE');
        taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan();
        acceptPaymentMethodPage.chooseYes(); // no is covered in settlement journey
        taskListPage.selectTaskChooseHowToFormaliseRepayment();
        chooseHowToProceedPage.chooseRequestCcj();
        taskListPage.selectTaskRequestCountyCourtJudgment();
        if (shouldPaySome) {
            ccjPaidAnyMoneyPage.paidSome(10);
        }
        else {
            ccjPaidAnyMoneyPage.notPaidSome();
        }
        ccjPaidAmountSummaryPage.continue();
        taskListPage.selectTaskCheckandSubmitYourResponse();
        checkAndSendPage.verifyFactsForCCJ();
        I.click('input[type=submit]');
    }
    acceptCCJWithClaimantPaymentOption(shouldPaySome, testData, claimantResponseTestData) {
        I.dontSeeElement({ css: 'div.task-finished:not(.unfinished)>strong' });
        taskListPage.selectTaskViewDefendantResponse();
        viewDefendantsResponsePage.submit();
        taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan();
        acceptPaymentMethodPage.chooseNo();
        taskListPage.selectProposeAnAlternativeRepaymentPlan();
        switch (testData.claimantPaymentOption) {
            case payment_option_1.PaymentOption.IMMEDIATELY:
                paymentOptionPage.chooseImmediately();
                courtOfferedSetDataPage.accept();
                break;
            case payment_option_1.PaymentOption.BY_SET_DATE:
                paymentOptionPage.chooseFullBySetDate();
                paymentDatePage.enterDate(claimantResponseTestData.pageSpecificValues.paymentDatePageEnterDate);
                paymentDatePage.saveAndContinue();
                payBySetDateAccepted.continue();
                if (claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage) {
                    courtOfferedInstalmentsPage.accept();
                }
                break;
            case payment_option_1.PaymentOption.INSTALMENTS:
                paymentOptionPage.chooseInstalments();
                paymentPlanPage.enterRepaymentPlan(claimantResponseTestData.pageSpecificValues.paymentPlanPageEnterRepaymentPlan);
                paymentPlanPage.saveAndContinue();
                payBySetDateAccepted.continue();
                if (claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage) {
                    courtOfferedInstalmentsPage.accept();
                }
                break;
            default:
                throw new Error(`Unknown payment option: ${testData.claimantPaymentOption}`);
        }
        taskListPage.selectTaskChooseHowToFormaliseRepayment();
        chooseHowToProceedPage.chooseRequestCcj();
        taskListPage.selectTaskRequestCountyCourtJudgment();
        if (shouldPaySome) {
            ccjPaidAnyMoneyPage.paidSome(10);
        }
        else {
            ccjPaidAnyMoneyPage.notPaidSome();
        }
        ccjPaidAmountSummaryPage.continue();
        taskListPage.selectTaskCheckandSubmitYourResponse();
        checkAndSendPage.verifyFactsForCCJ();
        I.click('input[type=submit]');
    }
    acceptFullDefencePaidLessThanFullAmount() {
        taskListPage.selectTaskViewDefendantResponse();
        viewDefendantsResponsePage.submit();
        I.see('COMPLETE');
        I.click('Have you been paid the ');
        partPaymentReceivedPage.yesTheDefendantHasPaid();
        I.see('Settle the claim for ');
        I.click('Settle the claim for');
        claimantSettleClaimPage.selectAcceptedYes();
        I.click('Check and submit your response');
        I.see('Do you agree the defendant has paid');
        I.see('Yes');
        I.see('Do you want to settle the claim for the');
        I.click('input[type=submit]');
        I.see('You’ve accepted their response');
    }
    rejectFullDefencePaidLessThanFullAmount(testData) {
        taskListPage.selectTaskViewDefendantResponse();
        viewDefendantsResponsePage.submit();
        I.see('COMPLETE');
        I.click('Have you been paid the £50');
        partPaymentReceivedPage.noTheDefendantHasNotPaid();
        taskListPage.selectTaskHearingRequirements();
        directionsQuestionnaireSteps.acceptDirectionsQuestionnaireNoJourneyAsClaimant();
        taskListPage.selectTaskCheckandSubmitYourResponse();
        checkAndSendPage.checkFactsTrueAndSubmit(testData.defenceType);
        I.see('You’ve rejected their response');
    }
    acceptFullDefencePaidFullAmount(testData) {
        taskListPage.selectTaskViewDefendantResponse();
        I.see(`${testData.defendantName} states they paid you £105.50.`);
        viewDefendantsResponsePage.submit();
        I.see('COMPLETE');
        I.click('Accept or reject their response');
        I.see(`Do you agree the defendant has paid the £105.50 in full?`);
        claimantSettleClaimPage.selectAcceptedYes();
        I.see('COMPLETE');
        I.click('Check and submit your response');
        I.see(`Do you agree the defendant has paid £105.50`);
        I.see('Yes');
        I.click('input[type=submit]');
        I.see('You’ve accepted their response');
        I.see('The claim is now settled.');
    }
    rejectFullDefencePaidFullAmount(testData) {
        taskListPage.selectTaskViewDefendantResponse();
        I.see(`${testData.defendantName} states they paid you £${test_data_1.claimAmount.getTotal()}`);
        viewDefendantsResponsePage.submit();
        I.see('COMPLETE');
        I.click('Accept or reject their response');
        I.see(`Do you agree the defendant has paid the £105.50 in full?`);
        claimantSettleClaimPage.selectAcceptedNo();
        I.see('Why did you reject their response');
        claimantRejectionReasonPage.enterReason('No money received');
        I.see('COMPLETE');
        this.finishClaimantResponse();
        checkAndSendPage.checkFactsTrueAndSubmit(testData.defenceType);
        I.see('You’ve rejected their response');
    }
}
exports.ClaimantResponseSteps = ClaimantResponseSteps;
