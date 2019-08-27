import * as express from 'express'

import { Paths } from 'shared/components/ccj/Paths'

import { Claim } from 'claims/models/claim'

import { ErrorHandling } from 'main/common/errorHandling'
import { getInterestDetails } from 'shared/interestUtils'
import { MomentFactory } from 'shared/momentFactory'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { AbstractModelAccessor } from 'shared/components/model-accessor'

/* tslint:disable:no-default-export */
export abstract class AbstractPaidAmountSummaryPage<Draft> {

  abstract paidAmount (): AbstractModelAccessor<Draft, PaidAmount>
  abstract amountSettledFor (claim: Claim, draft: Draft): number
  abstract claimFeeInPennies (claim: Claim): number
  abstract buildRedirectUri (req: express.Request, res: express.Response): string

  getView (): string {
    return 'components/ccj/paid-amount-summary'
  }

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(
        path + Paths.paidAmountSummaryPage.uri,
        ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
          const claim: Claim = res.locals.claim
          const model = this.paidAmount().get(res.locals.draft.document)

          res.render(
            this.getView(), {
              claim: claim,
              alreadyPaid: model.amount || 0,
              interestDetails: await getInterestDetails(claim),
              nextPageUrl: this.buildRedirectUri(req, res),
              defaultJudgmentDate: MomentFactory.currentDate(),
              amountSettledFor: this.amountSettledFor(claim, res.locals.draft.document),
              claimFee: this.claimFeeInPennies(claim)
            }
          )
        }))
  }
}
