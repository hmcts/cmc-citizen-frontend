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
import { DraftService } from 'services/draftService'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { LocalDate } from 'forms/models/localDate'

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
    const user: User = res.locals.user
    
    const externalId: string = req.params.externalId
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const courtDecision = this.getCourtDecision(claimResponse, claim, draft, user)

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

  getCourtDecision (claimResponse: FullAdmissionResponse | PartialAdmissionResponse, claim: Claim, draft: Draft<DraftClaimantResponse>, user: User): DecisionType {
    const defendantPaymentPlanWhenSetDate: PaymentPlan = PaymentPlanHelper
      .createPaymentPlanFromClaimWhenSetDate(
        claimResponse,
        claim.claimData.amount.totalAmount()
      )

    const defendantLastPaymentDate: Moment = defendantPaymentPlanWhenSetDate.calculateLastPaymentDate()
    const defendantEnteredPayBySetDate: Moment = claimResponse.paymentIntention.paymentDate
    const claimantEnteredPayBySetDate: Moment = draft.document.alternatePaymentMethod.paymentDate.date.toMoment()
    const courtDecision: DecisionType = CourtDetermination.calculateDecision(
      defendantEnteredPayBySetDate,
      claimantEnteredPayBySetDate,
      defendantLastPaymentDate
    )

    const courtOfferedPaymentDate: Moment = this.getCourtOfferedDate(
      courtDecision,
      defendantEnteredPayBySetDate,
      claimantEnteredPayBySetDate,
      defendantLastPaymentDate
    )

    this.saveCourtOfferedPaymentIntention(draft, defendantPaymentPlanWhenSetDate, courtOfferedPaymentDate, defendantLastPaymentDate, user)
    return courtDecision
  }

  saveCourtOfferedPaymentIntention (draft: Draft<DraftClaimantResponse>, defendantPaymentPlanWhenSetDate: PaymentPlan, courtOfferedPaymentDate: Moment, defendantLastPaymentDate: Moment, user: User) {
    draft.document.courtOfferedPaymentIntention = new PaymentIntention()

    draft.document.courtOfferedPaymentIntention.paymentPlan = defendantPaymentPlanWhenSetDate
    draft.document.courtOfferedPaymentIntention.paymentDate = new LocalDate(courtOfferedPaymentDate.year(),
      defendantLastPaymentDate.month(),
      defendantLastPaymentDate.day())
    draft.document.courtOfferedPaymentIntention.paymentOption = draft.document.alternatePaymentMethod.paymentOption

    // await new DraftService().save(draft, user.bearerToken)
    console.log('payment-date-courtOfferedPaymentIntention------>', draft.document.courtOfferedPaymentIntention)
  }

  getCourtOfferedDate (courtDecision: DecisionType,
                               defendantEnteredPayBySetDate: Moment,
                               claimantPaymentDate: Moment,
                               courtOfferedPayBySetDate: Moment
                               ): Moment {
    switch (courtDecision) {
      case DecisionType.COURT: {
        return courtOfferedPayBySetDate
      }
      case DecisionType.DEFENDANT: {
        return defendantEnteredPayBySetDate
      }
      case DecisionType.CLAIMANT: {
        return claimantPaymentDate
      }
    }
  }
}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(claimantResponsePath)
