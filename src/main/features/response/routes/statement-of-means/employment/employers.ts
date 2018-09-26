import * as express from 'express'
import { GuardFactory } from 'response/guards/guardFactory'

import { StatementOfMeansPaths as Paths, StatementOfMeansPaths } from 'response/paths'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { Employers } from 'response/form/models/statement-of-means/employers'
import { User } from 'idam/user'
import { RoutablePath } from 'shared/router/routablePath'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { UUIDUtils } from 'shared/utils/uuidUtils'

const page: RoutablePath = StatementOfMeansPaths.employersPage

const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  const draft: Draft<ResponseDraft> = res.locals.responseDraft

  return draft.document.statementOfMeans.employment !== undefined
    && draft.document.statementOfMeans.employment.declared === true
    && draft.document.statementOfMeans.employment.employed === true
}, (req: express.Request, res: express.Response): void => {
  res.redirect(Paths.employmentPage.evaluateUri({ externalId: UUIDUtils.extractFrom(req.path) }))
})

function renderView (form: Form<Employers>, res: express.Response): void {
  res.render(page.associatedView, {
    form: form,
    canAddMoreJobs: form.model.canAddMoreRows()
  })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<Employers> = req.body
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
    stateGuardRequestHandler,
    async (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.statementOfMeans.employers), res)
    })
  .post(
    page.uri,
    StatementOfMeansStateGuard.requestHandler(),
    stateGuardRequestHandler,
    FormValidator.requestHandler(Employers, Employers.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<Employers> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user
        form.model.removeExcessRows()

        draft.document.statementOfMeans.employers = form.model
        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        if (draft.document.statementOfMeans.employment.selfEmployed) {
          res.redirect(StatementOfMeansPaths.selfEmploymentPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(StatementOfMeansPaths.courtOrdersPage.evaluateUri({ externalId: externalId }))
        }
      }
    })
  )
