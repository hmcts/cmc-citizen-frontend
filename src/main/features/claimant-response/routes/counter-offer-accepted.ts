import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { PaymentSchedule as DefendantPaymentSchedule } from 'ccj/form/models/paymentSchedule'

function isOverriddenByDefendantsPaymentFrequency (claimantPaymentSchedule: PaymentSchedule, defendantPaymentSchedule: DefendantPaymentSchedule): boolean {
  return true
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.counterOfferAcceptedPage.uri, (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const claimantPaymentSchedule: PaymentSchedule = res.locals.claim.response.paymentIntention.repaymentPlan.paymentSchedule
      const defendantPaymentSchedule: DefendantPaymentSchedule = draft.document.alternatePaymentMethod.paymentPlan.paymentSchedule
      const courtOfferedAmount: number = draft.document.courtOfferedAmount
      const convertedCourtOfferedAmount: number = 100

      res.render(Paths.counterOfferAcceptedPage.associatedView, {
        isOverriddenByDefendantsPaymentFrequency : isOverriddenByDefendantsPaymentFrequency(claimantPaymentSchedule, defendantPaymentSchedule),
        courtOfferedAmount: courtOfferedAmount,
        claimantPaymentSchedule: claimantPaymentSchedule,
        convertedCourtOfferedAmount: convertedCourtOfferedAmount,
        defendantPaymentFrequency: defendantPaymentSchedule
      })
    })
  .post(
    Paths.counterOfferAcceptedPage.uri, (req: express.Request, res: express.Response) => {
      const { externalId } = req.params
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    })
