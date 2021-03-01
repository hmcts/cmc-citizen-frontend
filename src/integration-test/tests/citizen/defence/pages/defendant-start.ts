import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: { css: 'input.button.button-start' }
}

export class DefendantStartPage {

  open (): void {
    I.amOnCitizenAppPage('/first-contact/start')
  }

  start (): void {
    I.click(buttons.submit)
  }
}
