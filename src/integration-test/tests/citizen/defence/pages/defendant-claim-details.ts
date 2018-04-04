import I = CodeceptJS.I
import { claimAmount, claimReason } from 'integration-test/data/test-data'
import { InterestType } from 'integration-test/data/interest-type'

const I: I = actor()

const fields = {
  amountBreakdown: 'details'
}

export class DefendantClaimDetails {

  clickViewClaim (): void {
    I.click('View claim')
  }

  checkClaimData (claimReference: string, interestType: InterestType): void {
    I.see(claimReference)
    I.see(claimAmount.getInterestTotal(interestType))
    I.see(claimReason)
    I.click(fields.amountBreakdown)
  }

}
