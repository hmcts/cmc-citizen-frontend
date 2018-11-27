import I = CodeceptJS.I

const I: I = actor()

const fields = {
  radioAdmittedYes: 'input[id=admittedyes]',
  radioAdmittedNo: 'input[id=admittedno]'
}

const buttons = {
  saveAndContinue: 'input[id=saveAndContinue]'
}

export class ClaimantSettleAdmittedPage {

  chooseAdmittedYes (): void {
    I.checkOption(fields.radioAdmittedYes)
    I.click(buttons.saveAndContinue)
  }

  chooseAdmittedNo (): void {
    I.checkOption(fields.radioAdmittedNo)
    I.click(buttons.saveAndContinue)
  }

}
