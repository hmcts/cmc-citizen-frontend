import I = CodeceptJS.I

const I: I = actor()

const fields = {
  yes: 'input[id=dependantDisabledyes]',
  no: 'input[id=dependantDisabledno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DependantDisabilityPage {

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
