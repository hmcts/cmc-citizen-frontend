import * as express from 'express'

import { AbstractPaymentDatePage } from 'shared/components/payment-intention/payment-date'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention as DraftPaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'

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
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentDeadlineHelper } from 'shared/helpers/paymentDeadlineHelper'

class PaymentDatePage extends AbstractPaymentDatePage<DraftClaimantResponse> {
  getHeading (): string {
    return 'What date do you want the defendant to pay by?'
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, DraftPaymentIntention> {
    return new DefaultModelAccessor('alternatePaymentMethod')
  }

  async saveDraft (locals: { user: User; draft: Draft<DraftClaimantResponse>, claim: Claim }): Promise<void> {
    const response = locals.claim.response as FullAdmissionResponse | PartialAdmissionResponse
    const paymentDateProposedByDefendant: Moment = PaymentDeadlineHelper.getPaymentDeadlineFromAdmission(locals.claim)
    const paymentIntentionFromClaimant: PaymentIntention = locals.draft.document.alternatePaymentMethod.toDomainInstance()
    const paymentDateDeterminedFromDefendantFinancialStatement: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromFinancialStatement(response.statementOfMeans, locals.claim.totalAmountTillToday)
    locals.draft.document.courtOfferedPaymentIntention = CourtDetermination.determinePaymentIntention(paymentDateProposedByDefendant, paymentIntentionFromClaimant, paymentDateDeterminedFromDefendantFinancialStatement)

    return super.saveDraft(locals)
  }

  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const claim: Claim = res.locals.claim
    const draft: Draft<DraftClaimantResponse> = res.locals.draft

    const externalId: string = req.params.externalId
    const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

    const paymentDateProposedByDefendant: Moment = PaymentDeadlineHelper.getPaymentDeadlineFromAdmission(claim)
    const paymentDateProposedByClaimant: Moment = draft.document.alternatePaymentMethod.paymentDate.date.toMoment()
    const paymentDateDeterminedFromDefendantFinancialStatement: Moment = PaymentPlanHelper.createPaymentPlanFromFinancialStatement(response.statementOfMeans, claim.totalAmountTillToday).calculateLastPaymentDate()

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
  .buildRouter(claimantResponsePath,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

      if (response.statementOfMeans === undefined) {
        return next(new Error('Page cannot be rendered because response doe snot have statement of means'))
      }

      next()
    }
  )
