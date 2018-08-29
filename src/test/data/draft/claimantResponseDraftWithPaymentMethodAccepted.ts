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

export const claimantResponseDraftWithPaymentMethodRejectedAndImmediatePaymentSuggested = {
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
    }
  },
  ...baseClaimantResponseDraft
}

export const claimantResponseDraftWithPaymentMethodRejectedAndPaymentBySetDateSuggested = {
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
