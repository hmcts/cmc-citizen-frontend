import I = CodeceptJS.I

const I: I = actor()

const fields = {
  amountClaimed: 'input[id=optionamountClaimed]',
  lessThenAmountClaimed: 'input[id=optionlessThenAmountClaimed]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantHowMuchHaveYouPaidClaimantPage {

  selectAmountClaimedOption (): void {
    I.checkOption(fields.amountClaimed)
    I.click(buttons.submit)
  }

  selectLessThanClaimedOption (): void {
    I.checkOption(fields.lessThenAmountClaimed)
    I.click(buttons.submit)
  }
}
