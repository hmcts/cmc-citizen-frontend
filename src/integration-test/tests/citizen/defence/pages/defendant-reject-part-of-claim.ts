import I = CodeceptJS.I

const I: I = actor()

const fields = {
  claimTooMuch: 'input[id=optionamountTooHigh]',
  paidWhatBelievedWasOwed: 'input[id=optionpaidWhatBelievedWasOwed]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantRejectPartOfClaimPage {

  rejectClaimTooMuch (): void {
    I.checkOption(fields.claimTooMuch)
    I.click(buttons.submit)
  }

  rejectClaimPaidWhatIBelieveIOwe (): void {
    I.checkOption(fields.paidWhatBelievedWasOwed)
    I.click(buttons.submit)
  }
}
