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
import { CourtDetermination, DecisionType, PaymentDeadline } from 'common/court-calculations/courtDetermination'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { LocalDate } from 'forms/models/localDate'
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
    const draft: Draft<DraftClaimantResponse> = res.locals.draft
    const user: User = res.locals.user

    const externalId: string = req.params.externalId
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const courtDecision = this.getCourtDecision(claimResponse, claim, draft, user)

    switch (courtDecision) {
      case DecisionType.COURT:
      case DecisionType.DEFENDANT: {
        return Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })
      }
      case DecisionType.CLAIMANT: {
        return Paths.payBySetDateAcceptedPage.evaluateUri({ externalId: externalId })
      }
    }
  }

  getCourtDecision (claimResponse: FullAdmissionResponse | PartialAdmissionResponse, claim: Claim, draft: Draft<DraftClaimantResponse>, user: User): DecisionType {
    const defendantPaymentPlanWhenSetDate: PaymentPlan = PaymentPlanHelper
      .createPaymentPlanFromClaimWhenSetDate(
        claimResponse,
        claim.claimData.amount.totalAmount()
      )

    const defendantLastPaymentDate: Moment = defendantPaymentPlanWhenSetDate.calculateLastPaymentDate()
    const defendantEnteredPayBySetDate: Moment = claimResponse.paymentIntention.paymentDate
    const claimantEnteredPayBySetDate: Moment = draft.document.alternatePaymentMethod.paymentDate.date.toMoment()
    const courtDecision: PaymentDeadline = CourtDetermination.determinePaymentDeadline(
      defendantEnteredPayBySetDate,
      claimantEnteredPayBySetDate,
      defendantLastPaymentDate
    )

    this.saveCourtOfferedPaymentIntention(draft, defendantPaymentPlanWhenSetDate, courtDecision.date, defendantLastPaymentDate, user)
    return courtDecision.source
  }

  saveCourtOfferedPaymentIntention (draft: Draft<DraftClaimantResponse>, defendantPaymentPlanWhenSetDate: PaymentPlan, courtOfferedPaymentDate: Moment, defendantLastPaymentDate: Moment, user: User) {
    const courtOfferedPaymentIntention = new PaymentIntention()

    courtOfferedPaymentIntention.paymentPlan = defendantPaymentPlanWhenSetDate
    courtOfferedPaymentIntention.paymentDate = new LocalDate(courtOfferedPaymentDate.year(),
      defendantLastPaymentDate.month(),
      defendantLastPaymentDate.day())
    courtOfferedPaymentIntention.paymentOption = draft.document.alternatePaymentMethod.paymentOption

    draft.document.courtOfferedPaymentIntention = courtOfferedPaymentIntention
    console.log('buildPostSubmissionUri--draft--->', JSON.stringify(draft))
  }
}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(claimantResponsePath)
