import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantEnterClaimPinNumberPage {

  enterPinNumber (pinNumber: string): void {
    I.fillField('input#pin', pinNumber)
    I.click(buttons.submit)
  }
}
