import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'

import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'shared/router/routablePath'
import { OtherDependants } from 'response/form/models/statement-of-means/otherDependants'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'

const page: RoutablePath = Paths.otherDependantsPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, {
        form: new Form(draft.document.statementOfMeans.otherDependants)
      })
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(OtherDependants, OtherDependants.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<OtherDependants> = req.body
      const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.otherDependants = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.employmentPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
