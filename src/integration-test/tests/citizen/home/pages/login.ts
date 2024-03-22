import I = CodeceptJS.I
import * as codeceptjs from 'codeceptjs'

const I = codeceptjs.actoour()

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
    I.waitForText('Email address', 60)
    I.waitForVisible(fields.username)
    I.fillField(fields.username, email)
    I.fillField(fields.password, password)
    I.click(buttons.submit)
  }

}
