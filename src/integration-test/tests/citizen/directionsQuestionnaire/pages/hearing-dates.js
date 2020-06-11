"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    next: '.next',
    prev: '.prev',
    day: '.day:not(.disabled)'
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class HearingDatesPage {
    chooseYes() {
        I.checkOption('Yes');
        I.waitForElement(fields.next);
        I.click(fields.next);
        I.waitForElement(fields.prev);
        I.click(fields.day);
        I.waitForText('Remove');
        I.click(buttons.submit);
    }
    chooseNo() {
        I.checkOption('No');
        I.click(buttons.submit);
    }
}
exports.HearingDatesPage = HearingDatesPage;
