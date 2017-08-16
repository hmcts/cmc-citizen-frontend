import { expect } from 'chai'

import { Address } from 'app/forms/models/address'

describe('Address', () => {
  describe('isCompleted', () => {
    it('should return true when there is a postcode', () => {
      const input = {
        line1: 'Another lane',
        city: 'Manchester',
        postcode: 'SW8 4DA'
      }
      const add: Address = new Address().deserialize(input)
      expect(add.isCompleted()).to.equal(true)
    })

    it('should return false when the task is no postcode', () => {
      const add: Address = new Address()
      expect(add.isCompleted()).to.equal(false)
    })
  })
})
