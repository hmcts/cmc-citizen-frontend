import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'

export const intentionOfImmediatePayment = {
  paymentOption: {
    option: {
      value: PaymentType.IMMEDIATELY.value
    }
  }
}

export const intentionOfPaymentInFullBySetDate = {
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
}

export const intentionOfPaymentByInstallments = {
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
    }
  }
}
