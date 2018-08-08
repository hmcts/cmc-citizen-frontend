import * as express from 'express'

import { Paths } from 'features/claimant-response/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { Claim } from 'claims/models/claim'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft } from '@hmcts/draft-store-client'
import { getInterestDetails } from 'shared/interestUtils'
import { MomentFactory } from 'shared/momentFactory'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.paidAmountSummaryPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<DraftCCJ> = res.locals.ccjDraft
      const { externalId } = req.params

      res.render(
        Paths.paidAmountSummaryPage.associatedView, {
          claim: claim,
          alreadyPaid: draft.document.paidAmount.amount || 0,
          interestDetails: await getInterestDetails(claim),
          nextPageUrl: Paths.taskListPage.evaluateUri({ externalId: externalId }),
          defaultJudgmentDate: MomentFactory.currentDate()
        }
      )
    }))
