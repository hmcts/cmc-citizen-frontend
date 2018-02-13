import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Form } from 'forms/form'
import { User } from 'idam/user'
import { Residence } from 'response/form/models/statement-of-means/residence'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'

function renderView (form: Form<Residence>, res: express.Response): void {
  res.render(Paths.residencePage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.residencePage.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.statementOfMeans.residence), res)
    })
  .post(
    Paths.residencePage.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    FormValidator.requestHandler(Residence, Residence.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<Residence> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.residence = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.dependantsPage.evaluateUri({ externalId: claim.externalId }))
      }
    })
  )
