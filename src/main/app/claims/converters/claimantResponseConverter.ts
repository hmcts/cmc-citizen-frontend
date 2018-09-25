import { DraftClaimantResponse } from 'features/claimant-response/draft/draftClaimantResponse.ts'
import { ResponseRejection } from 'claims/models/response/core/responseRejection.ts'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { CourtDetermination } from 'claims/models/response/core/courtDetermination.ts'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

export class ClaimantResponseConverter {

  public static covertToClaimantRespose (draftClaimantResponse: DraftClaimantResponse): any {

    if (draftClaimantResponse.rejectionReason && draftClaimantResponse.rejectionReason.text.length > 0) {
      return {
        'type': 'rejection',
        'amountPaid': 0,
        'responseRejection': this.createResponseRejection(draftClaimantResponse)
      }
    } else {
      return {
        'type': 'acceptation',
        'amountPaid': draftClaimantResponse.paidAmount ? draftClaimantResponse.paidAmount : 0,
        'courtDetermination': this.createCourtDetermination(draftClaimantResponse),
        'formaliseOption': this.getFormaliseOption(draftClaimantResponse.formaliseRepaymentPlan.option)
      }
    }
  }

  public static createResponseRejection (draftClaimantResponse: DraftClaimantResponse): ResponseRejection {
    return {
      freeMediation: draftClaimantResponse.freeMediation.option === 'yes',
      reason: draftClaimantResponse.rejectionReason.text
    } as ResponseRejection
  }

  public static createCourtDetermination (draftClaimantResponse: DraftClaimantResponse): CourtDetermination {
    return {
      'courtCalculatedPaymentIntention': this.createPaymentIntention(draftClaimantResponse.courtOfferedPaymentIntention), // TODO:completion Date is missing in the FE model
      'rejectionReason': draftClaimantResponse.rejectionReason ? draftClaimantResponse.rejectionReason.text : ''
    }
  }

  public static getFormaliseOption (option: FormaliseRepaymentPlanOption): string {
    switch (option) {
      case FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT :
        return 'SETTLEMENT'
      case FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT :
        return 'CCJ'
    }
  }

  public static createPaymentIntention (paymentIntention: PaymentIntention): any {
    return {
      'paymentOption': paymentIntention.paymentOption,// TODO: need to change this to value
      'paymentDate': paymentIntention.paymentDate,
      'repaymentPlan': paymentIntention.repaymentPlan
    }
  }

}
