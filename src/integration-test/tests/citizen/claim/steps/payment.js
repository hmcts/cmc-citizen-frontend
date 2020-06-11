"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_confirmation_1 = require("integration-test/tests/citizen/claim/pages/govpay/payment-confirmation");
const payment_details_1 = require("integration-test/tests/citizen/claim/pages/govpay/payment-details");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
class CardDetailsFactory {
    static createForCard(cardNumber) {
        return {
            number: cardNumber,
            expiryMonth: '12',
            expiryYear: '20',
            name: 'John Smith',
            verificationCode: '999'
        };
    }
}
const I = actor();
const govPaymentDetailsPage = new payment_details_1.PaymentDetailsPage();
const govPaymentConfirmationPage = new payment_confirmation_1.PaymentConfirmationPage();
const userSteps = new user_1.UserSteps();
const billingDetails = {
    line1: '221B Baker Street',
    line2: 'Baker Street',
    city: 'London',
    postcode: 'NW1 6XE'
};
const email = userSteps.getClaimantEmail();
class PaymentSteps {
    payWithWorkingCard() {
        govPaymentDetailsPage.enterPaymentDetails(CardDetailsFactory.createForCard(4444333322221111), billingDetails, email);
        govPaymentConfirmationPage.confirmPayment();
    }
    enterWorkingCard() {
        govPaymentDetailsPage.enterPaymentDetails(CardDetailsFactory.createForCard(4444333322221111), billingDetails, email);
    }
    payWithDeclinedCard() {
        govPaymentDetailsPage.enterPaymentDetails(CardDetailsFactory.createForCard(4000000000000002), billingDetails, email);
    }
    cancelPaymentFromDetailsPage() {
        govPaymentDetailsPage.cancelPayment();
        govPaymentConfirmationPage.goBackToService();
    }
    cancelPaymentFromConfirmationPage() {
        govPaymentConfirmationPage.cancelPayment();
    }
    goBackToServiceFromConfirmationPage() {
        govPaymentConfirmationPage.goBackToService();
    }
}
exports.PaymentSteps = PaymentSteps;
