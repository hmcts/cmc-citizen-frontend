"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantViewClaimPage {
    open() {
        I.amOnCitizenAppPage('/first-contact/claim-summary');
    }
    clickRespondToClaim() {
        I.waitForText('View amount breakdown');
        I.click('summary');
        I.see('Claim fee £25');
        I.click(buttons.submit);
    }
}
exports.DefendantViewClaimPage = DefendantViewClaimPage;
