import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class BankAccountsPage {

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
