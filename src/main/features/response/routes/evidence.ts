import * as express from 'express'

import { Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { Evidence } from 'response/form/models/evidence'
import { ErrorHandling } from 'common/errorHandling'
import { EvidenceType } from 'response/form/models/evidenceType'
import { DraftService } from 'services/draftService'
import { Claim } from 'claims/models/claim'
import { ResponseDraft } from 'response/draft/responseDraft'
import { User } from 'idam/user'

function renderView (form: Form<Evidence>, res: express.Response): void {
  const claim: Claim = res.locals.user.claim

  res.render(Paths.evidencePage.associatedView, {
    form: form,
    claimantName: claim.claimData.claimant.name,
    canAddMoreEvidence: form.model.canAddMoreRows(),
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
  .get(Paths.evidencePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: ResponseDraft = res.locals.user.responseDraft.document

    renderView(new Form(draft.evidence), res)
  })
  .post(
    Paths.evidencePage.uri,
    FormValidator.requestHandler(Evidence, Evidence.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Evidence> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        form.model.removeExcessRows()
        const user: User = res.locals.user

        user.responseDraft.document.evidence = form.model
        await new DraftService().save(user.responseDraft, user.bearerToken)

        res.redirect(Paths.impactOfDisputePage.evaluateUri({ externalId: user.claim.externalId }))
      }
    })
  )
