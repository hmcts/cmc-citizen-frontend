import I = CodeceptJS.I

const I: I = actor()

const fields = {
  requestMoreTime: {
    yes: 'input[id=optionyes]',
    no: 'input[id=optionno]'
  }
}

const buttons = {
  submit: 'input[type=submit]'
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
