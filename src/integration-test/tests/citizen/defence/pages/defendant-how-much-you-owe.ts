import I = CodeceptJS.I

const I: I = actor()

const fields = {
  amount: 'input[id=amount]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantHowMuchYouOwePage {

  enterAmountOwed (amount: number): void {
    I.fillField(fields.amount, amount.toString())
    I.click(buttons.submit)
  }
}
