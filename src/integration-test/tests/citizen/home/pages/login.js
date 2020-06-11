"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    username: '#username',
    password: '#password'
};
const buttons = {
    submit: 'input[type=submit]'
};
class LoginPage {
    open() {
        I.amOnCitizenAppPage('/');
    }
    login(email, password) {
        I.fillField(fields.username, email);
        I.fillField(fields.password, password);
        I.click(buttons.submit);
    }
}
exports.LoginPage = LoginPage;
