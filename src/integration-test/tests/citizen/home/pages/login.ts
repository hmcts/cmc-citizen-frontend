import I = CodeceptJS.I

const I: I = actor()

// DTSCCI-5286 (HMCTS Access migration): dual-UI selectors.
// Each locator matches BOTH the legacy IDAM login screen AND the new HMCTS Access login screen so
// the suite stays green throughout the transition window. Only one of the alternatives is present
// on a given page, so the OR-selector resolves to a single visible field.
// TODO(DTSCCI-5286): confirm the exact HMCTS Access selectors in a lower env, then AFTER cutover
// remove the legacy fallbacks (#username / #password / input[type=submit]) — HMCTS Access only.
const fields = {
  username: { css: '#username, input[name="username"], input[name="email"], #email' },
  password: { css: '#password, input[name="password"], input[type="password"]' }
}
const buttons = {
  submit: { css: 'input[type=submit], button[type=submit], button[name="save"], #continue' }
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
