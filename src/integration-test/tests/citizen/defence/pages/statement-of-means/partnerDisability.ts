import I = CodeceptJS.I

const I: I = actor()

const fields = {
  isDisabled: 'input[id=optionyes]',
  notDisabled: 'input[id=optionno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class PartnerDisabilityPage {

  selectYesOption (): void {
    I.checkOption(fields.isDisabled)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.notDisabled)
    I.click(buttons.submit)
  }
}
