import { expect } from 'chai'

import { DraftClaim } from 'drafts/models/draftClaim'
import { TheirDetails } from 'drafts/tasks/theirDetails'

describe('Their details', () => {
  describe('isCompleted', () => {
    it('should return true when the task is completed', () => {
      const input = {
        defendant: {
          email: { address: 'example@example.com' },
          partyDetails: {
            type : 'individual',
            firstName: 'Janice Henrieta',
            lastName: 'Clark',
            address: {
              line1: 'Another lane',
              line2: '',
              line3: '',
              city: 'Manchester',
              postcode: 'SW8 4DA'
            },
            hasCorrespondenceAddress: false
          }
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(TheirDetails.isCompleted(claim)).to.equal(true)
    })

    it('should return false when the task is not completed', () => {
      const claim: DraftClaim = new DraftClaim()
      expect(TheirDetails.isCompleted(claim)).to.equal(false)
    })
  })
})
