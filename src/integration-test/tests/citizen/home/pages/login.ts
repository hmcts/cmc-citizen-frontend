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
    I.retry(2).fillField({ css: '#username' }, email)
    I.retry(2).fillField({ css: '#password' }, password)
    I.click(buttons.submit)
  }

}
