import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
import { PaymentSteps } from 'integration-test/tests/citizen/claim/steps/payment'

const claimSteps: ClaimSteps = new ClaimSteps()
const paymentSteps: PaymentSteps = new PaymentSteps()

Feature('Claim issue').retry(3)

Scenario('I can cancel payment, attempt payment with declined card and finally issue claim using working card @citizen @quick', function* (I: I) {
  const email: string = yield I.createCitizenUser()

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
  claimSteps.reloadPage() // reload gets over the ESOCKETTIMEDOUT Error
  claimSteps.reloadPage() // reload gets over the 409 Duplicate Key value violates unique constraint Error
  I.waitForText('Claim submitted')
})
