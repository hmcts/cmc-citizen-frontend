import { expect } from 'chai'

import { DraftClaim } from 'app/drafts/models/draftClaim'
import { ClaimAmount } from 'app/drafts/tasks/claimAmount'
import { InterestType } from 'claim/form/models/interest'

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
          type: InterestType.NO_INTEREST
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
            amount: 1000
          }]
        },
        interest: {
          type: InterestType.STANDARD,
          rate: '',
          reason: ''
        }
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
          type: InterestType.NO_INTEREST,
          rate: '',
          reason: ''
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
