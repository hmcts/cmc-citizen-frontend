import * as express from 'express'

import { Paths } from 'shared/components/ccj/Paths'

import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'

import { ErrorHandling } from 'main/common/errorHandling'
import { getInterestDetails } from 'shared/interestUtils'
import { MomentFactory } from 'shared/momentFactory'

/* tslint:disable:no-default-export */
export abstract class AbstractPaidAmountSummaryPage<D> {

  abstract retrieveDraft: (res: express.Response) => Draft<D>
  abstract buildRedirectUri (req: express.Request, res: express.Response): string

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(
        path + Paths.paidAmountSummaryPage.uri,
      ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
        const claim: Claim = res.locals.claim
        const draft: Draft<D> = this.retrieveDraft(res)
        res.render(
          'components/ccj/views/paid-amount-summary', {
            claim: claim,
            alreadyPaid: draft.document.paidAmount,
            interestDetails: await getInterestDetails(claim),
            // nextPageUrl: res.redirect(this.buildRedirectUri(req, res)),
            defaultJudgmentDate: MomentFactory.currentDate()
          }
        )
      }))
  }
}
