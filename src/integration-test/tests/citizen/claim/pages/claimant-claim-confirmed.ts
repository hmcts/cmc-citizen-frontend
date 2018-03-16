import I = CodeceptJS.I

const I: I = actor()

const fields = {
  claimReference: 'div.reference-number > h1.bold-large'
}

export class ClaimantClaimConfirmedPage {

  getClaimReference (): string {
    return I.grabTextFrom(fields.claimReference)
  }
}
