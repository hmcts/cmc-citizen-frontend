import I = CodeceptJS.I

const I: I = actor()

const fields = {
  dispute: { css: 'input[id=optiondispute]' },
  alreadyPaid: { css: 'input[id=optionalreadyPaid]' },
  counterClaim: { css: 'input[id=optioncounterClaim]' }
}

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class DefendantRejectAllOfClaimPage {

  selectDisputeTheClaimOption (): void {
    I.checkOption(fields.dispute)
    I.click(buttons.submit)
  }

  selectAlreadyPaidOption (): void {
    I.checkOption(fields.alreadyPaid)
    I.click(buttons.submit)
  }

  selectCounterClaimOption (): void {
    I.checkOption(fields.counterClaim)
    I.click(buttons.submit)
  }
}
