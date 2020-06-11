"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    reason: 'textarea[id="reason"]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class HearingExceptionalCircumstancesPage {
    chooseYes() {
        I.checkOption('Yes');
        I.fillField(fields.reason, 'Some Reason');
        I.click(buttons.submit);
    }
    chooseNo() {
        I.checkOption('No');
        I.fillField(fields.reason, 'Some Reason');
        I.click(buttons.submit);
    }
}
exports.HearingExceptionalCircumstancesPage = HearingExceptionalCircumstancesPage;
