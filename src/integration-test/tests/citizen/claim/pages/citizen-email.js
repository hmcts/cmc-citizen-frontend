"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    email: 'input[id=address]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class CitizenEmailPage {
    open(type) {
        I.amOnCitizenAppPage('/claim/defendant-email');
    }
    enterEmail(emailAddress) {
        I.fillField(fields.email, emailAddress);
        I.click(buttons.submit);
    }
    submitForm() {
        I.click(buttons.submit);
    }
}
exports.CitizenEmailPage = CitizenEmailPage;
