import * as express from 'express'

import { AbstractPaymentDatePage } from 'shared/components/payment-intention/payment-date'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
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
import { CourtDecisionHelper } from 'shared/helpers/CourtDecisionHelper'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { LocalDate } from 'forms/models/localDate'
import { PaymentPlan as PaymentPlanModel } from 'shared/components/payment-intention/model/paymentPlan'
import { CourtDetermination } from 'claimant-response/draft/courtDetermination'

class PaymentDatePage extends AbstractPaymentDatePage<DraftClaimantResponse> {
  getHeading (): string {
    return 'What date do you want the defendant to pay by?'
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, DraftPaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod')
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: Draft<DraftClaimantResponse> = res.locals.draft
    const claimResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const externalId: string = req.params.externalId
    const courtDecision = CourtDecisionHelper.createCourtDecision(claim, draft)

    switch (courtDecision) {
      case DecisionType.COURT: {
        return Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })
      }
      case DecisionType.DEFENDANT: {
        if (claimResponse.paymentIntention.paymentOption === PaymentType.INSTALMENTS.value) {
          return Paths.courtOfferPage.evaluateUri({ externalId: externalId })
        }

        if (claimResponse.paymentIntention.paymentOption === PaymentType.BY_SET_DATE.value) {
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

  generateCourtDecidedPaymentIntention (draft: Draft<DraftClaimantResponse>, claim: Claim, decisionType: DecisionType): DraftPaymentIntention {
    const courtDecidedPaymentIntention = new DraftPaymentIntention()
    const claimResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    if (decisionType === DecisionType.CLAIMANT || decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT) {
      if (draft.document.alternatePaymentMethod.paymentOption.option === PaymentType.BY_SET_DATE) {
        courtDecidedPaymentIntention.paymentDate = draft.document.alternatePaymentMethod.paymentDate
        courtDecidedPaymentIntention.paymentOption.option = PaymentType.BY_SET_DATE
      }
      return courtDecidedPaymentIntention
    }

    if (decisionType === DecisionType.COURT) {
      const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
      const lastPaymentDate: Moment = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate()

      if (draft.document.alternatePaymentMethod.paymentOption.option === PaymentType.BY_SET_DATE) {
        courtDecidedPaymentIntention.paymentDate = LocalDate.fromMoment(lastPaymentDate)
        courtDecidedPaymentIntention.paymentOption.option = PaymentType.BY_SET_DATE
      }

      if (draft.document.alternatePaymentMethod.paymentOption.option === PaymentType.INSTALMENTS) {
        const defendantFrequency: Frequency = PaymentSchedule.toFrequency(claimResponse.paymentIntention.repaymentPlan.paymentSchedule)
        const paymentPlanConvertedToDefendantFrequency: PaymentPlanModel = PaymentPlanModel.fromObject(paymentPlanFromDefendantFinancialStatement.convertTo(defendantFrequency))
        courtDecidedPaymentIntention.paymentOption.option = PaymentType.INSTALMENTS
        courtDecidedPaymentIntention.paymentPlan = paymentPlanConvertedToDefendantFrequency
      }
      return courtDecidedPaymentIntention
    }

    if (decisionType === DecisionType.DEFENDANT) {

      if (claimResponse.paymentIntention.paymentOption === PaymentType.BY_SET_DATE.value) {
        courtDecidedPaymentIntention.paymentDate = LocalDate.fromMoment(claimResponse.paymentIntention.paymentDate)
        courtDecidedPaymentIntention.paymentOption.option = PaymentType.BY_SET_DATE
      }

      if (claimResponse.paymentIntention.paymentOption === PaymentType.INSTALMENTS.value) {
        courtDecidedPaymentIntention.paymentOption.option = PaymentType.INSTALMENTS
        courtDecidedPaymentIntention.paymentPlan = DraftPaymentIntention.deserialize(claimResponse.paymentIntention).paymentPlan
      }
      return courtDecidedPaymentIntention
    }
  }

  generateCourtCalculatedPaymentIntention (draft: Draft<DraftClaimantResponse>, claim: Claim, decisionType: DecisionType): DraftPaymentIntention {
    if (decisionType === DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT
      && draft.document.alternatePaymentMethod.paymentOption.option === PaymentType.BY_SET_DATE) {
      return undefined
    }

    const courtCalculatedPaymentIntention = new DraftPaymentIntention()
    const paymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
    const lastPaymentDate: Moment = paymentPlan.calculateLastPaymentDate()

    courtCalculatedPaymentIntention.paymentOption.option = PaymentType.BY_SET_DATE
    courtCalculatedPaymentIntention.paymentDate = LocalDate.fromMoment(lastPaymentDate)
    return courtCalculatedPaymentIntention
  }

  async saveDraft (locals: { user: User; draft: Draft<DraftClaimantResponse>, claim: Claim }): Promise<void> {

    const decisionType: DecisionType = CourtDecisionHelper.createCourtDecision(locals.claim, locals.draft)

    const courtDetermination: CourtDetermination = new CourtDetermination()

    courtDetermination.decisionType = decisionType
    courtDetermination.courtPaymentIntention = this.generateCourtCalculatedPaymentIntention(locals.draft, locals.claim, decisionType)
    courtDetermination.courtDecision = this.generateCourtDecidedPaymentIntention(locals.draft, locals.claim, decisionType)

    locals.draft.document.courtDetermination = courtDetermination
    return super.saveDraft(locals)
  }

}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(claimantResponsePath)
