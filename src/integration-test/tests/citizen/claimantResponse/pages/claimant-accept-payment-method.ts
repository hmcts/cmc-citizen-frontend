import I = CodeceptJS.I

const I: I = actor()

const fields = {
  radioYes: 'input[id=acceptyes]',
  radioNo: 'input[id=acceptNo]',
  submit: 'input[id=saveAndContinue]'
}

export class ClaimantAcceptPaymentMethod {

  chooseYes (): void {
    I.checkOption(fields.radioYes)
    I.click(fields.submit)
  }

  chooseNo (): void {
    I.checkOption(fields.radioNo)
    I.click(fields.submit)
  }

}
