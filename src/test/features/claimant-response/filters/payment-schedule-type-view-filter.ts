import { expect } from 'chai'
import { PaymentScheduleTypeViewFilter } from 'claimant-response/filters/payment-schedule-type-view-filter'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'

describe('Payment schedule type view filter', () => {
  PaymentSchedule.all()
    .forEach(type => {
      it(`should map '${type.value}' to '${type.displayValue}'`, () => {
        expect(PaymentScheduleTypeViewFilter.render(type.value)).to.equal(type.displayValue)
      })
    })

  it('should throw an error for anything else', () => {
    expect(() => PaymentScheduleTypeViewFilter.render('EVERY_YEAR')).to.throw(Error)
  })

  it('should throw an error for null', () => {
    expect(() => PaymentScheduleTypeViewFilter.render(null)).to.throw(Error)
  })
})
