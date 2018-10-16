import I = CodeceptJS.I

const I: I = actor()

const fields = {
  hasDisabledDependant: 'input[id=optionyes]',
  noDisabledDependant: 'input[id=optionno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DependantDisabilityPage {

  selectYesOption (): void {
    I.checkOption(fields.hasDisabledDependant)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.noDisabledDependant)
    I.click(buttons.submit)
  }
}
