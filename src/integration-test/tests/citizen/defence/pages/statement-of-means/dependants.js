"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    options: {
        declared: 'input[id="declaredtrue"]',
        notDeclared: 'input[id="declaredfalse"]'
    },
    ageGroups: {
        under11: 'input[id="numberOfChildren[under11]"]',
        between11And15: 'input[id="numberOfChildren[between11and15]"]',
        between16And19: 'input[id="numberOfChildren[between16and19]"]'
    }
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class DependantsPage {
    selectDeclared() {
        I.checkOption(fields.options.declared);
    }
    selectNotDeclared() {
        I.checkOption(fields.options.notDeclared);
    }
    enterNumberOfChildren(numberOfChildrenUnder11, numberOfChildrenBetween11And15, numberOfChildrenBetween16And19) {
        I.fillField(fields.ageGroups.under11, numberOfChildrenUnder11.toFixed());
        I.fillField(fields.ageGroups.between11And15, numberOfChildrenBetween11And15.toFixed());
        I.fillField(fields.ageGroups.between16And19, numberOfChildrenBetween16And19.toFixed());
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.DependantsPage = DependantsPage;
