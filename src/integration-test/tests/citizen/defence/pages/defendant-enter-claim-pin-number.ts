import I = CodeceptJS.I

const I: I = actor()

const fields = {
  pinNumber: 'input#pinnumber'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantEnterClaimPinNumberPage {

  enterPinNumber (pinNumber: string): void {
    I.fillField(fields.pinNumber, pinNumber)

    I.click(buttons.submit)
  }
}
