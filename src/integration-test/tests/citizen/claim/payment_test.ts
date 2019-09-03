import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
import { PaymentSteps } from 'integration-test/tests/citizen/claim/steps/payment'

const claimSteps: ClaimSteps = new ClaimSteps()
const paymentSteps: PaymentSteps = new PaymentSteps()

Feature('Claim issue')

Scenario('I can cancel payment, attempt payment with declined card and finally issue claim using working card @citizen @quick', { retries: 3 }, async (I: I) => {
  const email: string = await I.createCitizenUser()

  claimSteps.makeAClaimAndSubmitStatementOfTruth(email, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, true)

  paymentSteps.enterWorkingCard()
  paymentSteps.cancelPaymentFromConfirmationPage()
  I.waitForText('Your payment has been cancelled')
  paymentSteps.goBackToServiceFromConfirmationPage()

  claimSteps.checkClaimFactsAreTrueAndSubmit(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  paymentSteps.payWithDeclinedCard()
  I.waitForText('Your payment has been declined')
  paymentSteps.goBackToServiceFromConfirmationPage()

  claimSteps.checkClaimFactsAreTrueAndSubmit(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  paymentSteps.payWithWorkingCard()
  I.waitForText('Claim submitted')
})
