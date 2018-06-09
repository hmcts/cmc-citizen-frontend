import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'shared/router/routablePath'
import { Education } from 'response/form/models/statement-of-means/education'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { NumberOfChildren } from 'response/form/models/statement-of-means/numberOfChildren'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

const page: RoutablePath = Paths.educationPage

function renderView (form: Form<Education>, res: express.Response): void {
  const draft: Draft<ResponseDraft> = res.locals.responseDraft
  const numberOfChildren: NumberOfChildren = draft.document.statementOfMeans.dependants.numberOfChildren
  res.render(page.associatedView, {
    form: form,
    numberOfChildrenBetween16and19: (numberOfChildren && numberOfChildren.between16and19) || 0
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.statementOfMeans.education), res)
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    FormValidator.requestHandler(Education, Education.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<Education> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.education = form.model
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.maintenancePage.evaluateUri({ externalId: externalId }))
      }
    })
  )
