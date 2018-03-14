import { HowMuchPaidClaimantOption } from 'response/form/models/howMuchPaidClaimant'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { ResponseType } from 'response/form/models/responseType'
import { individualDetails } from './partyDetails'

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
  },
  freeMediation: {
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
