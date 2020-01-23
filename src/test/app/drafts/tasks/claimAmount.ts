import { expect } from 'chai'

import { DraftClaim } from 'drafts/models/draftClaim'
import { ClaimAmount } from 'drafts/tasks/claimAmount'
import { InterestRate } from 'claim/form/models/interestRate'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { InterestType, InterestTypeOption } from 'claim/form/models/interestType'
import { InterestEndDate, InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDateType } from 'common/interestDateType'
import { InterestDate } from 'claim/form/models/interestDate'
import { InterestStartDate } from 'claim/form/models/interestStartDate'
import { YesNoOption } from 'models/yesNoOption'

describe('Claim amount', () => {

  describe('isCompleted', () => {

    it('should return true when the task is completed and no interest has been selected', () => {
      const input = {
        amount: {
          rows: [{
            reason: 'Bills',
            amount: 1000
          }]
        },
        interest: {
          option: YesNoOption.NO
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(ClaimAmount.isCompleted(claim)).to.equal(true)
    })

    it('should return true when the task is completed and an interest type has been selected', () => {
      const input = {
        amount: {
          rows: [{
            reason: 'Bills',
            amount: 10000
          }]
        },
        interest: {
          option: YesNoOption.YES
        },
        interestType: {
          option: InterestTypeOption.SAME_RATE
        } as InterestType,
        interestRate: {
          type: InterestRateOption.DIFFERENT,
          rate: 10,
          reason: 'Special case'
        } as InterestRate,
        interestDate: {
          type: InterestDateType.SUBMISSION
        } as InterestDate,
        interestStartDate: {
          date: {
            day: 10,
            month: 12,
            year: 2016
          },
          reason: 'reason'
        } as InterestStartDate,
        interestEndDate: {
          option: InterestEndDateOption.SETTLED_OR_JUDGMENT
        } as InterestEndDate
      }

      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(ClaimAmount.isCompleted(claim)).to.equal(true)
    })

    it('should return false if total amount is not completed', () => {
      const input = {
        amount: {
          rows: [{
            reason: 'Bills',
            amount: 0
          }]
        },
        interest: {
          option: YesNoOption.NO
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(ClaimAmount.isCompleted(claim)).to.equal(false)
    })

    it('should return false if interest type has not been set', () => {
      const input = {
        amount: {
          rows: [{
            reason: 'Bills',
            amount: 0
          }]
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(ClaimAmount.isCompleted(claim)).to.equal(false)
    })
  })
})
