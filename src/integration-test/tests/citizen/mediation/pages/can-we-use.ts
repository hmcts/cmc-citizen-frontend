import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: { css: 'input[type=submit]' }
}

const fields = {
  mediationPhoneNumber: { css: 'input[id="mediationPhoneNumber"]' },
  optionYes: { css: 'input[id=optionyes]' },
  optionNo: { css: 'input[id=optionno]' }
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
