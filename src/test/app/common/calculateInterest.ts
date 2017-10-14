import { expect } from 'chai'
import * as moment from 'moment'

import { calculateInterest } from 'app/common/calculateInterest'
import { Interest, InterestType } from 'claim/form/models/interest'

describe('calculateInterest', () => {

  function buildInterest (type: InterestType = InterestType.STANDARD, rate: number = 0, reason: string = undefined): Interest {
    let interest: Interest = new Interest()

    return interest.deserialize({
      type: type,
      rate: rate,
      reason: reason
    })
  }

  describe('should return 0 when', () => {
    describe('amount 0 and', () => {
      const AMOUNT: number = 0;

      [100, 0].forEach((rate) => {
        it(`rate ${rate}`, () => {
          const interest = buildInterest(InterestType.DIFFERENT, rate)
          const interestDate = moment().subtract(5, 'years')

          expect(calculateInterest(AMOUNT, interest, interestDate)).to.equal(0)
        })
      })
    })

    describe('interest type is NO_INTEREST and', () => {
      it('amount is greater than 0', () => {
        const interest = buildInterest(InterestType.NO_INTEREST)
        const interestDate = moment().subtract(5, 'years')

        expect(calculateInterest(100, interest, interestDate)).to.equal(0)
      })
    })

    describe('date is today', () => {
      it('amount is greater than 0', () => {
        const interest = buildInterest()
        const interestDate = moment()

        expect(calculateInterest(100, interest, interestDate)).to.equal(0)
      })
    })
  })

  describe('should return positive number when', () => {

    let amount: number = 100
    let EXPECTED_RESULT: number = 40.02

    describe('interest type is STANDARD and', () => {
      it('amount is greater than 0', () => {
        const interest = buildInterest(InterestType.STANDARD)
        const interestDate = moment().subtract(5, 'years')

        expect(calculateInterest(amount, interest, interestDate)).to.equal(EXPECTED_RESULT)
      })
    })

    describe('interest type is DIFFERENT and', () => {
      it('amount is greater than 0 (rate = 8)', () => {
        const interest = buildInterest(InterestType.DIFFERENT, 8)
        const interestDate = moment().subtract(5, 'years')

        expect(calculateInterest(amount, interest, interestDate)).to.equal(EXPECTED_RESULT)
      })

      it('amount is greater than 0 (rate = 20)', () => {
        const interest = buildInterest(InterestType.DIFFERENT, 20)
        const interestDate = moment().subtract(5, 'years')

        let result: number = calculateInterest(amount, interest, interestDate)
        expect(result).not.to.equal(EXPECTED_RESULT)
        expect(result).to.equal(100.05)
      })
    })
  })

})
