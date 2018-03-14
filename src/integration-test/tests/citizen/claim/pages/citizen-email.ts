import I = CodeceptJS.I

const I: I = actor()

const fields = {
  email: 'input[id=address]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class CitizenEmailPage {

  open (type: string): void {
    I.amOnCitizenAppPage('/claim/defendant-email')
  }

  enterEmail (emailAddress: string): void {
    I.fillField(fields.email, emailAddress)
    I.click(buttons.submit)
  }

  submitForm (): void {
    I.click(buttons.submit)
  }
}
