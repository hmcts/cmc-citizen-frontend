"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    row: {
        typeOfAccount: 'rows[0][typeOfAccount]',
        joint: 'rows[0][joint]',
        balance: 'rows[0][balance]'
    }
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class BankAccountsPage {
    enterBankAccount(typeOfAccount, joint, balance) {
        I.selectOption(fields.row.typeOfAccount, typeOfAccount);
        I.selectOption(fields.row.joint, joint ? 'Yes' : 'No');
        I.fillField(fields.row.balance, balance.toFixed());
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.BankAccountsPage = BankAccountsPage;
