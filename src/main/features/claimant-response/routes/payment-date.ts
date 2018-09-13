import * as express from 'express'

import { AbstractPaymentDatePage } from 'shared/components/payment-intention/payment-date'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

import { claimantResponsePath, Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { Moment } from 'moment'
import { CourtDetermination, DecisionType } from 'common/court-calculations/courtDetermination'
import { Draft } from '@hmcts/draft-store-client'

class PaymentDatePage extends AbstractPaymentDatePage<DraftClaimantResponse> {
  getHeading (): string {
    return 'What date do you want the defendant to pay by?'
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, PaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod')
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
    const externalId: string = req.params.externalId
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const courtGeneratedPayBySetDate: Moment = PaymentPlanHelper
      .createPaymentPlanFromClaimWhenSetDate(
        claimResponse,
        claim.claimData.amount.totalAmount()
      )
      .calculateLastPaymentDate()
    const defendantEnteredPayBySetDate: Moment = claimResponse.paymentIntention.paymentDate
    const claimantPaymentDate: Moment = draft.document.alternatePaymentMethod.paymentDate.date.toMoment()
    const courtDecision: DecisionType = CourtDetermination.calculateDecision(
      defendantEnteredPayBySetDate,
      claimantPaymentDate,
      courtGeneratedPayBySetDate
    )

    // if (draft.document.acceptCourtOffer || draft.document.rejectionReason) {
    //   delete draft.document.acceptCourtOffer
    //   delete draft.document.rejectionReason
    // }

    switch (courtDecision) {
      case DecisionType.COURT: {
        return Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })
      }
      case DecisionType.DEFENDANT:
      case DecisionType.CLAIMANT: {
        return Paths.payBySetDateAcceptedPage.evaluateUri({ externalId: externalId })
      }
    }
  }
}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(claimantResponsePath)
