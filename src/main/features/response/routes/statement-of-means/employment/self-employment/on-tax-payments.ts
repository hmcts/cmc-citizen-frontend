import * as express from 'express'
import { GuardFactory } from 'response/guards/guardFactory'

import { StatementOfMeansPaths as Paths, StatementOfMeansPaths } from 'response/paths'
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
import { UUIDUtils } from 'shared/utils/uuidUtils'

const page: RoutablePath = StatementOfMeansPaths.onTaxPaymentsPage

const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  const draft: Draft<ResponseDraft> = res.locals.responseDraft

  return draft.document.statementOfMeans.employment !== undefined
    && draft.document.statementOfMeans.employment.declared === true
    && draft.document.statementOfMeans.employment.selfEmployed === true
}, (req: express.Request, res: express.Response): void => {
  res.redirect(Paths.employmentPage.evaluateUri({ externalId: UUIDUtils.extractFrom(req.path) }))
})

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    stateGuardRequestHandler,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      res.render(page.associatedView, { form: new Form(draft.document.statementOfMeans.onTaxPayments) })
    })
  .post(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    stateGuardRequestHandler,
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
        res.redirect(StatementOfMeansPaths.courtOrdersPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
