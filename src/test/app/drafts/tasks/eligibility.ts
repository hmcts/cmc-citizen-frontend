import { expect } from 'chai'

import { DraftClaim } from 'app/drafts/models/draftClaim'
import { YesNoOption } from 'models/yesNoOption'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'
import { Eligibility } from 'drafts/tasks/eligibility'

describe('Check eligibility', () => {
  describe('isCompleted', () => {
    it('should return true when the task is completed', () => {
      const input = {
        eligibility: {
          claimOnBehalf: YesNoOption.NO,
          claimantAddress: YesNoOption.YES,
          defendantAddress: YesNoOption.YES,
          claimValue: ClaimValue.UNDER_10000,
          eighteenOrOver: YesNoOption.YES,
          singleClaimant: YesNoOption.YES,
          singleDefendant: YesNoOption.YES,
          governmentDepartment: YesNoOption.NO,
          helpWithFees: YesNoOption.NO,
          claimIsForTenancyDeposit: YesNoOption.NO
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(Eligibility.isCompleted(claim)).to.equal(true)
    })

    it('should return false when the task is not completed', () => {
      const claim: DraftClaim = new DraftClaim()
      expect(Eligibility.isCompleted(claim)).to.equal(false)
    })
    it('should return false when the task is completed but user is not eligible', () => {
      const input = {
        eligibility: {
          claimOnBehalf: YesNoOption.YES,
          claimantAddress: YesNoOption.YES,
          defendantAddress: YesNoOption.YES,
          claimValue: ClaimValue.NOT_KNOWN,
          eighteenOrOver: YesNoOption.YES,
          singleClaimant: YesNoOption.YES,
          singleDefendant: YesNoOption.YES,
          governmentDepartment: YesNoOption.NO,
          helpWithFees: YesNoOption.NO,
          claimIsForTenancyDeposit: YesNoOption.YES
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(Eligibility.isCompleted(claim)).to.equal(false)
    })
  })
})
