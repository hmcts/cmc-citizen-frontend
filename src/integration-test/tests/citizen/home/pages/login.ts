import I = CodeceptJS.I

const I: I = actor()

const fields = {
  username: { css: '#username' },
  password: { css: '#password' }
}
const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class LoginPage {

  open (): void {
    I.amOnCitizenAppPage('/')
  }

  login (email: string, password: string): void {
    I.waitForElement(fields.username)
    I.fillField(fields.username, email)
    I.waitForElement(fields.password)
    I.fillField(fields.password, password)
    I.retry(2).click(buttons.submit)
  }

}
