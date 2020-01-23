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
import { DecisionType } from 'common/court-calculations/decisionType'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Draft } from '@hmcts/draft-store-client'
import { User } from 'idam/user'
import { PaymentOption } from 'claims/models/paymentOption'
import { CourtDecisionHelper } from 'shared/helpers/CourtDecisionHelper'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

export class PaymentDatePage extends AbstractPaymentDatePage<DraftClaimantResponse> {

  static generateCourtOfferedPaymentIntention (draft: DraftClaimantResponse, claim: Claim, decisionType: DecisionType): PaymentIntention {
    const courtOfferedPaymentIntention = new PaymentIntention()
    const claimResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    switch (decisionType) {
      case DecisionType.CLAIMANT:
      case DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT:
        if (draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.BY_SPECIFIED_DATE) {
          courtOfferedPaymentIntention.paymentDate = draft.alternatePaymentMethod.toDomainInstance().paymentDate
          courtOfferedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
        }
        break

      case DecisionType.COURT:
        const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)
        const lastPaymentDate: Moment = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate()

        if (draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.BY_SPECIFIED_DATE) {
          courtOfferedPaymentIntention.paymentDate = lastPaymentDate
          courtOfferedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
        }
        break

      case DecisionType.DEFENDANT:
        if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
          courtOfferedPaymentIntention.paymentDate = claimResponse.paymentIntention.paymentDate
          courtOfferedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
        }

        if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {

          courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
          courtOfferedPaymentIntention.repaymentPlan = claimResponse.paymentIntention.repaymentPlan
        }
        break

      default:
    }
    return courtOfferedPaymentIntention
  }

  static generateCourtCalculatedPaymentIntention (draft: DraftClaimantResponse, claim: Claim) {
    const paymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)
    if (!paymentPlan) {
      return undefined
    }

    const courtCalculatedPaymentIntention = new PaymentIntention()
    courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
    courtCalculatedPaymentIntention.paymentDate = paymentPlan.calculateLastPaymentDate()
    return courtCalculatedPaymentIntention
  }

  getHeading (): string {
    return 'When do you want the defendant to pay?'
  }

  getNotice (): string {
    return 'The court will review your suggestion and may reject it if it’s sooner than the defendant can afford to repay the money.'
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, DraftPaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod')
  }

  async saveDraft (locals: { user: User; draft: Draft<DraftClaimantResponse>, claim: Claim }): Promise<void> {

    if (!locals.claim.response.defendant.isBusiness()) {
      const decisionType: DecisionType = CourtDecisionHelper.createCourtDecision(locals.claim, locals.draft.document)
      locals.draft.document.courtDetermination.decisionType = decisionType
      locals.draft.document.courtDetermination.courtPaymentIntention = PaymentDatePage.generateCourtCalculatedPaymentIntention(locals.draft.document, locals.claim) || undefined
      locals.draft.document.courtDetermination.courtDecision = PaymentDatePage.generateCourtOfferedPaymentIntention(locals.draft.document, locals.claim, decisionType)
    }
    return super.saveDraft(locals)
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: DraftClaimantResponse = res.locals.draft.document
    const claimResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const externalId: string = req.params.externalId

    const courtDecision = CourtDecisionHelper.createCourtDecision(claim, draft)
    switch (courtDecision) {
      case DecisionType.NOT_APPLICABLE_IS_BUSINESS:
        return Paths.taskListPage.evaluateUri({ externalId })
      case DecisionType.COURT:
        return Paths.courtOfferedSetDatePage.evaluateUri({ externalId })
      case DecisionType.DEFENDANT:
        if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {
          return Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId })
        }

        if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
          return Paths.courtOfferedSetDatePage.evaluateUri({ externalId })
        }
        break
      case DecisionType.CLAIMANT:
      case DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT:
        return Paths.payBySetDateAcceptedPage.evaluateUri({ externalId })
    }
  }

}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(claimantResponsePath)
