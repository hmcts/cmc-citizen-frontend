import I = CodeceptJS.I

const I: I = actor()

const fields = {
  isDisabled: 'input[id=disabledyes]',
  notDisabled: 'input[id=disabledno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DisabilityPage {

  selectYesOption (): void {
    I.checkOption(fields.isDisabled)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.notDisabled)
    I.click(buttons.submit)
  }
}
