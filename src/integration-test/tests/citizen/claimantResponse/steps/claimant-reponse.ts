import I = CodeceptJS.I

import { PaymentOption } from 'integration-test/data/payment-option'

import { ClaimantAcceptPaymentMethod } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-accept-payment-method'
import { ClaimantTaskListPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-task-list'
import { ClaimantChooseHowToProceed } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-choose-how-to-proceed'
import { ClaimantConfirmation } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-confirmation'
import { ClaimantCheckAndSendPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send'
import { ClaimantSignSettlementAgreement } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-sign-settlement-agreement'
import { ClaimantCcjPaidAmountSummaryPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-ccj-paid-amount-summary'
import { ClaimantCcjPaidAnyMoneyPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-ccj-paid-any-money'
import { ClaimantPaymentOptionPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-payment-option'
import { ClaimantPaymentDatePage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-payment-date'
import { ClaimantPaymentPlanPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-payment-plan'
import { ClaimantPayBySetDateAcceptedPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-pay-by-set-date-accepted'
import { ClaimantCounterOfferAcceptedPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-counter-offer-accepted'

const I: I = actor()
const taskListPage: ClaimantTaskListPage = new ClaimantTaskListPage()
const acceptPaymentMethodPage: ClaimantAcceptPaymentMethod = new ClaimantAcceptPaymentMethod()
const chooseHowToProceedPage: ClaimantChooseHowToProceed = new ClaimantChooseHowToProceed()
const checkAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()
const confirmationPage: ClaimantConfirmation = new ClaimantConfirmation()
const signSettlementAgreementPage: ClaimantSignSettlementAgreement = new ClaimantSignSettlementAgreement()
const ccjPaidAmountSummaryPage: ClaimantCcjPaidAmountSummaryPage = new ClaimantCcjPaidAmountSummaryPage()
const ccjPaidAnyMoneyPage: ClaimantCcjPaidAnyMoneyPage = new ClaimantCcjPaidAnyMoneyPage()
const paymentOptionPage: ClaimantPaymentOptionPage = new ClaimantPaymentOptionPage()
const paymentDatePage: ClaimantPaymentDatePage = new ClaimantPaymentDatePage()
const paymentPlanPage: ClaimantPaymentPlanPage = new ClaimantPaymentPlanPage()
const counterOfferAcceptedPage: ClaimantCounterOfferAcceptedPage = new ClaimantCounterOfferAcceptedPage()
const payBySetDateAcceptedPage: ClaimantPayBySetDateAcceptedPage = new ClaimantPayBySetDateAcceptedPage()
const claimantRepaymentPlan: PaymentPlan = {
  equalInstalment: 5.00,
  firstPaymentDate: '2025-01-01',
  frequency: 'everyMonth'
}

export class ClaimantResponseSteps {

  acceptSettlementFromDashboardWhenRejectPaymentMethod (claimRef: string, paymentOption: PaymentOption): void {
    this.viewClaimFromDashboard(claimRef, true)
    this.acceptSettlement(false, paymentOption)
  }

  acceptSettlementFromDashboardWhenAcceptPaymentMethod (claimRef: string): void {
    this.viewClaimFromDashboard(claimRef, true)
    this.acceptSettlement(true, undefined)
  }

  acceptCcjFromDashboardWhenDefendantHasPaidNoneAndAcceptPaymentMethod (claimRef: string): void {
    this.viewClaimFromDashboard(claimRef, true)
    this.acceptCCJ(false)
  }

  acceptCcjFromDashboardWhenDefendantHasPaidSomeAndAcceptPaymentMethod (claimRef: string): void {
    this.viewClaimFromDashboard(claimRef, true)
    this.acceptCCJ(true)
  }

  viewClaimFromDashboard (claimRef: string, shouldRespondToOffer: boolean): void {
    I.click('My account')
    I.see('Your money claims account')
    I.click(claimRef)
    if (shouldRespondToOffer) {
      I.click('View and respond to the offer')
    }
  }

  acceptSettlement (shouldAcceptPaymentMethod: boolean, paymentOption: PaymentOption): void {
    I.dontSee('COMPLETE')
    taskListPage.selectTaskViewDefendantResponse()
    I.click('Continue')
    I.see('COMPLETED')
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    if (shouldAcceptPaymentMethod) {
      acceptPaymentMethodPage.chooseYes()
      taskListPage.selectTaskChooseHowToFormaliseRepayment()
      chooseHowToProceedPage.chooseSettlement()
      taskListPage.selectTaskSignASettlementAgreement()
      signSettlementAgreementPage.confirm()
    } else {
      acceptPaymentMethodPage.chooseNo()
      taskListPage.selectProposeAnAlternativeRepaymentPlan()
      switch (paymentOption) {
        case PaymentOption.IMMEDIATELY:
          paymentOptionPage.chooseImmediately()
          break
        case PaymentOption.BY_SET_DATE:
          paymentOptionPage.chooseFullBySetDate()
          paymentDatePage.enterDate('2025-01-01')
          paymentDatePage.saveAndContinue()
          payBySetDateAcceptedPage.continue()
          break
        case PaymentOption.INSTALMENTS:
          paymentOptionPage.chooseInstalments()
          paymentPlanPage.enterRepaymentPlan(claimantRepaymentPlan)
          paymentPlanPage.saveAndContinue()
          counterOfferAcceptedPage.continue()
          break
        default:
          throw new Error(`Unknown payment option: ${paymentOption}`)
      }
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
    I.see('County Court Judgment issued')
    confirmationPage.clickGoToYourAccount()
  }

}
