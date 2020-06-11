"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const links = {
    goBack: '#return-url'
};
const buttons = {
    confirm: '//*[@id="confirm"]'
};
class PaymentConfirmationPage {
    confirmPayment() {
        I.waitForText('Confirm your payment');
        I.click(buttons.confirm);
    }
    cancelPayment() {
        I.waitForText('Confirm your payment');
        I.click('Cancel payment');
    }
    goBackToService() {
        I.click(links.goBack);
    }
}
exports.PaymentConfirmationPage = PaymentConfirmationPage;
