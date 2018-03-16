import { expect } from 'chai'
import * as moment from 'moment'

import { calculateInterest } from 'app/common/calculateInterest'
import { InterestRateOption } from 'claim/form/models/interestRate'
import { mockCalculateInterestRate } from '../../http-mocks/claim-store'

describe('calculateInterest', () => {

  describe('should call api for any data gets what API returns', async () => {

    beforeEach(() => {
      mockCalculateInterestRate(0)
    })

    Object.keys(InterestRateOption).forEach(async (type) => {
      [0, 1, 1000].forEach(async (rate) => {
        it(`when rate is ${rate}, InterestRateOption = ${type} gets 0`, async () => {

          const interestFromDate = moment().subtract(5, 'years')

          const expected: number = await calculateInterest(0, rate, interestFromDate)

          expect(expected).to.equal(0)
        })
      })
    })
  })
})
