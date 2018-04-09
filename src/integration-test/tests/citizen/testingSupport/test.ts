import I = CodeceptJS.I

import { ClaimantCheckAndSendPage } from 'integration-test/tests/citizen/claim/pages/claimant-check-and-send'
import { PaymentSteps } from 'integration-test/tests/citizen/claim/steps/payment'
import { TestingSupportSteps } from 'integration-test/tests/citizen/testingSupport/steps/testingSupport'

const testingSupportSteps = new TestingSupportSteps()
const paymentSteps: PaymentSteps = new PaymentSteps()
const claimantCheckAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()

Scenario('I create a claim draft using testing support and submit it @citizen', function* (I: I) {
  testingSupportSteps.createClaimDraft()
  claimantCheckAndSendPage.checkFactsTrueAndSubmit()
  paymentSteps.payWithWorkingCard()

  I.waitForText('Claim submitted')
})
