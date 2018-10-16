import I = CodeceptJS.I

const I: I = actor()

const fields = {
  hasDisabledDependants: 'input[id=dependantDisabledyes]',
  noDisabledDependants: 'input[id=dependantDisabledno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DependantDisabilityPage {

  selectYesOption (): void {
    I.checkOption(fields.hasDisabledDependants)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.noDisabledDependants)
    I.click(buttons.submit)
  }
}
