import * as express from 'express'

import { AbstractPaymentPlanPage } from 'shared/components/payment-intention/payment-plan'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention as DraftPaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

import { Claim } from 'claims/models/claim'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

import { claimantResponsePath, Paths } from 'claimant-response/paths'

import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { DecisionType } from 'common/court-calculations/courtDetermination'
import { Frequency } from 'common/frequency/frequency'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentSchedule } from 'features/ccj/form/models/paymentSchedule'
import { CourtDecisionHelper } from 'shared/helpers/CourtDecisionHelper'

class PaymentPlanPage extends AbstractPaymentPlanPage<DraftClaimantResponse> {
  getView (): string {
    return 'claimant-response/views/payment-plan'
  }

  getHeading (): string {
    return 'Suggest instalments for the defendant'
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, DraftPaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod')
  }

  async saveDraft (locals: { user: User; draft: Draft<DraftClaimantResponse>, claim: Claim }): Promise<void> {
    const getCourtDecision: DecisionType = CourtDecisionHelper.createCourtDecision(locals.claim, locals.draft)

    locals.draft.document.courtDecisionType = getCourtDecision
    locals.draft.document.courtOfferedPaymentIntention = this.generateCourtCalculatedPaymentIntention(locals.draft, locals.claim, getCourtDecision)

    return super.saveDraft(locals)
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: Draft<DraftClaimantResponse> = res.locals.draft
    const courtDecision: DecisionType = CourtDecisionHelper.createCourtDecision(claim, draft)
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const externalId: string = req.params.externalId
    switch (courtDecision) {
      case DecisionType.COURT: {
        return Paths.courtOfferPage.evaluateUri({ externalId: externalId })
      }
      case DecisionType.DEFENDANT: {
        if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {
          return Paths.courtOfferPage.evaluateUri({ externalId: externalId })
        }

        if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
          return Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })
        }
        break
      }
      case DecisionType.CLAIMANT: {
        return Paths.counterOfferAcceptedPage.evaluateUri({ externalId: externalId })
      }
    }
  }

  generateCourtCalculatedPaymentIntention (draft: Draft<DraftClaimantResponse>, claim: Claim, decisionType: DecisionType): PaymentIntention {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const courtCalculatedPaymentIntention = new PaymentIntention()

    draft.document.courtDecisionType = decisionType

    if (decisionType === DecisionType.CLAIMANT) {
      const claimantEnteredPaymentPlan: PaymentPlan = PaymentPlanHelper
        .createPaymentPlanFromDraft(draft.document)

      courtCalculatedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS

      if (draft.document.alternatePaymentMethod.toDomainInstance().paymentOption === PaymentOption.INSTALMENTS
        && PaymentSchedule.toFrequency(claimResponse.paymentIntention.repaymentPlan.paymentSchedule) !== claimantEnteredPaymentPlan.frequency) {
        const paymentPlanConvertedToDefendantFrequency = claimantEnteredPaymentPlan.convertTo(PaymentSchedule.toFrequency(claimResponse.paymentIntention.repaymentPlan.paymentSchedule))

        courtCalculatedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanConvertedToDefendantFrequency.startDate,
          instalmentAmount: paymentPlanConvertedToDefendantFrequency.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanConvertedToDefendantFrequency.frequency),
          completionDate: paymentPlanConvertedToDefendantFrequency.calculateLastPaymentDate(),
          paymentLength: paymentPlanConvertedToDefendantFrequency.calculatePaymentLength()
        }

        return courtCalculatedPaymentIntention
      } else {
        courtCalculatedPaymentIntention.repaymentPlan = {
          firstPaymentDate: claimantEnteredPaymentPlan.startDate,
          instalmentAmount: claimantEnteredPaymentPlan.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(claimantEnteredPaymentPlan.frequency),
          completionDate: claimantEnteredPaymentPlan.calculateLastPaymentDate(),
          paymentLength: claimantEnteredPaymentPlan.calculatePaymentLength()
        }

        return courtCalculatedPaymentIntention
      }
    }

    if (decisionType === DecisionType.COURT) {
      const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
      const claimantFrequency: Frequency = Frequency.of(draft.document.alternatePaymentMethod.paymentPlan.paymentSchedule.value)
      const paymentPlanConvertedToClaimantFrequency: PaymentPlan = paymentPlanFromDefendantFinancialStatement.convertTo(claimantFrequency)

      if (draft.document.alternatePaymentMethod.paymentOption.option.value === PaymentOption.INSTALMENTS) {
        courtCalculatedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
        courtCalculatedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanConvertedToClaimantFrequency.startDate,
          instalmentAmount: paymentPlanConvertedToClaimantFrequency.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanConvertedToClaimantFrequency.frequency),
          completionDate: paymentPlanConvertedToClaimantFrequency.calculateLastPaymentDate(),
          paymentLength: paymentPlanConvertedToClaimantFrequency.calculatePaymentLength()
        }
        return courtCalculatedPaymentIntention
      }

      if (draft.document.alternatePaymentMethod.paymentOption.option.value === PaymentOption.BY_SPECIFIED_DATE) {
        const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
        courtCalculatedPaymentIntention.paymentDate = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate()
        courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE

        return courtCalculatedPaymentIntention
      }
    }

    if (decisionType === DecisionType.DEFENDANT) {
      const paymentPlanFromDefendant: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {
        courtCalculatedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanFromDefendant.startDate,
          instalmentAmount: paymentPlanFromDefendant.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanFromDefendant.frequency),
          completionDate: paymentPlanFromDefendant.calculateLastPaymentDate(),
          paymentLength: paymentPlanFromDefendant.calculatePaymentLength()
        }
        courtCalculatedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
      }

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
        courtCalculatedPaymentIntention.paymentDate = claimResponse.paymentIntention.paymentDate
        courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
      }

      return courtCalculatedPaymentIntention
    }
  }
}

/* tslint:disable:no-default-export */
export default new PaymentPlanPage()
  .buildRouter(claimantResponsePath,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

      if (response.statementOfMeans === undefined) {
        return next(new Error('Page cannot be rendered because response does not have statement of means'))
      }

      next()
    }
  )
