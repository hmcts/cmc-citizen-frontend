"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    disabledAccess: {
        input: 'input[id="disabledAccessSelectedtrue"]'
    },
    hearingLoop: {
        input: 'input[id="hearingLoopSelectedtrue"]'
    },
    signLanguageInterpreter: {
        input: 'input[id="signLanguageSelectedtrue"]',
        details: 'input[id="signLanguageInterpreted"]'
    },
    languageInterpreter: {
        input: 'input[id="languageSelectedtrue"]',
        details: 'input[id="languageInterpreted"]'
    },
    otherSupport: {
        input: 'input[id="otherSupportSelectedtrue"]',
        details: 'textarea[id="otherSupport"]'
    }
};
const buttons = {
    submit: 'input[type=submit]'
};
class SupportRequiredPage {
    selectAll() {
        const someText = 'Some Text';
        I.checkOption(fields.disabledAccess.input);
        I.checkOption(fields.hearingLoop.input);
        I.checkOption(fields.signLanguageInterpreter.input);
        I.fillField(fields.signLanguageInterpreter.details, someText);
        I.checkOption(fields.languageInterpreter.input);
        I.fillField(fields.languageInterpreter.details, someText);
        I.checkOption(fields.otherSupport.input);
        I.fillField(fields.otherSupport.details, someText);
        I.click(buttons.submit);
    }
}
exports.SupportRequiredPage = SupportRequiredPage;
