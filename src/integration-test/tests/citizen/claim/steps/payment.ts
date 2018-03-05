import { PaymentConfirmationPage } from 'integration-tests/tests/citizen/claim/pages/govpay/payment-confirmation'
import { PaymentDetailsPage } from 'integration-tests/tests/citizen/claim/pages/govpay/payment-details'

class CardDetailsFactory {
  static createForCard (cardNumber: number): CardDetails {
    return {
      number: cardNumber,
      expiryMonth: '12',
      expiryYear: '20',
      name: 'John Smith',
      verificationCode: '999'
    }
  }
}

const govPaymentDetailsPage: PaymentDetailsPage = new PaymentDetailsPage()
const govPaymentConfirmationPage: PaymentConfirmationPage = new PaymentConfirmationPage()

const billingDetails: Address = {
  line1: '221B Baker Street',
  city: 'London',
  postcode: 'NW1 6XE'
}

const email = 'civilmoneyclaims+payment@gmail.com'

export class PaymentSteps {

  payWithWorkingCard (): void {
    govPaymentDetailsPage.enterPaymentDetails(CardDetailsFactory.createForCard(4444333322221111), billingDetails, email)
    govPaymentConfirmationPage.confirmPayment()
  }

  enterWorkingCard (): void {
    govPaymentDetailsPage.enterPaymentDetails(CardDetailsFactory.createForCard(4444333322221111), billingDetails, email)
  }

  payWithDeclinedCard (): void {
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
