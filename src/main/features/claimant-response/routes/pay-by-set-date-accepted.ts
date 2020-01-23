import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.payBySetDateAcceptedPage.uri,
    async (req: express.Request, res: express.Response) => {
      res.render(Paths.payBySetDateAcceptedPage.associatedView)
    })
  .post(
    Paths.payBySetDateAcceptedPage.uri,
    async (req: express.Request, res: express.Response): Promise<void> => {
      const { externalId } = req.params

      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const user: User = res.locals.user

      if (draft.document.formaliseRepaymentPlan) {
        delete draft.document.formaliseRepaymentPlan
      }

      await new DraftService().save(draft, user.bearerToken)

      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    })
