import { PartyType } from 'integration-test/data/party-type'
import { createDefendant } from 'integration-test/data/test-data'
import { CountyCourtJudgementCheckAndSendPage } from 'integration-test/tests/citizen/ccj/pages/ccj-check-and-send'
import { DefendantPaidAnyMoneyPage } from 'integration-test/tests/citizen/ccj/pages/defendant-paid-any-money'
import { DefendantPayByInstalmentsPage } from 'integration-test/tests/citizen/ccj/pages/defendant-pay-by-instalments'
import { DefendantPayBySetDatePage } from 'integration-test/tests/citizen/ccj/pages/defendant-pay-by-set-date'
import { PaidAmountSummaryPage } from 'integration-test/tests/citizen/ccj/pages/paid-amount-summary'
import { PaymentOptionsPage } from 'integration-test/tests/citizen/ccj/pages/payment-options'
import { CitizenDobPage } from 'integration-test/tests/citizen/claim/pages/citizen-dob'
import { DashboardSteps } from 'integration-test/tests/citizen/dashboard/steps/dashboard'
import { TestingSupportSteps } from 'integration-test/tests/citizen/testingSupport/steps/testingSupport'
import I = CodeceptJS.I

const I: I = actor()
const testingSupport: TestingSupportSteps = new TestingSupportSteps()
const dashboardSteps: DashboardSteps = new DashboardSteps()
const ccjDateOfBirthPage: CitizenDobPage = new CitizenDobPage()
const ccjDefendantPaidAnyMoneyPage: DefendantPaidAnyMoneyPage = new DefendantPaidAnyMoneyPage()
const ccjPaidAmountSummary: PaidAmountSummaryPage = new PaidAmountSummaryPage()
const ccjPaymentOptionsPage: PaymentOptionsPage = new PaymentOptionsPage()
const ccjDefendantPaidByInstalmentsPage: DefendantPayByInstalmentsPage = new DefendantPayByInstalmentsPage()
const ccjDefendantPayBySetDatePage: DefendantPayBySetDatePage = new DefendantPayBySetDatePage()
const ccjCheckAndSendPage: CountyCourtJudgementCheckAndSendPage = new CountyCourtJudgementCheckAndSendPage()

const ccjRepaymentPlan: PaymentPlan = {
  equalInstalment: 20.00,
  firstPaymentDate: '2025-01-01',
  frequency: 'everyWeek'
}

const paymentBySetDate = '2025-01-01'
const defendant: Party = createDefendant(PartyType.INDIVIDUAL, false, true)
const defendantPaidAmount = 35.50

export class CountyCourtJudgementSteps {

  requestCCJ (claimRef: string, defendantType: PartyType): void {
    testingSupport.makeClaimAvailableForCCJ(claimRef)
    dashboardSteps.startCCJ(claimRef)
    if (defendantType === PartyType.INDIVIDUAL) {
      I.see('Do you know the defendant’s date of birth?')
      I.click('input[id=knowntrue]')
      ccjDateOfBirthPage.enterDOB(defendant.dateOfBirth)
    }
    I.see('Has the defendant paid some of the amount owed?')
    ccjDefendantPaidAnyMoneyPage.defendantPaid(defendantPaidAmount)
    ccjPaidAmountSummary.checkAmounts(defendantPaidAmount)
    ccjPaidAmountSummary.continue()
  }

  ccjDefendantToPayByInstalments (): void {
    ccjPaymentOptionsPage.chooseInstalments()
    ccjDefendantPaidByInstalmentsPage.checkOutstandingAmount(defendantPaidAmount)
    ccjDefendantPaidByInstalmentsPage.enterRepaymentPlan(ccjRepaymentPlan)
  }

  ccjDefendantToPayBySetDate (): void {
    ccjPaymentOptionsPage.chooseFullBySetDate()
    ccjDefendantPayBySetDatePage.paymentBySetDate(paymentBySetDate)
  }

  ccjDefendantToPayImmediately (): void {
    ccjPaymentOptionsPage.chooseImmediately()
  }

  checkCCJFactsAreTrueAndSubmit (claimantType: PartyType, defendant: Party, defendantType: PartyType): void {
    ccjCheckAndSendPage.verifyCheckAndSendAnswers(defendant, defendantType, defendantPaidAmount, defendant.address)

    if (claimantType === PartyType.COMPANY || claimantType === PartyType.ORGANISATION) {
      ccjCheckAndSendPage.signStatementOfTruthAndSubmit('Mr CCJ submitter', 'Director')
    } else {
      ccjCheckAndSendPage.checkFactsTrueAndSubmit()
    }
  }
}
