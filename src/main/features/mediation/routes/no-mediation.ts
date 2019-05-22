import * as express from 'express'

import { Paths } from 'mediation/paths'
import { Paths as responsePaths } from 'response/paths'
import { Paths as claimantResponsePaths } from 'claimant-response/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediation, FreeMediationOption } from 'forms/models/freeMediation'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Claim } from 'claims/models/claim'

function renderView (form: Form<FreeMediation>, res: express.Response): void {
  res.render(Paths.noMediationPage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.noMediationPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(new FreeMediation()), res)
  })
  .post(
    Paths.noMediationPage.uri,
    FormValidator.requestHandler(FreeMediation),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<FreeMediation> = req.body
      const { externalId } = req.params
      if (ClaimFeatureToggles.isFeatureEnabledOnClaim(res.locals.claim, 'mediationPilot')) {
        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          const user: User = res.locals.user
          const claim: Claim = res.locals.claim
          const draft: Draft<MediationDraft> = res.locals.mediationDraft
          draft.document.willYouTryMediation = new FreeMediation(req.body.model.option)

          await new DraftService().save(draft, user.bearerToken)

          if (req.body.model.option === FreeMediationOption.YES) {
            res.redirect(Paths.mediationAgreementPage.evaluateUri({ externalId }))
          } else {
            if (user.id === claim.claimantId) {
              res.redirect(claimantResponsePaths.taskListPage.evaluateUri({ externalId: externalId }))
            } else {
              res.redirect(responsePaths.taskListPage.evaluateUri({ externalId: externalId }))
            }
          }
        }
      } else {
        res.redirect(Paths.willYouTryMediation.evaluateUri({ externalId: externalId }))
      }
    }))
