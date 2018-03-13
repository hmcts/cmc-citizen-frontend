import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantMoreTimeRequestPage {

  chooseYes (): void {
    I.checkOption('Yes, I need an extra 14 days')
    I.click(buttons.submit)
  }
}
