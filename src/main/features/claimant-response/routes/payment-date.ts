import * as express from 'express'

import {AbstractPaymentDatePage} from 'shared/components/payment-intention/payment-date'
import {AbstractModelAccessor, DefaultModelAccessor} from 'shared/components/model-accessor'
import {PaymentIntention} from 'claims/models/response/core/paymentIntention'
import {PaymentIntention as DraftPaymentIntention} from 'shared/components/payment-intention/model/paymentIntention'

import {DraftClaimantResponse} from 'claimant-response/draft/draftClaimantResponse'

import {claimantResponsePath, Paths} from 'claimant-response/paths'
import {Claim} from 'claims/models/claim'
import {PaymentPlanHelper} from 'shared/helpers/paymentPlanHelper'
import {Moment} from 'moment'
import {DecisionType} from 'common/court-calculations/courtDetermination'
import {PaymentPlan} from 'common/payment-plan/paymentPlan'
import {Frequency} from 'common/frequency/frequency'
import {Draft} from '@hmcts/draft-store-client'
import {User} from 'idam/user'
import {PaymentOption} from 'claims/models/paymentOption'
import {CourtDecisionHelper} from 'shared/helpers/CourtDecisionHelper'
import {FullAdmissionResponse} from "claims/models/response/fullAdmissionResponse"
import {PartialAdmissionResponse} from "claims/models/response/partialAdmissionResponse"

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
      case DecisionType.COURT:
      case DecisionType.DEFENDANT: {
        if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
          return Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })
        }

        if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {
          return Paths.courtOfferPage.evaluateUri({ externalId: externalId })
        }
        break
      }
      case DecisionType.CLAIMANT: {
        return Paths.payBySetDateAcceptedPage.evaluateUri({ externalId: externalId })
      }
    }
  }

  generateCourtCalculatedPaymentIntention (draft: Draft<DraftClaimantResponse>, claim: Claim, decisionType: DecisionType): PaymentIntention {
    const courtCalculatedPaymentIntention = new PaymentIntention()
    const claimResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
    draft.document.courtDecisionType = decisionType

    if (decisionType === DecisionType.CLAIMANT) {
      if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
        courtCalculatedPaymentIntention.paymentDate = draft.document.alternatePaymentMethod.toDomainInstance().paymentDate
        courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
      }

      return courtCalculatedPaymentIntention
    }

    if (decisionType === DecisionType.COURT) {
      const paymentPlanFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim)
      const lastPaymentDate: Moment = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate()

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
        courtCalculatedPaymentIntention.paymentDate = lastPaymentDate
        courtCalculatedPaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
      }

      if (claimResponse.paymentIntention.paymentOption === PaymentOption.INSTALMENTS) {

        courtCalculatedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
        courtCalculatedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanFromDefendantFinancialStatement.startDate,
          instalmentAmount: paymentPlanFromDefendantFinancialStatement.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanFromDefendantFinancialStatement.frequency),
          completionDate: paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate(),
          lengthOfPayment: paymentPlanFromDefendantFinancialStatement.calculatePaymentLength()
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
        const paymentPlanFromDefendant: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)

        courtCalculatedPaymentIntention.paymentOption = PaymentOption.INSTALMENTS
        courtCalculatedPaymentIntention.repaymentPlan = {
          firstPaymentDate: paymentPlanFromDefendant.startDate,
          instalmentAmount: paymentPlanFromDefendant.instalmentAmount,
          paymentSchedule: Frequency.toPaymentSchedule(paymentPlanFromDefendant.frequency),
          completionDate: paymentPlanFromDefendant.calculateLastPaymentDate(),
          lengthOfPayment: paymentPlanFromDefendant.calculatePaymentLength()
        }
      }
      return courtCalculatedPaymentIntention
    }
  }

  async saveDraft (locals: { user: User; draft: Draft<DraftClaimantResponse>, claim: Claim }): Promise<void> {
    const getCourtDecision: DecisionType = CourtDecisionHelper.createCourtDecision(locals.claim, locals.draft)

    locals.draft.document.courtDecisionType = getCourtDecision
    locals.draft.document.courtOfferedPaymentIntention = this.generateCourtCalculatedPaymentIntention(locals.draft, locals.claim, getCourtDecision)

    return super.saveDraft(locals)
  }
}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(claimantResponsePath)
