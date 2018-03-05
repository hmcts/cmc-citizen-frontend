import I = CodeceptJS.I

const I: I = actor()

const fields = {
  dispute: 'input[id=optiondispute]',
  alreadyPaid: 'input[id=optionalreadyPaid]',
  counterClaim: 'input[id=optioncounterClaim]'
}

const buttons = {
  submit: 'input[type=submit]'
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
