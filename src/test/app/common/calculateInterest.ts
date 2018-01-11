import { expect } from 'chai'
import * as moment from 'moment'

import { calculateInterest } from 'app/common/calculateInterest'
import { Interest, InterestType } from 'claim/form/models/interest'

xdescribe('calculateInterest', () => {

  function buildInterest (type: InterestType = InterestType.STANDARD, rate: number = 0, reason: string = undefined): Interest {
    return new Interest().deserialize({
      type: type,
      rate: rate,
      reason: reason
    })
  }

  xdescribe('should return 0 when', () => {
    describe('amount is 0 and', () => {
      [100, 0].forEach((rate) => {
        it(`rate is ${rate}`, () => {
          const interest = buildInterest(InterestType.DIFFERENT, rate)
          const interestFromDate = moment().subtract(5, 'years')

          expect(calculateInterest(0, interest, interestFromDate)).to.equal(0)
        })
      })
    })

    describe('interest type is NO_INTEREST and', () => {
      it('amount is greater than 0', () => {
        const interest = buildInterest(InterestType.NO_INTEREST)
        const interestFromDate = moment().subtract(5, 'years')

        expect(calculateInterest(100, interest, interestFromDate)).to.equal(0)
      })
    })

    describe('date is today and', () => {
      it('amount is greater than 0', () => {
        const interest = buildInterest()
        const interestFromDate = moment()

        expect(calculateInterest(100, interest, interestFromDate)).to.equal(0)
      })
    })
  })

  xdescribe('should return positive number when', () => {
    describe('interest type is STANDARD and', () => {
      it('amount is greater than 0', () => {
        const interest = buildInterest(InterestType.STANDARD)
        const interestDate = moment().subtract(5, 'years')

        expect(calculateInterest(100, interest, interestDate)).to.equal(40.02)
      })
    })

    describe('interest type is DIFFERENT and', () => {
      it('amount is greater than 0 (rate = 8)', () => {
        const interest = buildInterest(InterestType.DIFFERENT, 8)
        const interestDate = moment().subtract(5, 'years')

        expect(calculateInterest(100, interest, interestDate)).to.equal(40.02)
      })

      it('amount is greater than 0 (rate = 20)', () => {
        const interest = buildInterest(InterestType.DIFFERENT, 20)
        const interestDate = moment().subtract(5, 'years')

        expect(calculateInterest(100, interest, interestDate)).to.equal(100.05)
      })
    })
  })

  it('should calculate interest for any day', () => {
    const interest = buildInterest(InterestType.DIFFERENT, 8)
    const interestFromDate = moment().subtract(5, 'years')
    const interestToDate = moment().subtract(5, 'year').add(1, 'day')

    expect(calculateInterest(100, interest, interestFromDate, interestToDate)).to.equal(0.02)
  })
})
