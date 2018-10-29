import * as express from 'express'

import { AbstractPaymentDatePage } from 'shared/components/payment-intention/payment-date'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentIntention as DraftPaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

import { claimantResponsePath, Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { Moment } from 'moment'
import { DecisionType } from 'common/court-calculations/courtDecision'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import { Draft } from '@hmcts/draft-store-client'
import { User } from 'idam/user'
import { PaymentOption } from 'claims/models/paymentOption'
import { CourtDecisionHelper } from 'shared/helpers/CourtDecisionHelper'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'

export class PaymentDatePage extends AbstractPaymentDatePage<DraftClaimantResponse> {

  static generateCourtOfferedPaymentIntention (draft: DraftClaimantResponse, claim: Claim, decisionType: DecisionType): PaymentIntention {
    const courtCalculatedPaymentIntention = new PaymentIntention()
    const claimResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    if (decisionType === DecisionType.CLAIMANT || decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT) {
      if (draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.BY_SPECIFIED_DATE) {
        courtCalculatedPaymentIntention.paymentDate = draft.alternatePaymentMethod.toDomainInstance().paymentDate
        courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
      }
      return courtCalculatedPaymentIntention
    }

    if (decisionType === DecisionType.COURT) {
      const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
      const lastPaymentDate: Moment = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate()

      if (draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.BY_SPECIFIED_DATE) {
        courtCalculatedPaymentIntention.paymentDate = lastPaymentDate
        courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
      }

      if (draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.INSTALMENTS) {
        const defendantFrequency: Frequency = PaymentSchedule.toFrequency(claimResponse.paymentIntention.repaymentPlan.paymentSchedule)
        const paymentPlanConvertedToDefendantFrequency: PaymentPlan = paymentPlanFromDefendantFinancialStatement.convertTo(defendantFrequency)
        courtCalculatedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
        courtCalculatedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanConvertedToDefendantFrequency.startDate,
          instalmentAmount: paymentPlanConvertedToDefendantFrequency.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanConvertedToDefendantFrequency.frequency),
          completionDate: paymentPlanConvertedToDefendantFrequency.calculateLastPaymentDate(),
          paymentLength: paymentPlanConvertedToDefendantFrequency.calculatePaymentLength()
        }
      }

      return courtCalculatedPaymentIntention
    }

    if (decisionType === DecisionType.DEFENDANT) {

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
        courtCalculatedPaymentIntention.paymentDate = claimResponse.paymentIntention.paymentDate
        courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
      }

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {

        courtCalculatedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
        courtCalculatedPaymentIntention.repaymentPlan = claimResponse.paymentIntention.repaymentPlan
      }
      return courtCalculatedPaymentIntention
    }
  }

  static generateCourtCalculatedPaymentIntention (draft: DraftClaimantResponse, claim: Claim, decisionType: DecisionType) {
    if (decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT && draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.BY_SPECIFIED_DATE) {
      return undefined
    }
    const paymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
    if (!paymentPlan) {
      return undefined
    }

    const courtCalculatedPaymentIntention = new PaymentIntention()
    courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
    courtCalculatedPaymentIntention.paymentDate = paymentPlan.calculateLastPaymentDate()
    return courtCalculatedPaymentIntention
  }

  getHeading (): string {
    return 'What date do you want the defendant to pay by?'
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, DraftPaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod')
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: DraftClaimantResponse = res.locals.draft.document
    const claimResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const externalId: string = req.params.externalId
    const courtDecision = CourtDecisionHelper.createCourtDecision(claim, draft)

    switch (courtDecision) {
      case DecisionType.COURT: {
        return Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })
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
        return Paths.payBySetDateAcceptedPage.evaluateUri({ externalId: externalId })
      }
    }
  }

  async saveDraft (locals: { user: User; draft: Draft<DraftClaimantResponse>, claim: Claim }): Promise<void> {
    const decisionType: DecisionType = CourtDecisionHelper.createCourtDecision(locals.claim, locals.draft.document)
    locals.draft.document.decisionType = decisionType

    const courtCalculatedPaymentIntention = PaymentDatePage.generateCourtCalculatedPaymentIntention(locals.draft.document, locals.claim, decisionType)
    if (courtCalculatedPaymentIntention) {
      locals.draft.document.courtCalculatedPaymentIntention = courtCalculatedPaymentIntention
      locals.draft.document.courtOfferedPaymentIntention = PaymentDatePage.generateCourtOfferedPaymentIntention(locals.draft.document, locals.claim, decisionType)
    }

    return super.saveDraft(locals)
  }

}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(claimantResponsePath)
