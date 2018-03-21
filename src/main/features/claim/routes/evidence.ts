import * as express from 'express'

import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { RoutablePath } from 'common/router/routablePath'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Evidence } from 'forms/models/evidence'

const page: RoutablePath = Paths.evidencePage

function renderView (form: Form<Evidence>, res: express.Response): void {
  res.render(page.associatedView, {
    form: form
  })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<Evidence> = req.body
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
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaim> = res.locals.claimDraft
      renderView(new Form(draft.document.evidence), res)
    })
  .post(
    page.uri,
    FormValidator.requestHandler(Evidence, Evidence.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Evidence> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        form.model.removeExcessRows()
        draft.document.evidence = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.taskListPage.uri)
      }
    })
  )
