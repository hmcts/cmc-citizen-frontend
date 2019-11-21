import I = CodeceptJS.I

const I: I = actor()

const radioButtons = {
  optionYes: 'input[id=acceptedyes]',
  optionNo: 'input[id=acceptedno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantSettleClaimPage {

  selectAcceptedYes (): void {
    I.checkOption(radioButtons.optionYes)
    I.click(buttons.submit)
  }

  selectAcceptedNo (): void {
    I.checkOption(radioButtons.optionNo)
    I.click(buttons.submit)
  }
}
