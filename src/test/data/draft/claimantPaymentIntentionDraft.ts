import { PaymentType } from 'main/common/components/payment-intention/model/paymentOption'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { PaymentIntention } from 'main/common/components/payment-intention/model/paymentIntention'

export const payImmediatelyIntent: PaymentIntention = PaymentIntention.deserialize({
  paymentOption: {
    option: {
      value: PaymentType.IMMEDIATELY.value
    }
  }
})

export const payBySetDateIntent: PaymentIntention = PaymentIntention.deserialize({
  paymentOption: {
    option: {
      value: PaymentType.BY_SET_DATE.value
    }
  },
  paymentDate: {
    date: {
      year: 2018,
      month: 12,
      day: 31
    }
  }
})

export const payByInstallmentsIntent: PaymentIntention = PaymentIntention.deserialize({
  paymentOption: {
    option: {
      value: PaymentType.INSTALMENTS.value
    }
  },
  paymentPlan: {
    instalmentAmount: 100,
    paymentSchedule: {
      value: PaymentSchedule.EVERY_MONTH.value
    },
    firstPaymentDate: {
      year: 2018,
      month: 12,
      day: 31
    },
    completionDate: {
      year: 2019,
      month: 12,
      day: 30
    },
    paymentLength: ''
  }
})
