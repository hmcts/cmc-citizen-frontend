import { expect } from 'chai'

import { calculateMonthIncrement } from 'common/calculate-month-increment/calculateMonthIncrement'
import * as moment from 'moment'
import { MomentFactory } from 'shared/momentFactory'

describe('calculateMonthIncrement', () => {

  it('should calculate a month where the start date is before the 28th',() => {
    const startDate: moment.Moment = MomentFactory.parse('2018-10-15')
    const calculateMonthDate: moment.Moment = calculateMonthIncrement(startDate)
    expect(calculateMonthDate.toString()).to.equal(MomentFactory.parse('2018-11-15').toString())
  })

  it('should calculate a month where start date is 28th', () => {
    const startDate: moment.Moment = MomentFactory.parse('2018-02-28')
    const calculateMonthDate: moment.Moment = calculateMonthIncrement(startDate)
    expect(calculateMonthDate.toString()).to.equal(MomentFactory.parse('2018-03-28').toString())
  })

  it('should calculate a month where start date is 30th', () => {
    const startDate: moment.Moment = MomentFactory.parse('2018-03-30')
    const calculateMonthDate: moment.Moment = calculateMonthIncrement(startDate)
    expect(calculateMonthDate.toString()).to.equal(MomentFactory.parse('2018-04-30').toString())
  })

  it('should calculate a month where start date is 31st', () => {
    const startDate: moment.Moment = MomentFactory.parse('2018-10-31')
    const calculateMonthDate: moment.Moment = calculateMonthIncrement(startDate)
    expect(calculateMonthDate.toString()).to.equal(MomentFactory.parse('2018-12-01').toString())
  })

  it('should calculate a month where the start date is 29th Jan',() => {
    const startDate: moment.Moment = MomentFactory.parse('2018-01-29')
    const calculateMonthDate: moment.Moment = calculateMonthIncrement(startDate)
    expect(calculateMonthDate.toString()).to.equal(MomentFactory.parse('2018-03-01').toString())
  })

  it('should calculate a month where the start date is 30th Jan',() => {
    const startDate: moment.Moment = MomentFactory.parse('2018-01-30')
    const calculateMonthDate: moment.Moment = calculateMonthIncrement(startDate)
    expect(calculateMonthDate.toString()).to.equal(MomentFactory.parse('2018-03-01').toString())
  })

  it('should calculate a month where the start date is 31st Jan',() => {
    const startDate: moment.Moment = MomentFactory.parse('2018-01-31')
    const calculateMonthDate: moment.Moment = calculateMonthIncrement(startDate)
    expect(calculateMonthDate.toString()).to.equal(MomentFactory.parse('2018-03-01').toString())
  })

  it('should calculate a month where the start date is 29th Jan in a leap year',() => {
    const startDate: moment.Moment = MomentFactory.parse('2020-01-29')
    const calculateMonthDate: moment.Moment = calculateMonthIncrement(startDate)
    expect(calculateMonthDate.toString()).to.equal(MomentFactory.parse('2020-02-29').toString())
  })

  it('should calculate a month where the start date is 30th Jan in a leap year',() => {
    const startDate: moment.Moment = MomentFactory.parse('2020-01-30')
    const calculateMonthDate: moment.Moment = calculateMonthIncrement(startDate)
    expect(calculateMonthDate.toString()).to.equal(MomentFactory.parse('2020-03-01').toString())
  })

  it('should calculate a month where the start date is 31st Jan in a leap year',() => {
    const startDate: moment.Moment = MomentFactory.parse('2020-01-31')
    const calculateMonthDate: moment.Moment = calculateMonthIncrement(startDate)
    expect(calculateMonthDate.toString()).to.equal(MomentFactory.parse('2020-03-01').toString())
  })

  it('should calculate a month where the start date is 31st leading to another month with 31 days',() => {
    const startDate: moment.Moment = MomentFactory.parse('2018-07-31')
    const calculateMonthDate: moment.Moment = calculateMonthIncrement(startDate)
    expect(calculateMonthDate.toString()).to.equal(MomentFactory.parse('2018-08-31').toString())
  })

  it('should calculate a month where the start date is 31st leading to next month with 30 days',() => {
    const startDate: moment.Moment = MomentFactory.parse('2018-08-31')
    const calculateMonthDate: moment.Moment = calculateMonthIncrement(startDate)
    expect(calculateMonthDate.toString()).to.equal(MomentFactory.parse('2018-10-01').toString())
  })

  it('should calculate a month going into the following year',() => {
    const startDate: moment.Moment = MomentFactory.parse('2018-12-31')
    const calculateMonthDate: moment.Moment = calculateMonthIncrement(startDate)
    expect(calculateMonthDate.toString()).to.equal(MomentFactory.parse('2019-01-31').toString())
  })

  it('should return the 1st of a month when start date is the 1st of the following month', () => {
    expect(calculateMonthIncrement(moment('2019-01-01'), -1).format('YYYY-MM-DD'))
      .to.equal(moment('2018-12-01').format('YYYY-MM-DD'))
  })

  it('should return a month date in the middle of the previous month starting from 15th December ', () => {
    expect(calculateMonthIncrement(moment('2018-08-15'), -1).format('YYYY-MM-DD'))
      .to.equal(moment('2018-07-15').format('YYYY-MM-DD'))
  })

  it('should return last date of a 30 days month when start date is on 31th of the following month', () => {
    expect(calculateMonthIncrement(moment('2018-12-31'), -1).format('YYYY-MM-DD'))
      .to.equal(moment('2018-11-30').format('YYYY-MM-DD'))
  })

  it('should return the last day of february (leap year) when starting date >= 28th of a month', () => {
    expect(calculateMonthIncrement(moment('2020-03-30'), -1).format('YYYY-MM-DD'))
      .to.equal(moment('2020-02-29').format('YYYY-MM-DD'))
  })

  it('should return the last day of february (no leap year) when starting date >= 29th of a month', () => {
    expect(calculateMonthIncrement(moment('2018-03-30'), -1).format('YYYY-MM-DD'))
      .to.equal(moment('2018-02-28').format('YYYY-MM-DD'))
  })

  it('should return error when given a null start date', () => {
    expect(() => { calculateMonthIncrement(null) }).to.throw(Error, 'Start Date is invalid')
  })

  it('should return undefined when given an undefined start date', () => {
    expect(() => { calculateMonthIncrement(undefined) }).to.throw(Error, 'Start Date is invalid')
  })
})
