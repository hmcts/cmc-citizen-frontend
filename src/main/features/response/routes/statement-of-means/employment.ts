import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'shared/router/routablePath'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

const page: RoutablePath = StatementOfMeansPaths.employmentPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView,
        { form: new Form(draft.document.statementOfMeans.employment) }
      )
    })
  .post(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(Employment, Employment.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<Employment> = req.body

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.employment = form.model
        if (form.model.declared) {
          draft.document.statementOfMeans.unemployment = undefined
        } else {
          draft.document.statementOfMeans.employers = draft.document.statementOfMeans.selfEmployment = undefined
        }
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        if (form.model.declared === false) {
          res.redirect(StatementOfMeansPaths.unemployedPage.evaluateUri({ externalId: externalId }))
        } else {
          if (form.model.employed) {
            res.redirect(StatementOfMeansPaths.employersPage.evaluateUri({ externalId: externalId }))
          } else {
            res.redirect(StatementOfMeansPaths.selfEmploymentPage.evaluateUri({ externalId: externalId }))
          }
        }
      }
    })
  )
