import * as express from 'express'

import { Paths } from 'shared/components/ccj/Paths'
import { Paths as CCJPaths } from 'claimant-response/paths'

import { Claim } from 'claims/models/claim'

import { ErrorHandling } from 'main/common/errorHandling'
import { getInterestDetails } from 'shared/interestUtils'
import { MomentFactory } from 'shared/momentFactory'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { AbstractModelAccessor } from 'shared/components/model-accessor'

/* tslint:disable:no-default-export */
export abstract class AbstractPaidAmountSummaryPage<Draft> {

  abstract getHeading (): string
  abstract createModelAccessor (): AbstractModelAccessor<Draft, PaidAmount>
  abstract buildRedirectUri (req: express.Request, res: express.Response): string

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(
        path + Paths.paidAmountSummaryPage.uri,
      ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
        const claim: Claim = res.locals.claim
        let draft = this.createModelAccessor().get(res.locals.draft.document)
        const { externalId } = req.params
        res.render(
          'components/ccj/views/paid-amount-summary', {
            claim: claim,
            alreadyPaid: draft.amount,
            interestDetails: await getInterestDetails(claim),
            // nextPageUrl: res.redirect(this.buildRedirectUri(req, res)),
            nextPageUrl: CCJPaths.taskListPage.evaluateUri({ externalId: externalId }),
            defaultJudgmentDate: MomentFactory.currentDate()
          }
        )
      }))
  }
}
