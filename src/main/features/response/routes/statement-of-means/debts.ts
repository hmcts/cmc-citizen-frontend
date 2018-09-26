import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { RoutablePath } from 'shared/router/routablePath'
import { Debts } from 'response/form/models/statement-of-means/debts'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { makeSureThereIsAtLeastOneRow } from 'forms/utils/multiRowFormUtils'

const page: RoutablePath = StatementOfMeansPaths.debtsPage

function renderView (form: Form<Debts>, res: express.Response): void {
  makeSureThereIsAtLeastOneRow(form.model)
  res.render(page.associatedView, { form: form })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<Debts> = req.body
    if (req.body.action.addRow) {
      form.model.appendRow()
    }
    return renderView(form, res)
  }
  next()
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    async (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.statementOfMeans.debts), res)
    })
  .post(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(Debts, Debts.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<Debts> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        form.model.removeExcessRows()
        draft.document.statementOfMeans.debts = form.model

        await new DraftService().save(draft, user.bearerToken)
        res.redirect(StatementOfMeansPaths.monthlyExpensesPage.evaluateUri({ externalId: claim.externalId }))
      }
    })
  )
