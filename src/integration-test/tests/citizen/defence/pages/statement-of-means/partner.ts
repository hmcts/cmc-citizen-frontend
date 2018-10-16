import I = CodeceptJS.I

const I: I = actor()

const fields = {
  isCohabiting: 'input[id=cohabitingyes]',
  notCohabiting: 'input[id=cohabitingno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class PartnerPage {

  selectYesOption (): void {
    I.checkOption(fields.isCohabiting)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.notCohabiting)
    I.click(buttons.submit)
  }
}
