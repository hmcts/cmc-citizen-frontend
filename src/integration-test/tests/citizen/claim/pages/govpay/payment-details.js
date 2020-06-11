"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    card: {
        number: '#card-no',
        expiryDate: {
            month: '#expiry-month',
            year: '#expiry-year'
        },
        name: '#cardholder-name',
        verificationCode: '#cvc'
    },
    address: {
        line1: '#address-line-1',
        city: '#address-city',
        postcode: '#address-postcode'
    },
    email: '#email'
};
class PaymentDetailsPage {
    open() {
        I.amOnCitizenAppPage('/claim/pay');
    }
    enterPaymentDetails(cardDetails, billingDetails, email) {
        I.waitForText('Enter card details');
        I.fillField(fields.card.number, cardDetails.number.toString());
        I.fillField(fields.card.expiryDate.month, cardDetails.expiryMonth);
        I.fillField(fields.card.expiryDate.year, cardDetails.expiryYear);
        I.fillField(fields.card.name, cardDetails.name);
        I.fillField(fields.card.verificationCode, cardDetails.verificationCode);
        I.fillField(fields.address.line1, billingDetails.line1);
        I.fillField(fields.address.city, billingDetails.city);
        I.fillField(fields.address.postcode, billingDetails.postcode);
        I.fillField(fields.email, email);
        this.submitCardDetailsForm();
    }
    submitCardDetailsForm() {
        I.executeScript(function () {
            document.getElementById('card-details')['submit']();
        });
    }
    cancelPayment() {
        I.waitForText('Enter card details');
        I.click('Cancel payment');
    }
}
exports.PaymentDetailsPage = PaymentDetailsPage;
