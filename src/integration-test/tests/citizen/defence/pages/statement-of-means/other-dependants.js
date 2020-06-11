"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    options: {
        declared: 'input[id="declaredtrue"]',
        notDeclared: 'input[id="declaredfalse"]'
    },
    numberOfPeople: {
        value: 'input[id="numberOfPeople[value]"]',
        details: 'textarea[id="numberOfPeople[details]"]'
    }
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class OtherDependantsPage {
    selectDeclared() {
        I.checkOption(fields.options.declared);
    }
    selectNotDeclared() {
        I.checkOption(fields.options.notDeclared);
    }
    enterNumberOfPeople(value, details) {
        I.fillField(fields.numberOfPeople.value, value.toFixed());
        I.fillField(fields.numberOfPeople.details, details);
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.OtherDependantsPage = OtherDependantsPage;
