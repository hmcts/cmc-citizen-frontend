import I = CodeceptJS.I

const I: I = actor()

const fields = {
  hasPension: 'input[id=optionyes]',
  noPension: 'input[id=optionno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class PartnerPensionPage {

  selectYesOption (): void {
    I.checkOption(fields.hasPension)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.noPension)
    I.click(buttons.submit)
  }
}
