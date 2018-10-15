import I = CodeceptJS.I

const I: I = actor()

const fields = {
  yes: 'input[id=severelyDisabledyes]',
  no: 'input[id=severelyDisabledno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class SevereDisabilityPage {

  selectYesOption (): void {
    I.checkOption(fields.yes)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.no)
    I.click(buttons.submit)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
