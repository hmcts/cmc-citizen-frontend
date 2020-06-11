"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    reason: 'textarea[id=text]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantYourDefencePage {
    enterYourDefence(defence) {
        I.fillField(fields.reason, defence);
        I.click(buttons.submit);
    }
}
exports.DefendantYourDefencePage = DefendantYourDefencePage;
