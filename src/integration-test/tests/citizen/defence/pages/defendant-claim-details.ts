import I = CodeceptJS.I

const I: I = actor()

const fields = {
  amountBreakdown: 'details'
}

export class DefendantClaimDetails {

  clickViewClaim (): void {
    I.click('View claim')
  }

  checkClaimData (claimReference: string, claimData: ClaimData): void {
    I.see(claimReference)
    I.see(claimData.total)
    I.see(claimData.reason)
    I.click(fields.amountBreakdown)
  }

}
