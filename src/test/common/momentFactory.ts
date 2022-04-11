import { expect, assert } from 'chai'
import { MomentFactory } from 'shared/momentFactory'

describe('MomentFactory', () => {
  describe('static method test cases', () => {
    it('should create a moment with current date time', () => {
      const moment = MomentFactory.currentDateTime()
      assert.isNotNull(moment)
    })

    it('should create a moment with current date', () => {
      const moment = MomentFactory.currentDate()
      assert.isNotNull(moment)
      assert.equal(moment.hour(), 0)
      assert.equal(moment.minute(), 0)
      assert.equal(moment.second(), 0)
      assert.equal(moment.millisecond(), 0)
    })

    it('should create a moment with a date passed ', () => {
      const moment = MomentFactory.parse('2017-07-25T22:45:51.785')
      assert.isNotNull(moment)
      expect(moment.day()).eq(2)
    })

    it('should throw an error when value is not defined', () => {
      expect(() => MomentFactory.parse('')).to.throw('Value must be define')
    })
  })
})
