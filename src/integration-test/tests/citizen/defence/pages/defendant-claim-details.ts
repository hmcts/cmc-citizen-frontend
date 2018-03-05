import I = CodeceptJS.I
import { claimAmount, claimReason } from 'integration-tests/data/test-data'

const I: I = actor()

const fields = {
  amountBreakdown: 'details'
}

export class DefendantClaimDetails {

  clickViewClaim (): void {
    I.click('View claim')
  }

  checkClaimData (claimReference: string): void {
    I.see(claimReference)
    I.see(claimAmount.getTotal())
    I.see(claimReason)
    I.click(fields.amountBreakdown)
  }
}
