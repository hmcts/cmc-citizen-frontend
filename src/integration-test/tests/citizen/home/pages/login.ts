import I = CodeceptJS.I

const I: I = actor()

const fields = {
  username: '#username',
  password: '#password'
}
const buttons = {
  submit: 'input[type=submit]'
}

export class LoginPage {

  open (): void {
    I.amOnCitizenAppPage('/')
  }

  login (email: string, password: string): void {
    I.fillField(fields.username, email)
    I.fillField(fields.password, password)
    I.click(buttons.submit)
  }

}
