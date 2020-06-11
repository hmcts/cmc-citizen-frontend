"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantEnterClaimPinNumberPage {
    enterPinNumber(pinNumber) {
        I.fillField('input#pin', pinNumber);
        I.click(buttons.submit);
    }
}
exports.DefendantEnterClaimPinNumberPage = DefendantEnterClaimPinNumberPage;
