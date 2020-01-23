/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import * as moment from 'moment'

import { isPastDeadline } from 'claims/isPastDeadline'

describe('isPastDeadline', () => {
  const responseDeadline: moment.Moment = moment('2018-05-15')

  it('should return false when given timestamp is 3:59.59.999 PM on the deadline day', () => {
    const timestamp: moment.Moment = responseDeadline.clone().hour(15).minute(59).second(59).millisecond(999)
    expect(isPastDeadline(timestamp, responseDeadline)).to.be.false
  })

  it('should return true when given timestamp is 4:00 PM on the deadline day', () => {
    const timestamp: moment.Moment = responseDeadline.clone().hour(16).minute(0)
    expect(isPastDeadline(timestamp, responseDeadline)).to.be.true
  })

  it('should return true when given timestamp is 4:01 PM on the deadline day', () => {
    const timestamp: moment.Moment = responseDeadline.clone().hour(16).minute(1)
    expect(isPastDeadline(timestamp, responseDeadline)).to.be.true
  })

  context('when response deadline has an arbitrary time set', () => {
    const modifiedDeadline: moment.Moment = responseDeadline.clone().hour(19).minute(33).second(23)

    it('should return false when given timestamp is 3:59.59.999 PM on the deadline day', () => {
      const timestamp: moment.Moment = responseDeadline.clone().hour(15).minute(59).second(59).millisecond(999)
      expect(isPastDeadline(timestamp, modifiedDeadline)).to.be.false
    })

    it('should return true when given timestamp is 4:00 PM on the deadline day', () => {
      const timestamp: moment.Moment = responseDeadline.clone().hour(16).minute(0)
      expect(isPastDeadline(timestamp, modifiedDeadline)).to.be.true
    })
  })
})
