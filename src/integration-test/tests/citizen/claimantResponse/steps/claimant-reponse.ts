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
const claimantDefendantResponsePage: ClaimantDefendantResponsePage = new ClaimantDefendantResponsePage()
const settleAdmittedPage: ClaimantSettleAdmittedPage = new ClaimantSettleAdmittedPage()
const freeMediationPage: ClaimantFreeMediationPage = new ClaimantFreeMediationPage()

export class ClaimantResponseSteps {

  signSettlementFromDashboardWhenRejectPaymentMethod (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.signSettlementWithClaimantPaymentOption(testData, claimantResponseTestData)
  }

  signSettlementFromDashboardWhenAcceptPaymentMethod (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.signSettlementWithDefendantPaymentOption(testData, claimantResponseTestData)
  }

  requestCcjFromDashboardWhenDefendantHasPaidNoneAndAcceptPaymentMethod (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.requestCCJ(testData, claimantResponseTestData)
  }

  requestCcjFromDashboardWhenDefendantHasPaidSomeAndAcceptPaymentMethod (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.requestCCJ(testData, claimantResponseTestData)
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
    claimantDefendantResponsePage.submit()
    if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      claimantDefendantResponsePage.submitHowTheyWantToPay()
    }
    I.see('COMPLETED')
    if (!testData.defendantClaimsToHavePaidInFull) {
      taskListPage.selectAcceptOrRejectSpecificAmount(50)
      settleAdmittedPage.selectAdmittedNo()
    }
    taskListPage.selectTaskFreeMediation()
    freeMediationPage.accept()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  signSettlementWithDefendantPaymentOption (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData
  ): void {
    I.dontSee('COMPLETE')
    taskListPage.selectTaskViewDefendantResponse()
    claimantDefendantResponsePage.submit()
    if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      claimantDefendantResponsePage.submitHowTheyWantToPay()
    }
    I.see('COMPLETED')
    if (!testData.defendantClaimsToHavePaidInFull) {
      taskListPage.selectAcceptOrRejectSpecificAmount(50)
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

  signSettlementWithClaimantPaymentOption (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData
  ): void {
    I.dontSee('COMPLETE')
    taskListPage.selectTaskViewDefendantResponse()
    claimantDefendantResponsePage.submit()
    if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      claimantDefendantResponsePage.submitHowTheyWantToPay()
    }
    I.see('COMPLETED')
    if (!testData.defendantClaimsToHavePaidInFull) {
      taskListPage.selectAcceptOrRejectSpecificAmount(50)
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

  requestCCJ (testData: EndToEndTestData, claimantResponseTestData: ClaimantResponseTestData): void {
    I.dontSee('COMPLETE')
    taskListPage.selectTaskViewDefendantResponse()
    claimantDefendantResponsePage.submit()
    if (claimantResponseTestData &&
      claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      claimantDefendantResponsePage.submitHowTheyWantToPay()
    }
    I.see('COMPLETED')

    if (!testData.defendantClaimsToHavePaidInFull) {
      taskListPage.selectAcceptOrRejectSpecificAmount(50)
      settleAdmittedPage.selectAdmittedYes()
    }

    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseYes()  // no is covered in settlement journey
    taskListPage.selectTaskChooseHowToFormaliseRepayment()
    chooseHowToProceedPage.chooseRequestCcj()
    taskListPage.selectTaskRequestCountyCourtJudgment()
    if (claimantResponseTestData &&
      claimantResponseTestData.shouldPaySome) {
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
