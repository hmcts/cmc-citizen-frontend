import I = CodeceptJS.I
import { PaymentOption } from 'integration-test/data/payment-option'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'
import { ClaimantResponseTestData } from 'integration-test/tests/citizen/claimantResponse/data/ClaimantResponseTestData'
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
import { ClaimantFreeMediationPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-free-mediation'
import { ClaimantSettleClaimPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-settle-claim'

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
const freeMediationPage: ClaimantFreeMediationPage = new ClaimantFreeMediationPage()

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
    this.acceptCCJ(false)
  }

  acceptCcjFromDashboardWhenDefendantHasPaidSomeAndAcceptPaymentMethod (
    testData: EndToEndTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.acceptCCJ(true)
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
    I.dontSee('COMPLETE')
    taskListPage.selectTaskViewDefendantResponse()
    defendantsResponsePage.submit()
    if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      defendantsResponsePage.submitHowTheyWantToPay()
    }
    I.see('COMPLETED')
    if (!testData.defendantClaimsToHavePaidInFull) {
      taskListPage.selectTaskAcceptOrRejectSpecificAmount(50)
      settleAdmittedPage.selectAdmittedNo()
    }
    taskListPage.selectTaskFreeMediation()
    freeMediationPage.accept()
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
    I.dontSee('COMPLETE')
    taskListPage.selectTaskViewDefendantResponse()
    defendantsResponsePage.submit()
    defendantsResponsePage.submitHowTheyWantToPay() // bug
    I.see('COMPLETED')
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
    I.dontSee('COMPLETE')
    taskListPage.selectTaskViewDefendantResponse()
    defendantsResponsePage.submit()
    defendantsResponsePage.submitHowTheyWantToPay() // bug
    I.see('COMPLETED')
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
    I.dontSee('COMPLETE')
    taskListPage.selectTaskViewDefendantResponse()
    defendantsResponsePage.submit()
    if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      defendantsResponsePage.submitHowTheyWantToPay()
    }
    I.see('COMPLETED')
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
    I.dontSee('COMPLETE')
    taskListPage.selectTaskViewDefendantResponse()
    defendantsResponsePage.submit()
    if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      defendantsResponsePage.submitHowTheyWantToPay()
    }
    I.see('COMPLETED')
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

  acceptCCJ (shouldPaySome: boolean): void {
    I.dontSee('COMPLETE')
    taskListPage.selectTaskViewDefendantResponse()
    I.click('Continue')
    I.see('COMPLETED')
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
    checkAndSendPage.checkFactsTrueAndSubmit()
  }

  acceptCCJWithClaimantPaymentOption (
    shouldPaySome: boolean,
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData
  ): void {
    I.dontSee('COMPLETE')
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
    if (shouldPaySome) {
      ccjPaidAnyMoneyPage.paidSome(10)
    } else {
      ccjPaidAnyMoneyPage.notPaidSome()
    }
    ccjPaidAmountSummaryPage.continue()
    taskListPage.selectTaskCheckandSubmitYourResponse()
    checkAndSendPage.verifyFactsForCCJ()
    checkAndSendPage.checkFactsTrueAndSubmit()
  }
}
