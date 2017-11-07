import { expect } from 'chai'
import * as moment from 'moment'

import { dateFilter } from 'modules/nunjucks/filters/dateFilter'

describe('dateFilter', () => {
  it('formats date (moment object) properly', () => {
    expect(dateFilter(moment('2017-01-01'))).to.eq('1 January 2017')
  })

  it('formats date (string) properly', () => {
    expect(dateFilter('2017-01-01')).to.eq('1 January 2017')
  })

  it('formats date properly (object with time)', () => {
    expect(dateFilter(moment('2017-01-01 12:12:12'))).to.eq('1 January 2017')
  })

  describe('throws exception when', () => {
    it('null given', () => {
      expectToThrowErrorWithMsg(null, 'Input should be moment or string, cannot be empty')
    })

    it('undefined given', () => {
      expectToThrowErrorWithMsg(undefined, 'Input should be moment or string, cannot be empty')
    })

    it('empty string given', () => {
      expectToThrowErrorWithMsg('', 'Input should be moment or string, cannot be empty')
    })

    it('number given', () => {
      expectToThrowErrorWithMsg(1.01 as any, 'Input should be moment or string, cannot be empty')
    })

    it('string given, but it is not a valid date', () => {
      expectToThrowErrorWithMsg('this is invalid date', 'Invalid date')
    })

    it('moment given with invalid date', () => {
      const invalidDateMoment = moment('2010-02-31')
      expectToThrowErrorWithMsg(invalidDateMoment, 'Invalid date')
    })
  })
})

function expectToThrowErrorWithMsg (input: any, msg: string): void {
  expect(() => {
    dateFilter(input)
  }).to.throw(Error, msg)
}
