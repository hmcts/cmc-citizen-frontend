import * as express from 'express'

import { Paths } from 'features/directions-questionnaire/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { RoutablePath } from 'shared/router/routablePath'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { makeSureThereIsAtLeastOneRow } from 'forms/utils/multiRowFormUtils'
import { ExpertReports } from 'directions-questionnaire/forms/models/expertReports'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'

const page: RoutablePath = Paths.expertReportsPage

function renderView (form: Form<ExpertReports>, res: express.Response): void {
  makeSureThereIsAtLeastOneRow(form.model)
  res.render(page.associatedView, { form: form })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<ExpertReports> = req.body
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
    async (req: express.Request, res: express.Response) => {
      const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
      renderView(new Form(draft.document.expertReports || new ExpertReports(undefined, [])), res)
    })
  .post(
    page.uri,
    FormValidator.requestHandler(ExpertReports, ExpertReports.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<ExpertReports> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const claim: Claim = res.locals.claim
        const draft: Draft<DirectionsQuestionnaireDraft> = res.locals.draft
        const user: User = res.locals.user

        form.model.removeExcessRows()
        draft.document.expertReports = form.model

        const declared: boolean = draft.document.expertReports.declared
        if (!declared) {
          draft.document.expertReports.rows = []
        }

        await new DraftService().save(draft, user.bearerToken)

        if (declared) {
          res.redirect(Paths.selfWitnessPage.evaluateUri({ externalId: claim.externalId }))
        } else {
          res.redirect(Paths.expertGuidancePage.evaluateUri({ externalId: claim.externalId }))
        }
      }
    })
  )
