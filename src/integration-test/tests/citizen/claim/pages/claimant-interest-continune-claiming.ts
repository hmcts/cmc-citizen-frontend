import I = CodeceptJS.I

const I: I = actor()

const fields = {
  optionYes: 'input[id=optionyes]',
  optionNo: 'input[id=optionno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantInterestContinueClaimingPage {

  selectYes (): void {
    I.checkOption(fields.optionYes)
    I.click(buttons.submit)
  }

  selectNo (): void {
    I.checkOption(fields.optionNo)
    I.click(buttons.submit)
  }
}
