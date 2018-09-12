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
    const externalId: string = req.params.externalId

    const defendantPaymentDate = this.getDefendantPaymentDate(claim)
    const claimantPaymentDate = draft.alternatePaymentMethod.paymentDate.date.toMoment()

    if (claimantPaymentDate
      .isSameOrAfter(defendantPaymentDate)) {
      return Paths.counterOfferAcceptedPage.evaluateUri({ externalId: externalId })
    } else {
      // Change this to court proposed date page
      return Paths.courtOfferPage.evaluateUri({ externalId: externalId })
    }
  }

  private getDefendantPaymentDate (claim: Claim): Moment {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    if (claimResponse.paymentIntention.paymentDate) {
      return claimResponse.paymentIntention.paymentDate
    }

    if (claimResponse.paymentIntention.repaymentPlan) {
      return PaymentPlanHelper.createCourtOrderedPaymentPlanFromDefendantSetDate(claim).calculateLastPaymentDate()
    }
  }
}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(claimantResponsePath)
