import I = CodeceptJS.I

const I: I = actor()

const fields = {
  typeOfAccount: 'rows[0][typeOfAccount]',
  joint: 'rows[0][joint]',
  balance: 'rows[0][balance]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class BankAccountsPage {

  addBankAccount (): void {
    I.selectOption(fields.typeOfAccount, 'Current account')
    I.selectOption(fields.joint, 'No')
    I.fillField(fields.balance, '1000.00')
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
