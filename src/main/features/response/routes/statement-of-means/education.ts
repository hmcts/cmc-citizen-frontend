import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'common/router/routablePath'
import { Education } from 'response/form/models/statement-of-means/education'

const page: RoutablePath = Paths.educationPage

function renderView (form: Form<Education>, res: express.Response): void {
  const user: User = res.locals.user
  const between16and19: number = user.responseDraft.document.statementOfMeans.dependants.between16and19

  res.render(page.associatedView, {
    form: form,
    between16and19: between16and19
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(page.uri,
    (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      renderView(new Form(user.responseDraft.document.statementOfMeans.education), res)
    })
  .post(
    page.uri,
    FormValidator.requestHandler(Education, Education.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Education> = req.body
      const user: User = res.locals.user
      const { externalId } = req.params

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        user.responseDraft.document.statementOfMeans.education = form.model

        await new DraftService().save(res.locals.user.responseDraft, res.locals.user.bearerToken)
        res.redirect(Paths.maintenancePage.evaluateUri({ externalId: externalId }))
      }
    })
  )
