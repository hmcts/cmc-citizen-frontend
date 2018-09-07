import { expect } from 'chai'

import { FinalPaymentDateCalculator } from 'common/court-calculations/finalPaymentDateCalculator'
import * as moment from 'moment'

describe('FinalPaymentDateCalculator', () => {

  let today = moment(new Date())
  let tomorrow = moment(new Date()).add(1,'days')
  let yesterday = moment(new Date()).add(-1,'days')

  context('getFinalPaymentDate', () => {
    it('should return claimant selected payment date', () => {
      expect(FinalPaymentDateCalculator.getFinalPaymentDate(today, tomorrow, yesterday)).to.equal(tomorrow)
    })

    it('should return defendant selected payment date', () => {
      expect(FinalPaymentDateCalculator.getFinalPaymentDate(yesterday, today, tomorrow)).to.equal(today)
    })

    it('should return court generated selected payment date', () => {
      expect(FinalPaymentDateCalculator.getFinalPaymentDate(tomorrow, today, yesterday)).to.equal(yesterday)
    })
  })
})
