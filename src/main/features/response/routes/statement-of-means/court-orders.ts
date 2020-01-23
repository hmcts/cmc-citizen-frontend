import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { RoutablePath } from 'shared/router/routablePath'
import { CourtOrders } from 'response/form/models/statement-of-means/courtOrders'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'
import { makeSureThereIsAtLeastOneRow } from 'forms/utils/multiRowFormUtils'

const page: RoutablePath = StatementOfMeansPaths.courtOrdersPage

function renderView (form: Form<CourtOrders>, res: express.Response): void {
  makeSureThereIsAtLeastOneRow(form.model)
  res.render(page.associatedView, { form: form })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<CourtOrders> = req.body
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
      renderView(new Form(draft.document.statementOfMeans.courtOrders), res)
    })
  .post(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    FormValidator.requestHandler(CourtOrders, CourtOrders.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<CourtOrders> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        form.model.removeExcessRows()
        draft.document.statementOfMeans.courtOrders = form.model

        await new DraftService().save(draft, user.bearerToken)
        res.redirect(StatementOfMeansPaths.priorityDebtsPage.evaluateUri({ externalId: claim.externalId }))
      }
    })
  )
