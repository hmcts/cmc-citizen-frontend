export const immediatePayment = {
  paymentOption: {
    option: {
      value: 'IMMEDIATELY'
    }
  }
}

export const paymentBySetDate = {
  paymentOption: {
    option: {
      value: 'BY_SPECIFIED_DATE'
    }
  },
  paymentDate: {
    date: {
      year: 2025,
      month: 12,
      day: 31
    }
  }
}

export const paymentByInstallments = {
  paymentOption: {
    option: {
      value: 'INSTALMENTS'
    }
  },
  paymentPlan: {
    instalmentAmount: 100,
    firstPaymentDate: {
      year: 2025,
      month: 12,
      day: 31
    },
    paymentSchedule: {
      value: 'EVERY_MONTH'
    }
  }
}
