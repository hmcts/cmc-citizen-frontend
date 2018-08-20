import { expect } from 'chai'
import { FrequencyConversions } from 'common/frequency/frequencyConversions'
import { Frequency } from 'common/frequency/frequency'

describe('CalculateAmountByFrequency', () => {
  describe('convertAmountToMonthly', () => {
    describe('when a weekly amount is given', () => {
      it('should calculate the monthly amount', () => {
        expect(FrequencyConversions.convertAmountToMonthly(100, Frequency.WEEKLY)).to.equal(433.3333333333333)
      })
    })
    describe('when a two-weekly amount is given', () => {
      it('should calculate the monthly amount', () => {
        expect(FrequencyConversions.convertAmountToMonthly(100, Frequency.TWO_WEEKLY)).to.equal(216.66666666666666)
      })
    })
    describe('when a four-weekly amount is given', () => {
      it('should calculate the monthly amount', () => {
        expect(FrequencyConversions.convertAmountToMonthly(100, Frequency.FOUR_WEEKLY)).to.equal(108.33333333333333)
      })
    })
    describe('when a monthly amount is given', () => {
      it('should calculate the monthly amount', () => {
        expect(FrequencyConversions.convertAmountToMonthly(100, Frequency.MONTHLY)).to.equal(100)
      })
    })
  })

  describe('convertAmountToWeekly', () => {
    describe('when a weekly amount is given', () => {
      it('should calculate the weekly amount', () => {
        expect(FrequencyConversions.convertAmountToWeekly(100, Frequency.WEEKLY)).to.equal(100)
      })
    })
    describe('when a two-weekly amount is given', () => {
      it('should calculate the weekly amount', () => {
        expect(FrequencyConversions.convertAmountToWeekly(100, Frequency.TWO_WEEKLY)).to.equal(50)
      })
    })
    describe('when a four-weekly amount is given', () => {
      it('should calculate the weekly amount', () => {
        expect(FrequencyConversions.convertAmountToWeekly(100, Frequency.FOUR_WEEKLY)).to.equal(25)
      })
    })
    describe('when a monthly amount is given', () => {
      it('should calculate the weekly amount', () => {
        expect(FrequencyConversions.convertAmountToWeekly(100, Frequency.MONTHLY)).to.equal(23.07692307692308)
      })
    })

    describe('convertAmountToTwoWeekly', () => {
      describe('when a weekly amount is given', () => {
        it('should calculate the two-weekly amount', () => {
          expect(FrequencyConversions.convertAmountToTwoWeekly(100, Frequency.WEEKLY)).to.equal(200)
        })
      })
      describe('when a two-weekly amount is given', () => {
        it('should calculate the two-weekly amount', () => {
          expect(FrequencyConversions.convertAmountToTwoWeekly(100, Frequency.TWO_WEEKLY)).to.equal(100)
        })
      })
      describe('when a four-weekly amount is given', () => {
        it('should calculate the two-weekly amount', () => {
          expect(FrequencyConversions.convertAmountToTwoWeekly(100, Frequency.FOUR_WEEKLY)).to.equal(50)
        })
      })
      describe('when a monthly amount is given', () => {
        it('should calculate the two-weekly amount', () => {
          expect(FrequencyConversions.convertAmountToTwoWeekly(100, Frequency.MONTHLY)).to.equal(46.15384615384616)
        })
      })
    })

    describe('convertAmountToFourWeekly', () => {
      describe('when a weekly amount is given', () => {
        it('should calculate the four-weekly amount', () => {
          expect(FrequencyConversions.convertAmountToFourWeekly(100, Frequency.WEEKLY)).to.equal(400)
        })
      })
      describe('when a two-weekly amount is given', () => {
        it('should calculate the four-weekly amount', () => {
          expect(FrequencyConversions.convertAmountToFourWeekly(100, Frequency.TWO_WEEKLY)).to.equal(200)
        })
      })
      describe('when a four-weekly amount is given', () => {
        it('should calculate the four-weekly amount', () => {
          expect(FrequencyConversions.convertAmountToFourWeekly(100, Frequency.FOUR_WEEKLY)).to.equal(100)
        })
      })
      describe('when a monthly amount is given', () => {
        it('should calculate the four-weekly amount', () => {
          expect(FrequencyConversions.convertAmountToFourWeekly(100, Frequency.MONTHLY)).to.equal(92.30769230769232)
        })
      })
    })
  })
})
