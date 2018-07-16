import { expect } from 'chai'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { ViewDefendantResponse } from 'claimant-response/tasks/viewDefendantResponse'

describe('View Defendant Response', () => {
  describe('isCompleted', () => {
    it('should return true when the task is completed', () => {
      const input = {
        viewedDefendantResponse: true
      }
      const claim: DraftClaimantResponse = new DraftClaimantResponse().deserialize(input)
      expect(ViewDefendantResponse.isCompleted(claim)).to.equal(true)
    })

    it('should return false when the task is not completed', () => {
      const claim: DraftClaimantResponse = new DraftClaimantResponse()
      expect(ViewDefendantResponse.isCompleted(claim)).to.equal(false)
    })
  })
})
