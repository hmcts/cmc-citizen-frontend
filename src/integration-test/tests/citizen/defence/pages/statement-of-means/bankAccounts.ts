import I = CodeceptJS.I

const I: I = actor()

const fields = {
  row: {
    typeOfAccount: 'rows[0][typeOfAccount]',
    joint: 'rows[0][joint]',
    balance: 'rows[0][balance]'
  }
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class BankAccountsPage {

  enterBankAccount (typeOfAccount: string, joint: boolean, balance: number): void {
    I.waitInUrl('statement-of-means/bank-accounts')
    I.selectOption(fields.row.typeOfAccount, typeOfAccount)
    I.selectOption(fields.row.joint, joint ? 'Yes' : 'No')
    I.fillField(fields.row.balance, balance.toFixed())
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
