import { expect } from 'chai'

import { MobilePhone } from 'app/forms/models/mobilePhone'

describe('Mobile Phone', () => {
  describe('isCompleted', () => {
    it('should return true when there is a mobile phone number', () => {
      const input = {
        number: '7123123123'
      }
      const phone: MobilePhone = new MobilePhone().deserialize(input)
      expect(phone.isCompleted()).to.equal(true)
    })

    it('should return false when there is no phone number', () => {
      const phone: MobilePhone = new MobilePhone()
      expect(phone.isCompleted()).to.equal(false)
    })
  })
})
