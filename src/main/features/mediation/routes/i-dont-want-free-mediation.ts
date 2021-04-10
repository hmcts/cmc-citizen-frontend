import * as express from 'express'

import { Paths } from 'mediation/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'

import { ErrorHandling } from 'main/common/errorHandling'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { NoMediationReason } from 'mediation/form/models/NoMediationReason'

function renderView (form: Form<NoMediationReason>, res: express.Response): void {
  const user: User = res.locals.user
  const claim: Claim = res.locals.claim

  res.render(Paths.iDontWantFreeMediationPage.associatedView, {
    form: form,
    otherParty: claim.otherPartyName(user)
  })
}

function reDirectTo (res: express.Response, externalId: string) {
  const claim: Claim = res.locals.claim
  if (!claim.isResponseSubmitted()) {
    res.redirect(ResponsePaths.taskListPage.evaluateUri({ externalId: externalId }))
  } else {
    res.redirect(ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: externalId }))
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.iDontWantFreeMediationPage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<MediationDraft> = res.locals.mediationDraft
    renderView(new Form(draft.document.noMediationReason), res)
  })
  .post(
    Paths.iDontWantFreeMediationPage.uri,
    FormValidator.requestHandler(NoMediationReason, NoMediationReason.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<NoMediationReason> = req.body
      const externalId: string = req.params.externalId

      if (form.rawData['reject']) {
        reDirectTo(res, externalId)
      } else {
        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          const draft: Draft<MediationDraft> = res.locals.mediationDraft
          const user: User = res.locals.user

          draft.document.noMediationReason = form.model
          await new DraftService().save(draft, user.bearerToken)

          reDirectTo(res, externalId)
        }
      }
    }))
