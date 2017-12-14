import * as express from 'express'

import { Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { Evidence } from 'response/form/models/evidence'
import { ErrorHandling } from 'common/errorHandling'
import { EvidenceType } from 'response/form/models/evidenceType'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'common/router/routablePath'
import { User } from 'idam/user'

const page: RoutablePath = Paths.evidencePage

function renderView (form: Form<Evidence>, res: express.Response): void {
  res.render(page.associatedView, {
    form: form,
    claimantName: res.locals.user.claim.claimData.claimant.name,
    allEvidenceTypes: EvidenceType.all()
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
      const user: User = res.locals.user
      renderView(new Form(user.responseDraft.document.evidence), res)
    })
  .post(
    page.uri,
    FormValidator.requestHandler(Evidence, Evidence.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Evidence> = req.body
      const user: User = res.locals.user

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        form.model.removeExcessRows()
        user.responseDraft.document.evidence = form.model

        await new DraftService().save(user.responseDraft, user.bearerToken)
        res.redirect(Paths.impactOfDisputePage.evaluateUri({ externalId: user.claim.externalId }))
      }
    })
  )
