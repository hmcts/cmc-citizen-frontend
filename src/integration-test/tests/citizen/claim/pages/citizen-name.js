"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    name: 'input[id=name]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class CitizenNamePage {
    open(type) {
        I.amOnCitizenAppPage(`/claim/${type}-name`);
    }
    enterName(name) {
        I.fillField(fields.name, name);
        I.click(buttons.submit);
    }
}
exports.CitizenNamePage = CitizenNamePage;
