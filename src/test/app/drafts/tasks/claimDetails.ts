import { expect } from 'chai'

import { DraftClaim } from 'drafts/models/draftClaim'
import { ClaimDetails } from 'drafts/tasks/claimDetails'

describe('Claim details', () => {

  describe('isCompleted', () => {

    it('should return true when timeline has a row and reason is given', () => {
      const input = {
        timeline: {
          rows: [{
            date: 'may',
            description: 'it is ok'
          }]
        },
        reason: { reason: 'It is my reason' }
      }

      const claim: DraftClaim = new DraftClaim().deserialize(input)

      expect(ClaimDetails.isCompleted(claim)).to.equal(true)
    })

    context('should return false', () => {

      it('timeline has no rows and reason is valid', () => {
        const input = {
          timeline: {
            rows: []
          },
          reason: 'It is my reason'
        }

        const claim: DraftClaim = new DraftClaim().deserialize(input)

        expect(ClaimDetails.isCompleted(claim)).to.equal(false)
      })

      it('timeline has row but reason is empty', () => {
        const input = {
          timeline: {
            rows: [{
              date: 'may',
              description: 'it is ok'
            }]
          },
          reason: ''
        }

        const claim: DraftClaim = new DraftClaim().deserialize(input)

        expect(ClaimDetails.isCompleted(claim)).to.equal(false)
      })
    })
  })
})
