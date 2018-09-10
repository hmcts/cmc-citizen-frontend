import * as express from 'express'

import { AbstractPaymentDatePage } from 'shared/components/payment-intention/payment-date'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

import { claimantResponsePath, Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { PaymentOption } from 'claims/models/paymentOption'
import { CourtOrderHelper } from 'shared/helpers/courtOrderHelper'

class PaymentDatePage extends AbstractPaymentDatePage<DraftClaimantResponse> {
  getHeading (): string {
    return 'What date do you want the defendant to pay by?'
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, PaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod')
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: DraftClaimantResponse = res.locals.draft.document
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const externalId: string = req.params.externalId

    const defendantSuggestedPaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaimWhenSetDate(claimResponse,claim.totalAmountTillDateOfIssue)
    const claimantSuggestedPaymentPlan = PaymentPlanHelper.createPaymentPlanFromDraft(draft)
    const courtSuggestedPaymentPlan = CourtOrderHelper.createCourtOrder(claim, draft)

    // Change below if condition to use Court Determination Calculator
    if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
      return Paths.counterOfferAcceptedPage.evaluateUri({ externalId: externalId })
    } else {
      // Change this to court proposed date page
      return Paths.courtOfferPage.evaluateUri({ externalId: externalId })
    }
  }
}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(claimantResponsePath)
