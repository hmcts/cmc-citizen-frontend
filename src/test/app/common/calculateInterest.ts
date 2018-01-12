import { expect } from 'chai'
import * as moment from 'moment'

import { calculateInterest } from 'app/common/calculateInterest'
import { Interest, InterestType } from 'claim/form/models/interest'
import { mockCalculateInterestRate } from '../../http-mocks/claim-store'

describe('calculateInterest', () => {

  function buildInterest (type: InterestType, rate: number): Interest {
    return new Interest().deserialize({
      type: type,
      rate: rate,
      reason: 'because'
    })
  }

  describe('should call api for any data gets what API returns', async () => {

    beforeEach(() => {
      mockCalculateInterestRate(0)
    })

    Object.keys(InterestType).forEach(async (type) => {
      [0, 1, 1000].forEach(async (rate) => {
        it(`when rate is ${rate}, interestType = ${type} gets 0`, async () => {

          const interest = buildInterest(type, rate)
          const interestFromDate = moment().subtract(5, 'years')

          const expected: number = await calculateInterest(0, interest, interestFromDate)

          expect(expected).to.equal(0)
        })
      })
    })
  })
})
