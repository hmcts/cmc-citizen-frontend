import I = CodeceptJS.I

const I: I = actor()

const fields = {
  radioYes: 'input[id=proceedyes]',
  radioNo: 'input[id=proceedno]'
}

const buttons = {
  saveAndContinue: 'input[id=saveAndContinue]'
}

export class ClaimantIntentionToProceedPage {

  chooseYes (): void {
    I.checkOption(fields.radioYes)
    I.click(buttons.saveAndContinue)
  }

  chooseNo (): void {
    I.checkOption(fields.radioNo)
    I.click(buttons.saveAndContinue)
  }

}
