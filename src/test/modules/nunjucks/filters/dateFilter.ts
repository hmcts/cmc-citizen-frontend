import { expect } from 'chai'
import * as moment from 'moment'

import { dateFilter, dateInputFilter } from 'modules/nunjucks/filters/dateFilter'

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
      expectDateFilterToThrowErrorWithMsg(null, 'Input should be moment or string, cannot be empty')
    })

    it('undefined given', () => {
      expectDateFilterToThrowErrorWithMsg(undefined, 'Input should be moment or string, cannot be empty')
    })

    it('empty string given', () => {
      expectDateFilterToThrowErrorWithMsg('', 'Input should be moment or string, cannot be empty')
    })

    it('number given', () => {
      expectDateFilterToThrowErrorWithMsg(1.01 as any, 'Input should be moment or string, cannot be empty')
    })

    it('string given, but it is not a valid date', () => {
      expectDateFilterToThrowErrorWithMsg('this is invalid date', 'Invalid date')
    })

    it('moment given with invalid date', () => {
      const invalidDateMoment = moment('2010-02-31')
      expectDateFilterToThrowErrorWithMsg(invalidDateMoment, 'Invalid date')
    })
  })
})

describe('dateInputFilter', () => {
  it('formats date (moment object) properly', () => {
    expect(dateInputFilter(moment('2017-01-01'))).to.eq('01 01 2017')
  })

  it('formats date (string) properly', () => {
    expect(dateInputFilter('2017-01-01')).to.eq('01 01 2017')
  })

  it('formats date properly (object with time)', () => {
    expect(dateInputFilter(moment('2017-01-01 12:12:12'))).to.eq('01 01 2017')
  })

  describe('throws exception when', () => {
    it('null given', () => {
      expectInputDateFilterToThrowErrorWithMsg(null, 'Input should be moment or string, cannot be empty')
    })

    it('undefined given', () => {
      expectInputDateFilterToThrowErrorWithMsg(undefined, 'Input should be moment or string, cannot be empty')
    })

    it('empty string given', () => {
      expectInputDateFilterToThrowErrorWithMsg('', 'Input should be moment or string, cannot be empty')
    })

    it('number given', () => {
      expectInputDateFilterToThrowErrorWithMsg(1.01 as any, 'Input should be moment or string, cannot be empty')
    })

    it('string given, but it is not a valid date', () => {
      expectInputDateFilterToThrowErrorWithMsg('this is invalid date', 'Invalid date')
    })

    it('moment given with invalid date', () => {
      const invalidDateMoment = moment('2010-02-31')
      expectInputDateFilterToThrowErrorWithMsg(invalidDateMoment, 'Invalid date')
    })
  })
})

function expectDateFilterToThrowErrorWithMsg (input: any, msg: string): void {
  expect(() => {
    dateFilter(input)
  }).to.throw(Error, msg)
}

function expectInputDateFilterToThrowErrorWithMsg (input: any, msg: string): void {
  expect(() => {
    dateFilter(input)
  }).to.throw(Error, msg)
}
