import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantMoreTimeConfirmationPage {

  confirm (): void {
    I.click(buttons.submit)
  }
}
