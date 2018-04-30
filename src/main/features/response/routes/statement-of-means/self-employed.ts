import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { SelfEmployed } from 'response/form/models/statement-of-means/selfEmployed'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { RoutablePath } from 'common/router/routablePath'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

const page: RoutablePath = StatementOfMeansPaths.selfEmployedPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, { form: new Form(draft.document.statementOfMeans.selfEmployed) })
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    FormValidator.requestHandler(SelfEmployed, SelfEmployed.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<SelfEmployed> = req.body

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.selfEmployed = form.model
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(StatementOfMeansPaths.bankAccountsPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
