import I = CodeceptJS.I

const I: I = actor()

const fields = {
  phoneNumber: { css: 'input[id=number]' }
}

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class DefendantPhonePage {

  enterPhone (phoneNumber: string): void {
    I.fillField(fields.phoneNumber, phoneNumber)
    I.click(buttons.submit)
  }
}
