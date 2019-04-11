import * as express from 'express'

import { Paths } from 'mediation/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediation, FreeMediationOption } from 'forms/models/freeMediation'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'

function renderView (res: express.Response): void {
  res.render(Paths.howMediationWorksPage.associatedView)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.howMediationWorksPage.uri, (req: express.Request, res: express.Response) => {
    renderView(res)
  })
  .post(
    Paths.howMediationWorksPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      const draft: Draft<MediationDraft> = res.locals.mediationDraft
      draft.document.willYouTryMediation = new FreeMediation(
        req.body.mediationYes ? FreeMediationOption.YES : FreeMediationOption.NO
      )

      await new DraftService().save(draft, user.bearerToken)

      const { externalId } = req.params
      res.redirect(Paths.willYouTryMediation.evaluateUri({ externalId: externalId }))
    }))
