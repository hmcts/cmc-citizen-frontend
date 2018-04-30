import { expect } from 'chai'

import { DraftClaim } from 'app/drafts/models/draftClaim'
import { ResolveDispute } from 'app/drafts/tasks/resolveDispute'

describe('Resolve your dispute', () => {
  describe('isCompleted', () => {
    it('should return true when the task is completed', () => {
      const input = {
        readResolveDispute: true
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(ResolveDispute.isCompleted(claim)).to.equal(true)
    })

    it('should return false when the task is not completed', () => {
      const claim: DraftClaim = new DraftClaim()
      expect(ResolveDispute.isCompleted(claim)).to.equal(false)
    })
  })
})
