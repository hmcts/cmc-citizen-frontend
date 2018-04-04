import I = CodeceptJS.I
import { claimAmount, claimReason } from 'integration-test/data/test-data'

const I: I = actor()

const fields = {
  amountBreakdown: 'details'
}

export class DefendantClaimDetails {

  clickViewClaim (): void {
    I.click('View claim')
  }

  checkClaimData (claimReference: string, getTotal: boolean = true, getTotalWithInterest: boolean = false): void {
    I.see(claimReference)
    if (getTotal) {
      I.see(claimAmount.getTotal())
    }
    if (getTotalWithInterest) {
      I.see(claimAmount.getTotalWithInterest())
    }
    I.see(claimReason)
    I.click(fields.amountBreakdown)
  }
}
