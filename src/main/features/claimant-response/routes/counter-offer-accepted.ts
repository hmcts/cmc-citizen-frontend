import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Claim } from 'claims/models/claim'

// function isOverriddenByDefendantsPaymentFrequency(): boolean {
//
// }

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.counterOfferAcceptedPage.uri, (req: express.Request, res: express.Response) => {
      const claimantResponseDraft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const defendantResponsePaymentFrequency: Claim = res.locals.claim.response.paymentIntention
      console.log('res.defendantResponsePaymentFrequency------->', res.locals.claim.response.paymentIntention)
      console.log('claimantReponseDraft--------->',res.locals.claimantResponseDraft)
      res.render(Paths.counterOfferAcceptedPage.associatedView)
    })
  .post(
    Paths.counterOfferAcceptedPage.uri, (req: express.Request, res: express.Response) => {
      const { externalId } = req.params
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    })
