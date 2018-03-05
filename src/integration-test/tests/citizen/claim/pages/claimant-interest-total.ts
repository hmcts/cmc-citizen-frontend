import I = CodeceptJS.I

const I: I = actor()

const fields = {
  amount: 'todo, for future use'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantInterestTotalPage {

  open (): void {
    I.amOnCitizenAppPage('/claim/total')
  }

  // to be used in the future.
  getTotalAmount (): number {
    return I.grabTextFrom(fields.amount)
  }

  continue (): void {
    I.click(buttons.submit)
  }
}
