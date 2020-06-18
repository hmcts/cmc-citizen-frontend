import * as express from 'express'

import { Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'shared/router/routablePath'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'
import { DefendantEvidence } from 'response/form/models/defendantEvidence'

const page: RoutablePath = Paths.evidencePage

function renderView (form: Form<DefendantEvidence>, res: express.Response): void {
  const claim: Claim = res.locals.claim

  res.render(page.associatedView, {
    form: form,
    evidence: claim.claimData.evidence
  })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<DefendantEvidence> = req.body
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
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      let evidence

      if (draft.document.isResponsePartiallyAdmitted()) {
        evidence = draft.document.partialAdmission.evidence
      } else {
        evidence = draft.document.evidence
      }

      renderView(new Form(evidence), res)
    })
  .post(
    page.uri,
    FormValidator.requestHandler(DefendantEvidence, DefendantEvidence.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DefendantEvidence> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        form.model.removeExcessRows()

        if (draft.document.isResponsePartiallyAdmitted()) {
          draft.document.partialAdmission.evidence = form.model
          await new DraftService().save(draft, user.bearerToken)
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
        } else {
          draft.document.evidence = form.model
          await new DraftService().save(draft, user.bearerToken)

          if (draft.document.isResponseRejected()) {
            res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
          } else {
            res.redirect(Paths.impactOfDisputePage.evaluateUri({ externalId: claim.externalId }))
          }
        }
      }
    })
  )
