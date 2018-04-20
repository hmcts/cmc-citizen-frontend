import { expect } from 'chai'
import { Address } from 'app/forms/models/address'

describe('Address', () => {
  describe('isCompleted', () => {
    it('should return true when there is a postcode', () => {
      const input = {
        line1: 'House no',
        line2: 'Another lane',
        line3: 'Another area',
        city: 'Manchester',
        postcode: 'BB12 7NQ'
      }
      const add: Address = new Address().deserialize(input)
      expect(add.isCompleted()).to.equal(true)
    })

    it('should return false when the there is no postcode', () => {
      const add: Address = new Address()
      expect(add.isCompleted()).to.equal(false)
    })

    it('should return false when the there is invalid postcode', () => {
      const input = {
        line1: 'House no',
        line2: 'Another lane',
        line3: 'Another area',
        city: 'Manchester',
        postcode: 'BB1234567'
      }
      const add: Address = new Address().deserialize(input)
      expect(add.isCompleted()).to.equal(false)
    })
  })
})
