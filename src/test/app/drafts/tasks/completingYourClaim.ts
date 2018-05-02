import { expect } from 'chai'

import { DraftClaim } from 'drafts/models/draftClaim'
import { CompletingYourClaim } from 'drafts/tasks/completingYourClaim'

describe('Completing your claim', () => {
  describe('isCompleted', () => {
    it('should return true when the task is completed', () => {
      const input = {
        readCompletingClaim: true
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(CompletingYourClaim.isCompleted(claim)).to.equal(true)
    })

    it('should return false when the task is not completed', () => {
      const claim: DraftClaim = new DraftClaim()
      expect(CompletingYourClaim.isCompleted(claim)).to.equal(false)
    })
  })
})
