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
import { Disability, DisabilityOption } from 'response/form/models/statement-of-means/disability'

const page: RoutablePath = StatementOfMeansPaths.disabilityPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, {
        form: new Form(draft.document.statementOfMeans.disability)
      })
    })
  .post(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(Disability),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Disability> = req.body
      const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.disability = form.model
        if (form.model.option === DisabilityOption.NO) {
          draft.document.statementOfMeans.severeDisability = undefined
        }
        await new DraftService().save(draft, user.bearerToken)

        if (form.model.option === DisabilityOption.YES) {
          res.redirect(StatementOfMeansPaths.severeDisabilityPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(StatementOfMeansPaths.residencePage.evaluateUri({ externalId: externalId }))
        }
      }
    })
  )
