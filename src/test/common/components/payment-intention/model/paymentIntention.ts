/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { PaymentType } from 'main/common/components/payment-intention/model/paymentOption'
import { MomentFactory } from 'shared/momentFactory'
import { LocalDate } from 'forms/models/localDate'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

describe('PaymentIntention', () => {
  describe('toDomainInstance', () => {
    it('should convert immediate payment', () => {
      const paymentIntention = PaymentIntention.deserialize({
        paymentOption: { option: PaymentType.IMMEDIATELY } })

      const result = paymentIntention.toDomainInstance()
      expect(result.paymentOption).to.be.equal('IMMEDIATELY')
      expect(result.paymentDate).to.be.undefined
      expect(result.repaymentPlan).to.be.undefined
    })

    it('should convert payment in full by specified date', () => {
      const paymentIntention = PaymentIntention.deserialize({
        paymentOption: { option: PaymentType.BY_SET_DATE },
        paymentDate: { date: new LocalDate(2018,12,31) }
      })

      const result = paymentIntention.toDomainInstance()
      expect(result.paymentOption).to.be.equal('BY_SPECIFIED_DATE')
      expect(result.paymentDate.toISOString()).to.be.deep.equal(MomentFactory.parse('2018-12-31').toISOString())
      expect(result.repaymentPlan).to.be.undefined
    })

    it('should convert payment by installments', () => {
      const paymentIntention = PaymentIntention.deserialize({
        paymentOption: { option: PaymentType.INSTALMENTS },
        paymentPlan: {
          instalmentAmount : 100,
          paymentSchedule: { value: PaymentSchedule.EVERY_MONTH },
          completionDate: new LocalDate(2019,12,30)
        }
      })

      const result = paymentIntention.toDomainInstance()
      expect(result.paymentOption).to.be.equal('INSTALMENTS')
      expect(result.paymentDate).to.be.undefined
      expect(result.repaymentPlan.instalmentAmount).to.be.equal(100)
      expect(result.repaymentPlan.completionDate.toISOString()).to.be.deep.equal(MomentFactory.parse('2019-12-30').toISOString())
    })
  })
})
