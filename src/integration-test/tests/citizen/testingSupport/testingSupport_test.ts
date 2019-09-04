import I = CodeceptJS.I

import { ClaimantCheckAndSendPage } from 'integration-test/tests/citizen/claim/pages/claimant-check-and-send'
import { PaymentSteps } from 'integration-test/tests/citizen/claim/steps/payment'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { TestingSupportSteps } from 'integration-test/tests/citizen/testingSupport/steps/testingSupport'

const userSteps: UserSteps = new UserSteps()
const testingSupportSteps = new TestingSupportSteps()
const paymentSteps: PaymentSteps = new PaymentSteps()
const claimantCheckAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()

Feature('Testing support')

Scenario('I create a claim draft using testing support and submit it @citizen', async (I: I) => {
  const email: string = await I.createCitizenUser()

  userSteps.login(email)
  testingSupportSteps.createClaimDraft()
  claimantCheckAndSendPage.checkFactsTrueAndSubmit()
  paymentSteps.payWithWorkingCard()

  I.waitForText('Claim submitted')
}).retry(3)
