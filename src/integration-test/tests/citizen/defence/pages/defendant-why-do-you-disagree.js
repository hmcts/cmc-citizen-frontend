"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    reason: 'textarea[id=text]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantWhyDoYouDisagreePage {
    enterReason(reason) {
        I.fillField(fields.reason, reason);
        I.click(buttons.submit);
    }
}
exports.DefendantWhyDoYouDisagreePage = DefendantWhyDoYouDisagreePage;
