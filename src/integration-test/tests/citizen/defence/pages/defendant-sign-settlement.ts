import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantSignSettlement {

  selectYes (): void {
    I.click('Yes - I confirm I\'ve read and accept the terms of the agreement.')
  }

  selectNo (): void {
    I.click('No - I reject the terms of the agreement.')
  }

  confirm (): void {
    I.click(buttons.submit)
  }
}
