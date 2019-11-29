import I = CodeceptJS.I

const I: I = actor()

const radioButtons = {
  optionYes: 'input[id=receivedyes]',
  optionNo: 'input[id=receivedno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantPartPaymentReceivedPage {

  yesTheDefendantHasPaid (): void {
    I.checkOption(radioButtons.optionYes)
    I.click(buttons.submit)
  }

  noTheDefendantHasNotPaid (): void {
    I.checkOption(radioButtons.optionNo)
    I.click(buttons.submit)
  }
}
