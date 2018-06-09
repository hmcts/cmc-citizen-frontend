import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'shared/router/routablePath'
import { Dependants } from 'response/form/models/statement-of-means/dependants'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

const page: RoutablePath = Paths.dependantsPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, { form: new Form(draft.document.statementOfMeans.dependants) })
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    FormValidator.requestHandler(Dependants, Dependants.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<Dependants> = req.body

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.dependants = form.model
        if (!form.model.numberOfChildren || !form.model.numberOfChildren.between16and19) {
          draft.document.statementOfMeans.education = undefined
        }
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        if (form.model.numberOfChildren && form.model.numberOfChildren.between16and19) {
          res.redirect(Paths.educationPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(Paths.maintenancePage.evaluateUri({ externalId: externalId }))
        }
      }
    })
  )
