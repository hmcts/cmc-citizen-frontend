"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    yes: 'input[id="consentResponseyes"]',
    no: 'input[id="consentResponseno"]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class NewFeaturesPage {
    optIn() {
        I.checkOption(fields.yes);
        I.click(buttons.submit);
    }
}
exports.NewFeaturesPage = NewFeaturesPage;
