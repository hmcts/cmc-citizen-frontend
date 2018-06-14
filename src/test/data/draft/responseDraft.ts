import { PaymentSchedule } from 'claims/models/response/fullDefenceAdmission'
import { DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { HowMuchPaidClaimantOption } from 'response/form/models/howMuchPaidClaimant'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { ResponseType } from 'response/form/models/responseType'
import { individualDetails } from 'test/data/draft/partyDetails'

const baseResponseDraft = {
  defendantDetails: {
    partyDetails: individualDetails,
    mobilePhone: {
      number: '0700000000'
    },
    email: {
      address: 'user@example.com'
    }
  },
  moreTimeNeeded: {
    option: 'no'
  }
}

const baseDefenceDraft = {
  response: {
    type: {
      value: ResponseType.DEFENCE.value
    }
  },
  defence: {
    text: 'My defence'
  },
  freeMediation: {
    option: 'no'
  }
}

export const defenceWithDisputeDraft = {
  ...baseResponseDraft,
  ...baseDefenceDraft,
  rejectAllOfClaim: {
    option: RejectAllOfClaimOption.DISPUTE
  }
}

export const defenceWithAmountClaimedAlreadyPaidDraft = {
  ...baseResponseDraft,
  ...baseDefenceDraft,
  rejectAllOfClaim: {
    option: RejectAllOfClaimOption.ALREADY_PAID
  },
  howMuchPaidClaimant: {
    option: HowMuchPaidClaimantOption.AMOUNT_CLAIMED
  },
  whenDidYouPay: {
    date: {
      year: 2017,
      month: 12,
      day: 31
    },
    text: 'I paid in cash'
  }
}

const baseFullAdmissionDraft = {
  response: {
    type: {
      value: ResponseType.FULL_ADMISSION.value
    }
  }
}

export const fullAdmissionWithImmediatePaymentDraft = {
  ...baseResponseDraft,
  ...baseFullAdmissionDraft,
  fullAdmission: {
    paymentOption: {
      option: DefendantPaymentType.IMMEDIATELY
    }
  }
}

export const fullAdmissionWithPaymentBySetDateDraft = {
  ...baseResponseDraft,
  ...baseFullAdmissionDraft,
  fullAdmission: {
    paymentOption: {
      option: DefendantPaymentType.BY_SET_DATE
    },
    paymentDate: {
      date: {
        year: 2050,
        month: 12,
        day: 31
      }
    }
  }
}

export const fullAdmissionWithPaymentByInstalmentsDraft = {
  ...baseResponseDraft,
  ...baseFullAdmissionDraft,
  fullAdmission: {
    paymentOption: {
      option: DefendantPaymentType.INSTALMENTS
    },
    paymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: {
        year: 2050,
        month: 12,
        day: 31
      },
      paymentSchedule: {
        value: PaymentSchedule.EACH_WEEK
      }
    }
  }
}
