import { NotFoundError } from 'errors'
import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { GuardFactory } from 'response/guards/guardFactory'
import { ErrorHandling } from 'shared/errorHandling'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { ResponseType } from 'claims/models/response/responseType'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'

const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  const claim: Claim = res.locals.claim

  return claim.response.responseType === ResponseType.FULL_ADMISSION
    || (claim.response.responseType === ResponseType.PART_ADMISSION && claim.response.paymentIntention !== undefined)
}, (req: express.Request): void => {
  throw new NotFoundError(req.path)
})

function renderView (res: express.Response, page: number): void {
  const claim: Claim = res.locals.claim

  const paymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)
  const c = {
    claim: claim,
    instalmentAmount: paymentPlan ? paymentPlan.instalmentAmount : 0,
    paymentSchedule: paymentPlan ? Frequency.toPaymentSchedule(paymentPlan.frequency) : {},
    firstPaymentDate: paymentPlan ? paymentPlan.startDate : null,
    completionDate: paymentPlan ? paymentPlan.calculateLastPaymentDate() : null,
    paymentLength: paymentPlan ? paymentPlan.calculatePaymentLength() : 0,
    page: page
  }
  res.render(Paths.defendantsResponsePage.associatedView, c)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.defendantsResponsePage.uri,
    stateGuardRequestHandler,
    (req: express.Request, res: express.Response) => {
      const page: number = 0
      renderView(res, page)
    }
  )
  .post(
    Paths.defendantsResponsePage.uri,
    stateGuardRequestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const user: User = res.locals.user

      if (req.body.action && req.body.action.showPage) {
        const page: number = +req.body.action.showPage
        return renderView(res, page)
      }

      draft.document.defendantResponseViewed = true
      await new DraftService().save(draft, user.bearerToken)

      const { externalId } = req.params
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    }))
