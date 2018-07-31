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
import { Maintenance } from 'response/form/models/statement-of-means/maintenance'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

const page: RoutablePath = Paths.maintenancePage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, { form: new Form(draft.document.statementOfMeans.maintenance) })
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('admissions'),
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(Maintenance, Maintenance.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<Maintenance> = req.body

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.maintenance = form.model
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.otherDependantsPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
