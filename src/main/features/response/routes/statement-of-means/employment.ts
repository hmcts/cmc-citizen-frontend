import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'common/router/routablePath'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

const page: RoutablePath = StatementOfMeansPaths.employmentPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView,
        { form: new Form(draft.document.statementOfMeans.employment) }
      )
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    FormValidator.requestHandler(Employment, Employment.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Employment> = req.body

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user
        const statementOfMeans: StatementOfMeans = draft.document.statementOfMeans
        statementOfMeans.employment = form.model

        if (statementOfMeans.employment.isCurrentlyEmployed === true) {
          statementOfMeans.unemployed = undefined
        } else if (statementOfMeans.employment.isCurrentlyEmployed === false) {
          statementOfMeans.selfEmployed = statementOfMeans.employers = undefined
        }

        draft.document.statementOfMeans.employment = form.model
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        if (form.model.isCurrentlyEmployed === false) {
          res.redirect(StatementOfMeansPaths.unemployedPage.evaluateUri({ externalId: externalId }))
        } else {
          if (form.model.employed) {
            res.redirect(StatementOfMeansPaths.employersPage.evaluateUri({ externalId: externalId }))
          } else {
            res.redirect(StatementOfMeansPaths.selfEmployedPage.evaluateUri({ externalId: externalId }))
          }
        }
      }
    })
  )
