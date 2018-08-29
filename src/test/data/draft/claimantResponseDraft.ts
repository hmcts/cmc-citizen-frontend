import { ResponseType } from 'response/form/models/responseType'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { individualDetails } from 'test/data/draft/partyDetails'

import { MomentFactory } from 'shared/momentFactory'

const baseFullAdmissionDraft = {
  response: {
    type: {
      value: ResponseType.FULL_ADMISSION.value
    }
  }
}

const basePartialAdmissionDraft = {
  response: {
    type: {
      value: ResponseType.PART_ADMISSION.value
    }
  }
}

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

const baseFullAdmissionData = {
  responseType: 'FULL_ADMISSION',
  freeMediation: undefined
}

const basePartialAdmissionData = {
  responseType: 'PART_ADMISSION',
  freeMediation: undefined
}

const basePartialEvidencesAndTimeLines = {
  evidence: {
    rows: [
      {
        type: 'CONTRACTS_AND_AGREEMENTS',
        description: ' you might have signed a contract'
      }
    ],
    comment: ' you might have signed a contract'
  },
  timeline: {
    rows: [
      {
        date: '1 May 2017',
        description: ' you might have signed a contract'
      }
    ],
    comment: ' you might have signed a contract'
  }
}

export const fullAdmissionClaimantAcceptedPayImmediatelyDraft = {
  ...baseResponseDraft,
  ...baseFullAdmissionDraft,
  fullAdmission: {
    paymentIntention: {
      paymentOption: {
        option: PaymentType.IMMEDIATELY,
        paymentDate: MomentFactory.currentDate().add(5, 'days')
      }
    }
  }
}

export const fullAdmissionClaimantAcceptedPaySetDateDraft = {
  ...baseResponseDraft,
  ...baseFullAdmissionDraft,
  fullAdmission: {
    paymentIntention: {
      paymentOption: {
        option: PaymentType.BY_SET_DATE
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
}

export const fullAdmissionClaimantAcceptedPayByInstalmentDraft = {
  ...baseResponseDraft,
  ...baseFullAdmissionDraft,
  fullAdmission: {
    paymentIntention: {
      paymentOption: {
        option: PaymentType.INSTALMENTS
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
}

export const fullAdmissionClaimantRejectedWithProposalPayImmediatelyDraft = {
  ...baseFullAdmissionDraft
}
export const fullAdmissionClaimantRejectedWithProposalPaySetDateDraft = {
  ...baseFullAdmissionDraft
}
export const fullAdmissionClaimantRejectedWithProposalPayInstalmentsDraft = {
  ...baseFullAdmissionDraft
}

export const partAdmissionCompanyAcceptedPayImmediatelyDraft = {
  ...basePartialAdmissionDraft
}
export const partAdmissionCompanyAcceptedPaySetDateDraft = {
  ...basePartialAdmissionDraft
}
export const partAdmissionCompanyAcceptedPayByInstalmentDraft = {
  ...basePartialAdmissionDraft
}

export const partAdmissionCompanyRejectedWithProposalPayImmediatelyDraft = {
  ...basePartialAdmissionDraft
}
export const partAdmissionCompanyRejectedWithProposalPaySetDateDraft = {
  ...basePartialAdmissionDraft
}
export const partAdmissionCompanyRejectedWithProposalPayInstalmentsDraft = {
  ...basePartialAdmissionDraft
}
