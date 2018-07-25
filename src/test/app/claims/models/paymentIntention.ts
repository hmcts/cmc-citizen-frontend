import { MomentFactory } from 'shared/momentFactory'
import { expect } from 'chai'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

describe('pastDefendantPayImmediatelyDate', () => {
  it('should return true when payment date is earlier than current day', () => {
    const paymentIntention = PaymentIntention.deserialize({
      paymentDate: MomentFactory.currentDateTime().subtract(1, 'day')
    })

    expect(paymentIntention.pastDefendantPayImmediatelyDate).to.be.equal(true)
  })

  it('should return false when payment date is later than current day', () => {
    const paymentIntention = PaymentIntention.deserialize({
      paymentDate: MomentFactory.currentDate().add(1, 'day')
    })

    expect(paymentIntention.pastDefendantPayImmediatelyDate).to.be.equal(false)
  })
})
