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
      assert.equal(0, moment.hour())
      assert.equal(0, moment.minute())
      assert.equal(0, moment.second())
      assert.equal(0, moment.millisecond())
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
