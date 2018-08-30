import { MomentFactory } from 'shared/momentFactory'

const baseClaimantResponseDraft = {
  paidAmount: {
    amount: 100
  }
}

export const claimantResponseDraftWithPaymentMethodAccepted = {
  acceptPaymentMethod: {
    accept: {
      option: 'yes'
    }
  },
  ...baseClaimantResponseDraft
}

export const claimantResponseDraftWithPaymentMethodRejectedAndImmediatePaymentProposed = {
  acceptPaymentMethod: {
    accept: {
      option: 'no'
    }
  },
  alternatePaymentMethod: {
    paymentOption: {
      option: {
        value: 'IMMEDIATELY'
      }
    },
    paymentDate: {
      date: MomentFactory.currentDate().add(5, 'days')
    }
  },
  ...baseClaimantResponseDraft
}

export const claimantResponseDraftWithPaymentMethodRejectedAndPaymentBySetDateProposed = {
  acceptPaymentMethod: {
    accept: {
      option: 'no'
    }
  },
  alternatePaymentMethod: {
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
  },
  ...baseClaimantResponseDraft
}

export const claimantResponseDraftWithPaymentMethodRejectedAndPaymentByInstalmentProposed = {
  acceptPaymentMethod: {
    accept: {
      option: 'no'
    }
  },
  alternatePaymentMethod: {
    paymentOption: {
      option: {
        value: 'INSTALMENTS'
      }
    },
    repaymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: '2050-12-31T00:00:00.000Z',
      paymentSchedule: 'EACH_WEEK'
    }
  },
  ...baseClaimantResponseDraft
}
