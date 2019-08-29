import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

const fields = {
  mediationPhoneNumber: 'input[id="mediationPhoneNumber"]',
  optionYes: 'input[id=optionyes]',
  optionNo: 'input[id=optionno]'
}

export class CanWeUsePage {

  chooseYes (): void {
    I.checkOption(fields.optionYes)
    I.click(buttons.submit)
  }

  chooseNo (mediationPhoneNumber: string): void {
    I.checkOption(fields.optionNo)
    I.fillField(fields.mediationPhoneNumber, mediationPhoneNumber)
    I.click(buttons.submit)
  }
}
