import I = CodeceptJS.I

const I: I = actor()

const fields = {
  isCarer: 'input[id=careryes]',
  notCarer: 'input[id=carerno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class CarerPage {

  selectYesOption (): void {
    I.checkOption(fields.isCarer)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.notCarer)
    I.click(buttons.submit)
  }
}
