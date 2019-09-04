import I = CodeceptJS.I
import { PaymentOption } from 'integration-test/data/payment-option'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'
import {
  ClaimantResponseTestData,
  UnreasonableClaimantResponseTestData
} from 'integration-test/tests/citizen/claimantResponse/data/ClaimantResponseTestData'
import { ClaimantAcceptPaymentMethod } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-accept-payment-method'
import { ClaimantTaskListPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-task-list'
import { ClaimantChooseHowToProceed } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-choose-how-to-proceed'
import { ClaimantCheckAndSendPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send'
import { ClaimantSignSettlementAgreement } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-sign-settlement-agreement'
import { ClaimantCcjPaidAmountSummaryPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-ccj-paid-amount-summary'
import { ClaimantCcjPaidAnyMoneyPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-ccj-paid-any-money'
import { ClaimantPaymentOptionPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-payment-option'
import { ClaimantPaymentDatePage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-payment-date'
import { ClaimantPaymentPlanPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-payment-plan'
import { ClaimantDefendantResponsePage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-defendant-response'
import { ClaimantCourtOfferedSetDatePage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-court-offered-set-date'
import { ClaimantCourtOfferedInstalmentsPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-court-offered-instalments'
import { ClaimantPayBySetDateAcceptedPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-pay-by-set-date-accepted'
import { ClaimantSettleAdmittedPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-settle-admitted'
import { ClaimantSettleClaimPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-settle-claim'
import { MediationSteps } from 'integration-test/tests/citizen/mediation/steps/mediation'
import { DirectionsQuestionnaireSteps } from 'integration-test/tests/citizen/directionsQuestionnaire/steps/directionsQuestionnaireSteps'

const I: I = actor()
const taskListPage: ClaimantTaskListPage = new ClaimantTaskListPage()
const acceptPaymentMethodPage: ClaimantAcceptPaymentMethod = new ClaimantAcceptPaymentMethod()
const chooseHowToProceedPage: ClaimantChooseHowToProceed = new ClaimantChooseHowToProceed()
const checkAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()
const signSettlementAgreementPage: ClaimantSignSettlementAgreement = new ClaimantSignSettlementAgreement()
const ccjPaidAmountSummaryPage: ClaimantCcjPaidAmountSummaryPage = new ClaimantCcjPaidAmountSummaryPage()
const ccjPaidAnyMoneyPage: ClaimantCcjPaidAnyMoneyPage = new ClaimantCcjPaidAnyMoneyPage()
const paymentOptionPage: ClaimantPaymentOptionPage = new ClaimantPaymentOptionPage()
const paymentDatePage: ClaimantPaymentDatePage = new ClaimantPaymentDatePage()
const paymentPlanPage: ClaimantPaymentPlanPage = new ClaimantPaymentPlanPage()
const courtOfferedSetDataPage: ClaimantCourtOfferedSetDatePage = new ClaimantCourtOfferedSetDatePage()
const courtOfferedInstalmentsPage: ClaimantCourtOfferedInstalmentsPage = new ClaimantCourtOfferedInstalmentsPage()
const payBySetDateAccepted: ClaimantPayBySetDateAcceptedPage = new ClaimantPayBySetDateAcceptedPage()
const defendantsResponsePage: ClaimantDefendantResponsePage = new ClaimantDefendantResponsePage()
const settleAdmittedPage: ClaimantSettleAdmittedPage = new ClaimantSettleAdmittedPage()
const settleClaimPage: ClaimantSettleClaimPage = new ClaimantSettleClaimPage()
const mediationSteps: MediationSteps = new MediationSteps()
const directionsQuestionnaireSteps: DirectionsQuestionnaireSteps = new DirectionsQuestionnaireSteps()

export class ClaimantResponseSteps {

  acceptSettlementFromDashboardWhenRejectPaymentMethod (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.acceptSettlementWithClaimantPaymentOption(testData, claimantResponseTestData)
  }

  acceptCourtOfferedRepaymentPlan (
    testData: EndToEndTestData,
    unReasonableClaimantResponseTestData: UnreasonableClaimantResponseTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.acceptCourtOffer(testData, unReasonableClaimantResponseTestData)
  }

  acceptSettlementFromDashboardWhenAcceptPaymentMethod (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.acceptSettlement(testData, claimantResponseTestData)
  }

  acceptCcjFromDashboardWhenDefendantHasPaidNoneAndAcceptPaymentMethod (
    testData: EndToEndTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.acceptCCJ(false, testData)
  }

  acceptCcjFromDashboardWhenDefendantHasPaidSomeAndAcceptPaymentMethod (
    testData: EndToEndTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.acceptCCJ(true, testData)
  }

  acceptCcjFromDashboardWhenRejectPaymentMethod (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.acceptCCJWithClaimantPaymentOption(false,testData,claimantResponseTestData)
  }

  viewClaimFromDashboard (claimRef: string): void {
    I.click('My account')
    I.see('Your money claims account')
    I.click(claimRef)
  }

  respondToOffer (buttonText: string): void {
    I.click(buttonText)
  }

  reject (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData
  ): void {
    taskListPage.selectTaskViewDefendantResponse()
    defendantsResponsePage.submit()
    if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      defendantsResponsePage.submitHowTheyWantToPay()
    }
    I.see('COMPLETE')
    if (!testData.defendantClaimsToHavePaidInFull) {
      taskListPage.selectTaskAcceptOrRejectSpecificAmount(50)
      settleAdmittedPage.selectAdmittedNo()
    }
    taskListPage.selectTaskFreeMediation()
    mediationSteps.acceptMediationAsIndividualPhoneNumberProvidedIsUsed()
    taskListPage.selectTaskHearingRequirements()
    directionsQuestionnaireSteps.acceptDirectionsQuestionnaireNoJourney()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  settleClaim (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData,
    buttonText: string)
    : void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    settleClaimPage.enterDate(claimantResponseTestData.pageSpecificValues.settleClaimEnterDate)
    settleClaimPage.saveAndContinue()
  }

  acceptPartAdmitFromBusinessWithAlternativePaymentIntention (): void {
    taskListPage.selectTaskViewDefendantResponse()
    defendantsResponsePage.submit()
    defendantsResponsePage.submitHowTheyWantToPay() // bug
    I.see('COMPLETE')
    taskListPage.selectTaskAcceptOrRejectSpecificAmount(50)
    settleAdmittedPage.selectAdmittedYes()
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseNo()
    taskListPage.selectProposeAnAlternativeRepaymentPlan()
    paymentOptionPage.chooseFullBySetDate()
    paymentDatePage.enterDate('2024-01-01')
    paymentDatePage.saveAndContinue()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  acceptFullAdmitFromBusinessWithAlternativePaymentIntention (claimantResponseTestData: ClaimantResponseTestData): void {
    taskListPage.selectTaskViewDefendantResponse()
    defendantsResponsePage.submit()
    defendantsResponsePage.submitHowTheyWantToPay() // bug
    I.see('COMPLETE')
    taskListPage.selectTaskAcceptOrRejectSpecificAmount(50)
    settleAdmittedPage.selectAdmittedYes()
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseNo()
    taskListPage.selectProposeAnAlternativeRepaymentPlan()
    paymentOptionPage.chooseInstalments()
    paymentPlanPage.enterRepaymentPlan(claimantResponseTestData.pageSpecificValues.paymentPlanPageEnterRepaymentPlan)
    paymentDatePage.saveAndContinue()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  acceptSettlement (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData
  ): void {
    taskListPage.selectTaskViewDefendantResponse()
    defendantsResponsePage.submit()
    if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      defendantsResponsePage.submitHowTheyWantToPay()
    }
    I.see('COMPLETE')
    if (!testData.defendantClaimsToHavePaidInFull) {
      taskListPage.selectTaskAcceptOrRejectSpecificAmount(50)
      settleAdmittedPage.selectAdmittedYes()
    }
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseYes()
    taskListPage.selectTaskChooseHowToFormaliseRepayment()
    chooseHowToProceedPage.chooseSettlement()
    taskListPage.selectTaskSignASettlementAgreement()
    signSettlementAgreementPage.confirm()
    taskListPage.selectTaskChooseHowToFormaliseRepayment()
    chooseHowToProceedPage.chooseSettlement()
    taskListPage.selectTaskSignASettlementAgreement()
    signSettlementAgreementPage.confirm()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  acceptSettlementWithClaimantPaymentOption (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData
  ): void {
    taskListPage.selectTaskViewDefendantResponse()
    defendantsResponsePage.submit()
    if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      defendantsResponsePage.submitHowTheyWantToPay()
    }
    I.see('COMPLETE')
    if (!testData.defendantClaimsToHavePaidInFull) {
      taskListPage.selectTaskAcceptOrRejectSpecificAmount(50)
      settleAdmittedPage.selectAdmittedYes()
    }
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseNo()
    taskListPage.selectProposeAnAlternativeRepaymentPlan()
    switch (testData.claimantPaymentOption) {
      case PaymentOption.IMMEDIATELY:
        paymentOptionPage.chooseImmediately()
        courtOfferedSetDataPage.accept()
        break
      case PaymentOption.BY_SET_DATE:
        paymentOptionPage.chooseFullBySetDate()
        paymentDatePage.enterDate(claimantResponseTestData.pageSpecificValues.paymentDatePageEnterDate)
        paymentDatePage.saveAndContinue()
        payBySetDateAccepted.continue()
        if (claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage) {
          courtOfferedInstalmentsPage.accept()
        }
        break
      case PaymentOption.INSTALMENTS:
        paymentOptionPage.chooseInstalments()
        paymentPlanPage.enterRepaymentPlan(claimantResponseTestData.pageSpecificValues.paymentPlanPageEnterRepaymentPlan)
        paymentPlanPage.saveAndContinue()
        payBySetDateAccepted.continue()
        break
      default:
        throw new Error(`Unknown payment option: ${testData.claimantPaymentOption}`)
    }
    taskListPage.selectTaskChooseHowToFormaliseRepayment()
    chooseHowToProceedPage.chooseSettlement()
    taskListPage.selectTaskSignASettlementAgreement()
    signSettlementAgreementPage.confirm()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  acceptCourtOffer (
    testData: EndToEndTestData,
    unReasonableClaimantResponseTestData: UnreasonableClaimantResponseTestData
  ): void {
    taskListPage.selectTaskViewDefendantResponse()
    defendantsResponsePage.submit()
    if (unReasonableClaimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      defendantsResponsePage.submitHowTheyWantToPay()
    }
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseNo()
    taskListPage.selectProposeAnAlternativeRepaymentPlan()
    paymentOptionPage.chooseInstalments()
    paymentPlanPage.enterRepaymentPlan(unReasonableClaimantResponseTestData.pageSpecificValues.paymentPlanPageEnterRepaymentPlan)
    paymentPlanPage.saveAndContinue()
    courtOfferedInstalmentsPage.checkingCourtOfferedPlanAndAccept()
    taskListPage.selectTaskChooseHowToFormaliseRepayment()
    chooseHowToProceedPage.chooseSettlement()
    taskListPage.selectTaskSignASettlementAgreement()
    signSettlementAgreementPage.confirm()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  acceptCCJ (shouldPaySome: boolean, testData: EndToEndTestData): void {
    taskListPage.selectTaskViewDefendantResponse()
    I.click('Continue')
    I.see('COMPLETE')
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseYes()  // no is covered in settlement journey
    taskListPage.selectTaskChooseHowToFormaliseRepayment()
    chooseHowToProceedPage.chooseRequestCcj()
    taskListPage.selectTaskRequestCountyCourtJudgment()
    if (shouldPaySome) {
      ccjPaidAnyMoneyPage.paidSome(10)
    } else {
      ccjPaidAnyMoneyPage.notPaidSome()
    }
    ccjPaidAmountSummaryPage.continue()
    taskListPage.selectTaskCheckandSubmitYourResponse()
    checkAndSendPage.verifyFactsForCCJ()
    I.click('input[type=submit]')
  }

  acceptCCJWithClaimantPaymentOption (
    shouldPaySome: boolean,
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData
  ): void {
    I.dontSeeElement({ css: 'div.task-finished:not(.unfinished)>strong' })
    taskListPage.selectTaskViewDefendantResponse()
    defendantsResponsePage.submit()
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseNo()
    taskListPage.selectProposeAnAlternativeRepaymentPlan()
    switch (testData.claimantPaymentOption) {
      case PaymentOption.IMMEDIATELY:
        paymentOptionPage.chooseImmediately()
        courtOfferedSetDataPage.accept()
        break
      case PaymentOption.BY_SET_DATE:
        paymentOptionPage.chooseFullBySetDate()
        paymentDatePage.enterDate(claimantResponseTestData.pageSpecificValues.paymentDatePageEnterDate)
        paymentDatePage.saveAndContinue()
        payBySetDateAccepted.continue()
        if (claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage) {
          courtOfferedInstalmentsPage.accept()
        }
        break
      case PaymentOption.INSTALMENTS:
        paymentOptionPage.chooseInstalments()
        paymentPlanPage.enterRepaymentPlan(claimantResponseTestData.pageSpecificValues.paymentPlanPageEnterRepaymentPlan)
        paymentPlanPage.saveAndContinue()
        payBySetDateAccepted.continue()
        if (claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage) {
          courtOfferedInstalmentsPage.accept()
        }
        break
      default:
        throw new Error(`Unknown payment option: ${testData.claimantPaymentOption}`)
    }
    taskListPage.selectTaskChooseHowToFormaliseRepayment()
    chooseHowToProceedPage.chooseRequestCcj()
    taskListPage.selectTaskRequestCountyCourtJudgment()
    if (shouldPaySome) {
      ccjPaidAnyMoneyPage.paidSome(10)
    } else {
      ccjPaidAnyMoneyPage.notPaidSome()
    }
    ccjPaidAmountSummaryPage.continue()
    taskListPage.selectTaskCheckandSubmitYourResponse()
    checkAndSendPage.verifyFactsForCCJ()
    I.click('input[type=submit]')
  }
}
