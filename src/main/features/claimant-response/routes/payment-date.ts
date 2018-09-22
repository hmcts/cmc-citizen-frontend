import * as express from 'express'

import { AbstractPaymentDatePage } from 'shared/components/payment-intention/payment-date'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

import { claimantResponsePath, Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { Moment } from 'moment'
import { CourtDetermination, DecisionType } from 'common/court-calculations/courtDetermination'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import { Draft } from '@hmcts/draft-store-client'
import { User } from 'idam/user'
import { PaymentOption } from 'claims/models/paymentOption'

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

    const externalId: string = req.params.externalId
    const courtDecision = this.getCourtDecision(claim, draft)

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

  getCourtDecision (claim: Claim, draft: Draft<DraftClaimantResponse>): DecisionType {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const courtCalculatedPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
    const defendantPaymentPlanWhenInstalment: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)

    const defendantEnteredPayBySetDate: Moment = claimResponse.paymentIntention.paymentDate
    const defendantInstalmentLastDate: Moment = defendantPaymentPlanWhenInstalment.calculateLastPaymentDate()

    const courtOfferedLastDate: Moment = courtCalculatedPaymentPlan.calculateLastPaymentDate()
    const defendantLastPaymentDate: Moment = defendantEnteredPayBySetDate ? defendantInstalmentLastDate : defendantEnteredPayBySetDate
    const claimantEnteredPayBySetDate: Moment = draft.document.alternatePaymentMethod.paymentDate.date.toMoment()

    return CourtDetermination.calculateDecision(
      defendantLastPaymentDate,
      claimantEnteredPayBySetDate,
      courtOfferedLastDate
    )
  }

  generateCourtCalculatedPaymentIntention (draft: Draft<DraftClaimantResponse>, claim: Claim, decisionType: DecisionType): PaymentIntention {
    const courtCalculatedPaymentIntention = new PaymentIntention()

    if (decisionType === DecisionType.CLAIMANT) {
      const claimantEnteredPayBySetDate: Moment = draft.document.alternatePaymentMethod.paymentDate.date.toMoment()

      courtCalculatedPaymentIntention.paymentDate = claimantEnteredPayBySetDate
      courtCalculatedPaymentIntention.paymentOption = draft.document.alternatePaymentMethod.toDomainInstance().paymentOption

      return courtCalculatedPaymentIntention
    }

    if (decisionType === DecisionType.COURT || decisionType === DecisionType.DEFENDANT) {
      const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
      const lastPaymentDate: Moment = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate()
      
      if (draft.document.alternatePaymentMethod.paymentOption.option.value === PaymentOption.BY_SPECIFIED_DATE) {
        courtCalculatedPaymentIntention.paymentDate = lastPaymentDate
      }

      if (draft.document.alternatePaymentMethod.paymentOption.option.value === PaymentOption.INSTALMENTS)
      courtCalculatedPaymentIntention.paymentDate = lastPaymentDate
      courtCalculatedPaymentIntention.paymentOption = draft.document.alternatePaymentMethod.toDomainInstance().paymentOption
      courtCalculatedPaymentIntention.repaymentPlan = { 
        firstPaymentDate: paymentPlanFromDefendantFinancialStatement.startDate, 
        instalmentAmount: paymentPlanFromDefendantFinancialStatement.instalmentAmount, 
        paymentSchedule: Frequency.toPaymentSchedule(paymentPlanFromDefendantFinancialStatement.frequency) }

      return courtCalculatedPaymentIntention
    }
  }

  async saveDraft (locals: { user: User; draft: Draft<DraftClaimantResponse>, claim: Claim }): Promise<void> {
    const getCourtDecision: DecisionType = this.getCourtDecision(locals.claim, locals.draft)

    locals.draft.document.courtDecisionType = getCourtDecision
    locals.draft.document.courtOfferedPaymentIntention = this.generateCourtCalculatedPaymentIntention(locals.draft, locals.claim, getCourtDecision)

    return super.saveDraft(locals)
  }
}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(claimantResponsePath)
