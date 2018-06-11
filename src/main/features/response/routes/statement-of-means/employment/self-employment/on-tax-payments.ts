import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'

import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { OnTaxPayments } from 'response/form/models/statement-of-means/onTaxPayments'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { RoutablePath } from 'shared/router/routablePath'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

const page: RoutablePath = StatementOfMeansPaths.onTaxPaymentsPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    StatementOfMeansStateGuard.requestHandler(),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, { form: new Form(draft.document.statementOfMeans.onTaxPayments) })
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(OnTaxPayments, OnTaxPayments.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<OnTaxPayments> = req.body

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.statementOfMeans.onTaxPayments = form.model
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(StatementOfMeansPaths.debtsPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
