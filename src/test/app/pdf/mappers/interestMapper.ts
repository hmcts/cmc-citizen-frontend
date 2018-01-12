import { expect } from 'chai'

import { InterestType } from 'claim/form/models/interest'
import { InterestDateType } from 'app/common/interestDateType'
import { Claim } from 'app/claims/models/claim'
import { MomentFactory } from 'common/momentFactory'
import { InterestMapper } from 'app/pdf/mappers/interestMapper'
import { MomentFormatter } from 'app/utils/momentFormatter'
import { ClaimAmountBreakdown } from 'claim/form/models/claimAmountBreakdown'
import { mockCalculateInterestRate } from '../../../http-mocks/claim-store'

const creationDate = MomentFactory.currentDateTime()
const customInterestDate = creationDate.subtract(10, 'days')

const submissionInterestDateClaim = {
  createdAt: creationDate,
  claimData: {
    amount: new ClaimAmountBreakdown(),
    interest: {
      type: InterestType.STANDARD
    },
    interestDate: {
      type: InterestDateType.SUBMISSION
    }
  }
} as Claim

const customInterestDateClaim = {
  claimData: {
    amount: new ClaimAmountBreakdown(),
    interest: {
      type: InterestType.STANDARD
    },
    interestDate: {
      type: InterestDateType.CUSTOM,
      date: customInterestDate
    }
  }
} as Claim

describe('InterestMapper', () => {

  describe('createInterestData', () => {

    beforeEach(() => {
      mockCalculateInterestRate(1)
    })

    it('should use Claim createdAt date if submission interest date is used', async () => {
      let mapped: any = await InterestMapper.createInterestData(submissionInterestDateClaim)
      expect(mapped.dateClaimedFrom).to.equal(MomentFormatter.formatLongDate(creationDate))
    })

    it('should use provided interest date if specific interest date is used', async () => {
      let mapped: any = await InterestMapper.createInterestData(customInterestDateClaim)
      expect(mapped.dateClaimedFrom).to.equal(MomentFormatter.formatLongDate(customInterestDate))
    })
  })
})
