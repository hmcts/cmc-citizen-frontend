"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    reason: 'textarea[id=reason]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantReasonPage {
    open() {
        I.amOnCitizenAppPage('/claim/reason');
    }
    enterReason(reason) {
        I.fillField(fields.reason, reason);
        I.click(buttons.submit);
    }
}
exports.ClaimantReasonPage = ClaimantReasonPage;
