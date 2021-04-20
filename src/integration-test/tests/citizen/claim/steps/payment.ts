import I = CodeceptJS.I
import { PaymentConfirmationPage } from 'integration-test/tests/citizen/claim/pages/govpay/payment-confirmation'
import { PaymentDetailsPage } from 'integration-test/tests/citizen/claim/pages/govpay/payment-details'

class CardDetailsFactory {
  static createForCard (cardNumber: number): CardDetails {
    return {
      number: cardNumber,
      expiryMonth: '12',
      expiryYear: '22',
      name: 'John Smith',
      verificationCode: '999'
    }
  }
}

const I: I = actor()
const govPaymentDetailsPage: PaymentDetailsPage = new PaymentDetailsPage()
const govPaymentConfirmationPage: PaymentConfirmationPage = new PaymentConfirmationPage()

const billingDetails: Address = {
  line1: '221B Baker Street',
  line2: 'Baker Street',
  city: 'London',
  postcode: 'NW1 6XE'
}

export class PaymentSteps {

  async payWithWorkingCard (I: I): Promise<void> {
    const email = await I.getClaimantEmail()
    govPaymentDetailsPage.enterPaymentDetails(CardDetailsFactory.createForCard(4444333322221111), billingDetails, email)
    govPaymentConfirmationPage.confirmPayment()
  }

  async enterWorkingCard (I: I): Promise<void> {
    const email = await I.getClaimantEmail()
    govPaymentDetailsPage.enterPaymentDetails(CardDetailsFactory.createForCard(4444333322221111), billingDetails, email)
  }

  async payWithDeclinedCard (I: I): Promise<void> {
    const email = await I.getClaimantEmail()
    govPaymentDetailsPage.enterPaymentDetails(CardDetailsFactory.createForCard(4000000000000002), billingDetails, email)
  }

  cancelPaymentFromDetailsPage (): void {
    govPaymentDetailsPage.cancelPayment()
    govPaymentConfirmationPage.goBackToService()
  }

  cancelPaymentFromConfirmationPage (): void {
    govPaymentConfirmationPage.cancelPayment()
  }

  goBackToServiceFromConfirmationPage (): void {
    govPaymentConfirmationPage.goBackToService()
  }
}
