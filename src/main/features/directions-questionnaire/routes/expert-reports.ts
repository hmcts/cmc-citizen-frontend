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
import { YesNoOption } from 'models/yesNoOption'
import { PermissionForExpert } from 'directions-questionnaire/forms/models/permissionForExpert'
import { ExpertEvidence } from 'directions-questionnaire/forms/models/expertEvidence'
import { WhyExpertIsNeeded } from 'directions-questionnaire/forms/models/whyExpertIsNeeded'

const page: RoutablePath = Paths.expertReportsPage

function renderView (form: Form<ExpertReports>, res: express.Response): void {
  makeSureThereIsAtLeastOneRow(form.model)
  res.render(page.associatedView, {
    form: form,
    reportNumber: form.model.rows.length
  })
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
      renderView(new Form(draft.document.expertReports), res)
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

        if (form.model.declared.option === YesNoOption.YES.option && draft.document.expertReports && draft.document.expertReports.declared && draft.document.expertReports.declared.option === YesNoOption.NO.option) {
          draft.document.permissionForExpert = new PermissionForExpert()
          draft.document.expertEvidence = new ExpertEvidence()
          draft.document.whyExpertIsNeeded = new WhyExpertIsNeeded()
        }

        draft.document.expertReports = form.model

        if (draft.document.expertReports.declared === YesNoOption.NO) {
          draft.document.expertReports.rows = []
        }

        await new DraftService().save(draft, user.bearerToken)

        if (form.model.declared.option === YesNoOption.YES.option) {
          res.redirect(Paths.selfWitnessPage.evaluateUri({ externalId: claim.externalId }))
        } else {
          res.redirect(Paths.expertGuidancePage.evaluateUri({ externalId: claim.externalId }))
        }
      }
    })
  )
