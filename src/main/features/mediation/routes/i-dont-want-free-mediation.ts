import * as express from 'express'

import { Paths } from 'mediation/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediation } from 'main/app/forms/models/freeMediation'
import { User } from 'idam/user'
import { Form } from 'main/app/forms/form'

function renderView (form: Form<FreeMediation>, res: express.Response): void {
  const user: User = res.locals.user
  const claim: Claim = res.locals.claim

  res.render(Paths.iDontWantFreeMediationPage.associatedView, {
    form: form,
    otherParty: claim.otherPartyName(user)
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.iDontWantFreeMediationPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<MediationDraft> = res.locals.mediationDraft
    renderView(new Form(draft.document.mediationDisagreement), res)
  })
  .post(
    Paths.iDontWantFreeMediationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const externalId: string = req.params.externalId

      if (!claim.isResponseSubmitted()) {
        res.redirect(ResponsePaths.taskListPage.evaluateUri({ externalId: externalId }))
      } else {
        res.redirect(ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    }))
