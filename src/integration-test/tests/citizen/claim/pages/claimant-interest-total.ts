import I = CodeceptJS.I

const I: I = actor()

const fields = {
  amount: 'input[id=amount]',
  reason: 'textarea[id=reason]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantInterestTotalPage {

  selectInterestTotal (amount: string, reason: string): void {
    I.fillField(fields.amount, amount)
    I.fillField(fields.reason, reason)
    I.click(buttons.submit)
  }
}
