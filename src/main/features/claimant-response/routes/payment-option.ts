import * as express from 'express'

import { AbstractPaymentOptionPage } from 'shared/components/payment-intention/payment-option'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention as DraftPaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

import { claimantResponsePath, Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { CourtDecisionHelper } from 'shared/helpers/CourtDecisionHelper'
import { DecisionType } from 'common/court-calculations/courtDecision'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { Frequency } from 'common/frequency/frequency'
import { User } from 'idam/user'
import { MomentFactory } from 'shared/momentFactory'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { Draft } from '@hmcts/draft-store-client'
import { CourtDetermination } from 'claimant-response/draft/courtDetermination'

export class PaymentOptionPage extends AbstractPaymentOptionPage<DraftClaimantResponse> {

  static generateCourtOfferedPaymentIntention (draft: DraftClaimantResponse, claim: Claim, decisionType: DecisionType): PaymentIntention {
    const courtOfferedPaymentIntention = new PaymentIntention()
    const claimResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    if (decisionType === DecisionType.CLAIMANT || decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT) {
      if (draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.IMMEDIATELY) {
        courtOfferedPaymentIntention.paymentOption = PaymentOption.IMMEDIATELY
        courtOfferedPaymentIntention.paymentDate = MomentFactory.currentDate().add(5,'days')
        return courtOfferedPaymentIntention
      }
      return undefined
    }

    if (decisionType === DecisionType.COURT) {
      const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {
        const defendantFrequency: Frequency = Frequency.of(claimResponse.paymentIntention.repaymentPlan.paymentSchedule)
        const paymentPlanConvertedToDefendantFrequency: PaymentPlan = paymentPlanFromDefendantFinancialStatement.convertTo(defendantFrequency)

        courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
        courtOfferedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanConvertedToDefendantFrequency.startDate,
          instalmentAmount: Math.round(paymentPlanConvertedToDefendantFrequency.instalmentAmount * 100) / 100,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanConvertedToDefendantFrequency.frequency),
          completionDate: paymentPlanConvertedToDefendantFrequency.calculateLastPaymentDate(),
          paymentLength: paymentPlanConvertedToDefendantFrequency.calculatePaymentLength()
        }
        return courtOfferedPaymentIntention
      }

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
        courtOfferedPaymentIntention.paymentDate = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate()
        courtOfferedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE

        return courtOfferedPaymentIntention
      }
      return undefined
    }

    if (decisionType === DecisionType.DEFENDANT) {

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
        courtOfferedPaymentIntention.paymentDate = claimResponse.paymentIntention.paymentDate
        courtOfferedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
        return courtOfferedPaymentIntention
      }

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {

        courtOfferedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
        courtOfferedPaymentIntention.repaymentPlan = claimResponse.paymentIntention.repaymentPlan
        return courtOfferedPaymentIntention
      }
      return undefined
    }
    return undefined
  }

  static generateCourtCalculatedPaymentIntention (draft: DraftClaimantResponse, claim: Claim, decisionType: DecisionType): PaymentIntention {
    if (decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT && draft.alternatePaymentMethod.paymentOption.option.value === PaymentOption.IMMEDIATELY) {
      return undefined
    }

    const courtCalculatedPaymentIntention = new PaymentIntention()
    const paymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
    if (!paymentPlan) {
      return undefined
    }

    courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
    courtCalculatedPaymentIntention.paymentDate = paymentPlan.calculateLastPaymentDate()
    return courtCalculatedPaymentIntention
  }

  static getCourtDecision (draft: DraftClaimantResponse, claim: Claim): DecisionType {
    return CourtDecisionHelper.createCourtDecision(claim, draft)
  }

  getView (): string {
    return 'claimant-response/views/payment-option'
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, DraftPaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod', () => new DraftPaymentIntention())
  }

  buildTaskListUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: DraftClaimantResponse = res.locals.draft.document
    const claimResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const externalId: string = req.params.externalId

    const courtDecision = PaymentOptionPage.getCourtDecision(draft, claim)

    switch (courtDecision) {
      case DecisionType.COURT:
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

    const courtDetermination: CourtDetermination = new CourtDetermination()

    if (locals.draft.document.alternatePaymentMethod.paymentOption.option === PaymentType.IMMEDIATELY) {
      const decisionType: DecisionType = PaymentOptionPage.getCourtDecision(locals.draft.document, locals.claim)

      courtDetermination.decisionType = decisionType
      courtDetermination.courtPaymentIntention = PaymentOptionPage.generateCourtCalculatedPaymentIntention(locals.draft.document, locals.claim, decisionType)
      courtDetermination.courtDecision = PaymentOptionPage.generateCourtOfferedPaymentIntention(locals.draft.document, locals.claim, decisionType)
    }
    locals.draft.document.courtDetermination = courtDetermination
    return super.saveDraft(locals)
  }
}

/* tslint:disable:no-default-export */
export default new PaymentOptionPage()
  .buildRouter(claimantResponsePath)
