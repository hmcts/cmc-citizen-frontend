"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantMoreTimeConfirmationPage {
    confirm() {
        I.click(buttons.submit);
    }
}
exports.DefendantMoreTimeConfirmationPage = DefendantMoreTimeConfirmationPage;
