import I = CodeceptJS.I

const I: I = actor()

const fields = {
  amount: 'input[id=amount]',
  text: 'textarea[id=text]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantHowMuchYouOwePage {

  enterAmountOwedAndExplaination (amount: number, explaination: string): void {
    I.fillField(fields.amount, amount.toString())
    I.fillField(fields.text, explaination)
    I.click(buttons.submit)
  }
}
