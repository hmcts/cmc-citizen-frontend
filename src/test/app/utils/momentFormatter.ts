import { expect } from 'chai'
import * as moment from 'moment'

import { MomentFormatter } from 'app/utils/momentFormatter'

describe('MomentFormatter', () => {

  describe('formatDate', () => {
    it('format moment value to date string', () => {
      expect(MomentFormatter.formatDate(moment('2017-01-01'))).to.eq('2017-01-01')
    })
  })

  describe('formatLongDate', () => {
    it('format moment value to date string', () => {
      expect(MomentFormatter.formatLongDate(moment('2017-01-01'))).to.eq('1 January 2017')
    })
  })

  describe('formatLongDateAndTime', () => {
    it('format moment value to date and time string', () => {
      expect(MomentFormatter.formatLongDateAndTime(moment('2017-01-01T11:22:33'))).to.eq('1 January 2017 at 11:22am')
    })
  })
})
