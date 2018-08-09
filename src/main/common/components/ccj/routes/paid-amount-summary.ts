import * as express from 'express'

import { Paths } from 'shared/components/ccj/Paths'

import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'

import { ErrorHandling } from 'main/common/errorHandling'
import { getInterestDetails } from 'shared/interestUtils'
import { MomentFactory } from 'shared/momentFactory'

/* tslint:disable:no-default-export */
export abstract class AbstractPaidAmountSummaryPage {

  abstract buildRedirectUri (req: express.Request, res: express.Response): string

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(Paths.paidAmountSummaryPage.uri,
      ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
        const claim: Claim = res.locals.claim
        const draft: Draft<any> = res.locals.draft

        res.render(
          Paths.paidAmountSummaryPage.associatedView, {
            claim: claim,
            alreadyPaid: draft.document.paidAmount.amount || 0,
            interestDetails: await getInterestDetails(claim),
            nextPageUrl: res.redirect(this.buildRedirectUri(req, res)),
            defaultJudgmentDate: MomentFactory.currentDate()
          }
        )
      }))
  }
}
