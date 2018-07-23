import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { AllClaimantResponseTasksCompletedGuard } from 'claimant-response/guards/allClaimantResponseTasksCompletedGuard'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'

function prepareUrls (externalId: string): object {
  return {
    settleAdmittedPageUrl: Paths.settleAdmittedPage.evaluateUri({ externalId: externalId }),
    acceptPaymentMethodPageUrl: Paths.acceptPaymentMethodPage.evaluateUri({ externalId: externalId })
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      res.render(Paths.checkAndSendPage.associatedView, {
        draft: draft.document,
        ...prepareUrls(req.params.externalId)
      })
    })
  )
