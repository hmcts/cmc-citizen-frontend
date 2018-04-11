import I = CodeceptJS.I

const I: I = actor()

const fields = {
  amountBreakdown: 'Details'
}

export class DashbaordClaimDetails {

  clickViewClaim (): void {
    I.click('View claim')
  }

  checkClaimData (claimReference: string, claimData: ClaimData): void {
    I.see(claimReference)
    I.see(claimData.total)
    I.see(claimData.reason)
    I.click(fields.amountBreakdown)
    I.wait(60)
    I.click('Download claim')
    I.see('Claim amount')
    I.see(claimData.total)
  }
}
