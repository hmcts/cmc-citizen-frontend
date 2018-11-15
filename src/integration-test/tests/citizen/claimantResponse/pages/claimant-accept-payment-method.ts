import I = CodeceptJS.I

const I: I = actor()

const fields = {
  radioYes: 'input[id=acceptyes]',
  radioNo: 'input[id=acceptno]'
}

const buttons = {
  saveAndContinue: 'input[id=saveAndContinue]'
}

export class ClaimantAcceptPaymentMethod {

  chooseYes (): void {
    I.checkOption(fields.radioYes)
    I.click(buttons.saveAndContinue)
  }

  chooseNo (): void {
    I.checkOption(fields.radioNo)
    I.click(buttons.saveAndContinue)
  }

}
