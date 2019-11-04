import { expect } from 'chai'

import { DraftClaim } from 'drafts/models/draftClaim'
import { YourDetails } from 'drafts/tasks/yourDetails'

describe('Your details', () => {
  describe('isCompleted', () => {
    it('should return true when the task is completed', () => {
      const input = {
        claimant: {
          phone: {
            number: '7123123123'
          },
          partyDetails: {
            type : 'individual',
            address: { line1: 'Here',line2: 'There',line3: '',city: 'London',postcode: 'BB12 7NQ' },
            name: 'John Doe',
            dateOfBirth: {
              known: 'true',
              date: {
                day: 10,
                month: 11,
                year: 1990
              }
            }
          }
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(YourDetails.isCompleted(claim)).to.equal(true)
    })

    it('should return false when the task is not completed', () => {
      const claim: DraftClaim = new DraftClaim()
      expect(YourDetails.isCompleted(claim)).to.equal(false)
    })
  })
})
