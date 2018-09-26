import { RoutablePath } from 'shared/router/routablePath'
import { StatementOfMeansPaths } from 'response/paths'
import * as express from 'express'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { Carer } from 'response/form/models/statement-of-means/carer'

const page: RoutablePath = StatementOfMeansPaths.carerPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, {
        form: new Form(draft.document.statementOfMeans.carer)
      })
    })
  .post(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(Carer),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Carer> = req.body
      const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.carer = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(StatementOfMeansPaths.employmentPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
