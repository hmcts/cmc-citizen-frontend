import I = CodeceptJS.I

const I: I = actor()

const fields = {
  row: {
    typeOfAccount: 'form select[name=rows[0][typeOfAccount]]',
    joint: 'form select[name=rows[0][joint]]',
    balance: 'form select[name=rows[0][balance]]'
  }
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class BankAccountsPage {

  enterBankAccount (typeOfAccount: string, joint: boolean, balance: number): void {
    I.selectOption(fields.row.typeOfAccount, typeOfAccount)
    I.selectOption(fields.row.joint, joint ? 'Yes' : 'No')
    I.fillField(fields.row.balance, balance.toFixed())
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
