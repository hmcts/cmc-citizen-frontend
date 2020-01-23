import I = CodeceptJS.I

const I: I = actor()

const fields = {
  isAdult: 'input[id=optionyes]',
  notAdult: 'input[id=optionno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class PartnerAgePage {

  selectYesOption (): void {
    I.checkOption(fields.isAdult)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.notAdult)
    I.click(buttons.submit)
  }
}
