import I = CodeceptJS.I

const I: I = actor()

const fields = {
  phoneNumber: 'input[id=number]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class CitizenPhonePage {

  open (type: string): void {
    I.amOnCitizenAppPage(`/claim/${type}-phone`)
  }

  enterPhone (phoneNumber: string): void {
    I.fillField(fields.phoneNumber, phoneNumber)
    I.click(buttons.submit)
  }
}
