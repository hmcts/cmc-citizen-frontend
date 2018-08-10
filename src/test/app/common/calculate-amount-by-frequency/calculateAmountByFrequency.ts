import { expect } from 'chai'
import * as CalculateAmountByFrequency from 'common/calculate-amount-by-frequency/calculateAmountByFrequency'
import { Frequency } from 'common/calculate-amount-by-frequency/frequency'

describe('CalculateAmountByFrequency', () => {
  describe('toMonthly', () => {
    describe('when a weekly amount is given', () => {
      it('should calculate the monthly amount', () => {
        expect(CalculateAmountByFrequency.toMonthly(100, Frequency.WEEKLY)).to.equal(433.3333333333333)
      })
    })
    describe('when a two-weekly amount is given', () => {
      it('should calculate the monthly amount', () => {
        expect(CalculateAmountByFrequency.toMonthly(100, Frequency.TWO_WEEKLY)).to.equal(216.66666666666666)
      })
    })
    describe('when a four-weekly amount is given', () => {
      it('should calculate the monthly amount', () => {
        expect(CalculateAmountByFrequency.toMonthly(100, Frequency.FOUR_WEEKLY)).to.equal(108.33333333333333)
      })
    })
    describe('when a monthly amount is given', () => {
      it('should calculate the monthly amount', () => {
        expect(CalculateAmountByFrequency.toMonthly(100, Frequency.MONTHLY)).to.equal(100)
      })
    })
  })

  describe('toWeekly', () => {
    describe('when a weekly amount is given', () => {
      it('should calculate the weekly amount', () => {
        expect(CalculateAmountByFrequency.toWeekly(100, Frequency.WEEKLY)).to.equal(100)
      })
    })
    describe('when a two-weekly amount is given', () => {
      it('should calculate the weekly amount', () => {
        expect(CalculateAmountByFrequency.toWeekly(100, Frequency.TWO_WEEKLY)).to.equal(50)
      })
    })
    describe('when a four-weekly amount is given', () => {
      it('should calculate the weekly amount', () => {
        expect(CalculateAmountByFrequency.toWeekly(100, Frequency.FOUR_WEEKLY)).to.equal(25)
      })
    })
    describe('when a monthly amount is given', () => {
      it('should calculate the weekly amount', () => {
        expect(CalculateAmountByFrequency.toWeekly(100, Frequency.MONTHLY)).to.equal(23.07692307692308)
      })
    })

    describe('toTwoWeekly', () => {
      describe('when a weekly amount is given', () => {
        it('should calculate the two-weekly amount', () => {
          expect(CalculateAmountByFrequency.toTwoWeekly(100, Frequency.WEEKLY)).to.equal(200)
        })
      })
      describe('when a two-weekly amount is given', () => {
        it('should calculate the two-weekly amount', () => {
          expect(CalculateAmountByFrequency.toTwoWeekly(100, Frequency.TWO_WEEKLY)).to.equal(100)
        })
      })
      describe('when a four-weekly amount is given', () => {
        it('should calculate the two-weekly amount', () => {
          expect(CalculateAmountByFrequency.toTwoWeekly(100, Frequency.FOUR_WEEKLY)).to.equal(50)
        })
      })
      describe('when a monthly amount is given', () => {
        it('should calculate the two-weekly amount', () => {
          expect(CalculateAmountByFrequency.toTwoWeekly(100, Frequency.MONTHLY)).to.equal(46.15384615384616)
        })
      })
    })

    describe('toFourWeekly', () => {
      describe('when a weekly amount is given', () => {
        it('should calculate the four-weekly amount', () => {
          expect(CalculateAmountByFrequency.toFourWeekly(100, Frequency.WEEKLY)).to.equal(400)
        })
      })
      describe('when a two-weekly amount is given', () => {
        it('should calculate the four-weekly amount', () => {
          expect(CalculateAmountByFrequency.toFourWeekly(100, Frequency.TWO_WEEKLY)).to.equal(200)
        })
      })
      describe('when a four-weekly amount is given', () => {
        it('should calculate the four-weekly amount', () => {
          expect(CalculateAmountByFrequency.toFourWeekly(100, Frequency.FOUR_WEEKLY)).to.equal(100)
        })
      })
      describe('when a monthly amount is given', () => {
        it('should calculate the four-weekly amount', () => {
          expect(CalculateAmountByFrequency.toFourWeekly(100, Frequency.MONTHLY)).to.equal(92.30769230769232)
        })
      })
    })
  })
})
