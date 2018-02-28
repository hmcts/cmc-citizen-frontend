import { expect } from 'chai'

import { DraftClaim } from 'app/drafts/models/draftClaim'
import { YesNoOption } from 'models/yesNoOption'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'
import { Eligibility } from 'drafts/tasks/eligibility'
import { ClaimType } from 'claim/form/models/eligibility/claimType'
import { DefendantAgeOption } from 'claim/form/models/eligibility/DefendantAgeOption'

describe('Check eligibility', () => {
  describe('isCompleted', () => {
    it('should return true when the task is completed', () => {
      const input = {
        eligibility: {
          claimValue: ClaimValue.UNDER_10000,
          helpWithFees: YesNoOption.NO,
          claimantAddress: YesNoOption.YES,
          defendantAddress: YesNoOption.YES,
          eighteenOrOver: YesNoOption.YES,
          eighteenOrOverDefendant: DefendantAgeOption.YES,
          claimType: ClaimType.PERSONAL_CLAIM,
          singleDefendant: YesNoOption.NO,
          governmentDepartment: YesNoOption.NO,
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
          claimValue: ClaimValue.UNDER_10000,
          helpWithFees: YesNoOption.NO,
          claimantAddress: YesNoOption.YES,
          defendantAddress: YesNoOption.YES,
          eighteenOrOver: YesNoOption.YES,
          eighteenOrOverDefendant: DefendantAgeOption.YES,
          claimType: ClaimType.MULTIPLE_CLAIM,
          singleDefendant: YesNoOption.YES,
          governmentDepartment: YesNoOption.NO,
          claimIsForTenancyDeposit: YesNoOption.NO
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(Eligibility.isCompleted(claim)).to.equal(false)
    })
  })
})
