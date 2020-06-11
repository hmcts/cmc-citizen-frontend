"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const radioButtons = {
    optionYes: 'input[id=receivedyes]',
    optionNo: 'input[id=receivedno]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantPartPaymentReceivedPage {
    yesTheDefendantHasPaid() {
        I.checkOption(radioButtons.optionYes);
        I.click(buttons.submit);
    }
    noTheDefendantHasNotPaid() {
        I.checkOption(radioButtons.optionNo);
        I.click(buttons.submit);
    }
}
exports.ClaimantPartPaymentReceivedPage = ClaimantPartPaymentReceivedPage;
