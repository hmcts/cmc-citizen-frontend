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
import { User } from 'idam/user'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'

class PaymentDatePage extends AbstractPaymentDatePage<DraftClaimantResponse> {
  getHeading (): string {
    return 'What date do you want the defendant to pay by?'
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, PaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod')
  }

  async saveDraft (locals: { user: User; draft: Draft<DraftClaimantResponse>, claim: Claim }): Promise<void> {
    const response = locals.claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const paymentDateProposedByDefendant: Moment = response.paymentIntention.paymentDate // TODO: handle payments by installments properly
    const paymentIntentionFromClaimant: any = locals.draft.document.alternatePaymentMethod as any // TODO: convert PI to claim store structure
    const paymentDateDeterminedFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromFinancialStatement(response.statementOfMeans, locals.claim.claimData.amount.totalAmount()) // TODO: handle cases where SoM is undefined (defendant paying immediately)
    locals.draft.document.courtOfferedPaymentIntention = CourtDetermination.determinePaymentIntention(paymentDateProposedByDefendant, paymentIntentionFromClaimant, paymentDateDeterminedFromDefendantFinancialStatement)

    return super.saveDraft(locals)
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: Draft<DraftClaimantResponse> = res.locals.draft

    const externalId: string = req.params.externalId
    const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const paymentDateProposedByDefendant: Moment = response.paymentIntention.paymentDate // TODO: handle payments by installments properly
    const paymentDateProposedByClaimant: Moment = draft.document.alternatePaymentMethod.paymentDate.date.toMoment()
    const paymentDateDeterminedFromDefendantFinancialStatement: Moment = PaymentPlanHelper.createPaymentPlanFromFinancialStatement(response.statementOfMeans, claim.claimData.amount.totalAmount()).calculateLastPaymentDate() // TODO: handle cases where SoM is undefined (defendant paying immediately)

    switch (CourtDetermination.determinePaymentDeadline(paymentDateProposedByDefendant, paymentDateProposedByClaimant, paymentDateDeterminedFromDefendantFinancialStatement).source) {
      case DecisionType.COURT:
      case DecisionType.DEFENDANT: {
        return Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })
      }
      case DecisionType.CLAIMANT: {
        return Paths.payBySetDateAcceptedPage.evaluateUri({ externalId: externalId })
      }
    }
  }
}

/* tslint:disable:no-default-export */
export default new PaymentDatePage()
  .buildRouter(claimantResponsePath)
