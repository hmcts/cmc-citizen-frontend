import I = CodeceptJS.I

const I: I = actor()

const radioButtons = {
  optionYes: 'input[id=admittedyes]',
  optionNo: 'input[id=admittedno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantSettleAdmittedPage {

  selectAdmittedYes (): void {
    I.checkOption(radioButtons.optionYes)
    I.click(buttons.submit)
  }

  selectAdmittedNo (): void {
    I.checkOption(radioButtons.optionNo)
    I.click(buttons.submit)
  }
}
