import I = CodeceptJS.I

const I: I = actor()

const fields = {
  mobileNumber: 'input[id=number]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class CitizenMobilePage {

  open (type: string): void {
    I.amOnCitizenAppPage(`/claim/${type}-mobile`)
  }

  enterMobile (mobileNumber: string): void {
    I.fillField(fields.mobileNumber, mobileNumber)
    I.click(buttons.submit)
  }
}
