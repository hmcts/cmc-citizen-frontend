import I = CodeceptJS.I

const I: I = actor()

const fields = {
  requestMoreTime: {
    yes: { css: 'input[id=optionyes]' },
    no: { css: 'input[id=optionno]' }
  }
}

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class DefendantMoreTimeRequestPage {

  chooseYes (): void {
    I.checkOption(fields.requestMoreTime.yes)
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.checkOption(fields.requestMoreTime.no)
    I.click(buttons.submit)
  }
}
