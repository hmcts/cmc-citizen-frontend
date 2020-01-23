import I = CodeceptJS.I

const I: I = actor()

const fields = {
  isSeverelyDisabled: 'input[id=optionyes]',
  notSeverelyDisabled: 'input[id=optionno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class PartnerSevereDisabilityPage {

  selectYesOption (): void {
    I.checkOption(fields.isSeverelyDisabled)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.notSeverelyDisabled)
    I.click(buttons.submit)
  }
}
