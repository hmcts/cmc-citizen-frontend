import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class DefendantMoreTimeConfirmationPage {

  confirm (): void {
    I.click(buttons.submit)
  }
}
