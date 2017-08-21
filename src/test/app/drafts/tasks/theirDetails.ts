import { expect } from 'chai'

import DraftClaim from 'app/drafts/models/draftClaim'
import { TheirDetails } from 'app/drafts/tasks/theirDetails'

describe('Their details', () => {
  describe('isCompleted', () => {
    it('should return true when the task is completed', () => {
      const input = {
        defendant: {
          partyTypeResponse: {
            type : { value : 'individual', displayValue: 'individual'}
          },
          email: { address: 'example@example.com' },
          partyDetails: {
            name: 'Janice Henrieta Clark',
            address: {
              line1: 'Another lane',
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
