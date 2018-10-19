import * as express from 'express'

import { AbstractPaymentPlanPage } from 'shared/components/payment-intention/payment-plan'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention as DraftPaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

import { Claim } from 'claims/models/claim'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

import { claimantResponsePath, Paths } from 'claimant-response/paths'

import { FormValidationError } from 'forms/form'
import { getEarliestPaymentDateForAlternatePaymentInstalments } from 'claimant-response/helpers/paydateHelper'
import { ValidationError } from 'class-validator'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { DecisionType } from 'common/court-calculations/courtDecision'
import { Frequency } from 'common/frequency/frequency'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentSchedule } from 'features/ccj/form/models/paymentSchedule'
import { CourtDecisionHelper } from 'shared/helpers/CourtDecisionHelper'
import { Moment } from 'moment'

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

    const decisionType: DecisionType = CourtDecisionHelper.createCourtDecision(locals.claim, locals.draft)
    locals.draft.document.courtCalculatedPaymentIntention = this.generateCourtCalculatedPaymentIntention(locals.draft, locals.claim, decisionType)
    locals.draft.document.decisionType = decisionType
    locals.draft.document.courtOfferedPaymentIntention = this.generateCourtOfferedPaymentIntention(locals.draft, locals.claim, decisionType)

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
      case DecisionType.CLAIMANT:
      case DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT: {
        return Paths.counterOfferAcceptedPage.evaluateUri({ externalId: externalId })
      }
    }
  }

  generateCourtOfferedPaymentIntention (draft: Draft<DraftClaimantResponse>, claim: Claim, decisionType: DecisionType): PaymentIntention {
    const claimResponse: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const courtOfferedPaymentIntention = new PaymentIntention()

    if (decisionType === DecisionType.CLAIMANT || decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT) {
      const claimantEnteredPaymentPlan: PaymentPlan = PaymentPlanHelper
        .createPaymentPlanFromDraft(draft.document)

      courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS

      if (draft.document.alternatePaymentMethod.toDomainInstance().paymentOption === PaymentOption.INSTALMENTS
        && claimResponse.paymentIntention.repaymentPlan.paymentSchedule !== draft.document.alternatePaymentMethod.toDomainInstance().repaymentPlan.paymentSchedule) {
        const paymentPlanConvertedToDefendantFrequency = claimantEnteredPaymentPlan.convertTo(PaymentSchedule.toFrequency(claimResponse.paymentIntention.repaymentPlan.paymentSchedule))

        courtOfferedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanConvertedToDefendantFrequency.startDate,
          instalmentAmount: paymentPlanConvertedToDefendantFrequency.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanConvertedToDefendantFrequency.frequency),
          completionDate: paymentPlanConvertedToDefendantFrequency.calculateLastPaymentDate(),
          paymentLength: paymentPlanConvertedToDefendantFrequency.calculatePaymentLength()
        }

        return courtOfferedPaymentIntention
      } else {
        courtOfferedPaymentIntention.repaymentPlan = draft.document.alternatePaymentMethod.toDomainInstance().repaymentPlan

        return courtOfferedPaymentIntention
      }
    }

    if (decisionType === DecisionType.COURT) {
      const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
      const claimantFrequency: Frequency = Frequency.of(draft.document.alternatePaymentMethod.paymentPlan.paymentSchedule.value)
      const paymentPlanConvertedToClaimantFrequency: PaymentPlan = paymentPlanFromDefendantFinancialStatement.convertTo(claimantFrequency)

      if (draft.document.alternatePaymentMethod.paymentOption.option.value === PaymentOption.INSTALMENTS) {
        courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
        courtOfferedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanConvertedToClaimantFrequency.startDate,
          instalmentAmount: paymentPlanConvertedToClaimantFrequency.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanConvertedToClaimantFrequency.frequency),
          completionDate: paymentPlanConvertedToClaimantFrequency.calculateLastPaymentDate(),
          paymentLength: paymentPlanConvertedToClaimantFrequency.calculatePaymentLength()
        }
        return courtOfferedPaymentIntention
      }

      if (draft.document.alternatePaymentMethod.paymentOption.option.value === PaymentOption.BY_SPECIFIED_DATE) {
        const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
        courtOfferedPaymentIntention.paymentDate = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate()
        courtOfferedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE

        return courtOfferedPaymentIntention
      }
    }

    if (decisionType === DecisionType.DEFENDANT) {

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {
        courtOfferedPaymentIntention.repaymentPlan = claimResponse.paymentIntention.repaymentPlan
        courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
      }

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
        courtOfferedPaymentIntention.paymentDate = claimResponse.paymentIntention.paymentDate
        courtOfferedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
      }

      return courtOfferedPaymentIntention
    }
  }

  generateCourtCalculatedPaymentIntention (draft: Draft<DraftClaimantResponse>, claim: Claim, decisionType: DecisionType) {
    if (decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT && draft.document.alternatePaymentMethod.paymentOption.option.value === PaymentOption.INSTALMENTS) {
      return undefined
    }

    const courtCalculatedPaymentIntention = new PaymentIntention()
    const paymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
    courtCalculatedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
    courtCalculatedPaymentIntention.repaymentPlan = {
      firstPaymentDate: paymentPlan.startDate,
      instalmentAmount: Math.round(paymentPlan.instalmentAmount * 100) / 100,
      paymentSchedule: Frequency.toPaymentSchedule(paymentPlan.frequency),
      completionDate: paymentPlan.calculateLastPaymentDate(),
      paymentLength: paymentPlan.calculatePaymentLength()
    }

    return courtCalculatedPaymentIntention
  }

  postValidation (req: express.Request, res: express.Response): FormValidationError {
    const model = req.body.model
    if (model.firstPaymentDate) {
      const validDate: Moment = getEarliestPaymentDateForAlternatePaymentInstalments(res.locals.claim, model.firstPaymentDate.toMoment())
      if (validDate && validDate > model.firstPaymentDate.toMoment()) {
        const error: ValidationError = {
          target: model,
          property: 'firstPaymentDate',
          value: model.firstPaymentDate.toMoment(),
          constraints: { 'Failed': 'Enter a date of  ' + validDate.format('DD MM YYYY') + ' or later for the first instalment' },
          children: undefined
        }
        return new FormValidationError(error)
      }
    }
    return undefined
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
